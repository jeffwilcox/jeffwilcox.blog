---
layout: post
comments: true
title: Creating a MongoDB replica set cluster using Windows Azure Linux VMs
categories: [windows-azure, cloud]
tags: [windows-azure, cloud, cli, mongodb, command-line, tools, linux, centos, nosql]
---
I love [MongoDB](http://www.mongodb.org/), the JSON-document friendly NoSQL database by 10gen that just keeps ticking; I'm a long-time user and have attended the MongoDB Seattle conference for a few years learning about ideal deployment scenarios, tips and tricks, and interacting with the community.

In this long post I'm going to talk about hosted MongoDB as well as single instance deployments, but primarily my focus is on setting up a cloud-based MongoDB replica set cluster in California from my Mac, sitting in a Seattle coffee shop, using the [cross-platform Command Line Interface (CLI) tools](http://www.jeff.wilcox.name/2013/08/command-line-improvements/) that [Windows Azure](http://www.windowsazure.com/) offers (and my team builds).

With a simple bash script for initializing the instances, today I'm able to launch and go live with the cluster in the time it takes to enjoy an Americano, so let's get to it!

![Setting up a MongoDB replica set via Mac command line tools while in a Seattle coffee shop.]({{ site.cdn }}mongo/VoxxCoffee.png =700x263 "Coffee, Cloud, and a Mac - the Seattle classic.")

As an aside: I developed a mobile app for foursquare users called [4th & Mayor](http://www.4thandmayor.com/) a few years; the backend is powered by Node.js and MongoDB. I first ran it all on Amazon EC2, then moved the NoSQL tier to hosted MongoDB with [MongoLab](http://www.mongolab.com), and today I'm running my own replica set cluster using Linux virtual machines in Windows Azure. The cluster is reliable, redundant, affordable, and a great case study for me as I look over our cloud capabilities and developer tools.

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

> Disclaimer: I'm running my MongoDB cluster via my BizSpark subscription and it is working great for me. I'm sharing my experiences here; however, this is not the same as the official Windows Azure guidance on MongoDB that (links at the very bottom). Your experience may vary. No warranty. Etc etc. Hosted MongoDB solutions are probably the most worry-free way to experience NoSQL so do consider MongoLab!

# Why Mongo / a replica set / multiple VM instances / etc.?

I feel like NoSQL and MongoDB specifically are entertaining "nerd religion" topics, but I've attended the Mongo Seattle conference in Seattle for the past 2 years learning about modern best practices, running MongoDB in the cloud (I'm excited to go again this year on Nov. 5th), and it is clear that there is a very passionate group of developers and companies using MongoDB for important production work.

Although Windows Azure has published some great documentation on MongoDB; both running single instance Mongo (Linux), Mongo on Windows (via roles), and via 3rd-party MongoDB hosting providers.

## MongoLab and the Windows Azure Store

The easiest way to get going with MongoDB is actually by using the 3rd-party Store right inside the Windows Azure Management Portal, powered by MongoLab. It only takes a few seconds and today there is both a paid and free tier.

As a long-time MongoLab customer, I can say, their product is great!

### Windows Azure store

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

### Product offerings

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

MongoLab offers a shared, hosted replica set option, but not in all Windows Azure data centers according to [their post announcing the availability](http://blog.mongolab.com/2013/07/production-mongodb-replica-sets-now-available-on-windows-azure/), so if you're looking to have a replica set in Europe, for example, this post might help you run that yourself until they offer such an option/region combination.

### On to our own replica set...

So that's the easy option. Let's do MongoDB ourselves now... minus the nice management and backup services that the MongoLab folks provide.

If things go down, there's only me to fix it, and I won't have the nice backup and monitoring that hosters provide for the value-add.

## Replica set built from Linux VMs

Ideal MongoDB deployments are spread across a few independent compute nodes. MongoDB takes care of replicating writes and other information across the nodes, monitoring for health, and a unique election system for determining the active primary node for writes.

Running a multi-instance VM cluster is important for a production app - dev/test/staging scenarios can use a single instance often, but production instances should be backed by the Windows Azure service-level agreement (SLA). In order to be eligible for the 99.95% SLA for infrastructure virtual machines in Windows Azure, I need to make sure to actually have multi-instance VMs running my app, coupled with an Availability Set - so a replica set.

Clients actively target the number of nodes via connection strings, able to locate and speak with the current primary node. The primary node may shift over time as operating system updates happen, virtual machines restart or go down, or data centers have problems.

I've selected a decently-redundant solution: I'm only using a single data center and single geography for my underlying storage, but I should not actually experience data loss, only mild downtime, if things really go bad. This matches a highly-available, high performance design for my app that should rock.

## Mac tooling

This post started from my initial investigations into running a cluster on Windows Azure VMs via available methods:

- Windows-based PowerShell scripts
- Windows Azure Management Portal
- Cross-platform command line interface (CLI) for Mac/Linux/Windows

This specific first post is targeted on using a Mac, but I'll follow up with posts on the other methods soon enough.

I will say this was a great way to stress the tools: I'm using a majority of the Virtual Machine feature surface area and was able to open some solid issues along the way.

The July and August releases of the cross-platform command line tools ([my overview post here](http://www.jeff.wilcox.name/2013/08/command-line-improvements/); [download the tools here](http://www.windowsazure.com/en-us/downloads/#cmd-line-tools)) include new features around Virtual Networks to enable some scenarios here, as well as Availability Set and password-less VM functionality for Virtual Machine operations.

# The Windows Azure Command Line Interface (CLI)

There are a lot of great ways that Windows Azure lets you work with your services. We officially have:

- The Windows Azure Management Portal online
- Visual Studio with the Windows Azure SDK
- PowerShell commandlets for Windows
- The cross-platform Command Line Interface / Tool (CLI) for Windows, Mac, and Linux (powered by Node.js)
- Client libraries for many languages, including .NET, Java, Python, Ruby, PHP, and others.

A lot of people get started with infrastructure and VMs using the portal; I find myself toting my notebook all over town though and really love that the x-plat command line tools allow me to use the easy `azure` command from your favorite terminal.

![The Azure command running in the Terminal application.]({{ site.cdn }}summercli/AzureCommandTerminal.png =697x534 "The Azure command running in the Terminal application.")

Did I mention almost everything is open source and on GitHub at [https://www.github.com/WindowsAzure/](https://www.github.com/WindowsAzure/)?

The Node.js source code for the command line tools is in the repo at [https://github.com/WindowsAzure/azure-sdk-tools-xplat](https://github.com/WindowsAzure/azure-sdk-tools-xplat) - though it also takes a dependency on our Node.js SDK which is at [https://github.com/WindowsAzure/azure-sdk-for-node](https://github.com/WindowsAzure/azure-sdk-for-node).

# MongoDB

MongoDB is a "NoSQL" document database. It is open source and implemented in native code. You can find out plenty at [http://www.mongodb.org/](http://mongodb.org/), but key features include:

- Document-oriented storage: JSON-style docs with dynamic schemas
- Index support on any attribute
- Replication and high availability through replica sets
- Advanced sharding support for horizontal scaling
- Querying, including geo-location query support
- Map/Reduce support

MongoDB was first released in 2009, production-ready since 2010, and today is used by major apps and companies; according to [Wikipedia](http://en.wikipedia.org/wiki/MongoDB), these customers include eBay, MetLife, Foursquare, MTV Networks, and others.

## Mongo Configurations

MongoDB can be configured in many ways: a local instance running on your development machine, a cloud-connected virtual machine running a single instance, a "replica set" or master/slave configuration that backs up data for availability and security across many machines, or a shared configuration for high performance and tons of data.

### Single instance

For development and testing scenarios, running a single MongoDB instance is very straightforward and easy. You can even run such an instance on your local machine without the need to spin anything up in the cloud.

Most of the MongoDB hosting providers offer very affordable single instance hosting, often on hardware or VMs that run multiple MongoDB server processes: effectively higher-density shared hosting.

### Multi-node replica set cluster

When it comes to data availability and redundancy, MongoDB's replica set concept is ideal. Unlike a single instance, these replica sets are built from multiple virtual machines and can either be shared among customers/uses (Mongo hosting scenario), or completely dedicated.

You can learn about MongoDB through via its documentation:

- [Introduction to MongoDB Replication](http://docs.mongodb.org/manual/core/replication-introduction/)
- MongoDB's documentation provides a short overview of [replica set deployment architectures](http://docs.mongodb.org/manual/core/replica-set-architectures/)
- [A full set of tutorials](http://docs.mongodb.org/manual/administration/replica-sets/)

#### Nodes + Arbiter

The traditional, cost-effective solution for a MongoDB cluster is to ensure that you have an odd number of voting MongoDB instances for your database - in order to elect a new Primary.

This means most providers will spin up two dedicated VMs with nice specifications (good memory mostly), and then a very lightweight, inexpensive Arbiter role. The Arbiter can typically always be an Extra Small (A0)-sized instance, costing pennies an hour, while I recommend most people look at Medium and Large instances for the remaining nodes, depending on their requirements for memory.

An Arbiter simply communicates with the nodes in the replica set, checking response times, uptime, etc., in order to select the best-weighted MongoDB primary if a primary goes down.

For hosting providers such as MongoLab, they will actually take a single virtual machine and run many MongoDB processes on it, acting as Arbiters, to drive the cost down even further.

#### 3x Nodes

The most solid replica set implementation is to spin up a cluster of 3 identical, high-powered VMs, each of which could be an acting primary. Without an arbiter, but 3 nodes, it has enough communication and data potential to participate in MongoDB elections for a new primary if the need arrises, while client apps are able to connect to all 3 machines in the case that it needs to probe for the current primary.

### Understanding memory management and MongoDB

MongoDB is very efficient with memory and uses [operating system-level memory mapped files](http://docs.mongodb.org/manual/faq/storage/).

As a result, the intended working set of your data (that is regularly used in computations, reductions, etc.) is the primary dictator of how much memory you should allocate via instance size selection. If you intend on regular scans across sets of data, you'll need to take that into account.

Also, 64-bit is a must for MongoDB in order to effectively allow for memory mapping.

For my production application use, I maintain several collections of data:

- User and friend documents
- Push notification queue
- Metadata storage
- Web site session store (for Node.js + Express)

Since only the user, friend, and push queue documents are regularly used heavily (plus a small subset of the active sessions), I've found that this data represents about 1.5 GB of my 3 GB of data. The size of my data doesn't grow too much month-to-month.

This means that the 1.7 GB afforded to me by a Small instance size is often enough. You can always scale up or down your instance sizes with Windows Azure VMs.

### Linux and MongoDB

Every year at the MongoDB Seattle Conference (and other conferences held around the world by 10gen), there have been great sessions by real engineers using and running replica sets in the real world. Key applications out there like [foursquare](https://foursquare.com) are powered by MongoDB and using powerful features such as the geo-spatial query features.

I've found the AWS-targeted guidance in the past about Linux and MongoDB to be very helpful while fine-tuning MongoDB on Windows Azure, as many of the key principals apply about file system configurations.

The short list of things that I prefer to have setup:

- Data drives should be separate from the OS drive
- Data drives should be formatted with extfs4
- The file system on data drives need not record access times (atime)

## MongoDB Clusters and Applications

When you run a MongoDB replica set, you are actually running a system of slightly independent nodes that may or may not be available during maint., OS updates, etc.

From an application standpoint, this means that connecting to a replica set is dependent on support in the MongoDB driver for the language/framework you are using. Over time things have improved as 10gen has worked with open source library authors to get some consistency in the connection string and configuration situation.

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

I recommend always having your MongoDB cluster running within a virtual network - performance for replication is actually faster and all that chatty replication information is kept within the data center.

#### As Internet-accessible endpoints

Most applications will probably need to find a way to expose the replica set VMs to the Internet. You can further configure machine firewalls via iptables if needed.

If you're using:

- Web Sites
- Other cloud providers
- Connecting from outside a virtual network

Then you should use the Internet cloud service endpoints.

Providers such as MongoLab expose their MongoDB servers to the public Internet more or less without too much trouble, so as long as you follow security best practices, this isn't too hazardous.

I expose endpoints for the cluster somewhat as a chain of incremental ports: MongoNode1 exposes 27017 (MongoDB default), MongoNode2 is 27018, etc.

So my MongoDB URI will look more like this:

<pre class="brush: bash">
mongodb://username:password@cloudmongo.cloudapp.net:27017,cloudmongo.cloudapp.net:27018/databaseName
</pre>

### Testing replica sets and clients

Reboot is your friend. Rebooting and shutting down VMs is fun.

MongoLab actually provides an epic service to the community, they have a self-failing MongoDB cluster that really helps with building our robust clients and client applications. They call this "Flip Flop" and you can find out more at [http://mongolab.org/flip-flop/](http://mongolab.org/flip-flop/).

## MongoDB on Windows Azure

When it comes to MongoDB running on Windows Azure, there have been a lot of different recommendations over the years as new services have launched. The general availability of Virtual Machines has changed this once again.

I believe that multiple-node (+arbiter) configurations running on CentOS Linux VMs are the most common deployment mechanism for MongoDB replica set installations in the industry, so I prefer these for my production environment when compared to some of the earlier guidance for MongoDB on Azure, such as using [cloud service worker roles](http://docs.mongodb.org/ecosystem/tutorial/deploy-mongodb-worker-roles-in-azure/) to deploy MongoDB.

Direct guidance is available for running Linux VMs with MongoDB within the MongoDB tutorial titled [Install MongoDB on Linunx on Azure](http://docs.mongodb.org/ecosystem/tutorial/install-mongodb-on-linux-in-azure/). This post, and associated scripts, build on this.

### Estimating compute costs

The cost of running a MongoDB cluster is variable, depending on data transfer costs, data disk sizes, storage transaction costs, compute instance size and uptime, as well as data disk cache settings. I recommend experimenting with dev/test replica set clusters on an MSDN account for some time before eventually using a production subscription to create the cluster you're happy with in terms of performance, cost, and capacity.

Let's do some estimation in the back-of-the-napkin sort of way. No warranty on this one!

#### Compute

For a MongoDB replica set cluster in the traditional 2xNode + 1xArbiter configuration, I'd like to consider:

- Primary MongoDB Node: Medium Linux Virtual Machine ($0.12/hour)
- Secondary MongoDB Node: Medium Linux Virtual Machine ($0.12/hour)
- MongoDB Arbiter: Extra Small Linux VM ($0.02/hour)

The total hourly raw compute cost is therefore $0.26, at a monthly rate of $187.20. This is the base *compute* component of running the service.

#### Storage

For storage, we are going to be storing the VHD operating system disks for the 3 virtual machines; the OS disk cost is variable somewhat, depending on whether the entire allocated space is actually used. A0 allocates a 20 GB data disk, A1 70 GB, and A2 135 GB - but if you're only using 2 GB, then the cost is much lower as the sparse VHD has not actually been "expanded".

Here's the use on one of my production MongoDB nodes that has been running for a few months:

<pre class="brush: bash">
[jeffwilcox@MongoNode1 ~]$ df -h
Filesystem            Size  Used Avail Use% Mounted on
/dev/sda1              29G  2.0G   26G   8% /
tmpfs                 776M     0  776M   0% /dev/shm
/dev/sdc1              40G  6.0G   32G  16% /mnt/data
/dev/sdb1              69G  180M   66G   1% /mnt/resource
</pre>

So what I see for my production cluster is:

- 2.0 GB disk use for the operating system and MongoDB software
- 6.0 GB disk use for the MongoDB journal, log, and database storage (this is probably going to be a minimum of 4 GB and a maximum of the drive space for large cluster deployments full of data)

So each non-arbiter node is going to use in this model 8 GB per month of storage, while the arbiter will use 2 GB, for a monthly cost of the simple replica set cluster of 18 GB. Local redundant storage would then cost $0.07 per GB = $1.26, while geo-redundant would cost $1.71 per month.

As far as storage transactions, I'm not seeing a ton of charges here, but understand that OS page files, software updates, log files, security mechanisms, will all use transactions over time. I have not found this to be a large cost per virtual machine enough to really understand it much, but it is documented as to how large writes are, etc. If we have disk write and read caching off for attached disks (my recommendation), you'll see a storage transaction for any written data, fyi.

For our estimate, let's say 500,000 transactions per month, for a cost of $0.05. I just made this number up.

### Virtual Network

No cost for having VMs within a virtual network communicating with one another.

### Affinity Groups

No cost.

### Data Transfer

If your application is hosted entirely within the Virtual Network: No cost.

If your application has Internet endpoints exposed and is being used by other services, or by a site such as a Windows Azure Web Site, outbound data is charged as follows... I'm assuming for now that we're talking on a small enough scale to not go over the 10 TB amount, but other prices are listed on the [Data Transfer Pricing Details Page](http://www.windowsazure.com/en-us/pricing/details/data-transfers/) on the Windows Azure web site.

<table class="table">
<thead>
<tr>
<th>Outbound Data Transfer</th>
<th>Cost</th>
<th>Zone 2 Cost (East Asia and Southeast Asia)</th>
</tr>
</thead>
<tbody>
<tr>
<td>First 5 GB / Month</td>
<td>Free</td>
<td>Free</td>
</tr>
<tr>
<td>5 GB - 10 TB</td>
<td>$0.12 per GB</td>
<td>$0.19 per GB</td>
</tr>
</tbody>
</table>

For my app, I'm located in West US, and really am not causing too heavy of traffic to hit my service over the Internet, so I'm going to assume 20 GB a month of data transfer for this exercise, though my current data across all instances is showing that for my MongoDB cluster I'm probably only doing about 10 GB today.

So the first 5 GB is $0.00, and then the next 15 GB will be at a cost for me of $0.12/GB, for a total cost for the month of $1.80.

#### Total Monthly

<table class="table">
<tbody>
<tr>
<td>Compute (2x Medium, 1x Extra Small)</td>
<td>$ 187.20</td>
</tr>
<tr>
<td>Storage Space (Local Redundancy)</td>
<td>$ 1.26</td>
</tr>
<tr>
<td>Storage Transactions</td>
<td>$ 0.05</td>
</tr>
<tr>
<td>Outbound Data Transfer</td>
<td>$ 1.80</td>
</tr>
<tr class="info">
<td><strong>TOTAL<strong></td>
<td>$ 190.31</td>
</tr>
</tbody>
</table>

#### Cost-savings opportunity

To save a little money, if you intend on really monitoring your service and only using a secondary node in the rare situation that OS updates or other downtime affect things, you might be able to get away with a Medium Primary, Small Secondary, and Extra Small Arbiter.

#### Comparing compute costs

This is effectively my cost today for running my MongoDB cluster, including its various components; however, to do a price comparison with MongoLab, I'd allocate up to 60 GB of data storage - 70 GB with journal space, etc. - which would increase storage space costs to about $10.22/month vs $1.26.

A comparable MongoDB dedicated plan running in the Amazon cloud, according to the [MongoLab Plans and Pricing](https://mongolab.com/products/pricing/) page, would be the "X-Small" (3.7 GB memory) with standard monthly storage (60 GB of usable storage), and they charge $400/month for this service.

Keep in mind that this price would include service, support, backups, and a lot of other hidden costs beyond this.

### Thinking about backups

I'm avoiding the issue of data backups, but `cron` jobs or other services can be used to do some level of backup; this is a whole different topic and beyond the scope of this post. With MongoLab, at least they have your back!

# Windows Azure Virtual Machines

Infrastructure virtual machines from Windows Azure, running Linux (CentOS is my preference), are an awesome and powerful way to bring applications and services such as MongoDB online.

## Instance Sizes and Choices

As previously covered, memory mapped files and MongoDB mean that the common working set of data that your application is using is a key driver for picking an instance size for your primary and secondary nodes.

Arbiters can always be Extra Small size.

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

x

## Password-less Linux VMs

x

## Affinity Groups

x

## Availability Sets / IaaS VM SLA

Availability Sets are XXX

### Single Instances and Maintainence

If you only run a single Virtual Machine in Windows Azure for a service, you actually won't be covered by the SLA, since it is likely that at some point the fabric running the data center will need to update the host operating system, replace old hardware, experience downtime that is scheduled, etc.

In July, I was running a small VM doing some statistical analysis, and I received this mail from Windows Azure about my single-instance VM, and that it would experience some downtime (including a reboot):

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

### Viewing an availability set

When you have a multi-instance VM setup in Windows Azure, you will see that the Cloud Service (the DNS endpoint - cloudapp.net - for the service) will have multiple virtual machines listed within its properties, showing the availability set:

![]({{ site.cdn }}mongo/AvailabilitySet.png =700x290 "")


## Virtual Networks

x

## VM Endpoints

x

## Storage Accounts

x

### Geo-redundancy

When it comes to the geo-redundancy features built in to Windows Azure, effectively we make sure with writes to distribute the information across the local region (there will be 3 confirmed writes to a set of storage servers before we return a successful write for local redundancy) - but with geo-redundancy, we'll also send this to another entire data center.

So if your primary data center for a storage account is 

### VHDs and billing

x

### Storing blobs in the cloud

x

## Data Disks

x

# Creating a MongoDB replica set in Windows Azure

Now that we've covered all of the technical topics, some basics on MongoDB and architecture, we're ready to use the x-plat CLI to actually get out infrastructure in place.

## Architectural Design

The design I'm using for production app use today supporting 300,000 clients is a pair of nodes and an arbiter for primary voting.

![The infrastructure design for my MongoDB replica set cluster in Windows Azure.]({{ site.cdn }}mongo/MongoAvailabilityMap.png =700x480 "The infrastructure design for my MongoDB replica set cluster in Windows Azure.")

A slightly more robust architecture might involve additional "hidden" replica set members for backup in other regions or just using a 3rd primary node instead of an arbiter.

## Preparing the infrastructure: Networks, compute, storage and disks

Make sure you've installed the [Windows Azure Command Line Tools on your Mac](http://www.windowsazure.com/en-us/downloads/#cmd-line-tools). This will add an `azure` command to your path. (Node.js users: simply run `sudo npm install azure-cli` and the command will be globally installed).

### Ensure you have credentials and management certs installed

The first time you use the tool, you need to run `azure account import` to pull in management credentials for your account. If this is the first time, quickly set things up by following the [How to download and import publish settings](http://www.windowsazure.com/en-us/manage/linux/how-to-guides/command-line-tools/) section of the CLI tutorial.

### Create an Affinity Group

x

<pre class="brush: bash">
$ azure account affinity-group create \
-l "West US" \
-d "Web Services and MongoDB" \
California
</pre>

### Create a Storage Account

x

<pre class="brush: bash">
$ azure storage account create \
--affinity-group California \
--description "Disks for VMs and Mongo keys" \
california
</pre>

#### Consider turning off geo-replication

x

<pre class="brush: bash">
$ azure storage account update \
--geoReplicationEnabled false \
california
</pre>

#### Getting the storage account keys

x

<pre class="brush: bash">
$ azure storage account keys list california --json
</pre>

### Create a Virtual Network

x

<pre class="brush: bash">
$ bin/azure network vnet create \
--subnet-name VMs \
--affinity-group California \
CaliforniaNetwork
</pre>

### Launch Compute

x

### Selecting the OS image

<pre class="brush: bash">
$ azure vm image list --json | grep OpenLogic # 5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415
</pre>

#### Create the initial Primary Node (Linux VM)

x

<pre class="brush: bash">
$ bin/azure vm create \
--affinity-group California \
--availability-set MongoDB \
--blob-url "http://california.blob.core.windows.net/vhds/mongonode1.vhd" \
--vm-size medium \
--vm-name MongoNode1 \
--ssh 22001 \
--ssh-cert ~/jeffwilcox.pem \
--no-ssh-password \
--virtual-network-name "CaliforniaNetwork" \
--subnet-names "VMs" \
cloudmongo \
5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415 \
mongouser
</pre>

#### Create the initial Secondary Node

x

<pre class="brush: bash">
$ azure vm create \
--connect \
--availability-set MongoDB \
--blob-url "http://california.blob.core.windows.net/vhds/mongonode2.vhd" \
--vm-size medium \
--vm-name MongoNode2 \
--ssh 22002 \
--ssh-cert ~/jeffwilcox.pem \
--no-ssh-password \
--virtual-network-name "CaliforniaNetwork" \
--subnet-names "VMs" \
cloudmongo \
5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415 \
mongouser
</pre>

#### Create the Arbiter *or* 3rd node

x

<pre class="brush: bash">
$ azure vm create \
--connect \
--availability-set MongoDB \
--blob-url "http://california.blob.core.windows.net/vhds/mongoarbiter.vhd" \
--vm-size extrasmall \
--vm-name MongoArbiter \
--ssh 22003 \
--ssh-cert ~/jeffwilcox.pem \
--no-ssh-password \
--virtual-network-name "CaliforniaNetwork" \
--subnet-names "VMs" \
cloudmongo \
5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-63APR20130415 \
mongouser
</pre>

Now if you'd rather setup another data-storing node (more expensive cluster), instead fashion this command after the previous secondary instance command, matching the initial compute instance size, etc.

### Create and attach data disks

The primary MongoDB instances (this excludes MongoArbiter) should use data disks to improve IOPS throughput and also not collide with the operating system files. By default the OS disk will use a read/write cache setting with the storage service, while an attached data disk will not have any local caching, leading to better consistency of data.

<pre class="brush: bash">
$ azure vm disk attach-new \
MongoNode1 60 https://california.blob.core.windows.net/vhds/MongoNode1-data.vhd
$ azure vm disk attach-new \
MongoNode2 60 https://california.blob.core.windows.net/vhds/MongoNode2-data.vhd
</pre>

### Add TCP network endpoints for MongoDB

Next, we expose TCP endpoints to the MongoDB socket. I'm exposing the first node on the public port `27017` and the second on `27018`, and have no need to expose the arbiter. These will be exposed on the `cloudmongo.cloudapp.net` DNS name. Keep in mind that if the primary node fails, port `27018` (MongoNode2 VM) will be elected the primary node - so over time the roles may shift, an important reason that the connection string URIs for MongoDB include the list of machines participating in the replica set cluster.

<pre class="brush: bash">
$ azure vm endpoint create MongoNode1 27017 27017
$ azure vm endpoint create MongoNode2 27018 27017
</pre>

The only scenario in which you don't need to setup these endpoints is if your application is located within the same virtual network as the MongoDB cluster. Keeping everything within the virtual network boundaries is ideal for very secure scenarios and applications.

## Installing and Preparing MongoDB on your Virtual Machines

There's a lot of guidance for doing this manually both in the Windows Azure documentation as well as the MongoDB tutorial pages.

I've written a script that has been working great for me for initializing and bringing online MongoDB on top of CentOS Linux to save time. The script:

- Partitions, formats and configures any attached data disks
- Providing or entering a name for the replica set
- Providing Windows Azure storage account name and key credentials
- Installs helper utilities and software (Node.js, a Windows Azure storage service script)
- Adds 10gen's official MongoDB rpm repos to the system
- Installs any `yum` updates to the OS
- Installs the latest official MongoDB server build
- Configures or joins a MongoDB replica set cluster
- Generates and stores the MongoDB replica set private key in the cloud
- Starts up and configures MongoDB
- Configures the primary cluster administrator user
- Allows you to view replica set status

### How to use

x

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

## From 10Gen/MongoDB

- [Collected Windows Azure resources](http://docs.mongodb.org/ecosystem/platforms/windows-azure/)
- [MongoDB tutorial, Linux VMs](http://docs.mongodb.org/ecosystem/tutorial/install-mongodb-on-linux-in-azure/)
- [MongoDB tutorial, Windows](http://docs.mongodb.org/ecosystem/tutorial/install-mongodb-on-windows-azure/)

## From Windows Azure

- [MongoDB and Web Site tutorial using a Mac](http://bit.ly/19HU8D8)

## Closing

Hope this helps, let me know. Feel free to fork my Git repo with the setup script, interact with our team on Twitter, and let me know if things go well for you. We're open source and love sharing our hard work with you.