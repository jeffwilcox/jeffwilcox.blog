---
layout: post
comments: true
title: Creating secure Linux VMs in Azure with SSH key pairs
categories: [windows-azure, cloud]
tags: [windows-azure, cloud, vm, ssh]
---
A fairly standard security best practice for cloud-connected Linux virtual machines is to create "password-less" virtual machines. This is easy to do with Windows Azure but not the default if you use the "quick create" menu within the [Windows Azure Management Portal](https://manage.windowsazure.com/).

This post briefly describes how to go about creating VMs in a more secure manner, and also what we're doing to make this easier from command line tools as well.

# General tips for securing SSH

Essentially a secure SSH connection is the window to any Linux virtual machine andmore fun than the Remote Desktop experience for Windows VMs (note: remote PowerShell is available and a good option these days, too).

Though very easy to administer from anywhere, exposing SSH to the Internet from the cloud is a potential attack vector through bad passwords, lazy users, denial of service attacks, etc.

Secure SSH should probably be built on top of:

* A username that is not standard such as `root` or `admin`
* Private key/certificate SSH authentication
* No password for the user; no password-based login permitted
* A randomized public SSH port

Your operations staff should work to secure your instances, provide a clear process for getting credentials and access to machines, and considering what audit information may be necessary to maintain for your organization with it comes to key pairs, passwords, connection strings, etc.

To check that your users cannot use passwords to login, once connected to your instance, `sudo tail -n 10 sshd_config` and you should see a line about password authentication.

If you created a VM with the password checkbox not checked in the portal, you should see the good line: `PasswordAuthentication no`

If you have password authentication enabled, once you have the proper keys setup on the machine (this is beyond the scope of this guide, try [Bing](http://www.bing.com/)!), you can turn off password authentication.

# Secure Linux VMs w/SSH on Windows Azure

It is easy to create a secure VM by providing a PEM certificate associated with your private key at creation time. This is only available when using the "From Gallery" functionality in the portal, or a command line tool.

## Avoid "Quick Create" for production VMs

If you use the default "Quick Create" functionality built into the Windows Azure Management Portal, you'll find that you can set the DNS name, pick a Linux image (I'm a CentOS fan, its from my years of using EC2 + Amazon AMI Linux) and then specify a password.

![Quick creation does not allow for custom username and certificate use.]({{ site.cdn }}vmssh/QuickCreateOptions.png =692x497 "Quick creation does not allow for custom username and certificate use.")

This is not ideal IMO:

* The username is `azureuser`, which is our equivalent of EC2's `ec2-user`: why not go ahead and create a custom username instead that is on the sudoers list?
* Password-based authentication is currently the only option here. No certificate upload option.

Instead, use the "From Gallery" virtual machine creation option and get more control over your instances! You'll also be able to work on adding it to a virtual network, setting a custom username, etc.

## Generating a private/public key pair

Before we can use SSH private/public key pairs, we need to generate them. I recommend using OpenSSL for this, and thankfully every modern operating system has it available... even Windows, if you have [Git](http://git-scm.com/) installed.

There is a more in-depth guide available within the Windows Azure documentation - [How to use SSH with Linux on Windows Azure](http://www.windowsazure.com/en-us/manage/linux/how-to-guides/ssh-into-linux/).

I recommend checking that out, too! The `openssl` parameters I've used here come straight from that guide.

![Generating a key pair using openssl on a Mac.]({{ site.cdn }}vmssh/GenerateKey.png =699x522 "Generating a key pair using openssl on a Mac.")

To generate a key pair, use this command:

<pre class="brush: bash">
openssl req -x509 -nodes -days 365 \ 
-newkey rsa:2048 \ 
-keyout filename.key \ 
-out filename.pem
</pre>

You'll then be asked for some information you can optionally enter.

> Although you'll be asked for organization information for the cert request, this information is not used. It can be bogus.

If you're using Windows, as long as you have Git installed, you can use the shortcut to Git Bash to get to a terminal with built-in `ssh` and `openssl` support. The commands will be the same in this case.

![Using Git Bash with built-in openssl to generate a key pair.]({{ site.cdn }}vmssh/GenerateKeyWindows.png =700x429 "Using Git Bash with built-in openssl to generate a key pair.")

Once you generate a key pair, save the `.pem` file - this is the public portion that you'll upload whenever you create a new virtual machine in Windows Azure.

Store the `.key` file safely somewhere on your machine, somewhere that others cannot access. If you're using a Linux system or a Mac, make sure to `chmod 0600 *.key` to secure it from others' access. Many SSH clients will not allow you to connect to a machine if the key file is unsecured.

## Creating a secured Linux VM in Azure

OK let's create a virtual machine now in the Windows Azure Management Portal. Go to the big New button in the bottom left and select Compute, Virtual Machine, and From Gallery.

![Creating a new VM with the From Gallery option in the management portal.]({{ site.cdn }}vmssh/NewVirtualMachine.png =700x459 "Creating a new VM with the From Gallery option in the management portal.")

Next, pick the OS. I prefer CentOS myself but there are several Linux distribution images provided by third parties that are great, too.

![In the Gallery, selecting the OpenLogic CentOS Linux VM image.]({{ site.cdn }}vmssh/SelectOperatingSystem.png =700x503 "In the Gallery, selecting the OpenLogic CentOS Linux VM image.")

Next, you need to give the machine a name and specify affinity group / network / region options. I'm creating this VM in California, so I've selected "West US" as the region.

I recommend that you also create a storage account for each region you deploy VMs so that you can use that account. There is also an "auto-generate storage account" option which will create a GUID-named storage account for you. These are not pretty!

![Specifying a DNS name for the machine, region, and storage account.]({{ site.cdn }}vmssh/MachineName.png =700x503 "Specifying a DNS name for the machine, region, and storage account.")

Now for *the real configuration page*. This is where we tell Azure that we want a VM configured with a key pair but no password.

Make sure to not check the "provide a password" checkbox.

Next, upload a certificate. This is the `.pem` file you generated above.

![Virtual machine configuration - this is where you specify key-only authentication for a new Linux VM.]({{ site.cdn }}vmssh/MachineAuthentication.png =700x503 "Virtual machine configuration - this is where you specify key-only authentication for a new Linux VM.")

You can then hit Next, skip that page's options for simple VMs (but where you would create an availability group required for redundancy), then finish by pressing the finalize/check at the end of the wizard.

The certificate will be added to the account, VM will now be provisioned, and then eventually the new VM will boot and be available.

The operational status bar at the bottom of the portal will provide status; you can expand it for details of which step(s) that the portal is currently processing.

![The operational status bar at the bottom of the management portal will provide information about the provisioning of the virtual machine in Windows Azure.]({{ site.cdn }}vmssh/StatusBar.png =700x119 "The operational status bar at the bottom of the management portal will provide information about the provisioning of the virtual machine in Windows Azure.")

Once the VM is up, you can explore its page within the portal.

There is a quick glance pane on the right side that shows the SSH port that you can connect to, the DNS name, virtual IP, and other core values.

![The right pane of the management page for a VM will provide information about SSH endpoints, hostname, VIP, etc.]({{ site.cdn }}vmssh/QuickLook.png =247x608 "The right pane of the management page for a VM will provide information about SSH endpoints, hostname, VIP, etc.")

Also keep an eye on the cores count. Each core is typically billed as 1 Small VM instance unit, with the exception of Extra Small (A0) types.

![Keep an eye on your cores.]({{ site.cdn }}vmssh/CoresView.png =651x135 "Keep an eye on your cores.")

## Connecting to a virtual machine

To actually connect, you need an SSH client.

* Linux: use `ssh`
* Mac: use `ssh` in the Terminal app
* Windows: use `ssh` within a [Git](http://git-scm.com/) Bash shell session -or- download and use [Putty](http://www.putty.org/)

Simply SSH, providing various parameters:

* `-p PORT`: the port to connect to, or 22 if using the default endpoint
* `username@hostname`: the username you use at the cloud service DNS name. Alternatively you may use the `-l USERNAME` parameter.
* `-i PRIVATE_KEY_FILE`: point to the `.pem` file. On Mac/Linux, make sure it is chmod'd to 0600 to connect

So in this example I used this command:

<pre class="brush: bash">
ssh -i ./jeffwilcox.key jwilcox@cloudwebx.cloudapp.net -p22
</pre>

![Using SSH to connect to your new VM.]({{ site.cdn }}vmssh/SSH.png =699x480 "Using SSH to connect to your new VM.")

If you use Putty on Windows, you will need to do some conversion of your private key to be in a format that Putty enjoys.

I just use Git these days.

![Using Git Bash and its built-in openssl to SSH into your new VM.]({{ site.cdn }}vmssh/GitBashSsh.png =700x178 "Using Git Bash and its built-in openssl to SSH into your new VM.")

Anyone remember Cygwin?

## Consider creating a Virtual Network

Production services should consider not exposing SSH to the Internet at all. Instead, you can actually remove any and all SSH access from the "ENDPOINTS" configuration options in the management portal.

You can then use the VPN functionality to connect your site to the virtual network, for example. There is a cost associated with this.

Another option is to use another VM, for development use, to essentially act as a secure intermediary between the Internet and your virtual network-connected VMs.

By connecting to such an in-between VM (it could be an Extra Small instance, which costs $0.02 per hour) from the Internet, you can then SSH to any other machine within your virtual network, regardless of the underlying endpoints configuration for the Internet and load balancer.

You can still use OS-level firewalls to prevent access to most clients and work off a whitelist of connections, too.

## Modifying endpoints

You can change the SSH endpoint, or delete it, from the management portal. Check the "ENDPOINTS" tab.

Remember that you need to specify the port to connect to SSH with, so when using the `ssh` command, you'll need to include the `-p PORTNUMBER` parameter if you're not using the default value of port 22.

# Support in tools, APIs and the portal

We're working to make sure that you can create Linux VMs easily without a password. On the SDK team, we're busy updating our tools to enable this scenario in the coming sprints & releases.

I'll update this post once we ship some updated tooling!

## Command line tooling support

We'd like to support creating "password-less" Linux virtual machines via our command line tools for Mac, Linux and Windows, and are working toward supporting it.

### Cross-platform command line tools

I've submitted pull requests to the Azure Node SDK as well as the cross-platform command line tool to enable a new parameter `--no-ssh-password`. We'll still discuss naming and other options before shipping this.

You can follow the progress in this issue: [586: azure vm create: Cannot create a passwordless Linux VM](https://github.com/WindowsAzure/azure-sdk-tools-xplat/issues/586).

### PowerShell

A similar fix should be taken to add the new feature to the Windows Azure PowerShell, too. I've opened an issue: [1627: Add-AzureProvisioningConfig -Linux should support creating passwordless VMs](https://github.com/WindowsAzure/azure-sdk-tools/issues/1627).

### Service Management REST support

SSH certificate-only virtual machines can be created via the service management REST interface that Windows Azure exposes.

In order to do this, some steps include:

* Adding the SSH certificate information
* Within a LinuxProvisioningConfigurationSet, setting `DisableSshPasswordAuthentication` to True in the REST options.
* The UserPassword XML element must still be present, but be just an empty XML element. Omitting the XML element will cause an error to be raised by the server-side validation.

See also [the service management REST endpoint documentation on MSDN](http://msdn.microsoft.com/en-us/library/windowsazure/jj157194.aspx).

### Management portal support

The portal supports certificate-only VMs (no passwords) when you create a new VM via the "From Gallery" custom window view. Make sure not to check the "Password" option on the Virtual Machine Configuration screen.

Have a nice, secure day.