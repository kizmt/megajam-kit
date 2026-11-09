# Setting up an Automation Test Report Server

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-an-automation-test-report-server?application_version=5.9

> Instructions for setting up an Automation Test Report Server.

[image: Setting up an Automation Test Report Server]

The **Automation System** provides a way to run tests of various systems in **Unreal Engine**, but it has some limitations for providing visibility of data that can hamper its use for distributed testing. The Automation System can generate an HTML report instead of a log file, but over time these reports have become more complex, and if the HTML report is not self-contained locally, you cannot open it directly on a modern web browser.

As a solution to this limitation, you can use an **Automation Test Report Server** to output test results to a shared drive. You can then connect to the server to read the report.

Because there is no back-end to the Automation Test Report Server aside from serving files, it is a very basic, non-demanding web server that you can easily set up on most hardware. This means external third parties running tests remotely can set up a server on their own to share test results.

## Prerequisites

To set up an Automation Test Report Server, you must have the following prerequisite libraries and programs:

- Node.js

- Bower

- Git

If you do not have these prerequisites installed, you will encounter errors.

You can perform this setup process on a local host, but because you cannot share a local host, you will need to set it up with a valid DNS and IP address for the server to be accessible remotely.

Setting up a web domain and address is beyond the scope of this documentation. Use whatever solution is most appropriate to meet your requirements.

## Steps

To set up your Automation Test Report Server, follow the procedure below.

In the instructions below, replace the placeholder sections as follows:

- `(path to result)`: The path where the test results output will be stored. For example, `C:\http_server\local`.

- `(stream root)` : The path where the source control stream or the UE installation is located. For example, `C:\Epic\UE`.

### Install the HTTP Server

- Make sure you have installed all the needed prerequisites (-> setting-up-an-automation-test-report-server).

- Open a command prompt window.

- Make sure `%USERPROFILE%\AppData\Roaming\npm` is in your command prompt path.

- Run the following command: ```
         npm install http-server bower -g

``` npm install http-server bower -g This will install the Bower web server globally.

- Run the following command: ```
         xcopy (stream root)\Engine\Content\Automation (path to result) /E

``` xcopy (stream root)\Engine\Content\Automation (path to result) /E This will recursively copy over the images, config files, and templates for the HTTP server that will be referenced by the generated test reports.

- Run the following command: ```
         cd (path to result)& bower install

``` cd (path to result)& bower install This will tell Bower to install the javascript libraries that are referenced in the copied config files.

### Run the HTTP Server

- Run the following command: ```
         cd (path to result)& http-server

``` cd (path to result)& http-server This changes to the working directory for the HTTP server, and starts it running.

- Leave the command prompt open. Closing the command prompt will shut down the server.

### Viewing Test Results

- When you run your Automation tests, use the following command to specify the `(path to result)` directory for the output. This sets up your tests to output directly to the folder where you set up the web server and its resources. ```
     -ReportExportPath=C:\http_server\local
``` -ReportExportPath=C:\http_server\local

- Open the IP address of your web server in a browser. You can use `http://localhost:8080/` internally, but you will need to set up a proper web address for distributed work, as noted previously. If the output path is the same as the server path, you can use it directly. However, if you are using a subdirectory to store your files, you will need to add it to the path. For example, if you output to something like: `C:\http_server\local\mypath`, then the url should be: `http://localhost:8080/mypath`.

- The web server will provide a list of files. Any reports output to the correct directory will be visible immediately.

- If you provide a session name (-> setting-up-an-automation-test-report-server) and move `Index.html` and `index.json` (normally found in the target directory) along with the directory, you can access the results of a specific test session by name.

- When you finish reviewing results, you can close the command prompt and shut down the server.

### Setting Up Seperate Test Sessions

To better organize your test results and prevent overwriting, you can separate different test sessions into different directories.

- Define a directory name of your choosing to make identifying particular tests easier. For this example, we will use **Session1**.

- Output the result of your Automation tests to `(path to result)\Session1`.

- When you run a different set of tests, change the name. You can either increment the session number, or use a completely different descriptive name, for every new set of tests. This will avoid overwriting previous results.

- To access your results through the web browser, append the directory name for the appropriate test session to the path.

## Result

If everything functions correctly, you will see something resembling the image below, showing a list of tests executed and their respective statuses.

 [image: The Automation Test Report Server providing some test results]

- programming
- automation

On this page

- Prerequisites (-> setting-up-an-automation-test-report-server)
- Steps (-> setting-up-an-automation-test-report-server)
- Install the HTTP Server (-> setting-up-an-automation-test-report-server)
- Run the HTTP Server (-> setting-up-an-automation-test-report-server)
- Viewing Test Results (-> setting-up-an-automation-test-report-server)
- Setting Up Seperate Test Sessions (-> setting-up-an-automation-test-report-server)
- Result (-> setting-up-an-automation-test-report-server)
