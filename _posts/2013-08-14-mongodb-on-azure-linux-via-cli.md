---
layout: post
comments: true
title: Creating a MongoDB replica set cluster using Windows Azure Linux VMs and the OS X CLI
categories: [windows-azure, cloud]
tags: [windows-azure, cloud, cli, mongodb, command-line, tools]
---
I love [MongoDB](http://www.mongodb.org/), the JSON-friendly NoSQL database by 10gen that just keeps ticking; I'm a long-time user and have attended the MongoDB Seattle conference a few years to learn about ideal deployment scenarios, tips and tricks.

In this long post I'm going to setup a cloud-based MongoDB replica set cluster in California from my MacBook Air, sitting in a Seattle coffee shop, using the [cross-platform Command Line Interface (CLI) tools](http://www.jeff.wilcox.name/2013/08/command-line-improvements/) that [Windows Azure](http://www.windowsazure.com/) offers (and my team builds).

![Setting up a MongoDB replica set via Mac command line tools while in a Seattle coffee shop.]({{ site.cdn }}mongo/VoxxCoffee.png =700x263 "Coffee, Cloud, and a Mac - the Seattle classic.")

I've been running a mobile app for foursquare users called [4th & Mayor](http://www.4thandmayor.com/) for a few years; the backend is powered by MongoDB: running first on AWS EC2, then hosted MongoDB via [MongoLab](http://www.mongolab.com), and today I'm now running my own replica set cluster using virtual machines in Windows Azure in a reliable, redundant, affordable environment that rocks.

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

> Disclaimer: I'm running my MongoDB cluster via my BizSpark subscription and it is working great for me. I'm sharing my experiences here; however, this is not the same as the official Windows Azure guidance on MongoDB that (links at the very bottom). Your experience may vary. No warranty. Etc etc. Hosted MongoDB solutions are probably the most worry-free way to experience NoSQL!

# Why Mongo / a replica set / multiple VM instances / etc.?

I feel like NoSQL and MongoDB specifically are entertaining "nerd religion" topics, but I've attended the Mongo Seattle conference in Seattle for the past 2 years learning about modern best practices, running MongoDB in the cloud (I'm excited to go again this year on Nov. 5th), and it is clear that there is a very passionate group of developers and companies using MongoDB for important production work.

Although Windows Azure has published some great documentation on MongoDB; both running single instance Mongo (Linux), Mongo on Windows (via roles), and via 3rd-party MongoDB hosting providers.

## MongoLab and the Windows Azure Store

The easiest way to get going with MongoDB is actually by using the 3rd-party Store right inside the Windows Azure Management Portal, powered by MongoLab. It only takes a few seconds and today there is both a paid and free tier.

XXX

## My own replica set via Linux compute VMs

Ideal MongoDB deployments are spread across a few independent compute nodes. MongoDB takes care of replicating writes and other information across the nodes, monitoring for health, and a unique election system for determining the active primary node for writes.

Running a multi-instance VM cluster is important for a production app - dev/test/staging scenarios can use a single instance often, but production instances should be backed by the Windows Azure service-level agreement (SLA). In order to be eligible for the 99.95% SLA for infrastructure virtual machines in Windows Azure, I need to make sure to actually have multi-instance VMs running my app, coupled with an Availability Set - so a replica set.

Clients actively target the number of nodes via connection strings, able to locate and speak with the current primary node. The primary node may shift over time as operating system updates happen, virtual machines restart or go down, or data centers have problems.

I've selected a decently-redundant solution: I'm only using a single data center and single geography for my underlying storage, but I should not actually experience data loss, only mild downtime, if things really go bad. This matches a highly-available, high performance design for my app that should rock.

## Stressing our Mac & Linux tooling

This post started from my initial investigations into running a cluster on Windows Azure VMs; I made sure that I could stand up this cluster using our Windows-based PowerShell scripts, the Windows Azure Management Portal, and also the cross-platform command line interface (CLI) for Mac/Linux/Windows; this specific first post is targeted on using a Mac, but I'll follow up with posts on the other methods soon enough.

I will say this was a great way to stress the tools: I'm using a majority of the Virtual Machine feature surface area.

The July and August releases of the cross-platform command line tools ([my overview post here](http://www.jeff.wilcox.name/2013/08/command-line-improvements/); [download the tools here](http://www.windowsazure.com/en-us/downloads/#cmd-line-tools)) include new features around Virtual Networks to enable some scenarios here, as well as Availability Set and password-less VM functionality for Virtual Machine operations.

# The Windows Azure Command Line Interface (CLI)

There are a lot of great ways that Windows Azure lets you work with your services. We officially have:

- The Windows Azure Management Portal online
- Visual Studio with the Windows Azure SDK
- PowerShell commandlets for Windows
- The cross-platform Command Line Interface / Tool (CLI) for Windows, Mac, and Linux (powered by Node.js)
- Client libraries for many languages, including .NET, Java, Python, Ruby, PHP, and others.

A lot of people get started with infrastructure and VMs using the portal; I find myself toting my notebook all over town though and really love that the x-plat command line tools allow me to use the easy `azure` command from the terminal app.

![The Azure command running in the Terminal application.]({{ site.cdn }}summercli/AzureCommandTerminal.png =697x534 "The Azure command running in the Terminal application.")

So I'm using Mac + CLI today for this post but most any of these methods would work great.

Did I mention almost everything is open source and on GitHub at [https://www.github.com/WindowsAzure/](https://www.github.com/WindowsAzure/)?

The Node.js source code for the command line tools is in the repo at [https://github.com/WindowsAzure/azure-sdk-tools-xplat](https://github.com/WindowsAzure/azure-sdk-tools-xplat) - though it also takes a dependency on our Node.js SDK which is at [https://github.com/WindowsAzure/azure-sdk-for-node](https://github.com/WindowsAzure/azure-sdk-for-node).

# MongoDB

x

## My app and MongoDB history

x

Mongo Seattle conference 2011, 2012

My production app

How I use MongoDB

MongoLab

Moving to Windows Azure

## Mongo Configurations

MongoDB can be configured in many ways: a local instance running on your development machine, an Internet-connected virtual machine running a single instance, a "replica set" or master/slave configuration that backs up data for availability and security across many machines, or a shared configuration for high performance and tons of data.

### Multi-node cluster

x

### Single instance

x

### Understanding memory management and MongoDB

x

64-bit

Memory-mapped

Help select an instance size that works for you

### Linux and MongoDB

x

extfs 4

## MongoDB Clusters and Applications

x

### Connection strings

x

### Testing replica sets and clients

x

### Testing Windows Azure replica set failover

x

## MongoDB Hosting Providers

x

## MongoDB on Windows Azure

x

### Estimating compute costs

x

### Comparing compute costs

x

### Thinking about backups

x

## MongoDB Security

x

# Windows Azure Virtual Machines

x

## Instance Sizes and Choices

x

## Linux images

x

## Password-less Linux VMs

x

## Affinity Groups

x

## Availability Sets / IaaS VM SLA

Availability Sets are XXX

### Single Instances and Maintainence

![]({{ site.cdn }}mongo/SingleInstanceEmail.png =700x780 "")

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

x

### VHDs and billing

x

### Storing blobs in the cloud

x

## Data Disks

x

# Creating a MongoDB replica set in Windows Azure

Now that we've covered all of the technical topics, some basics on MongoDB and architecture, we're ready to use the x-plat CLI to actually get out infrastructure in place.

## Architectural Design

![]({{ site.cdn }}mongo/MongoAvailabilityMap.png =700x480 "")

## From the Terminal

x

## Preparing MongoDB

x

## Creating databases and user accounts

x

## Viewing the final Windows Azure infrastructure

![The various Windows Azure infrastructure services deployed for my MongoDB replica set.]({{ site.cdn }}mongo/DeployedServices.png =700x200 "The various Windows Azure infrastructure services deployed for my MongoDB replica set.")

# Resources

## From 10Gen/MongoDB

All resources: http://docs.mongodb.org/ecosystem/platforms/windows-azure/

On Linux: http://docs.mongodb.org/ecosystem/tutorial/install-mongodb-on-linux-in-azure/

On Windows: http://docs.mongodb.org/ecosystem/tutorial/install-mongodb-on-windows-azure/

## From Windows Azure

http://www.windowsazure.com/en-us/develop/nodejs/tutorials/website-with-mongodb-(mac)/

## Closing

Hope this helps, let me know. Feel free to fork my Gist with the setup script, interact with our team on Twitter, and let me know if things go well for you. We're open source and love sharing our hard work with you.