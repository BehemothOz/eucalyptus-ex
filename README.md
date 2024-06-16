# eucalyptus README

This is the README for extension "eucalyptus".

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

Settings

liveServer.settings.port: Customize Port Number of your Live Server. If you want random port number, set it as 0.

    Default value is 5500.

liveServer.settings.root: To change root of server in between workspace folder structure, use / and absolute path from workspace.

    Example: /sub_folder1/sub_folder2. Now sub_folder2 will be root of the server.

    Default value is "/".(The Workspace Root).

liveServer.settings.CustomBrowser: To change your system's default browser.

    Default value is null [String, not null]. (It will open your system's default browser.)
    Available Options :
        chrome
        chrome:PrivateMode
        firefox
        firefox:PrivateMode
        microsoft-edge
        blisk

Not enough? need more? open an/a issue/pull request on github. For now, use liveServer.settings.AdvanceCustomBrowserCmdLine settings (see below).
