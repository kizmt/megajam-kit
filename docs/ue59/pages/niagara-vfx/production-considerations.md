# Production Considerations

https://dev.epicgames.com/documentation/en-us/unreal-engine/production-considerations?application_version=5.9

> Learn about production considerations when rendering your Niagara systems.

[image: Production Considerations]

## Production Considerations

In most cases, you will not be working in isolation. Other artists will need to check out the files you are using. This can result in work stoppages as you wait for the files you need to be released back to you.

There are several methodologies you can employ to allow teams to work in parallel:

- Add per discipline level sequences to each shot.

- Add per discipline sub levels to each Persistent/Sequence based level.

Depending on the size of your team you may want to break down even further by adding per artist and/or per shot level sequences and sub levels.

 [image: Separate sequences]

Another technique you can employ is the use of **Spawnable** actors instead of **Possessable** actors.

A Spawnable actor is created by Sequencer. It does not exist within the level until you open the Level Sequence which spawns it. As a result you do not need access to the persistent level to add or modify an actor.

Spawnable actors can be created by either:

- Converting a Possessable actor to Spawnable.

- Dragging an asset from the Content Browser directly into Sequencer.

On this page

- Production Considerations (-> production-considerations)
