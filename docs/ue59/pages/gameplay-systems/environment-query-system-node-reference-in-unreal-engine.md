# Environment Query System Node Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/environment-query-system-node-reference-in-unreal-engine?application_version=5.9

> Environment Query System Node Reference page.

[image: Environment Query System Node Reference]

An **Environment Query** is made up of many different pieces. You must call an Environment Query from a Behavior Tree (-> behavior-trees-in-unreal-engine), and then the actual Environment Query will use its **Generator**, reference its **Contexts**, and use its **Tests** to give the Behavior Tree the highest weighted result.

| Node Type | Description |
| --- | --- |
| **Generator** | Produces the locations or Actors, referred to as **Items**, that will be tested and weighted. |
| **Contexts** | Provides a frame of reference for the various Tests and Generators. |
| **Tests** | Establishes how the Environment Query decides which Item from the Generator is the best option. |

Please refer to the links below for additional information on each subject.

- [image: EQS Node Reference: Generators] EQS Node Reference: GeneratorsDescribes how Generators are used within the EQS system. (-> eqs-node-reference-generators-in-unreal-engine)
- [image: EQS Node Reference: Tests] EQS Node Reference: TestsDescribes how to use Tests within EQS to generate the "best" option. (-> eqs-node-reference-tests-in-unreal-engine)
- [image: EQS Node Reference: Contexts] EQS Node Reference: ContextsDescribes how Contexts are used within Tests and Generators in the EQS system. (-> eqs-node-reference-contexts-in-unreal-engine)

- ai
- eqs
- environment query system
- eqs essentials
