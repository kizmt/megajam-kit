# ASIS Frequently Asked Questions

https://dev.epicgames.com/documentation/en-us/unreal-engine/asis-frequently-asked-questions-for-unreal-engine?application_version=5.9

> Some common questions about the status and usage of ASIS with Unreal Engine.

This page contains a list of frequently asked questions around Android Single Instance Service (ASIS).

### Frequently Asked Questions

##### 1 - When would one be recommended to use the following scenarios:

**Native Unreal Engine Packaged with Application**

Choose a GameActivity (non-ASIS) distribution when:

- You have no need for Android UI (whereby Unreal renders all pixels).AND
- You only develop a single Unreal Engine application.ORYou would rather combine your various Unreal Engine applications into a single project using your proprietary multi-app architecture. OROne or more of your applications is ineligible for inclusion in your primary ASIS build because it requires a different engine version or other global settings. For example, a GLES-only app and Vulkan-only app. ORYou have decided that the convenience of developing each application in completely separate projects and shipping them as separate APKs is worth the additional disk and RAM usage that having redundant engine build incurs.

**Single Instance Single Application**

Use ASIS with a single-app project:

The HMI is made as a native Android project, and you only need Unreal Engine for real-time 3D elements in one or more portions of the screen.

AND

You need Unreal Engine content only for a single application **or** you need or wish to display each Unreal Engine use-case as an independent project plus APK.

Using a single view:

Rendering multiple camera angles at once:

**Single Instance Multi Application**

Use ASIS and package all the functionality into a single Unreal Engine Android app if:

You have multiple “apps”, such as maps, confidence view, and personal assistance avatar, and do not want to incur the disk and RAM overhead that comes with distributing and running each as its own APK and process.

Displaying multiple UE “apps” using Android UI to tile them:

Using multiple client APKs to give each UE “app” its own OS-level window, although they all run in one process:

Single View versus Multi View:

This is an area that is currently being looked into for a future release and is not a fundamental decision like you’d make with questions 1, 2, or 3 here. But it’s worth knowing that if you want to display multiple apps from a single project simultaneously, or if you want to display perspectives from a single app simultaneously, this is an optional API of ASIS that you can choose to use or not.

Multi-window support is not yet complete, and touch input will not work.

##### 2 - What is the current (as of UE 5.8) thought on how HMI will be implemented with Unreal Engine? Which approach will most partners take?

This depends on the OEM. But the most common use case I have seen is to use Single Instance Single view. This is because, rather than asking the OEM to throw away their existing Android code base, we are enabling them to slowly add Unreal Engine elements into their existing HMI.

##### 3 - What issues is the single instance designed to address? What benefits does it provide?

It carries the benefit of only using only a single instance of Unreal Engine across multiple applications, meaning less RAM and Disk usage. It also has the ability to use Android UI, such as Material and Jetpack Compose, in combination with Unreal Engine in a workflow that is intuitive to native Android developers. The drawbacks of this is the application is split across two APKs, which could contribute to development and testing workflow complexity.

##### 4 - In the case where an Unreal Engine app is already designed to be natively packaged with Unreal Engine, what is the benefit to moving to ASIS?

This is a multi-faceted question where you should consider two architectural decisions: whether to run Unreal Engine as a service or an activity, or whether to combine multiple apple into a single Unreal Engine project. Using both strategies together is particularly powerful but it’s useful to consider the following in isolation when making this decision:

- What are the benefits of moving to a Single Instance?
- What is involved in doing so?
- Are there any drawbacks, like interactions and visuals?
- Are there resource savings, such as CPU, GPU, storage, DDR, DDR bandwidth in choosing to use a single instance if the entire application is built in Unreal Engine?
- Is launch time a consideration?

 The benefit of using Unreal Engine with the ASIS plugin, which runs it as a Service rather than an Activity, is that you can compose it into a native Android app. Additionally, putting multiple apps in a single application means reducing disk and RAM usage. If you want to run your multi-app from a single Unreal Engine process at the same time, you will either need to invent your own means of tiling their viewports within Unreal, or you will need to use ASIS to leverage Android as the means of tiling or piping into different windows (or different Activities). So, it is unlikely to consider combo-application architecture on Android without implying the use of ASIS and its mult-view feature.

 When it comes to ASIS conversion, consider the following:

- The conversion process involves adding the plugin and developing the client.
- The drawbacks are the application being split over two APKs and there is additional overhead from the client app, although it can be negligible.
- If built 100% in Unreal Engine, ASIS doesn’t reduce resource usage for a single app.
- Launching two apps takes more time than launching one app but making Unreal run as a background service allows you to start it preemptively. When the client app connects, Unreal must simply un-pause rather than cold-boot, making it appear as if the load time is only milliseconds.

 When it comes to a combo-app conversion, consider the following:

- The conversion process involves moving each app’s content and code into a single project and reconciling them as necessary. If the projects already exist separately, this can be more complicated.
- The drawbacks here are the inability to vary global settings, such as Vulkan versus OpenGL, buffer pixel depth settings, choosing forward versus deferred rendering, and so on. Workflow complications and longer build times are expected due to multiple apps, to which this could mean multiple development teams needing to share a single Unreal Engine project.
- Combo-app architecture inherently reduces disk and RAM usage, whether ASIS is used or not.
- It is easier to incur a slower launch time because more content means more opportunities to inadvertently load something at start even if it isn’t needed for the first-to-display app. However, while loading one combo-app might be slower than loading one single application, loading one combo-app is always faster than loading several single apps.

##### 5 - What are the considerations in cases where HMI is designed with Unreal Engine (packaged as individual apps for each display) to be used on multiple screens or multiple platforms?

As similar as this question can seem to the previous ones, it has its own benefits and drawbacks that must be considered. These include:

- Considering the benefits and drawbacks of switching to a single instance.
- Reasoning how a single instance can be used to save resources in the case of multiple displays without impeding its benefits of high visual fidelity, rich 3D rendering and smooth transitions / interactions.

Unreal Engine has per process runtime overhead to handle the high visual fidelity and rich 3D rendering required. By using a single instance, as compared to running multiple independent Unreal processes simultaneously, there is more total per-frame CPU and GPU budget for content. Both for CPU and GPU, context switching at the OS level is more expensive than context switching at the application framework level.

Unreal can provide smooth transitions and interactions by placing multiple views in a single process — their frame-pacing becomes synchronized — and interactions become simpler to implement and lower latency as they no longer require IPC.

- automotive
- android
- hmi
- asis

On this page

- Frequently Asked Questions (-> asis-frequently-asked-questions-for-unreal-engine)
- 1 - When would one be recommended to use the following scenarios: (-> asis-frequently-asked-questions-for-unreal-engine)
- 2 - What is the current (as of UE 5.8) thought on how HMI will be implemented with Unreal Engine? Which approach will most partners take? (-> asis-frequently-asked-questions-for-unreal-engine)
- 3 - What issues is the single instance designed to address? What benefits does it provide? (-> asis-frequently-asked-questions-for-unreal-engine)
- 4 - In the case where an Unreal Engine app is already designed to be natively packaged with Unreal Engine, what is the benefit to moving to ASIS? (-> asis-frequently-asked-questions-for-unreal-engine)
- 5 - What are the considerations in cases where HMI is designed with Unreal Engine (packaged as individual apps for each display) to be used on multiple screens or multiple platforms? (-> asis-frequently-asked-questions-for-unreal-engine)
