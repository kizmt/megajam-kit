# SMPTE 2110 on Linux

https://dev.epicgames.com/documentation/en-us/unreal-engine/smpte-2110-on-unreal-engine-for-linux?application_version=5.9

> An overview of how to use SMPTE 2110 and Rivermax on Linux.

[image: SMPTE 2110 on Linux]

Unreal Engine supports using SMPTE 2110 and Rivermax on Linux. This document explains the Linux-specific setup required to run the Rivermax UE plugin.

## Prerequisites

You must meet the following prerequisites to use the Rivermax UE plugin on Linux.

### Hardware

The hardware requirements for using SMPTE 2110 and Rivermax on Linux are the same as for Windows. Refer to the Setting Up SMPTE 2110 documentation for details on the hardware setup.

### Software

Refer to the table below to find the version of Rivermax to use with UE on Linux.

#### Bluefield 2 and Bluefield 3

| Unreal Engine Version | Rivermax SDK Version | DPU Scripts Version |
| --- | --- | --- |
| 5.8 | 1.90.18 | 3.1.0, 3.3.0 |

Follow the Rivermax and Bluefield DPU instructions for deployment and installation provided by NVidia. Rivermax on UE uses the Dynamic Header Data Split feature. The following recommendations pulled from the Rivermax documentation are important:

- Linux capabilities allow a non-root binary to perform specific privileged operations. The Rivermax library requires certain root permissions to run. Rather than running the entire editor as root, grant it only the two capabilities it needs.
- Rivermax requires `CAP_NET_RAW` (raw socket creation for DPCP) and `CAP_SYS_NICE` (real-time scheduling priority). Users without root access lack both by default.This must be repeated after every rebuild — the build system replaces the binary.
- Capabilities cannot be set on binaries on network-mounted filesystems (NFS, SMB).
- Setting capabilities requires root access.

- Use the following command to grant the required access to the Rivermax library. Command Line ```
sudo setcap cap_net_admin,cap_net_raw+ep /path/to/Engine/Binaries/Linux/UnrealEditor
``` sudo setcap cap_net_admin,cap_net_raw+ep /path/to/Engine/Binaries/Linux/UnrealEditorIf the nosuid mount flag is used, setcap will be ignored.

To check if the Rivermax library has the required root capabilities:

- Find the device that contains the UnrealEditor binary: Command Line ```
df -P /path/toUE/Engine/Binaries/Linux/UnrealEditor
``` df -P /path/toUE/Engine/Binaries/Linux/UnrealEditor
- Output the device: Command Line ```
/dev/nvme2n1p1 ...
``` /dev/nvme2n1p1 ...
- Check the mount options for the device: Command Line ```
cat /proc/mounts | grep /dev/nvme2n1p1
``` cat /proc/mounts | grep /dev/nvme2n1p1
- An example showing the problem with using nosuid: Command Line ```
/dev/nvme2n1p1 /media/nantstage/D ext4 rw,nosuid,nodev,relatime 0 0
``` /dev/nvme2n1p1 /media/nantstage/D ext4 rw,nosuid,nodev,relatime 0 0
- To apply an immediate fix, lost on next reboot, use the following command: Command Line ```
sudo mount -o remount,suid /dev/nvme2n1p1
``` sudo mount -o remount,suid /dev/nvme2n1p1

On this page

- Prerequisites (-> smpte-2110-on-unreal-engine-for-linux)
- Hardware (-> smpte-2110-on-unreal-engine-for-linux)
- Software (-> smpte-2110-on-unreal-engine-for-linux)
- Bluefield 2 and Bluefield 3 (-> smpte-2110-on-unreal-engine-for-linux)
