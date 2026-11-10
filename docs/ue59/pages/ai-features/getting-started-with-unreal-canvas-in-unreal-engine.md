# Getting Started with Unreal Canvas

https://dev.epicgames.com/documentation/en-us/unreal-engine/getting-started-with-unreal-canvas-in-unreal-engine?application_version=5.9

> Enable the Unreal Canvas plugins, add API keys for your AI providers, and run a health check to confirm Unreal Canvas is ready to generate images, video, and 3D models in Unreal Engine 5.9.

[image: Getting Started with Unreal Canvas]

Learn to use this **Experimental** feature, but use caution when shipping with it.

## Getting Started with Unreal Canvas

Set up Unreal Canvas in five steps: enable the plugins, install the **Unreal Canvas server** and its local AI models, connect your AI providers, connect an AI agent if you want one, and run a health check. When the health check passes, you're ready to create your first asset. Unreal Canvas can also run in a supported standalone app; this page covers the Unreal Canvas tab in Unreal Editor.

For what Unreal Canvas is and how it works, see Unreal Canvas Overview (-> unreal-canvas-overview-in-unreal-engine).

## Before You Begin

You need the following:

- **Unreal Engine 5.9 Preview**, installed using the instructions for your engine build or plugin package, with a project open. If you use an existing project, work on a copy. Preview builds aren't meant for production projects.
- **An NVIDIA GPU with at least 8 GB of video memory.** The local AI steps (segmentation, depth, and edge detection) run on your GPU.
- **An account and API key with at least one AI provider: **You bring your own keys, and each provider bills you for generation. Pre-release builds support** fal.ai, Scenario, Luma (and Luma Agents),** and **World Labs**, plus local models that run on your GPU.
- **An AI agent (optional):** **Claude Code** or **Codex** installed on your computer, or a company sign-in or API connection for another agent provider. Unreal Canvas uses the agent's own account and settings.
- **Network access:** To download the local AI models and Python packages, and to reach your providers.

## 1 - Enable the Unreal Canvas Plugins

You only need to enable the **Unreal Canvas Bridge** plugin to get started. It enables the other plugins Unreal Canvas depends on. For what each plugin does, see Unreal Canvas in Unreal Engine (-> unreal-canvas-overview-in-unreal-engine).

### Steps

- From the main menu, choose **Edit > Plugins**.
- Search for **Unreal Canvas Bridge**, and enable its checkbox.
- Click **Yes** to accept the experimental plugin warning.
- Click **Restart Now**.

The editor restarts with the Unreal Canvas plugins loaded. Expect a longer startup than before. For everything enabling the plugin installs and changes in your project, see What Gets Installed and What Changes in Your Project (-> unreal-canvas-overview-in-unreal-engine).

## 2 - Install the Unreal Canvas Server

The first time you open the **Unreal Canvas** tab, it completes the rest of the installation. The server unpacks first, followed by the local AI models and video tools. These are several GB, and download only after you agree.

### Steps

- Open the **Unreal Canvas tab from Tools > Unreal Canvas**.
- Click Install **Unreal Canvas**. The tab shows a progress bar while the server unpacks.
- In the **Download additional Unreal Canvas components** dialog, click **Yes**.If you click **No**, the local steps (segmentation, depth, and edges) are unavailable until you install the models. A banner at the top of the tab offers them again.

Keep open the Unreal Canvas window that's running your work. Closing it can interrupt running tools and scripts. Several windows can share one server, but a running script stays tied to the window that started it.

Teams that host their own server builds can install from a build server or a shared folder instead. See Managing Unreal Canvas Versions (-> unreal-canvas-overview-in-unreal-engine).

## The Unreal Canvas Tab at a Glance

You use these areas of the **Unreal Canvas** tab in the rest of this page. For how canvases, cards, and the toolshelf work, see Canvases and Organization, Cards, and Work with the Toolshelf (-> unreal-canvas-overview-in-unreal-engine).

|  |  |
| --- | --- |
| **Area** | **What It Does** |
| **The Canvas** | Your main working surface. Your content sits here as cards, which you can group into decks or Frames. You can also add notes and drawings as annotations. |
| **Toolshelf** | Your main interaction point. From here, you can ask agents to do work, or use generative models to create new content. See the table below (-> getting-started-with-unreal-canvas-in-unreal-engine). |
| **App Bar** | The top bar, with general app controls. On the left: **Open** and **Sav**e. A dot on the save icon means unsaved changes. Then one tab per open canvas. Click **+** to open another canvas.On the right: **Help (?)** and **Settings** (gear icon). When you run Unreal Canvas as a standalone app, **Unreal Connect** connects it to an Unreal Editor session. |
| **Panel Dock** | Expands the tool panels:**Agents**, at the top, monitors and interacts with all running agents.**Library** shows all content on the canvas, including archived cards.**Toolbox** holds graphs, Python scripts, and agent skills, and creates new ones.**Inspector** shows the details, history, metadata, and provenance of a selected item, including cards, Frames, and graph nodes.**Operations** tracks active and recently completed generative tasks. |
| **View Controls** | At the top right of the canvas: filter, zoom out, zoom level, zoom in, and settings. **Filter** shows cards that match criteria such as ratings, votes, status, and age. You can add new card metadata in **Setting**s. The settings menu also opens the **Canvas Map**. |
| **Canvas Palette** | Canvas tools: select mode, insert (**+**), annotations (**pen**), and Frame (#). In **Settings**, you can choose where the palette sits. |
| **Cards** | A single element or artifact on the canvas. Each card has one type, with rules you can recognize at a glance. |

#### Toolshelf

The toolshelf has the following controls:

|  |  |
| --- | --- |
| **Control** | **What It Does** |
| **Status message** | Appears above the prompt field when something blocks generation, such as a model with no confirmed credentials. |
| **Prompt field** | Describe what you want to create. Use the expand icon for more room, the microphone to speak your prompt, + to add inputs, and × to clear the prompt. |
| **Output type** | Chooses what to generate: Image, video, audio, text, and other types. |
| **Model picker** | Chooses the model that runs your generation. It reads No models available until you add a provider. |
| **Generation settings** | Click the settings icon beside the model picker to show Aspect Ratio, Resolution, Count, Seed, Google Search, and Batch. The settings change by model. |
| **Agent** | Chooses the agent that works with this generation. |
| **Output options** | Beside Generate. Choose where results go: Create New Card, Create New Deck, Add to Deck, or Agent Chooses. |
| **Add provider / Generate** | Shows Add provider until a provider is connected, then Generate. Or press Ctrl/Cmd+Enter to generate. |

## 3 - Connect Your AI Providers

Unreal Canvas generates images, video, text, and meshes through the providers you connect with your API keys. The models that appear in the toolshelf depend on the keys you add, the model catalog, and your project's restrictions. Set up your providers in three Settings panes, in order.

### Steps

- In the App Bar, click **Settings** (gear icon). Or, in the toolshelf, click** Add provider**.
- **Model Providers:** Paste the API key for each provider you use. You're done when no row reads Missing for a provider you need.
- **Model Catalog:** Check which models can run, and star a model to make it the default. You're done when at least one image model can run.
- **Default Models:** Choose one default for each kind of work you plan to do: image, video, mesh, splat, and upscale.
- Check that each provider's status updates. Unreal Canvas refreshes credentials and the model list when you change a key, so you don't usually need to restart. If a provider shows restart instructions, for example for a sign-in or an environment-based setting, follow them.

Keys set in an environment variable or a keys file take priority over keys you enter in **Settings**. If a key you entered seems to be ignored, check for one of these first.

Treat API keys like passwords. Don't paste them into bug reports, chat, or screenshots.

You can leave the other **Settings** panes, such as **Model Schemas**, **Storage, External Paths**, and **Extensions**, until you need them. Extensions add new tools, card types, and connections to other software.

Your providers' models appear in the toolshelf's model picker, with a default set for each kind of work, and **Add provider** changes to **Generate**.

If a model has no key, the toolshelf shows a message that names the setting it needs. For example: Model 'Nanobanana 2' has no confirmed credentials. Sign in or configure scenario-api-key in Settings, then retry.

### Key Formats

Some providers need their key in a specific format. For example, Scenario takes an ID and a secret joined by a colon (id:secret).

### Model Approval Badges

Every model in the Model Catalog shows an approval badge:

|  |  |
| --- | --- |
| **Badge** | **Meaning** |
| **Approved** | Cleared for use. |
| **Limited Use** | Allowed with conditions. Read the note on the badge. |
| **Unreviewed** | Not reviewed yet. |

Your project can also restrict which models run. If a model is listed but doesn't run, your project's restrictions may not allow it. Your studio decides which models are allowed, so check with whoever owns model approvals before you use a new provider for production work.

## 4 - Connect an AI Agent (Optional)

An AI agent reads your canvas and builds or runs the work you describe. The Agents panel walks you through connecting one in three steps. Unreal Canvas uses the agent's own account and connection settings, including your organization's configuration, and doesn't change them.

### Steps

- In the Panel Dock, click **Agents**. The **Connect your agent** sidebar opens.
- Under Choose your connection, choose one of the following:**Claude Code:** Uses the Claude Code CLI on your computer.
- **Codex:** Uses the Codex CLI on your computer.
- **Other providers:** A company sign-in or an API connection.The agent connection shows **Set up** if it isn't configured yet, or shows **Detected **if it's installed

- Click **Check connection**. This checks the local runtime and the available models, and doesn't send a message yet. If your account isn't signed in, click **Show sign-in steps** first.
- Under **Model for your first chat**, keep** Default (recommended)**, or choose another model.
- Click **Send test message**. This uses your agent provider's account and may incur its normal usage charges. It doesn't change your canvas.

The panel reads **You're connected**, and confirms that your agent replied. Click **Start chatting** to open a chat, or **Set up another provider** to connect another agent. The model, permission, and effort controls are in your chat.

For how Unreal Canvas and Unreal MCP use agents differently, see Unreal Canvas and Unreal MCP (-> unreal-canvas-overview-in-unreal-engine).

Agent usage can have its own costs, separate from the generation services the agent uses.

## 5 - Run a Health Check

Work through the checks in order. The first five cost nothing. Only the optional last checks run billed requests.

### Steps

- **Panel loads**. Open the **Unreal Canvas** tab. The Unreal Canvas interface appears.
- **Version**. Open **Help > About Unreal Canvas**. Write down the Unreal Canvas version and your engine version. You need both for any bug report.
- **Providers**. In **Settings > Model Providers**, nothing you need reads **Missing**.
- **Models**. In **Settings > Model Catalog**, at least one image model can run. The toolshelf shows **Generate** instead of **Add provider**.
- **Scene render.** Frame a shot in the Level Editor viewport. On a new canvas, open **Toolbox** and run **Viewport Render**. A new render card appears, with **Beauty, Depth, Normal**, and **Edges** passes as its components. This runs on your computer and costs nothing.
- **First generation (optional)**. In the toolshelf, set the output type to** Image**, and choose a model that accepts reference images. Select the render card, and add its passes through Inputs. Write a short prompt, and set **Count** to 1 in the generation settings. Open the output options beside Generate, keep **Create New Card**, then click **Generate** (or press **Ctrl/Cmd+Enter**). Watch progress in **Operations**. Your provider bills this generation.
- **Agent (optional)**. In the **Agents** panel, your agent shows as connected. If you skipped the test message in step 4, send it now. Your agent provider may bill this message.

**Viewport Render** starts Play In Editor by default, so level logic such as physics and Blueprints runs during the render.

### If a Check Fails

Local steps run on your GPU, and generation runs with your provider. They fail independently, so the half that works tells you which half to investigate.

- **The tab is blank, or shows a "can't connect" page:** Close Unreal Editor completely and reopen it. If it keeps happening, run the Unreal Canvas install again.
- **A version mismatch or "no versions found" message: **The server version must match the plugin exactly. Update to the latest 5.9 Preview release, then restart the editor.
- **The toolshelf says a model has no confirmed credentials:** Add the key the message names in **Settings > Model Providers**, and check that its status updates.
- **The model picker reads No models available:** No provider is connected yet. Click **Add provider**, and follow step 3 (-> getting-started-with-unreal-canvas-in-unreal-engine).
- **A generator fails as soon as you run it:** Add that provider's key in **Model Providers**. If the key is there, check for a key in an environment variable or keys file that overrides it.
- **A model is listed but doesn't run: **Your project's restrictions may not allow it. Use an approved model, or ask your model-approval owner.
- **Segmentation, depth, or edge steps fail: **Run the Unreal Canvas install again, and agree to the model download.
- **The viewport render is black:** Point the camera at your scene, and make sure the viewport tab is in front.
- **The render shows things moving or changing:** **Viewport Render** runs Play In Editor by default, so level logic runs. Use Editor World mode where it's available.
- **Your agent doesn't connect:** In the **Agents** panel, click **Show sign-in steps**, sign in with your agent's CLI, then click **Check connection** again.
- **Editor actions or agents stop working: **The window running the work was closed. Reopen the **Unreal Canvas** tab from the Tools menu.
- **Unreal Canvas isn't in the Tools menu:** Check that **Unreal Canvas Bridge** is enabled in step 1 (-> getting-started-with-unreal-canvas-in-unreal-engine).

### Changes That Need a Full Editor Restart

Close and reopen Unreal Editor after you do any of the following:

- Change where Unreal Canvas looks for its server builds.
- Turn plugins on or off.
- Change a provider setting whose restart instructions ask for it, such as a sign-in or an environment-based setting.

## Where Your Work Is Stored

Unreal Canvas keeps your canvases, results, and uploads in your user folder by default. You can change where data is stored, for example to a shared drive. On Windows, the default folders are under %APPDATA% and %LOCALAPPDATA%. Back these folders up like any other project data.

If a canvas doesn't open after a crash, open **Settings > Storage**, click **Scan**, then **Quarantine** the damaged files. Quarantine moves them aside safely and doesn't delete them.

For content Unreal Canvas saves inside your project, see What Changes in Your Project (-> unreal-canvas-overview-in-unreal-engine).

- setup
- plugins
- virtual production
- unreal canvas
- generative ai
- ai providers
- api keys

On this page

- Getting Started with Unreal Canvas (-> getting-started-with-unreal-canvas-in-unreal-engine)
- Before You Begin (-> getting-started-with-unreal-canvas-in-unreal-engine)
- 1 - Enable the Unreal Canvas Plugins (-> getting-started-with-unreal-canvas-in-unreal-engine)
- Steps (-> getting-started-with-unreal-canvas-in-unreal-engine)
- 2 - Install the Unreal Canvas Server (-> getting-started-with-unreal-canvas-in-unreal-engine)
- Steps (-> getting-started-with-unreal-canvas-in-unreal-engine)
- The Unreal Canvas Tab at a Glance (-> getting-started-with-unreal-canvas-in-unreal-engine)
- Toolshelf (-> getting-started-with-unreal-canvas-in-unreal-engine)
- 3 - Connect Your AI Providers (-> getting-started-with-unreal-canvas-in-unreal-engine)
- Steps (-> getting-started-with-unreal-canvas-in-unreal-engine)
- Key Formats (-> getting-started-with-unreal-canvas-in-unreal-engine)
- Model Approval Badges (-> getting-started-with-unreal-canvas-in-unreal-engine)
- 4 - Connect an AI Agent (Optional) (-> getting-started-with-unreal-canvas-in-unreal-engine)
- Steps (-> getting-started-with-unreal-canvas-in-unreal-engine)
- 5 - Run a Health Check (-> getting-started-with-unreal-canvas-in-unreal-engine)
- Steps (-> getting-started-with-unreal-canvas-in-unreal-engine)
- If a Check Fails (-> getting-started-with-unreal-canvas-in-unreal-engine)
- Changes That Need a Full Editor Restart (-> getting-started-with-unreal-canvas-in-unreal-engine)
- Where Your Work Is Stored (-> getting-started-with-unreal-canvas-in-unreal-engine)
