---
layout: post
comments: true
title: Using the Windows Azure SDK for Node.js to create a Table Service Explorer
categories: [windows-azure, cloud, nodejs]
tags: [windows-azure, table-service, storage, nodejs, cloud, bootstrap, express, github, websites]

# cdni: {{ site.cdn }}table/blog/
---
Hi! It has been way too long since I've shared some of the awesome work that we're doing throughout Windows Azure. I wanted to share an application that I built up a few nights ago that really highlights how things can come together easily using the open source Windows Azure SDKs that my team works on.

In this post I'm going to create both a client and cloud application that is glued together by JSON. The whole thing is written in JavaScript. I'm calling the app my "Windows Azure Table Explorer" - it is used for dynamically browsing through tabular data stored in the cloud.

![Windows Azure Table Service Explorer - this view shows a tabular page of results from the service.]({{ site.cdn }}table/blog/page1.png =700x651 "Windows Azure Table Service Explorer")

> The info that I'm storing in the table service is log data from my live application that is managing push notification connections from mobile devices. With a connection I log the phone manufacturer information, OS version, etc. I also log the severity of the log message - these connections are simply info. It allows me to filter out warning/error messages easily.

I'll also be introducing a few essentials and Windows Azure basics in this post since I haven't actually blogged very much about the work we're doing in the cloud, so many of my blog readers may not be familiar with the products and technologies.

Getting started
===============

Windows Azure Table Service
---------------------------

One thing that I really like about the Table Service in Windows Azure is the pricing model: it is priced the same way as all other storage, including blobs and queues - a price per GB per month, and then also a very small price for transactions. I found that for my application, table was cheaper than Amazon SimpleDB, for example. It lets me store loose data in the cloud that I can query outside of a SQL server or more complicated NoSQL solution.

I'm building this table explorer app because the Windows Azure management site doesn't display table information today, but instead just basic info about your blob containers and the blob contents. So I'm building this site to iterate through the table contents easily from any web browser.

You can find [storage pricing details here](http://www.windowsazure.com/en-us/pricing/details/#header-4).

How I'm logging data in the cloud
---------------------------------

I have an application in the cloud today in production that logs debug-style information to the cloud to make it easy to monitor what's going on. The log provider I use writes to the Windows Azure Table Service through the standard Node.js module that many use for logging called [Winston](https://github.com/flatiron/winston) and an extension to support table storage.

Windows Azure SDK for Node.js
-----------------------------

To actually interact with Windows Azure's services I am using the [Windows Azure SDK for Node.js](https://github.com/WindowsAzure/azure-sdk-for-node), a product that my dev team has done a really nice amount of work on.

If you're looking to get in touch with members of the SDK team, many of us are on Twitter and we have [a list of Twitter handles on our site](http://windowsazure.github.io/contact.html) about open source.

Windows Azure Web Sites
-----------------------

For almost all of my web projects today I just use Windows Azure Web Sites. The functionality as of April is in Preview mode still, but I've had great success in terms of uptime, availability and functionality. The key features I love about the Web Sites product:

* Git deployment functionality
* GitHub.com integration - when I push to the `master` branch on GitHub, the Windows Azure Web Site will automatically update and deploy the latest good version of my app
* Super quick deployment time (just a few seconds)
* There is a Shared plan for Web Sites that is free, so for low volume sites you can get started for free.
* The Dedicated plan is a nice way to invest in a good amount of capacity while still keeping costs low and spread along all your web properties
* I can get SSL support through the wildcard certificate at azurewebsites.net, enabling this application I am building to be secured for sending storage account credentials over an SSL channel at no cost

On the scaling side for my projects I use a set of multiple small instances that are dedicated to my projects. This way incoming requests are automatically load balanced among several virtual machines, yielding great performance, a little redundancy, and the flexibility to handle traffic quite well.

![A view of a Windows Azure Web Site in the management portal.]({{ site.cdn }}table/blog/websites.png =700x545 "Windows Azure Web Site view in the management portal.")

Securing storage credentials
----------------------------

To use services associated with a storage account, you use a key pair: the account name and an access key. This information is important to keep safe.

You'll find the keys inside the Windows Azure management portal and should take care to protect them: only send them using secure SSL connections, or store them in the cloud/server side in a secure manner.

![A view of the access keys inside the Windows Azure management portal.]({{ site.cdn }}table/blog/accesskeys.png =700x500 "Storage account access keys.")

How to send over the wire

Store in the cloud configuration (Web Sites)

![Inside the Windows Azure management portal you can store configuration variables including environment variables. This can used to securely store the storage credentials (account name and access key) in the cloud.]({{ site.cdn }}table/blog/appsettings.png =700x136 "Storing environment variables in the management portal.")

If you do this, then the site will greet you right away with a choice of tables as it does not required authentication/credentials. This is really only good for testing or temporary use while developing an app that uses the table service.

![The Getting Started page in the app is shown initially if cloud-stored credentials are used instead of prompting the user for their credentials.]({{ site.cdn }}table/blog/gettingstarted.png =700x284 "The getting started page immediately appears when using cloud-stored credentials.")

Building the site/web service
=============================

Express table middleware / credentials
--------------------------------------

x

Exposing simple json/ajax
-------------------------

x

Running locally
---------------
x

![A screenshot of the command prompt in Windows showing the running Node.js express site.]({{ site.cdn }}table/blog/commandprompt.png =700x136 "The local development environment with Node.js has nice debugging information showing each HTTP request, how long it took, and the content length of the response.")

![An error message showing a warning about sending credentials over an unsecured HTTP endpoint.]({{ site.cdn }}table/blog/httpendpoint.png =700x341 "When using an unsecured HTTP endpoint, a big warning message appears on the credentials page in this app.")

### Env variables

### Debug output

Deploying to Azure Web Sites
----------------------------

Storing credentials in the cloud (specialized purpose)
------------------------------------------------------

HTTPS endpoint - Antares
------------------------

![When connecting through a secured HTTPS endpoint, the warning message does not appear.]({{ site.cdn }}table/blog/secureendpoint.png =700x651 "When using a secure endpoint, a simple message appears letting the user know that their credentials will be safely stored.")

Building the client app
=======================

To interact with the web service, I'm creating a single-page application that is a static HTML file, built on a lot of great JavaScript frameworks (as well as Bootstrap), and then a set of JavaScript functions to interact with the cloud.

Frameworks: Bootstrap, jQuery, Moment.js
----------------------------------------

x

Listing all the tables in an account
------------------------------------

x

Building a simple table to show row results
-------------------------------------------

x

Showing details
---------------

![When clicking on a row, a small details view appears on the right side with the core information about the table row including a link to it with PartitionKey and RowKey.]({{ site.cdn }}table/blog/details.png =700x294 "The details view for a table row.")

Pagination / continuation tokens
--------------------------------

![The 11th page of the app - pagination is supported in the app.]({{ site.cdn }}table/blog/page11.png =700x180 "Pagination is supported in the app.")


Supporting multi-row delete
---------------------------

![Multi-selection is supported for deleting rows inside the table explorer.]({{ site.cdn }}table/blog/multiselect.png =700x651 "Multi-select delete is supported for removing rows in the app.")

Azure CDN for static assets (speed load time)
---------------------------------------------

x

Considering a 'count' property
------------------------------

x

Next steps
==========

Check out the app
-----------------

### Live URI

### Source code on GitHub

### Might add to a sample repo at some point

What's next
-----------

### Table clear

### Create table

### Add an entity

### Consider direct GETs to Azure (vs cloud round trip)

Related Windows Azure resources
-------------------------------

### Table documentation

### Doc example for Node/table

### GitHub repo for Node

### Open source at Windows Azure

Hope this helps!
