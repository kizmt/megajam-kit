# Material Data Manipulation and Arithmetic

https://dev.epicgames.com/documentation/en-us/unreal-engine/material-data-manipulation-and-arithmetic-in-unreal-engine?application_version=5.9

> Techniques for manipulating data types, and performing arithmetic in a Material graph.

[image: Material Data Manipulation and Arithmetic]

The Material Data Types (-> material-data-types-in-unreal-engine) page introduced the four ways data is represented in the Material Editor. To create Materials effectively it is necessary not only to know these data types, but also how to manipulate data and control the way information travels through your Material Graph.

Two topics are discussed in this document.

- Manipulating data types (-> material-data-manipulation-and-arithmetic-in-unreal-engine): How to combine floats into a multi-channel vector, and conversely, how to isolate information out of a larger data type.

- Material Graph arithmetic (-> material-data-manipulation-and-arithmetic-in-unreal-engine): Rules and processes for performing arithmetic operations in a Material with different data types.

## Manipulating Data Types

Just because a piece of information originates as one data type does not mean it needs to stay that way. For example, you can combine or **Append** two Scalar Parameters (floats) into a two-channel vector (float2) in order to pass them into an input that requires two-channel data. Conversely, you can use a **ComponentMask** to retrieve a specific subset of channels out of a larger vector.

The Material Expressions documented in this section provide ways to combine and separate data to control the way information flows through your Material Graph.

### AppendVector

An AppendVector Material Expression combines the data in **Input A** with the data in **Input B**, and outputs a multi-channel vector (float2, float3, or float4). In this example, two Constants are appended together to output a float2: **(1, 2)**.

 [image: AppendVector Node]

#### Example Use Case

The Append node is often useful when you want the ability to modify two values independently of one another, but need to pass them into an input that requires multi-channel data. The graph below gives artists a way to control the Tiling or **UV scale** of a texture in a Material Instance, but only uniformly.

 [image: UV Tiling controls uniform]

The shortcoming in this example is that the Material Graph only contains one parameter, but UV Coordinates have two channels. With this solution you cannot control the width and height of the texture independently.

You can solve this by using an **AppendVector**. Create a separate Scalar Parameter for each axis and then pass them into the Append node. The Append node combines the two parameters into a float2, which is then multiplied by the Texture Coordinates.

 [image: UV tiling controls two-channel]

Since **Tiling X** and **Tiling Y** are parameterized separately, you can now control the width and height of the texture independently.

#### Append Order

The AppendVector expression combines data in the order it is attached to the node. The data in Input B is always appended to the end of the data in Input A. Consider the two images below.

 [image: Append order initial]
 [image: Append order reversed]

- In the first slide, the appended result is **(0.05, 0.2, 0.8)**, or light blue as the node preview shows.

- In the second slide, the appended result is **(0.8, 0.05, 0.2)**, or pink as the node preview shows.

### AppendMany

**AppendMany** is a Material Function (-> unreal-engine-material-functions-overview) that works the same way as the AppendVector expression, but can combine up to four separate float/scalar values into a multi-channel vector.

 [image: AppendMany Material Function]

One added benefit of the AppendMany function is that it provides three different output pins. This gives you access to some or all of the appended channels, depending on what you need for a given situation.

The AppendMany node only accepts float/scalar values on its inputs. If you pass a float2, float3, or float4 into the AppendMany node, all but the first value is discarded.

### Component Mask

The **Component Mask** Material Expression serves the opposite purpose to the Append nodes documented above. Instead of combining data, a ComponentMask provides a way to separate data into its component parts or channels.

A Component Mask functions like a gate. For any data connected to its input, you can choose exactly which channels are allowed to pass through the output. The image below shows a Constant4Vector containing values of (0, 1, 0.7, 0.5). When you select the Mask node in the graph, four check-boxes are displayed in the Details Panel.

 [image: Component Mask Details Panel]

These check-boxes determine which channels the node will output. Currently none are checked, so the Mask node will not output any information. If you attempt to plug it into a downstream input, the node will display an error.

 [image: Component Mask Details Panel]

These checkboxes give you a way to filter out information and only use the channels that you need.

Suppose you wanted to use the value in the **A channel** to control the opacity of a Material. You would enable the A channel by checking the box, then connect the output pin of the Mask to the **Opacity Input**.

 [image: Component Mask example]

The ComponentMask discards the R, G, and B channels because they are unchecked, and outputs only the value in the A channel — in this case 0.5.

## Material Graph Arithmetic

The second main way of manipulating data in a Material Graph is through mathematical operations. All common arithmetic operations are available in the Material Editor.

 [image: Arithmetic Material expressions]

The four arithmetic Material Expressions. Read more on the Math Material Expressions page.

The basic purpose of the arithmetic nodes should be relatively self-evident. For example, if you plug constant values of **0.3** and **0.2** into an **Add** node, the Add node calculates **0.3 + 0.2** and outputs a value of **0.5**. Arithmetic between two constant values is simple and straightforward.

 [image: Simple addition operation]

However, as demonstrated on the data types page, information does not always travel through the Material Graph as individual float values. Because of this, it is important to understand the rules and processes for performing arithmetic between various data types in a Material. There are two major areas of concern.

- Not all data types are compatible with one another for arithmetic operations.

- Arithmetic operations work differently depending on the data types involved.

### Compatible and Incompatible Data Types

The example above showed a simple addition operation between two float values, or 0.3 + 0.2 = 0.5. This operation works because both values are the same kind of data. What happens if a different data type is passed into one of the inputs? These three points summarize compatibility between data types:

- Arithmetic between **equivalent data types** is always valid. For example, **float2 + float2** returns a new float2.

- Arithmetic between a float and any larger float is valid. For example, **float + float3** returns a new **float3**.

- Arithmetic between two inequivalent data types is invalid. For example, **float2 + float3** is invalid and returns an error.

In other words, arithmetic across two different data types is possible, but only if one of the data types is a float. In the graph below, the operation **0.3 + (1,2)** is valid. The float is added to both values in the float2, and the result is a new float2 with values of **1.3, 2.3)**.

 [image: Float1 plus float2]

However, arithmetic between inequivalent float2, float3, or float4 data returns an error.

 [image: Float3 plus float2 error]

The table below summarizes data type compatibility for Material Graph arithmetic.

| Data Type | Compatible Data Types for Arithmetic |
| --- | --- |
| Float | Any |
| Float2 | Float, Float2 |
| Float3 | Float, Float3 |
| Float4 | Float, Float4 |

### Arithmetic Rules Between Data Types

It's also necessary to understand how arithmetic calculations are performed between different data types. The two scenarios below demonstrate how arithmetic works when one or both of the data types are larger than a float.

#### Arithmetic Between Equivalent Data Types

When arithmetic occurs between equivalent data types (float2 + float2 for example) each value in Input A is operated on by the corresponding value in Input B. The example below shows addition between two **Constant2Vector** Expressions.

 [image: Addition between two Float2 variables]

Written out in long form, there are two separate addition operations. The first values in each node are added together: **(1 + 2)**. Then the second values in each node are added **(3 + 3)**. The result is a new float2: **(2, 6)**.

The chart below shows an arithmetic example for each of the four data types.

| Input A, Input B | Input Data | Math Notation | Resulting Data |
| --- | --- | --- | --- |
| Float, Float | (4) / (2) | 4 / 2 = 2 | 8 |
| Float2, Float2 | (1, 3) + (2, 3) | (1 + 2), (3 + 3) | (3, 6) |
| Float3, Float3 | (3, 2, 0.5) * (2, 1, 2) | (3 x 2), (2 x 1), (0.5 x 2) | (6, 2, 1) |
| Float4, Float4 | (2, 2, 2, 3) - (1, 1, 2, 2,) | (2 - 1), (2 - 1), (2 - 2), (3 - 2) | (1, 1, 0, 1) |

#### Arithmetic Between a Float and a Vector

When arithmetic occurs between a float and any larger data type, the float is used repeatedly for each separate calculation. In the image below a **Constant** and a **Constant3Vector** are multiplied together.

 [image: Multiplication between a Float and a Float3]

As shown in the illustration, the value in the Constant is multiplied by each value in the Constant3Vector. There are three separate multiplication expressions: **(2 3), (2 1)**, and **(2 *2)**. The product is a float3: **(6, 2, 4)**.

Whether the float is in Input A or Input B has no bearing on multiplication and addition, but of course matters for division and subtraction.

 [image: Subtraction operation]

In the image above, the value in the Constant (2) is subtracted from each value in the Constant3Vector (6, 4, 3). Written out in math notation: (6 - 2), (4 - 2), (3 - 2). The resulting float3 is **(4, 2, 1)**.

If you were to reverse the input order, the results would be different.

 [image: Subtraction with inputs reversed]

Since the float is now the top number in the subtraction node, each arithmetic operation is inverted: **(2 - 6), (2 - 4), (2 - 3)**. The resulting float3 is **(-4, -2, -1)**.

## Conclusion

The concepts and techniques on this page are a key component in most of the Material Graph logic you will use to create Materials. The reference pages linked below can help you increase your understanding of math and data manipulation operations in the Material Editor.

- Math Material Expressions (-> math-material-expressions-in-unreal-engine)

- Vector Operation Expressions (-> vector-operation-material-expressions-in-unreal-engine)

- materials
- rendering
- shaders
- material editor

On this page

- Manipulating Data Types (-> material-data-manipulation-and-arithmetic-in-unreal-engine)
- AppendVector (-> material-data-manipulation-and-arithmetic-in-unreal-engine)
- Example Use Case (-> material-data-manipulation-and-arithmetic-in-unreal-engine)
- Append Order (-> material-data-manipulation-and-arithmetic-in-unreal-engine)
- AppendMany (-> material-data-manipulation-and-arithmetic-in-unreal-engine)
- Component Mask (-> material-data-manipulation-and-arithmetic-in-unreal-engine)
- Material Graph Arithmetic (-> material-data-manipulation-and-arithmetic-in-unreal-engine)
- Compatible and Incompatible Data Types (-> material-data-manipulation-and-arithmetic-in-unreal-engine)
- Arithmetic Rules Between Data Types (-> material-data-manipulation-and-arithmetic-in-unreal-engine)
- Arithmetic Between Equivalent Data Types (-> material-data-manipulation-and-arithmetic-in-unreal-engine)
- Arithmetic Between a Float and a Vector (-> material-data-manipulation-and-arithmetic-in-unreal-engine)
- Conclusion (-> material-data-manipulation-and-arithmetic-in-unreal-engine)
