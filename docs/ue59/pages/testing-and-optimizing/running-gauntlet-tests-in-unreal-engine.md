# Run Gauntlet Tests

https://dev.epicgames.com/documentation/en-us/unreal-engine/running-gauntlet-tests-in-unreal-engine?application_version=5.9

> Learn how to run Gauntlet tests.

[image: Run Gauntlet Tests]

## RunUnreal Command: An Unreal Engine (UE) Tests Wrapper

Gauntlet has UE-specific commands, tests, and classes to handle Engine specifics.

The main Gauntlet command to trigger UE tests is `RunUnreal`. This command utilizes specific classes to handle UE-packaged games and other output.

Some related tests are already implemented to drive common test workflows, including the following:

- `UE.BootTest` and `UE.EditorBootTest` - Starts the project Client or Editor and then exits after initialization completes.

- `UE.EditorAutomation` and `UE.TargetAutomation` - Runs Engine Automation Test Framework on Editor and Client.

- `UE.Networking` - Runs an automated networking test if the target map is set up to trigger `NetTestGauntletClientController` or `NetTestGauntletServerController`.

- `UE.ErrorTest` - Runs automated tests on a target map if it is set up to trigger the `ErrorTest` Gauntlet Controller.

- `UE.PLMTest` - Runs Process Lifetime Management on the target platform.

### UE.Automation Tests

The tests under `UE.Automation.cs` simplify how you run C++ (-> write-cplusplus-tests-in-unreal-engine) and functional (-> functional-testing-in-unreal-engine) tests from a build system.

Gauntlet includes a test to run UE functional tests in the Editor and a packaged game (Client): `UE.EditorAutomation` and `UE.TargetAutomation`.

#### Editor Command Line

```
RunUAT.bat RunUnreal -test=UE.EditorAutomation -runtest=Mytest.one -project=<path to uproject> -build=editor
```

RunUAT.bat RunUnreal -test=UE.EditorAutomation -runtest=Mytest.one -project=<path to uproject> -build=editor

#### Client Command Line

```
RunUAT.bat RunUnreal -test=UE.TargetAutomation -runtest=Mytest.one -project=<path to uproject> -build=<path to packaged game>
```

RunUAT.bat RunUnreal -test=UE.TargetAutomation -runtest=Mytest.one -project=<path to uproject> -build=<path to packaged game>

#### Target Platform Command Line

```
RunUAT.bat RunUnreal -test=UE.TargetAutomation -runtest=Mytest.one -project=<path to uproject> -build=<path to packaged game> -platform=<platform> -device=<ip>:<platform>
```

RunUAT.bat RunUnreal -test=UE.TargetAutomation -runtest=Mytest.one -project=<path to uproject> -build=<path to packaged game> -platform=<platform> -device=<ip>:<platform>

Gauntlet can only deploy console and mobile device builds if you implement the corresponding `ITargetDevice`, `IDeviceFactory`, `IDefaultDeviceSource`, `IAppInstall`, and `IAppInstance`

#### Resuming Tests on Failure

UE.Automation tests can resume testing after a critical failure, such as a crash in the middle of a run. This behavior is optional as it forces the test controller to save a JSON file before tests start.

To enable resume behavior, add the `-ResumeOnCriticalFailure` argument.

The resume happens up to three times before considering the build too unstable to continue.

## Passing Parameters to Gauntlet from Command Line

You can pass custom arguments to Gauntlet from the command line. Gauntlet automatically passes all arguments to the test class, which you can access using specific properties.

You can use the following command line syntax:

```
-test="MyTest(foo,bar='some value')"
```

-test="MyTest(foo,bar='some value')"

You can access the parameter from the test class using the following syntax:

```
bool MyBoolFromArgumentLine = Context.TestParams.ParseParam("foo");
string MyValueFromArgumentLine = Context.TestParams.ParseValue("bar", "DefaultValue");
```

bool MyBoolFromArgumentLine = Context.TestParams.ParseParam("foo");
string MyValueFromArgumentLine = Context.TestParams.ParseValue("bar", "DefaultValue");

Alternatively, you can use the UAT-executed C# code to parse the global command line arguments (regardless if any other code consumed it) with the following syntax:

```
string MyValueFromArgumentLine = Globals.Params.ParseValue("ArgumentLine", "DefaultValue");
```

string MyValueFromArgumentLine = Globals.Params.ParseValue("ArgumentLine", "DefaultValue");

## Lyra Gauntlet Test

This section guides you through running an existing Gauntlet test that is available in the Lyra Sample Game (-> lyra-sample-game-in-unreal-engine).

### Boot Test Node Code

```
using Gauntlet;

namespace LyraTest
{
	/// <summary>
	/// A Simple boot test
	/// </summary>
	public class BootTest : UnrealTestNode<UnrealTestConfiguration>
	{
		public BootTest(UnrealTestContext InContext)
		: base(InContext)
		{}

		/// <summary>
		/// Return a config for BootTest, just need one client and a suitable
		/// timeout
		/// The test expect the client to quit automatically
		/// </summary>
		/// <returns></returns>
		public override UnrealTestConfiguration GetConfiguration()
		{
			UnrealTestConfiguration Config = base.GetConfiguration();

			// Get a single client
			UnrealTestRole ClientRole = Config.RequireRole(UnrealTargetRole.Client);
			// Exit when a specific log message is triggered
			ClientRole.CommandLineParams.Add("testexit", "GauntletHeartbeat: Idle");

			Config.MaxDuration = 5 * 600; // 5 minutes timeout

			return Config;
		}
	}
}
```

using Gauntlet;

namespace LyraTest
{
 /// <summary>
 /// A Simple boot test
 /// </summary>
 public class BootTest : UnrealTestNode<UnrealTestConfiguration>
 {
 public BootTest(UnrealTestContext InContext)
 : base(InContext)
 {}

 /// <summary>
 /// Return a config for BootTest, just need one client and a suitable
 /// timeout
 /// The test expect the client to quit automatically
 /// </summary>
 /// <returns></returns>
 public override UnrealTestConfiguration GetConfiguration()
 {
 UnrealTestConfiguration Config = base.GetConfiguration();

 // Get a single client
 UnrealTestRole ClientRole = Config.RequireRole(UnrealTargetRole.Client);
 // Exit when a specific log message is triggered
 ClientRole.CommandLineParams.Add("testexit", "GauntletHeartbeat: Idle");

 Config.MaxDuration = 5 * 600; // 5 minutes timeout

 return Config;
 }
 }
}

### Run the Boot Test Example

- Open a command prompt.

- Change directory to `Engine/Build/BatchFiles` within your Unreal Engine root directory.

- Enter the following command in the command prompt. ```
     RunUAT BuildCookRun -project=Samples/Games/Lyra/Lyra.uproject -platform=Win64 -configuration=Development -build -cook -pak -stage
``` RunUAT BuildCookRun -project=Samples/Games/Lyra/Lyra.uproject -platform=Win64 -configuration=Development -build -cook -pak -stage

- After the process completes, enter the following command in the command prompt. ```
     RunUAT RunUnreal -project=Samples/Games/Lyra -platform=Win64 -configuration=Development -build=local -test=LyraTest.BootTest
``` RunUAT RunUnreal -project=Samples/Games/Lyra -platform=Win64 -configuration=Development -build=local -test=LyraTest.BootTest

### Boot Test Flow Explanation

- `BuildCookRun` generates a Win64 build of Lyra in `Samples/Games/Lyra/Saved/StagedBuilds`.

- `RunUnreal` launches Gauntlet, which: Creates an instance of the `LyraTest.BootTest` node, which provides basic rules for running the test.

- Discovers local builds for the Lyra Project.

- Validates that a Win64 Development build was available.

- Launches Lyra.

- Monitors the running process for any issues.

- Detects that Lyra exits.

- Checks for common issues such as crashes, asserts, and fatal errors.

- Creates a summary report if the `LyraTest.BootTest` node verifies the test is still running without error.

- testing
- programming
- automation
- gauntlet

On this page

- RunUnreal Command: An Unreal Engine (UE) Tests Wrapper (-> running-gauntlet-tests-in-unreal-engine)
- UE.Automation Tests (-> running-gauntlet-tests-in-unreal-engine)
- Editor Command Line (-> running-gauntlet-tests-in-unreal-engine)
- Client Command Line (-> running-gauntlet-tests-in-unreal-engine)
- Target Platform Command Line (-> running-gauntlet-tests-in-unreal-engine)
- Resuming Tests on Failure (-> running-gauntlet-tests-in-unreal-engine)
- Passing Parameters to Gauntlet from Command Line (-> running-gauntlet-tests-in-unreal-engine)
- Lyra Gauntlet Test (-> running-gauntlet-tests-in-unreal-engine)
- Boot Test Node Code (-> running-gauntlet-tests-in-unreal-engine)
- Run the Boot Test Example (-> running-gauntlet-tests-in-unreal-engine)
- Boot Test Flow Explanation (-> running-gauntlet-tests-in-unreal-engine)
