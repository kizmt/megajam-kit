# Horde Self-Signed Certs Tutorial

https://dev.epicgames.com/documentation/en-us/unreal-engine/horde-self-signed-certs-tutorial-for-unreal-engine?application_version=5.9

> A tutorial on using self-signed certs with Horde for Unreal Engine.

[image: Horde Self-Signed Certs Tutorial]

## Introduction

When deploying Horde in production environments, it is recommended to use a verified signing certificate.

For testing scenarios, if can be useful to install a self-signed certificate.

Using self-signed certificates circumvents basic security measures. Do not use this technique in production environments.

## Server

- From an administrator PowerShell prompt, add a certificate to the "Personal" store for the local machine by running: ```
     New-SelfSignedCertificate -CertStoreLocation 'Cert:\LocalMachine\My' -DnsName 'my-domain.com'
``` New-SelfSignedCertificate -CertStoreLocation 'Cert:\LocalMachine\My' -DnsName 'my-domain.com'

- Open the Certificate Manager MMC snap-in by running `certmgr.msc` from the Windows 'Run' menu. You should see the certificate created above in the `Personal\Certificates` section. Select the certificate and press Ctrl+C. Navigate to the 'Trusted Root Authorities\Certificates' section, and press Ctrl+V to create a copy.

- Open the server.json (-> horde-orientation-for-unreal-engine) file, and uncomment the `HttpsPort` line: ```
     "HttpsPort": 13341,
``` "HttpsPort": 13341, ...as well as the certificate section at the bottom of the file - updating the subject name to the DNS name on the certificate created above. ```
 "Kestrel":
 {
     "Certificates":
     {
         "Default":
         {
             "Subject": "my-domain.com",
             "Store": "My",
             "Location": "LocalMachine"
         }
     }
 }
``` "Kestrel": { "Certificates": { "Default": { "Subject": "my-domain.com", "Store": "My", "Location": "LocalMachine" } } }

- Restart the server. You should be able to connect over HTTPS from a browser on the same machine on port 13341.

## Clients

- Browse to the server specified above on the HTTPS URL. On the warning dialog about the server having an invalid certificate, choose to export it to a file. On **Google Chrome**, this can be accessed by clicking on the "Not Secure" button in the address bar, selecting "Certificate is not valid", switching to the "Details" tab in the certificate browse, and chosing "Export". Select 'Base-64 Encoded ASCII' as the file type, and save the file. The certificate may also be exported directly from the Certificate Manager MMC snap-in.

- Locate the exported certificate file in Windows Explorer, right click on it, and choose "Install Certificate". When prompted, choose to import the certificate in to the "Trusted Root Certificates" store.

- horde
- bronze

On this page

- Introduction (-> horde-self-signed-certs-tutorial-for-unreal-engine)
- Server (-> horde-self-signed-certs-tutorial-for-unreal-engine)
- Clients (-> horde-self-signed-certs-tutorial-for-unreal-engine)
