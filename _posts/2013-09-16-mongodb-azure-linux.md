---
layout: post
comments: true
title: Creating a MongoDB replica set cluster w/Windows Azure Linux VMs
categories: [azure, cloud]
tags: [azure, cloud, cli, mongodb, command-line, tools, linux, centos, nosql]
---
I love [MongoDB](http://www.mongodb.org/). I've been using it as the NoSQL solution in my production phone app for several years now. I've used hosted MongoDB solutions and also run my own replica set clusters in both AWS and Windows Azure. In this post today I'm going to demonstrate creating a full-blown MongoDB replica set cluster in Microsoft's cloud... but I'll also touch on hosted and single-instance deployments.

Let's spin up a new cluster in a California data center. I'm going to do this while sitting at a nice coffee shop in Seattle full of Macs for the proper atmosphere. I'll be using the Terminal app, the [cross-platform Command Line Interface (CLI) tools for Windows Azure](http://www.jeff.wilcox.name/2013/08/command-line-improvements/), and in future posts I'll cover the same from Windows PowerShell and from the web-based management portal, too. My dev team on the [Windows Azure Developer Experience team](http://windowsazure.github.io/) builds the CLI.

Combined with a simple bash script for bringing online individual MongoDB nodes, I should be able to launch and go live with a cluster in the time it takes to enjoy an Americano.

![Setting up a MongoDB replica set via Mac command line tools while in a Seattle coffee shop.]({{ site.cdn }}mongo/VoxxCoffee.png =700x263 "Coffee, Cloud, and a Mac - the Seattle classic.")

I'll be using these Windows Azure features & technologies in this post:

- Affinity Groups
- Storage Accounts
- Virtual Machines running Linux (CentOS) with OS data disks in storage
- VM Availability Sets to qualify for compute SLA
- Attached data disks
- Virtual Networks
- Exposed VM endpoints
- Storage blobs for key storage
- Windows Azure Command Line Interface (CLI) tool on a Mac
- Windows Azure SDK for Node.js as part of a server node setup script

> Disclaimer: I'm sharing my own experience here, but this isn't official guidance. Consider all facets of your environment, requirements, security, etc., before deploying a production replica set. For the easiest MongoDB experience, why not just consider using MongoLab's hosted solutions?

# App Background & my MongoDB History

My mobile app is a foursquare client called [4th & Mayor](http://www.4thandmayor.com/). To create great experiences for my users, I have a backend that generates Windows Phone live tiles, stores preferences, plus runs a worker queue for tasks and processing.

The backend is powered by Node.js and MongoDB. I first ran it all on Amazon EC2, over time moved the data tier to hosted MongoDB via [MongoLab](http://www.mongolab.com), and today I'm running my own replica set cluster using Linux virtual machines in Windows Azure. My production cluster is reliable, with great uptime, and is also affordable, cheaper than a hosted, dedicated cluster. For hosting web services, the app's web site, both HTTP and custom HTTPS, I use Windows Azure Web Sites with its nice, affordable Node.js hosting.

Foursquare actually uses MongoDB very extensively as well. [Wikipedia](http://en.wikipedia.org/wiki/MongoDB) notes other large users, including eBay, MetLife, Foursquare, MTV Networks.

Having attended the MongoDB Seattle conference for the past few years learning about modern best practices, including running MongoDB in other cloud providers, this is an area very close to me.
Although Windows Azure has published some great docs on MongoDB, I felt a need to go in a different direction with a little more automation. I've also found very little replica set guidance for Azure.

Deploying and managing MongoDB replica sets makes for a a great case study and functional test for me as a development lead, looking to validate the cloud capabilities that Windows Azure has, along with the development tools and libraries that we ship. (Run into issues? Please [open issues in our GitHub repo](https://github.com/WindowsAzure/azure-sdk-tools-xplat/issues).)

# MongoDB Basics

## Mongo Configurations

MongoDB can be configured in many ways:

- a local instance running on your development machine,
- a cloud-connected virtual machine running a single instance,
- a "replica set" cluster of nodes that back up and distribute copies of data across many machines
- a master/slave configuration (no longer recommended by MongoDB)
- a "sharded" configuration for partitioning, extreme performance and availability across many, many, many machines

### Single instance

For development and testing scenarios, running a single MongoDB instance is very straightforward and easy. You can even run such an instance on your local machine without the need to spin anything up in the cloud.

Most of the MongoDB hosting providers offer very affordable single instance hosting, often on hardware or VMs that run multiple MongoDB server processes: effectively higher-density shared hosting.

### Multi-node replica set cluster

When it comes to data availability and redundancy, MongoDB's replica set concept is ideal for the cloud. Unlike a single instance, these replica sets are built from multiple virtual machines. The MongoDB node deployments can be dedicated to a single project, customer, or shared among multiple customers.

You can learn about MongoDB replication through the extensive online documentation:

- [Introduction to MongoDB Replication](http://docs.mongodb.org/manual/core/replication-introduction/)
- MongoDB's documentation provides a short overview of [replica set deployment architectures](http://docs.mongodb.org/manual/core/replica-set-architectures/)
- [A full set of tutorials](http://docs.mongodb.org/manual/administration/replica-sets/)

#### About MongoDB Elections

MongoDB clusters have a voting mechanism for determining the current "primary" node that should accept writes on behalf of all the nodes. Keeping voting fair, this means that you need to avoid ties, and so you'll need to deploy an odd number of nodes - 3 nodes, for example.

#### 3x Nodes

The most "solid" replica set implementation is to spin up a cluster of 3 identical, high-powered VMs, each of which could be an acting primary.

Having an odd number of nodes (3), the nodes can break ties and so properly elect a primary if an instance goes down for maintainence or has problems in the data center.

There are also performance optimizaitons available in this configuration: it is possible to configure client apps to read from any node in the cluster (but still write to the currently elected Primary) - if an eventually consistent, read-heavy application service is OK for your needs.

#### Introducing the Arbiter

Each typical Node in a cluster can be expensive:

- Powerful compute
- Large attached disks to hold data
- Memory to keep important, frequently-accessed data available and cached

It turns out that a very common, affordable alternative to running three dedicated MongoDB nodes is to have *two* dedicated nodes and then a very cheap, lightweight voting node that does not store data. In the MongoDB world, this is called an "arbiter" node.

An arbiter can, and should:

- Run on super cheap VMs such as Azure's "Extra Small" (A0) VM instance size
- Have no attached disks and no copies of the MongoDB data
- Cost pennies an hour, letting you spend your compute and storage money on more powerful main nodes

The arbiter then communicates with the other members of the cluster, checks for health measures, and then participates in elections when a vote is needed for a new primary.

The arbiter VM could in theory even play the part of Arbiter for multiple MongoDB clusters to further drive down cost.

#### 2x Nodes + an Arbiter

So the most popular MongoDB replica set solution is to have 2 (or an even number) powerful nodes. Good compute SKUs, high memory, attached data disks for storing data and maintaining high IOPS, etc.

## Architectural Design

The design I'm using for production app use today supporting 300,000 clients is a pair of nodes and an arbiter for primary voting. (2 powerful nodes, 1 cheap arbiter)

![The infrastructure design for my MongoDB replica set cluster in Windows Azure.]({{ site.cdn }}mongo/MongoAvailabilityMap.png =700x480 "The infrastructure design for my MongoDB replica set cluster in Windows Azure.")

A slightly more robust architecture might involve additional "hidden" replica set members for backup in other regions or just using a 3rd primary node instead of an arbiter, but you can read about those elsewhere on the Internets.

# MongoLab and the Windows Azure Store

The easiest way to get going with MongoDB is actually by using the 3rd-party store right inside Windows Azure: hosted MongoDB offered by MongoLab. It only takes a few seconds and today there is both a paid and free tier.

As a long-time MongoLab customer, I can say, their product is great, and as of this summer, they're offering more and more solutions inside Windows Azure data centers.

## Windows Azure Store

Within the Management Portal, go to "Store", which will then open a sub-window with the offerings that great third parties have.

![Management Portal - Azure Add-Ons]({{ site.cdn }}mongo/AzureStore.png =700x215 "Management Portal - Azure Add-Ons")

In the window, find MongoLab listed under the App Services category.

![Management Portal - Azure Add-Ons]({{ site.cdn }}mongo/StoreSelectAddOn.png =700x458 "Management Portal - Azure Add-Ons")

The wizard will then let you step through the offering, selecting a plan, etc.

![Management Portal - Azure Add-Ons]({{ site.cdn }}mongo/SelectMongoLabPlan.png =700x458 "Management Portal - Azure Add-Ons")

After provisioning, you will then be able to see a page about the offering within the portal under "Add-Ons"

![Management Portal - Azure Add-Ons]({{ site.cdn }}mongo/MongoLabExtraView.png =700x487 "Management Portal - Azure Add-Ons")

You can go to the Connection Info area to get a MongoDB connection string, including the username and password for the service, here:

![Management Portal - Azure Add-Ons]({{ site.cdn }}mongo/ConnectionInformation.png =700x201 "Management Portal - Azure Add-Ons")

And if you touch Manage, you will go directly into a management interface that MongoLab provides, letting you work with data within your collections.

![Management Portal - Azure Add-Ons]({{ site.cdn }}mongo/MongoLabManagement.png =700x441 "Management Portal - Azure Add-Ons")

## MongoLab product offerings

MongoLab has 2 offerings available right now for Windows Azure Add-On customers. Do check the store for the latest pricing and products.

<table class="table">
<thead>
<tr>
<th>Monthly Plan</th>
<th>Database Storage</th>
<th>Type</th>
<th>Monthly Price</th>
</tr>
</thead>
<tbody>
<tr>
<td>Sandbox</td>
<td>0.5 GB</td>
<td>Shared Single Instance</td>
<td>Free (0 USD)</td>
</tr>
<tr>
<td>Shared Cluster</td>
<td>8 GB</td>
<td>Shared Replica Set</td>
<td>149 USD</td>
</tr>
</tbody>
</table>

MongoLab offers a shared, hosted replica set option, but not in all Windows Azure data centers according to [their July post announcing the availability](http://blog.mongolab.com/2013/07/production-mongodb-replica-sets-now-available-on-azure/), so if you're looking to have a replica set in Europe, for example, this post might help you run that yourself until they offer such an option/region combination.

# Replica set built from Linux VMs

OK so MongoLab is the easy, smart, managed option. Got it?

If you'd like a very fast, redundant, high capacity solution of your own, you'll need to build out a MongoDB cluster from a set of virtual machines. These are deployed across many instances for redundancy. MongoDB takes care of replicating writes and other information across the nodes, monitoring for health, and electing the primary node.

Running a multi-instance VM cluster is important for any production app - you can do your dev/test/staging work often with a single instance, but production instances ideally should be backed by the Windows Azure service-level agreement (SLA), which means at least two virtual machine instances. (Azure might take a VM down briefly to install an OS update on the physical machine or do network maint. work)

> In order to be eligible for the 99.95% SLA for infrastructure virtual machines in Windows Azure, I need to make sure to actually have multi-instance VMs running my app, coupled with an Availability Set. I can then build the replica set of these instances.

Clients actively target all the nodes via connection strings listing the members; when a client connects to Mongo, it locates and then targets the current primary node. The primary node may shift over time as operating system updates happen, virtual machines restart or go down, or data centers have problems.

## Understanding memory management and MongoDB

MongoDB is very efficient with memory and [uses operating system-level memory mapped files](http://docs.mongodb.org/manual/faq/storage/). Therefore you'll always want to run 64-bit instances (as all things are in Windows Azure)

So the intended working set of your data (regularly used in computations, scans) is the primary driver for how much memory you should allocate when selecting an instance size.

For my production application use, I maintain several collections of data:

- User and friend documents
- Push notification queue
- Metadata & settings store
- Web site session store (for Node.js + Express)

Since only the user, friend, and push queue documents are regularly used heavily (plus a small subset of the active sessions), I've found that this data represents about 1.5 GB of my 3 GB of data. The size of my data doesn't grow too much month-to-month.

This means that the 1.7 GB afforded to me by a Small instance size is often enough. You can always scale up or down your instance sizes with Windows Azure VMs and MongoDB: changing size would trigger a reboot and may elect a new primary, but the data will remain.

## Linux and MongoDB

Every year at the MongoDB Seattle Conference (and other conferences held around the world by MongoDB), there have been great sessions by real engineers using and running replica sets in the real world. Key applications out there like [foursquare](https://foursquare.com) are powered by MongoDB and using powerful features such as the geo-spatial query features.

I've found the AWS-targeted guidance in the past about Linux and MongoDB to be very helpful while fine-tuning MongoDB on Windows Azure, as many of the key principals apply about file system configurations.

The short list of things that I prefer to have setup:

- CentOS rocks ;-) use it!
- Data drives should be separate from the OS drive. RAID10 if you really want to, but that's beyond the scope of this today.
- Data drives should be formatted with extfs4
- The file system on data drives need not record access times (no atime)

## MongoDB Clusters and Applications

Your app will connect to your cluster deployment through the list of nodes to find the primary. Clients take care of figuring out the specifics.

### Connection strings

The latest MongoDB drivers all support MongoClient and associated [MongoDB URIs](http://docs.mongodb.org/manual/reference/connection-string/).

> The MongoDB URI format is `mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]`

The URI includes a list of the servers that make up your cluster (as long as you are running straight nodes and not sharding clusters).

#### With Virtual Networks

If both your application and data tier sit within the same Windows Azure Virtual Network, then you should use the VM names and Azure-provided virtual network name resolution as you won't have to expose your servers to the Internet.

You might have a URI in these cases that looks like this:

<pre class="brush: bash">
mongodb://username:password@MongoNode1,MongoNode2/databaseName
</pre>

You should run your cluster within a Virtual Network. Replication will then happen within that network boundary, at no cost within the data center, and the response times and replication speed will be improved.

#### As Internet-accessible endpoints

Most applications will probably need to find a way to use the replica set VMs over the Internet. You can configure machine firewalls via iptables if needed.

Today, if you're using these app models, you'll need to expose it to the net:

- Windows Azure Web Sites
- Other cloud providers
- Connecting from outside a virtual network

Providers such as MongoLab expose their MongoDB servers to the public Internet more or less without too much trouble, so as long as you follow security best practices, this isn't too hazardous.

I expose endpoints for the cluster as a chain of incremental ports: MongoNode1 exposes 27017 (MongoDB default), MongoNode2 is 27018. So my MongoDB URI will look more like this:

<pre class="brush: bash">
mongodb://username:password@cloudmongo.cloudapp.net:27017,cloudmongo.cloudapp.net:27018/databaseName
</pre>

Note that the connection string doesn't include the arbiter, since it won't actually store a replicated data set or be available ever as a primary to your app.

### Testing replica sets and clients

Reboot is your friend. Rebooting and shutting down VMs is fun.

MongoLab actually provides an epic service to the community, they have a self-failing MongoDB cluster that really helps with building our robust clients and client applications. They call this "Flip Flop" and you can find out more at [http://mongolab.org/flip-flop/](http://mongolab.org/flip-flop/).

## MongoDB on Windows Azure

Original Linux VM guidance for Azure is available here: [Install MongoDB on Linunx on Azure](http://docs.mongodb.org/ecosystem/tutorial/install-mongodb-on-linux-in-azure/). This post, and associated scripts, build on this reference documentation, with some slight changes, such as extfs4 instead of extfs3.

# Windows Azure Virtual Machines

Infrastructure virtual machines from Windows Azure, running Linux (CentOS is my preference), are an awesome and powerful way to bring applications and services such as MongoDB online.

## Instance Sizes and Choices

As previously covered, memory mapped files and MongoDB mean that the common working set of data that your application is using is a key driver for picking an instance size for your primary and secondary nodes.

Arbiters can always be Extra Small (A0) size.

The current table of [Windows Azure instance sizes is online](http://msdn.microsoft.com/en-us/library/windowsazure/dn197896.aspx), along with current [Virtual Machine pricing details](http://www.windowsazure.com/en-us/pricing/details/virtual-machines/#service-non-windows. Make sure to look at the Linux pricing (it is slightly cheaper than Windows right now).

Also, with Windows Azure, you can configure any of your running VMs to actually change sizes - it will cause a reboot, and be subject to available instance size capacity restraints, but you can size up or down your VM post-launch - start with Small to get your cluster running, then move the nodes over time to be larger instances sizes. The reboots will likely cause a small hiccup in the replica set, so the primary nodes will change as part of this.

As of August 2013, here are the instance sizes that we offer in Windows Azure. Note also the maximum number of data disks supported if you're considering a RAID10 deployment for performance or other purposes (each drive in theory has IOPS of 500).

<table class="table">
<thead>
<tr>
<th>Compute Instance Name</th>
<th>Virtual Cores</th>
<th>RAM</th>
<th>Max # of Data Disks</th>
</tr>
</thead>
<tbody>
<tr>
<td>Extra Small</td>
<td>Shared</td>
<td>0.75 GB</td>
<td>1 data disk</td>
</tr>
<tr>
<td>Small</td>
<td>1</td>
<td>1.75 GB</td>
<td>2 data disks</td>
</tr>
<tr>
<td>Medium</td>
<td>2</td>
<td>3.5 GB</td>
<td>4 data disks</td>
</tr>
<tr>
<td>Large</td>
<td>4</td>
<td>7 GB</td>
<td>8 data disks</td>
</tr>
<tr>
<td>Extra Large</td>
<td>8</td>
<td>14 GB</td>
<td>16 data disks</td>
</tr>
<tr>
<td>A6</td>
<td>4</td>
<td>28 GB</td>
<td>8 data disks</td>
</tr>
<tr>
<td>A7</td>
<td>8</td>
<td>56 GB</td>
<td>16 data disks</td>
</tr>
</tbody>
</table>

## Linux images

Many people use Ubuntu, but I prefer CentOS. The scripts I've created here use `yum` as the package manager.

## Password-less Linux VMs

Previously I provided guidance on creating VMs that use public/private key pairs for authentication. Please refer to [my post about this using the CLI](http://www.jeff.wilcox.name/2013/06/secure-linux-vms-with-ssh-certificates/). I recommend not having password-accessible virtual machines in any scenario.

## Affinity Groups

We will use a Windows Azure affinity group. This groups a lot of things in nearby racks: storage, network, compute resources, etc.

## Single Instances and Maintainence

If you only run a single Virtual Machine in Windows Azure for a service, you actually won't be covered by the SLA, since it is likely that at some point the fabric running the data center will need to update the host operating system, replace old hardware, experience downtime that is scheduled, etc.

In July, I was running a small VM doing some statistical analysis, and I received this mail from Windows Azure about my single-instance VM, and that it would experience some downtime (including a reboot). I received emails before and after the work:

![A mail from Windows Azure about a single-instance VM.]({{ site.cdn }}mongo/SingleInstanceEmail.png =700x780 "A mail from Windows Azure about a single-instance VM.")

So to make sure that you are SLA compatible and your app is quite available, you need to actually run multiple VMs together using an Availability Set - a group of machines together in a single cloud service - and this is done by using the same location/affinity group, and then making up a name to cluster the machines together for.

If you look under the cloud service details, you'll see that Azure's fabric has assigned update and fault domains to these VMs to make sure that they will remain available during updates, etc. Here's what it looks like in my case (you can see this in the portal under 'Instances' for the service):

<table class="table">
<thead>
<tr>
<th>Name</th>
<th>Status</th>
<th>Role</th>
<th>Size</th>
<th>Update Domain</th>
<th>Fault Domain</th>
</tr>
</thead>
<tbody>
<tr>
<td>MongoArbiter</td>
<td>Running</td>
<td>MongoArbiter</td>
<td>Extra Small</td>
<td>2</td>
<td>0</td>
</tr>
<tr>
<td>MongoNode1</td>
<td>Running</td>
<td>MongoNode1</td>
<td>Medium</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>MongoNode2</td>
<td>Running</td>
<td>MongoNode2</td>
<td>Medium</td>
<td>1</td>
<td>1</td>
</tr>
</tbody>
</table>

If you look into fault and update domains in the Windows Azure documentation, you'll be able to learn more about the underlying concepts.

## Geo-redundancy + Storage

When it comes to the geo-redundancy features built in to Windows Azure, effectively we make sure with writes to distribute the information across the local region (there will be 3 confirmed writes to a set of storage servers before we return a successful write for local redundancy) - but with geo-redundancy, we'll also send this to another entire data center.

If you want to do any kind of RAID configuration, you won't want georedundancy, because it isn't guaranteed. I disable geo replication.

# Preparing the infrastructure: Networks, compute, storage and disks

Make sure you've installed the [Windows Azure Command Line Tools on your Mac](http://www.windowsazure.com/en-us/downloads/#cmd-line-tools). This will add an `azure` command to your path. (Node.js users: simply run `sudo npm install azure-cli` and the command will be globally installed).

LET'S DO THIS!

## Ensure you have credentials and management certs installed

The first time you use the tool, you need to run `azure account import` to pull in management credentials for your account. If this is the first time, quickly set things up by following the [How to download and import publish settings](http://www.windowsazure.com/en-us/manage/linux/how-to-guides/command-line-tools/) section of the CLI tutorial.

## Create an Affinity Group

This will be a service management group for storage, virtual networks, etc. I'm going to give it a name: California. And it will be located in the US West data center.

<pre class="brush: bash">
$ azure account affinity-group create \
-l "West US" \
-d "Web Services and MongoDB" \
California
</pre>

From this point on, I won't provide locations to any commands: an affinity group is a much better container than a data center.

## Create a Storage Account

I need to store some things in blob storage:

- VM VHDs storing the operating system
- VM VHD attached disks storing my MongoDB data for each node
- My cluster key, used for authenticating my nodes

<pre class="brush: bash">
$ azure storage account create \
--affinity-group California \
--description "Disks for VMs and Mongo keys" \
california
</pre>

Note that this storage account will be in the West US, but I'm just including the affinity group name: the affinity group is set to that data center location already.

### Consider turning off geo-replication

Now the default storage account includes geo replication. I prefer not to for my VM VHDs, though everyone has their own opinion. If you want to do any kind of RAID distribution, you need to turn this off.

<pre class="brush: bash">
$ azure storage account update \
--geoReplicationEnabled false \
california
</pre>

### Getting the storage account keys

We will use the keys at some point with the script for working with the cluster authentication key:

<pre class="brush: bash">
$ azure storage account keys list california --json
</pre>

Just copy the primary key into your clipboard for now.

## Create a Virtual Network

Inside the affinity group, I create the virtual network.

<pre class="brush: bash">
$ bin/azure network vnet create \
--subnet-name VMs \
--affinity-group California \
CaliforniaNetwork
</pre>

## Launch Compute

Time to create some virtual machines.

### Selecting the OS image

I want to use CentOS, offered as images created by OpenLogic.

I'll grep the standard image list to get OpenLogic's current image for CentOS:

<pre class="brush: bash">
$ azure vm image list --json | grep OpenLogic
</pre>

Today this returns `5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415`. Keep that handy.

### Create the initial Primary Node (Linux VM)

Now to create the primary VM in Azure:

- My affinity group, California
- A new availability set, MongoDB
- Specifying a blob URL for the OS VHD
- Medium size instance - lots of RAM
- Password-less VM, with a cert, etc.
- A virtual network we created, including the subnet
- The cloud service name, `cloudmongo`, for `cloudmongo.cloudapp.net`
- The username for the main user

<pre class="brush: bash">
$ bin/azure vm create \
--affinity-group California \
--availability-set MongoDB \
--blob-url http://california.blob.core.windows.net/vhds/mongonode1.vhd \
--vm-size medium \
--vm-name MongoNode1 \
--ssh 22001 \
--ssh-cert ./mongouser.pem \
--no-ssh-password \
--virtual-network-name CaliforniaNetwork \
--subnet-names VMs \
cloudmongo \
5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415 \
mongouser
</pre>

### Create the initial Secondary Node

Almost the same command, except:

- Connecting to an existing cloud service, `cloudmongo`
- Different SSH port
- Same size, Medium instance

<pre class="brush: bash">
$ azure vm create \
--connect \
--availability-set MongoDB \
--blob-url http://california.blob.core.windows.net/vhds/mongonode2.vhd \
--vm-size medium \
--vm-name MongoNode2 \
--ssh 22002 \
--ssh-cert ./mongouser.pem \
--no-ssh-password \
--virtual-network-name CaliforniaNetwork \
--subnet-names VMs \
cloudmongo \
5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415 \
mongouser
</pre>

### Create the Arbiter *or* 3rd node

This is the lightweight guy.

- Connect to an existing service
- Extra small instance size

<pre class="brush: bash">
$ azure vm create \
--connect \
--availability-set MongoDB \
--blob-url http://california.blob.core.windows.net/vhds/mongoarbiter.vhd \
--vm-size extrasmall \
--vm-name MongoArbiter \
--ssh 22003 \
--ssh-cert ./mongouser.pem \
--no-ssh-password \
--virtual-network-name CaliforniaNetwork \
--subnet-names VMs \
cloudmongo \
5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415 \
mongouser
</pre>

Now if you'd rather setup another data-storing node (more expensive cluster), instead fashion this command after the previous secondary instance command, matching the initial compute instance size, etc.

## Create and attach data disks

The primary MongoDB instances (this excludes MongoArbiter) should use data disks to improve IOPS throughput and also not collide with the operating system files. By default the OS disk will use a read/write cache setting with the storage service, while an attached data disk will not have any local caching, leading to better consistency of data.

This is easy: `attach-new` adds an empty disk. We then need to partition and format these extra disks.

<pre class="brush: bash">
$ azure vm disk attach-new \
MongoNode1 60 https://california.blob.core.windows.net/vhds/MongoNode1-data.vhd
$ azure vm disk attach-new \
MongoNode2 60 https://california.blob.core.windows.net/vhds/MongoNode2-data.vhd
</pre>

## Add TCP network endpoints for MongoDB

Next, we expose TCP endpoints to the MongoDB socket. I'm exposing the first node on the public port `27017` and the second on `27018`, and have no need to expose the arbiter. These will be exposed on the `cloudmongo.cloudapp.net` DNS name. Keep in mind that if the primary node fails, port `27018` (MongoNode2 VM) will be elected the primary node - so over time the roles may shift, an important reason that the connection string URIs for MongoDB include the list of machines participating in the replica set cluster.

<pre class="brush: bash">
$ azure vm endpoint create MongoNode1 27017 27017
$ azure vm endpoint create MongoNode2 27018 27017
</pre>

> Note: Our 0.7.1 CLI release has a bug here. So... we're fixing that. Like soon. So... sorry. The fix is in the dev branch.

The only scenario in which you don't need to setup these endpoints is if your application is located within the same virtual network as the MongoDB cluster. Keeping everything within the virtual network boundaries is ideal for very secure scenarios and applications.

## Installing and Preparing MongoDB on your Virtual Machines

There's a lot of guidance for doing this manually both in the Windows Azure documentation as well as the MongoDB tutorial pages.

I've written a script that has been working great for me for initializing and bringing online MongoDB on top of CentOS Linux to save time. The script:

- Partitions, formats and configures any attached data disks
- Providing or entering a name for the replica set
- Providing Windows Azure storage account name and key credentials
- Installs helper utilities and software (Node.js, a Windows Azure storage service script)
- Adds MongoDB's official MongoDB rpm repos to the system
- Installs any `yum` updates to the OS
- Installs the latest official MongoDB server build
- Configures or joins a MongoDB replica set cluster
- Generates and stores the MongoDB replica set private key in the cloud
- Starts up and configures MongoDB
- Configures the primary cluster administrator user
- Allows you to view replica set status

This script is open source and located at [https://github.com/jeffwilcox/waz-mongodb](https://github.com/jeffwilcox/waz-mongodb). It is named `setupMongoNode.sh`.

### How to use

Easy. Run it!

<pre class="brush: bash">
wget https://github.com/jeffwilcox/waz-mongodb/blob/master/setupMongoNode.sh && chmod a+x ./setupMongoNode.sh && ./setupMongoNode.sh
</pre>

As the script runs, it will ask you questions:

- Is this the first primary node, or is it another node being added to the cluster?
- Is this an arbiter?
- Will you be using a data disk?
- What are the Azure storage account credentials?
- What will you name the replicaset?
- What password do you want for the replicaset administrator?

### Source code

The source for the Bash script is up on GitHub: [https://github.com/jeffwilcox/waz-mongodb/blob/master/setupMongoNode.sh](setupMongoNode.sh at https://github.com/jeffwilcox/waz-mongodb/)

> No real warranty or support, sorry. I've had the script fail a few times at replica set initialization, I believe simple timing issues. The `/tmp` path will have log files and some simple scripts present if you need to diagnose issues.

## Creating databases and user accounts

Now you should have a fully-functional MongoDB replica set. To use it in your applications, you will want to create at least one database, and ideally create separate app (user) accounts and administrative accounts for security.

Since the last step of the script asks if you would like to connect to the primary MongoDB node, I'd recommend using this as the time to prepare the initial database(s) and users. You can learn about this process by reading about [user privilege roles](http://docs.mongodb.org/manual/reference/user-privileges/) and the tutorial [add a user to a database](http://docs.mongodb.org/manual/tutorial/add-user-to-database/).

Let's quickly create a database called "myDatabase" and a user that can only read and write data (but not actually administer the db), intended for use by a web site application. Here's what this looks like (assuming MongoNode1 is currently the primary):

<pre class="brush: bash">
$ mongo MongoNode1/admin -u clusteradmin -p
use myDatabase;
db.addUser({user:'webapp1', pwd:'webApp1PasswordGoesHere', roles:['readWrite']});
</pre>

You can then connect to the MongoDB shell directly as that new user:

<pre class="brush: bash">
$ mongo MongoNode1/myDatabase -u webapp1 -p
db.testcollection.insert({'hello':'world'});
db.testcollection.find();
</pre>

## Configuring your applications

At this point you should be allset to deploy your applications, using the credentials created above, once you include and use the appropriate MongoDB connection string for the replica set.

Here's my connection string for this app example:

<pre class="brush: bash">
mongodb://webapp1:webApp1PasswordGoesHere@cloudmongo.cloudapp.net:27017,cloudmongo.cloudapp.net:27018/myDatabase?replicaSet=rs0
</pre>

## Other considerations

There are plenty of other advanced issues that can come up with running a MongoDB in production, as well as scaling to very large databases and use cases. Your search engine of choice will help you find more information.

### RAID Data Disks

Larger VM instance sizes in Windows Azure support many data disk attachments. Some people report success using RAID10 data disk configurations on Linux to help keep high performance and availability with data disks, plus increase overall storage IOPS by splitting work and data across multiple attached drives.

I haven't found the need for this yet myself, but understand that it is best practice for a number of cloud providers.

### Secondary Read

For high-performance application needs where immediate, up-to-date 'truth' reads are not as important, there are configuration settings for MongoDB clients that can be used to enable reading from secondary nodes.

In this scenarios, the app may read from either node for data, but writes will still go to the primary.

### Sharding

MongoDB supports a horizontal partitioning and scaling technology called Sharding; it is designed for deploying very large databases supporting hundreds of millions of users. Foursquare, for example, uses such massive sharded databases.

### Backups, other data centers, silent replica set participants

It is also possible to configure additional members of a replica set that are "hidden", for purposes such as backing up data in other regions or data centers.

## Viewing the final Windows Azure infrastructure

Here's what the deployed services look like when I open the management portal; you'll see everything denoted here.

![The various Windows Azure infrastructure services deployed for my MongoDB replica set.]({{ site.cdn }}mongo/DeployedServices.png =700x200 "The various Windows Azure infrastructure services deployed for my MongoDB replica set.")

# Resources

While preparing the post, I've found all of these resources very helpful. Maybe you will, too.

## From MongoDB Inc.

- [Collected Windows Azure resources](http://docs.mongodb.org/ecosystem/platforms/azure/)
- [MongoDB tutorial, Linux VMs](http://docs.mongodb.org/ecosystem/tutorial/install-mongodb-on-linux-in-azure/)
- [MongoDB tutorial, Windows](http://docs.mongodb.org/ecosystem/tutorial/install-mongodb-on-azure/)

## From Windows Azure

- [MongoDB and Web Site tutorial using a Mac](http://bit.ly/19HU8D8)

## Closing

Hope this helps, let me know. Feel free to fork my Git repo with the setup script, interact with our team on Twitter, and let me know if things go well for you. We're open source and love sharing our hard work with you.