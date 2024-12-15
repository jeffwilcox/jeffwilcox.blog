---
layout: post
comments: true
title: Windows Azure cross-platform command line improvements - Summer 2013
categories: [azure, cloud]
outdated: true
tags: [azure, cloud, cli, command-line, tools]
---
On the Windows Azure team, we're committed to providing great experiences for developers and infrastructure customers with a number of ways to manage your services.

One of my favorite ways to administer my services is by using the `azure` command from a terminal: our cross-platform command line interface (CLI) lets you your manage virtual machines, storage accounts, mobile services and web site apps, and more, on any operating system - Windows, Mac OS X, and Linux.

![The Azure command running in the Terminal application.]({{ site.cdn }}summercli/AzureCommandTerminal.png =697x534 "The Azure command running in the Terminal application.")

I wanted to share a few of the recent improvements as a blog post; we iteratively complete many new features and bug fixes each month (even more often for our Node.js SDK, which the tool builds on).

Here's what we've been up to this summer... please let us know what you think! You can comment on this post, [file issues on our GitHub repo](https://github.com/WindowsAzure/azure-sdk-tools-xplat/issues?state=open), or [interact with us on Twitter](http://windowsazure.github.io/contact.html).

# Cross-platform command line interface

The x-plat command line tool is implemented in JavaScript (powered by Node.js) so that it works on your Mac, a PC, or even if you're running Ubuntu - but our nice Mac and PC installers mask these details allowing for anyone to easily manage resources from their favorite command prompt or terminal app. The CLI is a really easy and fun way to manage your account.

At the bottom of this post, I will provide additional info about the tool, such as where to log issues, learn about verbose output, and JSON support.

## Installing the CLI

- You can find the installation page at [http://www.windowsazure.com/downloads/](http://www.windowsazure.com/en-us/downloads/#cmd-line-tools).
- We offer installers for Windows and Mac, and on Linux either a Node.js source tarball or the `npm` installation option.
- Node.js developers can install the CLI by running `npm install azure-cli` (depending on your setup, you may need to run w/`sudo`)

# New features for Summer '13

In the month of July we shipped some good new functionality (0.6.18), focusing on storage and compute commands, and in August (0.7.0) we rounded out these improvements with support for virtual networks and other important sub-features. We've also rearranged some commands where it makes sense and are preparing to deprecate some older command entrypoints.

Here are some of the hundreds of commits that have happened over the summer.

## Improved menus, information and command hierarchy

With age the tool has finally had a nice refresh in many ways:

- Simplified default command view: drill down to the sections you care about, but the main `azure` view simply lists the top-level command areas now - the list of services supported continues to grow.
- Important bug fixes that were impacting developers in some scenarios.
- Added a `--version` flag at the top-level to share information about the installed CLI tool version you are using, along with the underlying Node.js runtime being used, to help with support issues.
- We're beginning to deprecate some functionality that has moved elsewhere; for example, the old `azure account storage` functionality for creating and managing storage accounts has moved to the proper top-level command of `azure storage account`; for now we support both, but will deprecate in a few releases.

## IaaS: Create and manage Windows Azure Virtual Networks

You can now create and manage Virtual Networks within Windows Azure using the command line tool.

This is key for enabling applications where VMs need to have a local network running without exposing endpoints to the public Internet.

You can learn more through the feature page for [Windows Azure Virtual Networks](http://www.windowsazure.com/en-us/services/virtual-network/) and also a tutorial on [creating a new Virtual Network via the management portal](http://www.windowsazure.com/en-us/manage/services/networking/create-a-virtual-network/). The best complete resource is the [MSDN documentation for Windows Azure Virtual Networks](http://msdn.microsoft.com/library/windowsazure/jj156007.aspx).

At this time the commands support creating, deleting, import/export of vnets, plus managing DNS server registrations.

### Creating a new Virtual Network

In the most simple case, you can create a new virtual network for a few VMs by simply specifying a name for the network, the subnet name, and that's it.

<pre class="brush: bash">
$ azure network vnet create -n VMs MyVirtualNetwork
</pre>

### Managing network configuration

You can use the `network export` and `network import` to work with a configuration file for the network, allowing for source control and other ways of modifying the network config.

## IaaS: Create secure Linux VMs

You can now create a "password-less" Linux VM that supports only authorization using an SSH key pair. This is much more secure than a password and is supported by a new `--no-ssh-password` parameter when calling `azure vm create` along with a `--ssh-cert` PEM SSH certificate.

I previously blogged about how to [Create Secure Linux VMs in Azure with SSH Certificates](http://www.jeff.wilcox.name/2013/06/secure-linux-vms-with-ssh-certificates/).

Here's a simple VM create command that will create a new CentOS Linux image in an affinity group I already have setup and the Virtual Network I just setup in the previous section:

<pre class="brush: bash">
$ azure vm create \
--affinity-group MyAffinityGroup \
--blob-url http://mystorageaccount.blob.core.windows.net/vhds/myvhdfile.vhd" \
--vm-size Large \
--vm-name MyVirtualMachine \
--ssh 22 \
--ssh-cert ~/mycertificate.pem \
--no-ssh-password \
--virtual-network-name MyVirtualNetwork \
--subnet-names VMs \
myservicename \
5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415 \
myusername
</pre>

## IaaS: Supporting high-memory instance sizes A6, A7

Memory-intensive virtual machines are available in Windows Azure and are referenced by the compute instance name: A6 and A7. The `vm create` command now supports creating these large, impressive, rather awesome virtual machines.

These instance sizes are perfect for database scenarios, memcache workloads, etc. Here's a table of the *Linux VM pricing*:

<table class="table">
<thead>
<tr>
<th>Compute Instance Name</th>
<th>Virtual Cores</th>
<th>RAM</th>
<th>Linux price per hour*</th>
<th>Linux approx. monthly price</th>
</tr>
</thead>
<tbody>
<tr>
<td>A6</td>
<td>4</td>
<td>28 GB</td>
<td>$0.82</td>
<td>~ $610</td>
</tr>
<tr>
<td>A7</td>
<td>8</td>
<td>56 GB</td>
<td>$1.64</td>
<td>~ $1,220</td>
</tr>
</tbody>
</table>

> * Note that the pricing information is most accurate on the Windows Azure web site. Provided in this post for easy reference only in a non-official manner. [Official pricing here](http://www.windowsazure.com/en-us/pricing/details/virtual-machines/).

You can learn about pricing for various Windows and Linux virtual machine instances on the [Windows Azure pricing details page for VMs](http://www.windowsazure.com/en-us/pricing/details/virtual-machines/).

## IaaS: Use and Create VM Availability Sets

The `azure vm create` command now supports a new `--availability-set` parameter (short param: `-A`). Availability Sets help create virtual machines that are designed to be serviced by the Windows Azure fabric during underlying operating system updates, and allow for the Service Level Agreement (SLA) for Virtual Machines.

The name specified with the parameter can refer to a non-existant availability set (we'll create one for you) or an existing availability set.

You can learn more in this article available on WindowsAzure.com: [Manage the Availability of Virtual Machines](http://www.windowsazure.com/en-us/manage/windows/common-tasks/manage-vm-availability/)

## Storage: Storage container management, new storage top-level group

We've refactored the earlier storage account support into its own top-level section, `storage`. So instead of calling `azure account storage` to view keys and create/remove storage accounts, these things are now found in the `azure storage` sub-space. We'll eventually remove the old `azure account storage` set of commands as they are now deprecated with our 0.7.0 August release.

Here's the current set of commands available for Windows Azure Storage:

<pre class="brush: bash">
$ azure storage
help:    Commands to manage your Storage objects
help:
help:    Commands to manage your Storage accounts
help:      storage account list [options]
help:      storage account show [options] <name>
help:      storage account create [options] <name>
help:      storage account set [options] <name>
help:      storage account delete [options] <name>
help:
help:    Commands to manage your Storage account keys
help:      storage account keys list [options] <name>
help:      storage account keys renew [options] <name>
help:
help:    Commands to manage your Storage container
help:      storage container list [options] [container]
help:      storage container show [options] [container]
help:      storage container create [options] [container]
help:      storage container delete [options] [container]
help:      storage container set [options] [container]
help:
help:    Options:
help:      -h, --help  output usage information
</pre>

So with the August release we now allow for creating storage containers inside of a storage account. When you create a storage container, you're able to set privacy (whether the URLs can be public or not) optionally.

### Retrieving keys

I have a storage account, but to use it, I need to include the account name and keys.

Here's an example of what I get when I query for the names:

<pre class="brush: bash">
$ azure storage account keys list mystorageaccount
info:    Executing command storage account keys list
+ Getting storage account keys
data:    Primary:  DCN12097124907124097124097124097124097214120947812940712409712049712094710924712097410==
data:    Secondary:  b7qoH019274190274019724019724019724091724091724097124097120497120947120947120974109722==
info:    storage account keys list command OK
</pre>

So copy the primary key and we'll use that next.

### Creating a new public container

By default containers are not public. But to make it public, I will provide a `--permission` parameter with either Off, Blob, or Container. I'll select Blob so that blog contents, but not listing the container, is accessible.

<pre class="brush: bash">
$ azure storage container create \
--permission Blob \
-a mystorageaccount \
-k DCN12097124907124097124097124097124097214120947812940712409712049712094710924712097410== \
MyNewPublicContainerName
</pre>

The tool also supports providing storage account connection strings from the portal using the `--connection-string` or `-c` parameter, too.

## Improved Mac OS X installation experience

We've done some work to update the OS X installation experience with the modern Windows Azure logo.

Key for Mountain Lion customers, installation is easier now that the package is Developer ID-signed, certifying it as an official Microsoft package. In the past, Mountain Lion customers unfortunately had to click through a dialog box approving the installation before as it was not signed.

![The Mac installer package is now Developer ID-signed, improving the experience for Mountain Lion customers.]({{ site.cdn }}summercli/DeveloperID.png =621x308 "The Mac installer package is now Developer ID-signed, improving the experience for Mountain Lion customers.")

We've also updated the brand graphics so things look more cloud-snazzy.

![The installer has the latest Windows Azure branding and is shipped as a disk image file.]({{ site.cdn }}summercli/MacInstallerUpdates.png =700x359 "The installer has the latest Windows Azure branding and is shipped as a disk image file.")

Special thanks to our friends from Mac business unit at Microsoft in their help here.

## Web Sites improvements

The Windows Azure Web Sites list now includes more commands for many of the latest features, including custom SSL certificate support, domain management, and more.

### Support for Custom SSL Certificates

The tool now supports adding new SSL certificates to an account, removing them, etc.

#### Viewing existing certificates

I run a web site for my app at www.4thandmayor.com, supporting both HTTP and HTTPS via a custom wildcard certificate. Here's what the `azure site cert list` command shows for my sites:

<pre class="brush: bash">
$ azure site cert list 4th
info:    Executing command site cert list
+ Retrieving site information
data:    Subject                            Expiration Date            Thumbprint
data:    ---------------------------------  -------------------------  ----------------------------------------
data:    *.4thandmayor.com,4thandmayor.com  2014-02-07T23:59:59+00:00  F5A51E2BFB0144547B25BAE90C843413AD8AC029
info:    site cert list command OK
</pre>

### Manage Web Site domains

There are now commands for managing domains for a Web Site, too. Here, I'm just going to list the domains associated with a Web Site, in JSON format.

<pre class="brush: bash">
$ azure site domain list 4th --json
[
  "4th.azurewebsites.net",
  "www.4thandmayor.com"
]
</pre>

### Set, Connection String, Default Document and Handlers

You can now set Windows Azure Web Site properties and settings from the command line, including the .NET version for the app, or PHP runtime version, or 32-/64-bit worker processes.

You will find information about these commands by querying `azure site -h`.

### Configure Web Site diagnostics

A lot of diagnostic options are available for Windows Azure Web Sites, including the ability to do web server logging, track failed requests, specify the level of logging to perform for applications, etc.

One of my favorites is the `azure site log tail` that will show real-time diagnostics information when I configure diagnostics on my site.

To configure diagnostics, you use the `azure site log set` command.

## Command line auto-completion support (Bash)

When using a Linux or Mac Bash shell + supporting terminal, the `azure` command now offers parameter `TAB`-key auto-completion in some scenarios. Look for more here in the future.

## General-purpose changes and bug fixes

- Many commands now have confirmation prompts for safety; a new `--quiet` parameter is available in these scenarios for scripted solutions.
- Errors are now reported through a file named `azure.err` in the current directory instead of `azure_error` - the file extension should help make the information more actionable to tools and file associations.
- The xplat CLI is no longer implemented using the singleton pattern; as a result, the tool is now more programmable and easier to test with.
- Support for account environments, a way to allow for managing resources across various Windows Azure data center offerings
- Improved service validation for mobile service names
- Slight code refactorings, JavaScript jslint fixes
- Bug fixes to the Web Sites scale feature

# More basics about the CLI

If this is your first time reading about the CLI, read on!

## Learning about commands

One of the nice things about the CLI is how easy it is to learn about functionality and commands. Start just by typing `azure` from the terminal and you'll be greeted with the top-level services & features.

<pre class="brush: bash">
jwmac:~ jeffwilcox$ azure
info:             _    _____   _ ___ ___
info:            /_\  |_  / | | | _ \ __|
info:      _ ___/ _ \__/ /| |_| |   / _|___ _ _
info:    (___  /_/ \_\/___|\___/|_|_\___| _____)
info:       (_______ _ _)         _ ______ _)_ _
info:              (______________ _ )   (___ _ _)
info:
info:    Windows Azure: Microsoft's Cloud Platform
info:
info:    Tool version 0.7.0
help:
help:    Display help for a given command
help:      help [options] [command]
help:
help:    Opens the portal in a browser
help:      portal [options]
help:
help:    Commands:
help:      account        Commands to manage your account information and publish settings
help:      config         Commands to manage your local settings
help:      hdinsight      Commands to manage your HDInsight accounts
help:      mobile         Commands to manage your Mobile Services
help:      network        Commands to manage your Networks
help:      sb             Commands to manage your Service Bus configuration
help:      service        Commands to manage your Cloud Services
help:      site           Commands to manage your Web Sites
help:      sql            Commands to manage your SQL Server accounts
help:      storage        Commands to manage your Storage objects
help:      vm             Commands to manage your Virtual Machines
help:
help:    Options:
help:      -h, --help     output usage information
help:      -v, --version  output the application version
jwmac:~ jeffwilcox$
</pre>

To drill in to a specific area, just type it. For example, with this latest update, we've added initial support for managing Virtual Networks, so typing `azure network` will drop down with even more options:

<pre class="brush: bash">
jwmac:~ jeffwilcox$ azure network
help:    Commands to manage your Networks
help:
help:    Export the current Azure Network configuration to a file
help:      network export [options] <file-path>
help:
help:    Set the Azure Network configuration from json file
help:      network import [options] <file-path>
help:
help:    Commands to manage your DNS Servers
help:      network dnsserver list [options]
help:      network dnsserver register [options] <dnsIp>
help:      network dnsserver unregister [options] <dnsIp>
help:
help:    Commands to manage your Virtual Networks
help:      network vnet list [options]
help:      network vnet show <vnet> [options]
help:      network vnet delete [options] <vnet>
help:      network vnet create [options] <vnet>
help:
help:    Options:
help:      -h, --help  output usage information
</pre>

## Getting help

And then you can always append `-h` to a command to learn more about its options.

<pre class="brush: bash">
jwmac:~ jeffwilcox$ azure network vnet create -h
help:    Create an Azure Virtual Network
help:
help:    Usage: network vnet create [options] <vnet>
help:
help:    Options:
help:      -h, --help                      output usage information
help:      -v, --verbose                   use verbose output
help:      --json                          use json output
help:      --vnet <vnet>                   The name of the virtual network to create
help:      -e, --address-space <ipv4>      The address space for the vnet
help:      -m, --max-vm-count <number>     The maximum number of VMs in the address space
help:      -i, --cidr <number>             The address space network mask in CIDR format
help:      -p, --subnet-start-ip <ipv4>    The start IP address of subnet
help:      -n, --subnet-name <name>        The name for the subnet
help:      -c, --subnet-vm-count <number>  The maximum number of VMs in the subnet
help:      -r, --subnet-cidr <number>      The subnet network mask in CIDR format
help:      -l, --location <name>           The location of data center
help:      -a, --affinity-group <name>     The affinity group
help:      -d, --dns-server-id <dns-id>    The name identifier of the DNS server
help:      -s, --subscription <id>         use the subscription id
</pre>

You can also refer to the documentation we have up on our GitHub page alongside the source code. [The README.md file](https://github.com/WindowsAzure/azure-sdk-tools-xplat/blob/master/README.md) is quite detailed, with information on many of the commands.

The Windows Azure documentation has a nice detailed tutorial, [How to use the Windows Azure Command-Line Tools for Mac and Linux](http://www.windowsazure.com/en-us/manage/linux/other-resources/command-line-tools/).

## JSON Support

If you're interested in using the tool for scripting, queries and other commands can actually return JSON results about resources - and often with more information.

Here's what happens when I list my running VMs using `azure vm list` with no other parameters:

<pre class="brush: bash">
jwair:~ jeffwilcox$ azure vm list
info:    Executing command vm list
+ Fetching VMs
data:    DNS Name                 VM Name       Status
data:    -----------------------  ------------  ---------
data:    cloudmongo.cloudapp.net  MongoArbiter  ReadyRole
data:    cloudmongo.cloudapp.net  MongoNode1    ReadyRole
data:    cloudmongo.cloudapp.net  MongoNode2    ReadyRole
info:    vm list command OK
</pre>

Simply append `--json` to a command. You will often find more information in the JSON body than the formatted output may provide.

In this case,

- Endpoint names and ports
- Attached data disks
- IP addresses

<pre class="brush: bash">
jwair:~ jeffwilcox$ azure vm list --json
[
  {
    "DNSName": "cloudmongo.cloudapp.net",
    "VMName": "MongoArbiter",
    "IPAddress": "10.0.0.6",
    "InstanceStatus": "ReadyRole",
    "InstanceSize": "ExtraSmall",
    "InstanceStateDetails": "",
    "OSVersion": "",
    "Image": "5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415",
    "DataDisks": [],
    "Network": {
      "Endpoints": [
        {
          "LocalPort": "22",
          "Name": "ssh",
          "Port": "22003",
          "Protocol": "tcp",
          "Vip": "138.91.168.48"
        }
      ]
    }
  },
  {
    "DNSName": "cloudmongo.cloudapp.net",
    "VMName": "MongoNode1",
    "IPAddress": "10.0.0.4",
    "InstanceStatus": "ReadyRole",
    "InstanceSize": "Medium",
    "InstanceStateDetails": "",
    "OSVersion": "",
    "Image": "5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415",
    "DataDisks": [
      {
        "HostCaching": "None",
        "DiskLabel": "cloudmongo-cloudmongo-MongoNode1-0",
        "DiskName": "cloudmongo-MongoNode1-0-201308092256550858",
        "LogicalDiskSizeInGB": "50",
        "MediaLink": "https://california.blob.core.windows.net/vhds/MongoNode1Data.vhd"
      }
    ],
    "Network": {
      "Endpoints": [
        {
          "LocalPort": "22",
          "Name": "ssh",
          "Port": "22001",
          "Protocol": "tcp",
          "Vip": "138.91.168.48"
        }
      ]
    }
  },
  {
    "DNSName": "cloudmongo.cloudapp.net",
    "VMName": "MongoNode2",
    "IPAddress": "10.0.0.5",
    "InstanceStatus": "ReadyRole",
    "InstanceSize": "Small",
    "InstanceStateDetails": "",
    "OSVersion": "",
    "Image": "5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415",
    "DataDisks": [
      {
        "HostCaching": "None",
        "DiskLabel": "cloudmongo-cloudmongo-MongoNode2-0",
        "DiskName": "cloudmongo-MongoNode2-0-201308092257470631",
        "LogicalDiskSizeInGB": "50",
        "MediaLink": "https://california.blob.core.windows.net/vhds/MongoNode2Data.vhd"
      }
    ],
    "Network": {
      "Endpoints": [
        {
          "LocalPort": "22",
          "Name": "ssh",
          "Port": "22002",
          "Protocol": "tcp",
          "Vip": "138.91.168.48"
        }
      ]
    }
  }
]
</pre>

So keep this in mind if you're looking for more information about a given request. Over time our team will be looking to add more information to the standard views as well.

## Verbose responses

If you want to really dig in to seeing the underlying requests and communications with the REST endpoints of Windows Azure, you can turn on super-mega-ultra-insane verbosity: appending `-vv` will be "very verbose" and show the actual requests.

These "silly" verbose details will be prefixed with `silly:`.

Here's a LONG example of listing virtual machines. Note that I've redacted some things such as certificate details and subscription specifics; lots of JSON for sure.

<pre class="brush: bash">
jwmac:~ jeffwilcox$ azure vm list -vv
info:    Executing command vm list
silly:   Reading config /Users/jeffwilcox/.azure/config.json
silly:   { endpoint: 'https://management.core.windows.net/', subscription: 'a938fa1c-b190-4f31-9327' }
silly:   Reading publish settings /Users/jeffwilcox/.azure/publishSettings.xml
silly:   Reading pem /Users/jeffwilcox/.azure/managementCertificate.pem
silly:   Reading config /Users/jeffwilcox/.azure/config.json
silly:   { endpoint: 'https://management.core.windows.net/', subscription: 'a938fa1c-b190-4f31-9327' }
verbose: Fetching VMs
silly:   requestOptions
silly:   {
silly:       url: 'https://management.core.windows.net/a938fa1c-b190-4f31-9327/services/hostedservices',
silly:       method: 'GET',
silly:       headers: {
silly:           host: 'management.core.windows.net',
silly:           Accept-Charset: 'UTF-8',
silly:           content-length: 0,
silly:           user-agent: 'WindowsAzureXplatCLI/0.7.0',
silly:           accept: 'application/xml',
silly:           content-type: 'application/xml',
silly:           x-ms-version: '2012-03-01'
silly:       },
silly:       key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAREDACTEDEsqTdX\015\n-----END RSA PRIVATE KEY-----\n',
silly:       cert: '-----BEGIN CERTIFICATE-----\nMIICxDCREDACTEDkMsskmRpW9A==\n-----END CERTIFICATE-----\n',
silly:       strictSSL: true,
silly:       agent: {
silly:           domain: null,
silly:           _events: { free: [Function] },
silly:           _maxListeners: 10,
silly:           options: ..,
silly:           requests: {},
silly:           sockets: {},
silly:           maxSockets: 5,
silly:           createConnection: [Function]
silly:       }
silly:   }
silly:   returnObject
silly:   {
silly:       error: null,
silly:       response: {
silly:           isSuccessful: true,
silly:           statusCode: 200,
silly:           body: {
silly:               HostedService: {
silly:                   ServiceName: 'cloudmongo',
silly:                   Url: 'https://management.core.windows.net/a938fa1c-b190/services/hostedservices/cloudmongo',
silly:                   HostedServiceProperties: {
silly:                       Label: 'Y2xvdWRtb25nbw==',
silly:                       Description: 'Implicitly created hosted service',
silly:                       Status: 'Created',
silly:                       AffinityGroup: 'California',
silly:                       DateCreated: '2013-08-09T22:46:54Z',
silly:                       DateLastModified: '2013-08-09T22:47:02Z',
silly:                       ExtendedProperties: ''
silly:                   }
silly:               },
silly:               $: { xmlns: 'http://schemas.microsoft.com/windowsazure', xmlns:i: 'http://www.w3.org/2001/XMLSchema-instance' }
silly:           },
silly:           headers: {
silly:               server: '33.0.6198.75 (rd_rdfe_stable.130724-1637) Microsoft-HTTPAPI/2.0',
silly:               x-ms-servedbyregion: 'ussouth',
silly:               content-length: '653',
silly:               cache-control: 'no-cache',
silly:               date: 'Mon, 12 Aug 2013 19:49:23 GMT',
silly:               content-type: 'application/xml; charset=utf-8',
silly:               x-ms-request-id: '7578f36f1909496194ae3c68'
silly:           },
silly:           md5: undefined
silly:       }
silly:   }
silly:   requestOptions
silly:   {
silly:       url: 'https://management.core.windows.net/a938fa1c-b190/services/hostedservices/cloudmongo/deploymentslots/Production',
silly:       method: 'GET',
silly:       headers: {
silly:           host: 'management.core.windows.net',
silly:           Accept-Charset: 'UTF-8',
silly:           content-length: 0,
silly:           user-agent: 'WindowsAzureXplatCLI/0.7.0',
silly:           accept: 'application/xml',
silly:           content-type: 'application/xml',
silly:           x-ms-version: '2012-03-01'
silly:       },
silly:       key: '-----BEGIN RSA PRIVATE KEY-----\nMIIREDACTEDTdX\015\n-----END RSA PRIVATE KEY-----\n',
silly:       cert: '-----BEGIN CERTIFICATE-----\nMIIREDACTEDpW9A==\n-----END CERTIFICATE-----\n',
silly:       strictSSL: true,
silly:       agent: {
silly:           domain: null,
silly:           _events: { free: [Function] },
silly:           _maxListeners: 10,
silly:           options: ..,
silly:           requests: {},
silly:           sockets: {},
silly:           maxSockets: 5,
silly:           createConnection: [Function]
silly:       }
silly:   }
silly:   returnObject
silly:   {
silly:       error: null,
silly:       response: {
silly:           isSuccessful: true,
silly:           statusCode: 200,
silly:           body: {
silly:               PrivateID: 'ca9b4cb9fc1d42',
silly:               Label: 'WTJ4dmRXUnRiMjVuYnc9PQ==',
silly:               DeploymentSlot: 'Production',
silly:               RollbackAllowed: 'false',
silly:               Configuration: 'PFNlcnZpY2VDb25maWd8L1NlcnZpY2VDb25maWd1cmF0aW9uPg==',
silly:               RoleInstanceList: {
silly:                   RoleInstance: [
silly:                       {
silly:                           InstanceStatus: 'ReadyRole',
silly:                           InstanceFaultDomain: '0',
silly:                           InstanceName: 'MongoArbiter',
silly:                           InstanceSize: 'ExtraSmall',
silly:                           RoleName: 'MongoArbiter',
silly:                           IpAddress: '10.0.0.6',
silly:                           PowerState: 'Started',
silly:                           InstanceEndpoints: {
silly:                               InstanceEndpoint: {
silly:                                   Protocol: 'tcp',
silly:                                   Name: 'ssh',
silly:                                   Vip: '138.91.168.48',
silly:                                   LocalPort: '22',
silly:                                   PublicPort: '22003'
silly:                               }
silly:                           },
silly:                           InstanceStateDetails: '',
silly:                           InstanceUpgradeDomain: '2',
silly:                           HostName: 'MongoArbiter'
silly:                       },
silly:                       {
silly:                           InstanceStatus: 'ReadyRole',
silly:                           InstanceFaultDomain: '0',
silly:                           InstanceName: 'MongoNode1',
silly:                           InstanceSize: 'Medium',
silly:                           RoleName: 'MongoNode1',
silly:                           IpAddress: '10.0.0.4',
silly:                           PowerState: 'Started',
silly:                           InstanceEndpoints: {
silly:                               InstanceEndpoint: {
silly:                                   Protocol: 'tcp',
silly:                                   Name: 'ssh',
silly:                                   Vip: '138.91.168.48',
silly:                                   LocalPort: '22',
silly:                                   PublicPort: '22001'
silly:                               }
silly:                           },
silly:                           InstanceStateDetails: '',
silly:                           InstanceUpgradeDomain: '0',
silly:                           HostName: 'MongoNode1'
silly:                       },
silly:                       {
silly:                           InstanceStatus: 'ReadyRole',
silly:                           InstanceFaultDomain: '1',
silly:                           InstanceName: 'MongoNode2',
silly:                           InstanceSize: 'Small',
silly:                           RoleName: 'MongoNode2',
silly:                           IpAddress: '10.0.0.5',
silly:                           PowerState: 'Started',
silly:                           InstanceEndpoints: {
silly:                               InstanceEndpoint: {
silly:                                   Protocol: 'tcp',
silly:                                   Name: 'ssh',
silly:                                   Vip: '138.91.168.48',
silly:                                   LocalPort: '22',
silly:                                   PublicPort: '22002'
silly:                               }
silly:                           },
silly:                           InstanceStateDetails: '',
silly:                           InstanceUpgradeDomain: '1',
silly:                           HostName: 'MongoNode2'
silly:                       }
silly:                   ]
silly:               },
silly:               Status: 'Running',
silly:               Name: 'cloudmongo',
silly:               Url: 'http://cloudmongo.cloudapp.net/',
silly:               UpgradeDomainCount: '3',
silly:               Locked: 'false',
silly:               CreatedTime: '2013-08-09T22:47:05Z',
silly:               VirtualNetworkName: 'CaliforniaNetwork',
silly:               $: { xmlns: 'http://schemas.microsoft.com/windowsazure', xmlns:i: 'http://www.w3.org/2001/XMLSchema-instance' },
silly:               ExtendedProperties: '',
silly:               SdkVersion: '',
silly:               RoleList: {
silly:                   Role: [
silly:                       {
silly:                           OSVirtualHardDisk: {
silly:                               OS: 'Linux',
silly:                               DiskName: 'cloudmongo-MongoArbiter-0-201308092250270346',
silly:                               MediaLink: 'http://california.blob.core.windows.net/vhds/MongoArbiter.vhd',
silly:                               SourceImageName: '5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415',
silly:                               HostCaching: 'ReadWrite'
silly:                           },
silly:                           RoleSize: 'ExtraSmall',
silly:                           ConfigurationSets: {
silly:                               ConfigurationSet: {
silly:                                   ConfigurationSetType: 'NetworkConfiguration',
silly:                                   InputEndpoints: {
silly:                                       InputEndpoint: {
silly:                                           Protocol: 'tcp',
silly:                                           Name: 'ssh',
silly:                                           Vip: '138.91.168.48',
silly:                                           LocalPort: '22',
silly:                                           Port: '22003'
silly:                                       }
silly:                                   },
silly:                                   SubnetNames: { SubnetName: 'VMs' },
silly:                                   $: { i:type: 'NetworkConfigurationSet' }
silly:                               }
silly:                           },
silly:                           DataVirtualHardDisks: '',
silly:                           RoleName: 'MongoArbiter',
silly:                           $: { i:type: 'PersistentVMRole' },
silly:                           OsVersion: '',
silly:                           RoleType: 'PersistentVMRole',
silly:                           AvailabilitySetName: 'MongoDB'
silly:                       },
silly:                       {
silly:                           OSVirtualHardDisk: {
silly:                               OS: 'Linux',
silly:                               DiskName: 'cloudmongo-MongoNode1-0-201308092247080990',
silly:                               MediaLink: 'http://california.blob.core.windows.net/vhds/MongoNode1.vhd',
silly:                               SourceImageName: '5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415',
silly:                               HostCaching: 'ReadWrite'
silly:                           },
silly:                           RoleSize: 'Medium',
silly:                           ConfigurationSets: {
silly:                               ConfigurationSet: {
silly:                                   ConfigurationSetType: 'NetworkConfiguration',
silly:                                   InputEndpoints: {
silly:                                       InputEndpoint: {
silly:                                           Protocol: 'tcp',
silly:                                           Name: 'ssh',
silly:                                           Vip: '138.91.168.48',
silly:                                           LocalPort: '22',
silly:                                           Port: '22001'
silly:                                       }
silly:                                   },
silly:                                   SubnetNames: { SubnetName: 'VMs' },
silly:                                   $: { i:type: 'NetworkConfigurationSet' }
silly:                               }
silly:                           },
silly:                           DataVirtualHardDisks: {
silly:                               DataVirtualHardDisk: {
silly:                                   DiskName: 'cloudmongo-MongoNode1-0-201308092256550858',
silly:                                   MediaLink: 'https://california.blob.core.windows.net/vhds/MongoNode1Data.vhd',
silly:                                   DiskLabel: 'cloudmongo-cloudmongo-MongoNode1-0',
silly:                                   LogicalDiskSizeInGB: '50',
silly:                                   HostCaching: 'None'
silly:                               }
silly:                           },
silly:                           RoleName: 'MongoNode1',
silly:                           $: { i:type: 'PersistentVMRole' },
silly:                           OsVersion: '',
silly:                           RoleType: 'PersistentVMRole',
silly:                           AvailabilitySetName: 'MongoDB'
silly:                       },
silly:                       {
silly:                           OSVirtualHardDisk: {
silly:                               OS: 'Linux',
silly:                               DiskName: 'cloudmongo-MongoNode2-0-201308092248530501',
silly:                               MediaLink: 'http://california.blob.core.windows.net/vhds/MongoNode2.vhd',
silly:                               SourceImageName: '5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415',
silly:                               HostCaching: 'ReadWrite'
silly:                           },
silly:                           RoleSize: 'Small',
silly:                           ConfigurationSets: {
silly:                               ConfigurationSet: {
silly:                                   ConfigurationSetType: 'NetworkConfiguration',
silly:                                   InputEndpoints: {
silly:                                       InputEndpoint: {
silly:                                           Protocol: 'tcp',
silly:                                           Name: 'ssh',
silly:                                           Vip: '138.91.168.48',
silly:                                           LocalPort: '22',
silly:                                           Port: '22002'
silly:                                       }
silly:                                   },
silly:                                   SubnetNames: { SubnetName: 'VMs' },
silly:                                   $: { i:type: 'NetworkConfigurationSet' }
silly:                               }
silly:                           },
silly:                           DataVirtualHardDisks: {
silly:                               DataVirtualHardDisk: {
silly:                                   DiskName: 'cloudmongo-MongoNode2-0-201308092257470631',
silly:                                   MediaLink: 'https://california.blob.core.windows.net/vhds/MongoNode2Data.vhd',
silly:                                   DiskLabel: 'cloudmongo-cloudmongo-MongoNode2-0',
silly:                                   LogicalDiskSizeInGB: '50',
silly:                                   HostCaching: 'None'
silly:                               }
silly:                           },
silly:                           RoleName: 'MongoNode2',
silly:                           $: { i:type: 'PersistentVMRole' },
silly:                           OsVersion: '',
silly:                           RoleType: 'PersistentVMRole',
silly:                           AvailabilitySetName: 'MongoDB'
silly:                       }
silly:                   ]
silly:               },
silly:               LastModifiedTime: '2013-08-12T19:48:40Z'
silly:           },
silly:           headers: {
silly:               server: '33.0.6198.75 (rd_rdfe_stable.130724-1637) Microsoft-HTTPAPI/2.0',
silly:               x-ms-servedbyregion: 'ussouth',
silly:               content-length: '6632',
silly:               cache-control: 'no-cache',
silly:               date: 'Mon, 12 Aug 2013 19:49:24 GMT',
silly:               content-type: 'application/xml; charset=utf-8',
silly:               x-ms-request-id: '1cb381b6fb7540f'
silly:           },
silly:           md5: undefined
silly:       }
silly:   }
data:    DNS Name                 VM Name       Status
data:    -----------------------  ------------  ---------
data:    cloudmongo.cloudapp.net  MongoArbiter  ReadyRole
data:    cloudmongo.cloudapp.net  MongoNode1    ReadyRole
data:    cloudmongo.cloudapp.net  MongoNode2    ReadyRole
info:    vm list command OK
jwmac:~ jeffwilcox$
</pre>

## Open source links

The x-plat CLI is open source.

- Download and install for your OS: http://www.windowsazure.com/en-us/downloads/#cmd-line-tools
- Node.js user? Install easily! `sudo npm install azure-cli`
- GitHub repo: https://github.com/WindowsAzure/azure-sdk-tools-xplat
- More than 11 releases so far: https://github.com/WindowsAzure/azure-sdk-tools-xplat/releases

# Windows Azure PowerShell

For Windows dev/ops, we also build powerful PowerShell commandlets and experiences that comfort to PowerShell guidelines. PS devs and operations folks should be at home with scripting with the Windows Azure resources. I'll write in a future post or two more about our PowerShell experiences and recent improvements there. We work with many great teams across Windows Azure to develop and deliver these goods.

## Open source links

The PowerShell commandlets are open source, if you'd like to check them out now.

- Download and install: http://www.windowsazure.com/en-us/downloads/#cmd-line-tools
- GitHub repo: https://github.com/WindowsAzure/azure-sdk-tools
- More than 14 releases so far: https://github.com/WindowsAzure/azure-sdk-tools/releases

Hope these tools help; let us know - we love sharing our work with you.