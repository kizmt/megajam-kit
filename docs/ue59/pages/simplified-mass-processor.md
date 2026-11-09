# Simplified Mass Processor/Query API (Query Executor)

https://dev.epicgames.com/documentation/en-us/unreal-engine/simplified-mass-processor?application_version=5.9

> Learn how to use the simplified Mass Processor in Unreal Engine.

## Overview

The simplified **Mass Processor/Query API** aims to reduce boilerplate for creating Mass processor logic, and to increase code readability and type safety. This is an optional API and the current style will continue to be supported.

### Creating a Mass Processor with the QueryExecutor

Create a struct in your .cpp inheriting UE::Mass::FQueryExecutor following this example:

 C++

```
struct FExampleExecutor : public UE::Mass::FQueryExecutor
{
  UE::Mass::FQueryDefinition<
    UE::Mass::FMutableFragmentAccess<FExampleFragmentA>,
    UE::Mass::FConstSubsystemAccess<UExampleSubsystem>,
    UE::Mass::FMassTagRequired<FExampleTag>
  > Accessors{ *this };

  virtual void Execute(FMassExecutionContext& Context)
```

Currently QueryExecutors need to be owned by a regular UMassProcessor. This requirement will be removed in a future update.

To create a wrapper UMassProcessor:

- Create a class that inherits from UMassProcessor.
- Do not override the ConfigureQuery or Execute functions.
- Create the QueryExecutor in the constructor for that processor as follows: C++ ```
UE::Mass::FQueryExecutor::CreateQuery<QueryType>(...)
``` UE::Mass::FQueryExecutor::CreateQuery(...)

## Limitations

Currently a UMassProcessor is still needed to interface with the Mass Phase Executor. This will be remedied in a future update.

The declaration of the FQueryDefinition template requires full definitions of the query types and as such, doing so in a header file should be limited to predefined query definitions (not part of larger interface headers). General best practice is to declare them privately in the .cpp file where they are used.

On this page

- Overview (-> simplified-mass-processor)
- Creating a Mass Processor with the QueryExecutor (-> simplified-mass-processor)
- Limitations (-> simplified-mass-processor)
