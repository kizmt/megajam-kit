# AI Components

https://dev.epicgames.com/documentation/en-us/unreal-engine/ai-components-in-unreal-engine?application_version=5.9

> Describes Components related to AI, used for AI Perception and Pawn Sensing.

[image: AI Components]

AI Components are a type of component that enable Pawns receive sensory like data from the environment, such as where noises are coming from or if the Pawn can see something.

## AI Perception Component

The **AIPerceptionComponent** is used to register as stimuli listener in the **AIPerceptionSystem** and gathers registered stimuli. **UpdatePerception** is called when component gets new stimuli (batched).

## Pawn Noise Emitter Component

A **PawnNoiseEmitterComponent** tracks noise event data used by **SensingComponents** to hear a Pawn. This component is intended to exist on either a Pawn or its Controller. It does nothing on network clients.

## Pawn Sensing Component

The Pawn SensingComponent encapsulates sensory (i.e. sight and hearing) settings and functionality for an Actor, allowing the Actor to see/hear Pawns in the world. It does nothing on network clients.

On this page

- AI Perception Component (-> ai-components-in-unreal-engine)
- Pawn Noise Emitter Component (-> ai-components-in-unreal-engine)
- Pawn Sensing Component (-> ai-components-in-unreal-engine)

Related documents

Artificial Intelligence

 [image: Artificial Intelligence] (-> artificial-intelligence-in-unreal-engine)
