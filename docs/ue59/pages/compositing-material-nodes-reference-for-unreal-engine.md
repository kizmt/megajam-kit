# Compositing Material Nodes Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/compositing-material-nodes-reference-for-unreal-engine?application_version=5.9

> Product documentation including reference and guides for Unreal Engine

To make compositing easier, UE5 has a series of nodes to serve some of the most common compositing operations. Here, each one is briefly highlighted and has an explanation of its purpose.

Click image to expand.

The compositing material nodes expect a **float4** input, so make sure you're passing in **RGBA** and not just **RGB**.

## Over

This node layers one image (A) over another (B), using the alpha from input A.

 [image: Over Node]

This node expects that the input color channels are pre-multiplied with the image's alpha.

## In

This node returns the portion of A that is inside the shape of B.

 [image: In Node]

## Out

This node returns the portion of A that is outside the shape of B.

 [image: Out Node]

## PreMult

This node multiplies the input's RGBA channel by its alpha.

 [image: PreMult Node]

## UnPreMult

This node divides the input's RGBA channel by its alpha.

 [image: UnPreMult Node]

## KeyMix

This node layers two images together using a specified mask.

 [image: KeyMix Node]
