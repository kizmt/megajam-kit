# Python Scripting for Capture Manager

https://dev.epicgames.com/documentation/en-us/unreal-engine/python-scripting-for-capture-manager-in-unreal-engine?application_version=5.9

> Use the Python API and example scripts to automate Capture Manager.

The download and ingest of takes using **Capture Manager** can be automated as part of a performance capture workflow with the Python API. The Capture Manager plugin includes a number of example scripts that can be used as a reference and modified to suit your specific requirements. Python scripts should be executed using the **LiveLinkHub **executable.

> **warning:** Use forward slashes `/`(instead of `\`) for paths that appear in a command to avoid problems with character parsing.

## Download Takes

An example script for downloading data from a **Live Link Face** device is provided in the plugin. This can be used as a reference, and modified to suit your specific requirements. It can be found in the following location:

`\Engine\Plugins\VirtualProduction\CaptureManager\CaptureManagerApp\Content\Python\examples\live_link_face_download_only.py`

The script can be run from a Windows terminal (such as PowerShell) using the following command, with the `ip-address` parameter updated for your environment:

```command_line
LiveLinkHub.exe -ExecutePythonScript="<path-to-ue-installation>/Engine/Plugins/VirtualProduction/CaptureManager/CaptureManagerApp/Content/Python/examples/live_link_face_download_only.py --ip-address <ip-address>"
```

## Ingest Takes

Several example scripts are provided to demonstrate ingesting data from Mono Video (-> mono-video-device), Live Link Face (-> live-link-face-device), and Take Archive (-> take-archive-device) devices. These can be used as a reference and modified to suit your specific requirements. They can be found in the following folder:

`\Engine\Plugins\VirtualProduction\CaptureManager\CaptureManagerApp\Content\Python\examples\`

These scripts can be run from a Windows terminal (such as PowerShell) using the following command as a template. You will need to update the `path-to-takes` parameter for your environment:

```command_line
LiveLinkHub.exe -ExecutePythonScript="<path-to-ue-installation>/Engine/Plugins/VirtualProduction/CaptureManager/CaptureManagerApp/Content/Python/examples/take_archive_ingest.py --archive-path <path-to-takes>"
```
