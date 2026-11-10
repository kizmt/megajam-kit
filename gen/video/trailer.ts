#!/usr/bin/env node
// Cut the trailer from the frames gen/test/shots.ps1 saved, and build its sound in the edit. The fixed-step capture
// has no game audio, so every sound effect is placed where the game's own log says its event happened, with the
// volume and pitch rules the game uses, and the music follows the game's cue changes.
//
//   node gen/video/trailer.ts --cut <Project>\design\video_cut.json [--events]
//        [--shots <Project>\Generated\shots] [--log <Project>\Saved\Logs\shots.log] [--out <Project>\Generated\video\trailer.mp4]
//
// The cut file (JSON):
//   { "fps": 60, "crf": 17, "size": "1920x1080",
//     "segments": [ { "shot": "title", "from": 1.0, "to": 3.0, "label": "title" },
//                   { "shot": "run", "anchor": "checkpoint 2", "before": 5.6, "after": 0.9 } ],
//     "sound": {
//       "dir": "C:/dev/<Project>/Generated/audio",          (base folder for the files below)
//       "eventPattern": "\\[EVT t=[\\d.\\-]+\\] (.*)$",     (one group: the event's text; this is the default)
//       "sfx": [ { "match": "^first jump", "file": "SFX_Jump.wav", "volume": 0.8 },
//                { "match": "^power jump x([\\d.]+)", "file": "SFX_Jump.wav", "pitch": "min(1.6, 1 + 0.08 * ($1 - 1))" },
//                { "match": "^hard landing .*?, (\\d+) km/h", "file": "SFX_Land.wav", "volume": "min(1, 0.35 + $1 / 150)" },
//                { "match": "^gate opens", "file": "SFX_Gate.wav", "volume": 0.6, "delay": 0.15 } ],
//       "music": { "volume": 0.55, "fade": 0.6,
//                  "cues": [ { "file": "MUS_0.wav" },
//                            { "file": "MUS_1.wav", "event": "boss wakes" },
//                            { "file": "MUS_End.wav", "event": "run complete", "fromStart": true } ] } } }
//   segments: "from"/"to" are seconds inside the shot; an "anchor" is the first logged event in that shot whose text
//     contains the string (the window is event time - before .. event time + after).
//   sfx: every rule whose "match" (a regex on the event text) fits an event plays its file at that moment, if the
//     moment is in the cut. "volume" and "pitch" are numbers or formulas over the regex groups ($1, $2; + - * / ( )
//     min max). "delay" shifts it (seconds). Several rules may match one event (layered sounds).
//   music: the first cue starts at 0; a cue with "event" takes over when that event happens in the game, also when the
//     moment itself was cut away (it then starts at the next cut point). Cues are read from the cut's own clock, so
//     loops that share tempo and key keep the beat across a switch; "fromStart" plays a cue from its beginning.
//   No "sound" at all gives a silent track (itch and YouTube both expect an audio stream).
// The game must log its events with the frame-stamped log lines shots.ps1 keeps ("[EVT t=1.23] checkpoint 2" by
// default: log one line per thing the player would hear). Output: 1080p H.264 + AAC, loudness -14 LUFS, true peak
// under -1.5 dB. Ported from a practice run's 230-line project script (2026-11-10); ffmpeg traps it met are in
// docs/ue/cinematics-video.md.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';
import { parseArgs } from 'node:util';
import { errorMessage, fail, findFfmpeg, projectDir } from '../paths.ts';

interface Segment { shot: string; from?: number; to?: number; anchor?: string; before?: number; after?: number; label?: string }
interface SfxRule { match: string; file: string; volume?: number | string; pitch?: number | string; delay?: number }
interface MusicCue { file: string; event?: string; fromStart?: boolean }
interface Cut {
  fps?: number;
  crf?: number;
  size?: string;
  segments: Segment[];
  sound?: { dir?: string; eventPattern?: string; sfx?: SfxRule[]; music?: { volume?: number; fade?: number; cues: MusicCue[] } };
}

const { values: o } = parseArgs({
  options: {
    cut: { type: 'string' },
    shots: { type: 'string' },
    log: { type: 'string' },
    out: { type: 'string' },
    events: { type: 'boolean', default: false },
  },
});
if (!o.cut) fail('usage: node gen/video/trailer.ts --cut <cut.json> [--shots <dir>] [--log <shots.log>] [--out <file.mp4>] [--events]');

const ffmpeg = findFfmpeg();
if (!ffmpeg) fail('ffmpeg not found (SETUP: Requirements)');
const ffprobe = ffmpeg === 'ffmpeg' ? 'ffprobe' : join(dirname(ffmpeg), 'ffprobe.exe');
function run(exe: string, args: string[], allowFail = false): { stdout: string; stderr: string } {
  const r = spawnSync(exe, args, { encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.status !== 0 && !allowFail) throw new Error(`${exe} failed:\n${(r.stderr ?? '').slice(-2500)}`);
  return { stdout: r.stdout ?? '', stderr: r.stderr ?? '' };
}

/** A number, or a formula over the regex groups: "min(1.6, 1 + 0.08 * ($1 - 1))". Only arithmetic, min and max. */
function evalNumber(v: number | string | undefined, groups: string[], fallback: number): number {
  if (v === undefined) return fallback;
  if (typeof v === 'number') return v;
  const expr = v.replace(/\$(\d)/g, (_, d: string) => String(Number(groups[Number(d)] ?? 'NaN')));
  if (!/^(?:[\d\s+\-*/().,]|min|max|NaN)+$/.test(expr)) throw new Error(`not a formula this tool accepts: ${v}`);
  const n = Number(new Function('min', 'max', `return (${expr});`)(Math.min, Math.max));
  if (!Number.isFinite(n)) throw new Error(`formula ${v} gave no number (groups: ${groups.slice(1).join(', ')})`);
  return n;
}

try {
  const cut = JSON.parse(readFileSync(o.cut ?? '', 'utf8')) as Cut;
  const fps = cut.fps ?? 60;
  const proj = o.shots && o.log && o.out ? '' : projectDir();
  const shotsDir = o.shots ?? join(proj, 'Generated', 'shots');
  const logPath = o.log ?? join(proj, 'Saved', 'Logs', 'shots.log');
  const outPath = o.out ?? join(proj, 'Generated', 'video', 'trailer.mp4');
  const workDir = join(dirname(outPath), 'work');
  mkdirSync(workDir, { recursive: true });
  const sound = cut.sound ?? {};
  const audioFile = (f: string): string => {
    const p = isAbsolute(f) ? f : join(sound.dir ?? join(proj, 'Generated', 'audio'), f);
    if (!existsSync(p)) throw new Error(`sound file not found: ${p}`);
    return p;
  };

  // ---------- the log: shots and events by engine frame
  // The log prints its frame counter modulo 1000, and "PROOF shot done name=X frames=N" is logged on the frame after
  // the shot's last saved frame: saved frame i of a shot is engine frame (done frame - N + i).
  const eventRe = new RegExp(sound.eventPattern ?? '\\[EVT t=[\\d.\\-]+\\] (.*)$');
  const marks: { frame: number; text: string }[] = [];
  let wraps = 0;
  let prev = -1;
  for (const line of readFileSync(logPath, 'utf8').split(/\r?\n/)) {
    const m = /^\[[\d.\-:]+\]\[\s*(\d+)\](.*)$/.exec(line);
    if (!m) continue;
    const raw = Number(m[1]);
    if (raw < prev) wraps += 1;
    prev = raw;
    marks.push({ frame: wraps * 1000 + raw, text: m[2] ?? '' });
  }
  interface Shot { first: number; frames: number; events: { t: number; text: string }[] }
  const shots: Record<string, Shot> = {};
  for (const mk of marks) {
    const m = /PROOF shot done name=(\S+) frames=(\d+)/.exec(mk.text);
    if (m?.[1]) shots[m[1]] = { first: mk.frame - Number(m[2]), frames: Number(m[2]), events: [] };
  }
  for (const mk of marks) {
    const m = eventRe.exec(mk.text);
    if (!m?.[1]) continue;
    for (const s of Object.values(shots)) {
      if (mk.frame >= s.first && mk.frame < s.first + s.frames) s.events.push({ t: (mk.frame - s.first) / fps, text: m[1] });
    }
  }
  if (Object.keys(shots).length === 0) fail(`no "PROOF shot done" lines in ${logPath}: is it the log of a gen/test/shots.ps1 run?`);

  // ---------- segments on the output timeline
  interface Seg { shot: string; f0: number; n: number; from: number; to: number; out: number; label: string }
  const segs: Seg[] = [];
  let outT = 0;
  for (const c of cut.segments) {
    const s = shots[c.shot];
    if (!s) throw new Error(`no shot named ${c.shot} in ${logPath} (shots: ${Object.keys(shots).join(', ')})`);
    let from = c.from ?? 0;
    let to = c.to ?? s.frames / fps;
    if (c.anchor) {
      const anchor = c.anchor;
      const e = s.events.find((ev) => ev.text.includes(anchor));
      if (!e) throw new Error(`no event containing "${anchor}" in shot ${c.shot}`);
      from = e.t - (c.before ?? 2);
      to = e.t + (c.after ?? 1);
    }
    const f0 = Math.max(0, Math.round(from * fps));
    const f1 = Math.min(s.frames, Math.round(to * fps));
    if (f1 <= f0) throw new Error(`empty segment ${JSON.stringify(c)}`);
    segs.push({ shot: c.shot, f0, n: f1 - f0, from: f0 / fps, to: f1 / fps, out: outT, label: c.label ?? c.anchor ?? '' });
    outT += (f1 - f0) / fps;
  }
  const total = outT;
  /** Where a moment of a shot lands in the cut; a moment that was cut away lands on the next cut point. */
  const toOut = (shot: string, t: number): { out: number; shown: boolean } | null => {
    for (const sg of segs) {
      if (sg.shot !== shot) continue;
      if (t < sg.from) return { out: sg.out, shown: false };
      if (t < sg.to) return { out: sg.out + (t - sg.from), shown: true };
    }
    return null;
  };

  // ---------- sound: the rules against the events
  const rules = (sound.sfx ?? []).map((r) => ({ ...r, re: new RegExp(r.match), path: audioFile(r.file) }));
  const musicCues = sound.music?.cues ?? [];
  const cues: { file: string; at: number; vol: number; pitch: number }[] = [];
  const music: { file: string; at: number; fromStart: boolean }[] = [];
  const table: string[] = [];
  if (musicCues[0]) music.push({ file: audioFile(musicCues[0].file), at: 0, fromStart: Boolean(musicCues[0].fromStart) });
  const pendingMusic = musicCues.slice(1);
  for (const [name, s] of Object.entries(shots)) {
    for (const e of s.events) {
      const where = toOut(name, e.t);
      if (!where) continue;
      for (const mc of pendingMusic) {
        if (mc.event && e.text.includes(mc.event) && !music.some((m) => m.file === audioFile(mc.file))) {
          music.push({ file: audioFile(mc.file), at: where.out, fromStart: Boolean(mc.fromStart) });
          table.push(`${where.out.toFixed(2).padStart(7)}  music  ${mc.file}  <- ${e.text.slice(0, 50)}${where.shown ? '' : ' (cut away: starts at the cut)'}`);
        }
      }
      if (!where.shown) continue;
      for (const r of rules) {
        const m = r.re.exec(e.text);
        if (!m) continue;
        const at = where.out + (r.delay ?? 0);
        cues.push({ file: r.path, at, vol: evalNumber(r.volume, m, 1), pitch: evalNumber(r.pitch, m, 1) });
        table.push(`${at.toFixed(2).padStart(7)}  sfx    ${r.file}  <- ${e.text.slice(0, 50)}`);
      }
    }
  }
  music.sort((a, b) => a.at - b.at);

  // ---------- 1. picture
  const [w, h] = (cut.size ?? '1920x1080').split('x');
  const vArgs = ['-y', '-v', 'error'];
  for (const sg of segs) {
    vArgs.push('-framerate', String(fps), '-start_number', String(sg.f0), '-t', (sg.n / fps).toFixed(5), '-i', join(shotsDir, sg.shot, 'f_%05d.png'));
  }
  const vFilter = `${segs.map((_, i) => `[${i}:v]`).join('')}concat=n=${segs.length}:v=1:a=0,scale=${w}:${h}:flags=lanczos,` +
    `fade=t=in:st=0:d=0.25,fade=t=out:st=${(total - 0.6).toFixed(3)}:d=0.6,format=yuv420p[v]`;
  const videoOnly = join(workDir, 'video_only.mp4');
  vArgs.push('-filter_complex', vFilter, '-map', '[v]', '-r', String(fps), '-c:v', 'libx264', '-preset', 'slow', '-crf', String(cut.crf ?? 17),
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', videoOnly);
  run(ffmpeg, vArgs);

  // ---------- 2. sound
  const musicVol = sound.music?.volume ?? 0.55;
  const fade = sound.music?.fade ?? 0.6;
  const aArgs = ['-y', '-v', 'error'];
  const chains: string[] = [];
  const labels: string[] = [];
  let n = 0;
  const fmt = 'aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo';
  music.forEach((mc, i) => {
    const next = music[i + 1];
    const end = next ? next.at : total;
    if (end - mc.at < 0.05) return;
    aArgs.push('-stream_loop', '-1', '-i', mc.file);
    const lead = mc.at > 0 ? fade / 2 : 0;
    const start = Math.max(0, mc.at - lead);
    const stop = Math.min(total, end + fade / 2);
    const src = mc.fromStart ? `atrim=0:${(stop - start).toFixed(3)}` : `atrim=${start.toFixed(3)}:${stop.toFixed(3)}`;
    const outFade = next ? fade : 0.8;
    chains.push(`[${n}:a]${fmt},${src},asetpts=PTS-STARTPTS,volume=${musicVol},afade=t=in:st=0:d=${mc.at > 0 ? fade : 0.25},` +
      `afade=t=out:st=${Math.max(0, stop - start - outFade).toFixed(3)}:d=${outFade},adelay=${Math.round(start * 1000)}:all=1[a${n}]`);
    labels.push(`[a${n}]`);
    n += 1;
  });
  for (const cue of cues) {
    if (cue.at >= total - 0.05 || cue.at < 0) continue;
    aArgs.push('-i', cue.file);
    let c = `[${n}:a]${fmt}`;
    if (Math.abs(cue.pitch - 1) > 0.005) c += `,asetrate=${Math.round(48000 * cue.pitch)},aresample=48000`;
    c += `,volume=${cue.vol.toFixed(3)},adelay=${Math.round(cue.at * 1000)}:all=1[a${n}]`;
    chains.push(c);
    labels.push(`[a${n}]`);
    n += 1;
  }
  const mixWav = join(workDir, 'mix.wav');
  if (n === 0) {
    run(ffmpeg, ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', total.toFixed(3), mixWav]);
  } else {
    // apad=whole_dur ends by itself; "apad,atrim" never finished when every input ended just before the total.
    chains.push(`${labels.join('')}amix=inputs=${n}:normalize=0:dropout_transition=0,alimiter=limit=0.79:level=disabled,` +
      `apad=whole_dur=${total.toFixed(3)},atrim=0:${total.toFixed(3)}[mix]`);
    const graphFile = join(workDir, 'audio_graph.txt');
    writeFileSync(graphFile, chains.join(';\n'));
    aArgs.push('-/filter_complex', graphFile, '-map', '[mix]', '-ar', '48000', mixWav);
    run(ffmpeg, aArgs);
  }

  // Two-pass loudness to -14 LUFS, with headroom for the AAC encode's overshoot.
  const lastJson = (t: string): Record<string, string> => JSON.parse(t.slice(t.lastIndexOf('{'), t.lastIndexOf('}') + 1)) as Record<string, string>;
  let audioIn = mixWav;
  let before: Record<string, string> = {};
  if (n > 0) {
    const target = 'I=-14:TP=-2.5:LRA=11'; // measured: the AAC encode lands 0.5-0.9 dB above the WAV's true peak
    before = lastJson(run(ffmpeg, ['-hide_banner', '-i', mixWav, '-af', `loudnorm=${target}:print_format=json`, '-f', 'null', '-'], true).stderr);
    audioIn = join(workDir, 'mix_norm.wav');
    run(ffmpeg, ['-y', '-v', 'error', '-i', mixWav, '-af',
      `loudnorm=${target}:measured_I=${before['input_i']}:measured_TP=${before['input_tp']}:measured_LRA=${before['input_lra']}:` +
      `measured_thresh=${before['input_thresh']}:offset=${before['target_offset']}:linear=true`, '-ar', '48000', audioIn]);
  }

  // ---------- 3. mux and report
  mkdirSync(dirname(outPath), { recursive: true });
  run(ffmpeg, ['-y', '-v', 'error', '-i', videoOnly, '-i', audioIn, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', outPath]);
  const probe = run(ffprobe, ['-v', 'error', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,sample_rate,duration', '-of', 'compact', outPath]).stdout.trim();

  console.log('segments (output s, length s, shot window):');
  for (const sg of segs) console.log(`  ${sg.out.toFixed(2).padStart(6)}  ${(sg.n / fps).toFixed(2).padStart(5)}  ${sg.shot} ${sg.from.toFixed(2)}-${sg.to.toFixed(2)}  ${sg.label}`);
  console.log(`music: ${music.map((mc) => `${mc.file.split(/[\\/]/).pop() ?? ''} at ${mc.at.toFixed(2)}`).join(', ') || 'none'}`);
  console.log(`sound effects placed: ${cues.length}`);
  if (o.events) for (const row of table.sort()) console.log(`  ${row}`);
  if (n > 0) {
    const after = lastJson(run(ffmpeg, ['-hide_banner', '-i', outPath, '-af', 'loudnorm=print_format=json', '-vn', '-f', 'null', '-'], true).stderr);
    console.log(`mix before normalising: ${before['input_i']} LUFS, true peak ${before['input_tp']} dB; after: ${after['input_i']} LUFS, true peak ${after['input_tp']} dB`);
  } else {
    console.log('no "sound" in the cut file: silent audio track');
  }
  const length = total.toFixed(2);
  console.log(`length ${length} s${total < 30 || total > 60 ? '  (the jam asks for 30-60 s)' : ''}`);
  console.log(probe);
  console.log(`OUT ${outPath}  ${(statSync(outPath).size / 1048576).toFixed(1)} MB`);
} catch (e) {
  console.error(`FAIL: ${errorMessage(e)}`);
  process.exit(1);
}
