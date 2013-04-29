---
layout: post
comments: true
title: Moving 4th & Mayor to Windows Azure Web Sites
categories: [windows-azure, cloud, nodejs, 4thandmayor]
tags: [windows-azure, 4thandmayor, nodejs, cloud, express, websites]
---
After several years of hosting my mobile application's web server and services with Amazon Web Services (AWS), in April I moved my production services to Windows Azure, and it went really smoothly. Here I am sharing a guide through some of the highlights of this process, including how I went about migrating my Node.js backend to an HTTPS-secured site powered by Windows Azure Web Sites, Cloud Services, and the Windows Azure Store.

After planning for the migration in March and doing some testing over weekends, I migrated all the traffic for my foursquare application [4th & Mayor](https://www.4thandmayor.com/) to Windows Azure via a quick DNS update a few days into the month of April. It has continued running without a hitch. I'm not going to detail my data migration here, however, that is never fun.

As my cloud backend is implemented in [Node.js](http://nodejs.org/), there was no very little app coding work required other than updating my logging provider and configuring some new infrastructure connection strings.

SSL + Windows Azure Web Sites today
===================================

My app makes connections to my cloud infrastructure to enable rich live tiles, push notification registration and processing, configuraton, and other future scenarios I hope to launch some day in future app updates. These requests need to be secured with SSL. I also expose some functionality on the web site for the app's marketing and user diagnostics.

![A screen capture of the web browser showing the key icon and graphics to show that the site has been served in a secure manner.]({{ site.cdn }}4thwazblog/4thandmayorSsl.png =700x100 "4thandmayor.com with SSL, site hosted by Windows Azure")

Here's the kicker: the Windows Azure Web Sites preview product supports SSL using Microsoft's wildcard certificate for `*.azurewebsites.net` - great and secure for many apps today - but does not support a "bring your own certificate" model today. In time, the service will support custom certificates for Web Sites via SNI I've heard, but today you cannot bring your own certs like you might like to. Since my production app already uses my own custom certificates, moving my traffic to the Windows Azure endpoints isn't a great story for me, and I prefer to route my app traffic through DNS for my domain.

Brady Gaster has a really good solution and tutorial for the interim: [Running SSL with Windows Azure Web Sites Today](http://www.bradygaster.com/running-ssl-with-windows-azure-web-sites) - this is what I have gone with, and though it is a little scary sounding at first, it was pretty easy to setup and has completely unblocked me. Check that out for the technical details and guide.

Production [4th & Mayor](https://www.4thandmayor.com/) app and site traffic as of April 4, 2013 is using SSL to communicate with the awesome Git-deployed goodness of [Windows Azure Web Sites](http://www.windowsazure.com/en-us/home/scenarios/web-sites/). WINNING!

Using Brady's guide, my services design for the core SSL traffic and Node.js app hosting is as follows:

![A simple network map of the various Windows Azure services involved in hosting the secure web site.]({{ site.cdn }}4thwazblog/MyAzureNetworkMap.png =700x350 "4thandmayor.com with SSL, site hosted by Windows Azure")

I can independently scale the Cloud Services (reverse proxy) and reserved Web Sites instances for the front end. Since I host a few other sites with my reserved region/subscription, I tend to keep more instances there for good response times across my network of sites.

Since both Windows Azure Web Sites and Cloud Services have built-in network load balancing (this is a difference from when I was with AWS and had to pay for and configure elastic load balancing separately), I get a nice value out of this configuration.

> Full disclosure: I'm a software development lead on the Windows Azure team and looked to this exercise to learn more about the tools, products and services that we offer. My application is a member of the [Microsoft BizSpark program](http://www.microsoft.com/bizspark/) which offers a nice set of cloud services, helping me to control my app's capex.

Background: m> Full disclosure: I'm a dev lead on the Windows Azure team and looked to this exercise to learn more about the tools, products and services that we offer. My application is a member of the [Microsoft BizSpark program](http://www.microsoft.com/bizspark/) which offers a nice set of cloud services, helping me to control my app's capex.

My Node.js app backend & site
=============================

Implemented in [Node.js](http://nodejs.org/), the web services and site for the app are super portable as a result: I'm glad there is great support for Node on Windows and Windows Azure. I also use some secondary services like MongoDB hosting (provided by the [MongoLab company](http://www.mongolab.com/)) and table/blob storage, and a nice thing of this infrastructure world is that I can move and migrate them as I please - it isn't all strongly coupled and is just a matter of identifying resources the right way and having the appropriate credentials available to my app, wherever it may live.

If I were to create my app from scratch today I might consider using the [Mobile Services](http://www.windowsazure.com/en-us/home/scenarios/mobile-services/) product that Windows Azure has, but I really enjoy the level of control I get with my own implemented Node app, and the experience of using the tools and techniques common in the cloud world today is really valuable to me. It is quite portable to any cloud as a result, too - it is just JavaScript code at the end of the day.

When hosted in the AWS cloud, I was using pure infrastructure services, and though I loved that level of control, keeping my VMs up-to-date just wasn't that fun. The huge benefit with this migration is that I've moved to the nice deployment model that Windows Azure Web Sites offers - reducing the complexity in scaling and provisioning new virtual machines.

Although not exactly the same as Web Sites, Amazon's Elastic Beanstalk product is pretty similar in some ways in terms of enabling a much better deployment model, FYI.

> The source code to my simple Node backend is open on GitHub at [https://github.com/jeffwilcox/4th-cloud](https://github.com/jeffwilcox/4th-cloud).

Creating a new Windows Azure Web Site
=====================================

From the management portal, creating a new web site is easy:

- Like anything else in Windows Azure, I just open up the "New" menu, pick Compute, and then Web Site.
- I'm hosting my own app and don't need a starting place, so Quick Create is the way to go.
- I provide the URL endpoint for the app
- I select the region I'd like the app hosted in
- I choose which Windows Azure subscription I would like to use for the service's billing.

![The Windows Azure management portal has an easy way to select New service, Compute, Web Site, to add a new site to a region and associate with a specific subscription.]({{ site.cdn }}4thwazblog/createWebSite.png =700x400 "Adding a new Web Site to Azure")

The Dashboard
-------------

Once the site is created, clicking on it in the portal will bring up its dashboard display where you can get deployment info, monitor data transfer and various instance and site metrics, plus perform configuration & administrative tasks.

Here's the 4th & Mayor dashboard showing a week of data - each day you can see clear ebb and flow.

![The portal dashboard view shows information about web endpoints, graphics and charts of recent data transfers, CPU use, and other metrics of interest.]({{ site.cdn }}4thwazblog/dashboard.png =700x411 "The dashboard view of a Windows Azure Web Sites app.")

Configuring the source code deployment mechanism
------------------------------------------------

To make the source control association for a site, from the dashboard, touch 'Set up deployment from source control' and make your selection. It will then let you setup credentials for Git or authenticate with services like CodePlex or GitHub.com.

There are many ways to deploy code to an Azure Web Site - each time I open the deployment set-up window I smile:

- Associating with Team Foundation Service
- Associating the site with a CodePlex project
- A GitHub private or public repo
- Your Dropbox
- Bitbucket Git/Mercurial repo
- Any external Git or Mercurial repo
- Push a local Git repo to the Web Site

![While setting up the deployment for a site, you can easily pick from a service like hosted Team Foundation Service, CodePlex, GitHub, Dropbox, Bitbucket, or a local Git repo on your machine.]({{ site.cdn }}4thwazblog/git.png =700x400 "Configuring a local git repo for site deployment.")

For my app, I'm using *Local Git repository* - I do some magic w.r.t. generating a JSON file with configuration information that I need to deploy in secret to the app, so I need to do this magic before pushing the site and service. This enables a good workflow for me, but for other web sites I host, I often just have them deployed straight from my source control.

So now, from a local repo, I can do a `git push azureproduction` or similar command to get my site updated in seconds. The first time you configure local Git deployment, the management portal will help you setup some credentials to pushing, fyi. There are a lot of nice tutorials out there that go into detail if you need.

Git deploying the service
-------------------------
Once configured, I setup the Git remotes inside my repo. The Azure portal should show you the command for this - but essentially you just issue a `git remote add` command to enable pushing to that endpoint.

When you push to the Git endpoint in the Azure cloud, a service called "Kudu" picks up the changes and redeploys the application. You can find out more about Kudu at [David Ebbo's blog](http://blog.davidebbo.com/2012/06/introducing-open-source-engine-behind.html) - he is the architect of that product.

When I push locally, the Git push command will echo back how the Web Site is being deployed. In this case, I see some useful information:

- It knows which branch I want deployed
- It recognizes that I am deploying a Node.js Web Site
- It updates and installs any needed npm packages
- It lets me know that the deployment is successful

![Using the standard Git command I am able to deploy my local code to the Windows Azure web site. Azure takes care then of making sure everything is setup for the Node.js application to be served live. The app experiences no downtime with the new deployment across all the reserved instances I have setup.]({{ site.cdn }}4thwazblog/deployedNodeApp.png =700x400 "Mac Terminal - Git deployment to a Web Site")

I can also view the status of my app's deployments from within the management experience online. Here is what it looks like during a deployment:

![While the Git deployment is in progress, you will see live status updates inside the portal. You can also revert to previous deployments in the portal if need be.]({{ site.cdn }}4thwazblog/deploying.png =700x400 "Watching an active deployment in the management portal.")

If something went wrong, the UI is available to help roll back to an earlier version in seconds, too.

Using the paid Reserved web site mode
-------------------------------------

The Free and Shared tiers of service for Windows Azure Web Sites are all great products; however, having a decent amount of traffic at times, I need to be able to scale and make sure that I have the right amount of resources available to my application. I'm using the Reserved web site mode which lets me actually associate a few complete virtual machine instances with all of my Web Sites in a region/subscription pair.

If you go to the "SCALE" tab in the management portal, you can scale your site to the Reserved mode, and even set the number and size of VM instances to use in the Reserved mode.

This lets me share my costs for dedicated VM hosting among all my web properties in a subscription, and also helps me make sure that my response times and available computing power are always there. My costs so far have been similar to those I had in AWS, though I have the benefit of being able to pool multiple sites on these instances, instead of before, when I would spin up a few EC2 instances and then have to pay for a load balancer (ELB) between the instances.

Load balancing is included at no additional cost with Windows Azure Web Sites and Cloud Services, which is great. Because of a workaround that I need to do for custom SSL today, however, I have similar costs as before since I am running a separate reverse proxy for encryption purposes. This cost will disappear once new functionality launches for web sites some day.

![All the Web Sites in the same region and with the same subscription will share the same virtual machine instances, load balancing across all instances.]({{ site.cdn }}4thwazblog/reservedSites.png =700x400 "Reserved Web Sites.")

When I go and view all my Web Sites now, I can check and see that the 'Mode' column clearly shows Reserved.

Scaling to multiple instances
-----------------------------

I prefer the standard Small instance types in Windows Azure right now - these are essentially single core VMs. Right now I'm using 3 small instances. Since "Small" is the default unit for billing in the Azure world, it also is pretty straightforward for me to understand where my cloud spend is going with these units.

Instance numbers for web sites is configured in the same area as the free/shared/reserved mode choice.

Just slide the Instance Count bar to the right to ramp up the instances.

![By moving to the Reserved web site model, all your Web Sites in a region under the same subscription can share the same deployed virtual machine instances.]({{ site.cdn }}4thwazblog/reservedScale.png =700x500 "Scaling your subscription's Web Sites to use a reserved model and set of instances of a specific size.")

Thanks to the underlying technical implementation of the Web Sites system, these scaling operations are often extremely quick and instantaneous - there are virtual machines standing by, more or less, for my scale.

Though I keep this pretty solid today, scaling down and up is a great way to keep costs at an appropriate level, and one of the primary cloud benefits for developers.

I get more traffic at night and weekends across the US (about half of my user base), and have thought about automating the scale up and down work on this schedule using the Windows Azure PowerShell or cross-platform command line tools for my Mac... but for now I am doing this by hand.

Setting environment variables, logging, etc.
--------------------------------------------

It is very easy to set environment variables that will be exposed to your application hosted via Web Sites. On the Configuration tab in the management portal, you can add key/value string pairs that will be exposed - and these can be changed on the fly, too.

A common configuration variable for Node.js apps is the `NODE_ENV` setting - when set to "production", the Express framework/module that exposes the web services & site will configure its error and diagnostics system in a way that will be efficient for production use.

Simply add the key/value pair in the UI in a blank space and then press the Save button in the bottom menu for the site. It should update all the running instances pretty quickly.

![Inside the Windows Azure management portal you can configure the app settings which become environment variables for the specific Web Site.]({{ site.cdn }}4thwazblog/productionNodeEnvironment.png =700x129 "Setting the NODE_ENV to production.")

My app also is designed to be run in one of 3 ways: dev, staging, and production; by setting a custom `MODE` environment variable, I then have the startup path for the app load the appropriate configuration file with cloud credentials and other data.

I actually have several Windows Azure Web Sites running for the app: the production app, a staging app, etc. Since they are all nearly mirrors of one another, it is very easy to use this configuration system to control the runtime environment.

Here you can see the configured values for my app in the management portal:

![My application looks for an environment variable named MODE that then tells it which configuration files to use. This lets me use the same exact application source for dev, staging, and production environments, without worrying too much about the specifics of implementing such a system.]({{ site.cdn }}4thwazblog/stagingMode.png =700x400 "Setting up an app-specific environment variable.")

For logging, my app uses a common log provider that many Node apps use, with a custom adapter I wrote that stores this information in the Windows Azure table service. More on that another day & post.

Endpoint monitoring
-------------------

There is a preview feature in Web Sites called Endpoint Monitoring that lets you pick a few test data centers and a URL to your application. The service then periodically pings your URL, records the response time (or error if it cannot connect), and makes this info available in the portal.

On the Configuration tab you just give the metric a name, URL, and pick a one or more locations and press Save.

![Endpoint monitoring is a preview feature available for both Cloud Services as well as Web Sites. It allows you to have data centers regularly check that your site is running and prove information on the response times for endpoints of interest.]({{ site.cdn }}4thwazblog/endpointMonitoring.png =700x190 "Configuring endpoint monitoring.")

This, combined with the built-in diagnostics information the Web Sites gathers and shows for all sites and no cost, is a really nice alternative to Amazon CloudWatch metrics I believe.

Hosted MongoDB
==============

I use MongoDB for storing a lot of information about push notifications and app users. Mongo has been a great experience for me, and is relatively inexpensive: I use a third-party shared MongoDB hosting provider, [MongoLab.com](http://www.mongolab.com/). Previously I had a paid product (about $40 a month) in the AWS US-East-1 region.

Windows Azure also has MongoLab and hosted Mongo support. MongoLab just makes things easy, you no longer have to worry about actually running the database (devops, etc.) and just use the connection info and let them manage the service.

In Windows Azure, the MongoLab hosting service is available free (for a 500MB max MongoDB shared instance) - yup - $0.00 per month. Awesome.

The Windows Azure Store is simple - just like creating any other service inside the management portal online, I just hit New, go to the Add-ons, and then find the MongoLab service.

![Adding a MongoDB shared instance through the service that MongoLab offers.]({{ site.cdn }}4thwazblog/mongoAddOn.png =700x457 "Adding a MongoLab add-on.")

You then get to provide a name for the service.

![Providing a name for the service.]({{ site.cdn }}4thwazblog/mongoPersonalize.png =700x456 "Naming the service.")

Once it is created (this took about 60 seconds for me when I recently tried), you highlight the service and the contextual toolbar at the bottom of the portal will update.

![The contextual menu for the store service, MongoLab. Connection Info reveals the connection string to connect to the MongoDB.]({{ site.cdn }}4thwazblog/mongoConnectionInfoToolbar.png =405x60 "The contextual menu for the store purchase.")

Just go ahead and hit Connection Info, and the connection string you will use is there. The connection is open to the web, so you can use the Mongo tools locally or from the cloud to copy and migrate, or backup, data.

![The connection string for the MongoLab shared MongoDB instance.]({{ site.cdn }}4thwazblog/mongoConnectionInfo.png =500x445 "Connection information for the store.")

So for my app, I just update my configuration JSON files and redeploy and boom, the free MongoDB instance is being used.

Web Sites + Custom SSL Certs
============================

Today (April 2013), the Windows Azure Web Sites product supports SSL, but not the kind that I need in order to be backwards compatible with my existing production deployment on Amazon that uses my own SSL certificates for the `www.4thandmayor.com` virtual machines.

Reading through previous posts about the Web Sites preview functionality, in time there will be support for SNI SSL, but this functionality is not available today.

The complete post on ()[http://www.bradygaster.com/running-ssl-with-windows-azure-web-sites] is a good reference and you should follow that. This is just a short summary.

For setting up the SSL reverse proxy with custom certificates I need to use my Windows workstation, Visual Studio 2012, and the Windows Azure SDK for Visual Studio. So, switching away from the Mac for this part.

SSL Certificates
----------------
Most web developers have been through this dance a few times - I've used Comodo and other reseller-friendly certificate services in the past through GoDaddy and NameCheap.

Most of the cheap certs are just fine and verify that you control the domain name in question. If you're looking for the fancy "green" security bar though, you'll need an EV cert and those typically actually have a much more involved verification process - for an LLC they will check records in D&B, perhaps require proof of a corporate bank account, look for legal documentation or business licenses, etc. So this isn't about that process.

### Creating a signing request

When you get a signing certificate, you never have to transmit the private key to the certificate authority - instead, you just send a .CSR file - a signing request.

To generate this, just use OpenSSL.

For 4th & Mayor, I moved this year from a standard certificate (for www.4thandmayor.com) to a wildcard certificate (`*.4thandmayor.com`, includes any subdomain) - this allows me to secure endpoints like `api.4thandmayor.com` and `staging.4thandmayor.com` as well. The wildcard cert did cost about $100 more for a year.

Don't forget to renew and keep your deployed certs up-to-date ;-)

> Fun Windows trick: if you have the Git Bash installed, just run it - `openssl` is available in the command prompt.

So from a command prompt:

<pre class="brush: bash">
$ openssl req -nodes -newkey rsa:2048 -nodes -keyout 4thandmayor-wildcard.key -out 4thandmayor-wildcard.csr -subj "/C=US/ST=Washington/L=Seattle/O=Wilcox Digital, LLC/OU=Corporate/CN=*.4thandmayor.com"
</pre>

It will then generate and save the `.key` file - save that - it is your private key - keep it safe, like Frodo.

<pre class="brush: bash">
Generating a 2048 bit RSA private key
..................................................................+++
.......................................+++
writing new private key to '4thandmayor-wildcard.key'
</pre>

![Providing the certificate signing request.]({{ site.cdn }}4thwazblog/csrRequest.png =700x490 "Submitting the CSR request online to the certificate authority.")

At this point you'll just wait for the verification process and then be able to download the certificate and any needed intermediate chain to then install on your web servers or your cloud service.

![The process according to the CSR reseller web site.]({{ site.cdn }}4thwazblog/csrSummary.png =700x490 "A summary according to the CSR reseller w.r.t. the process.")

As I was making the request on my Mac (Windows may be different), I need to generate a .PFX file which contains the private key, certificate, any intermediate certs, and optionally a password to protect it all. Since my "EssentialSSL" branded certificate is actually built on the trust of a few intermediate Certificate Authorities and resellers, you need the full chain to effectively validate the cert in the end.

### Creating a PFX/xxxxx

I munge these things using OpenSSL. Note that these are the commands I used, but every CA is going to be a little different.

Step One: combine all the intermediate chain certs into an intermediate file (these are all just text files, BTW)

`$ cat AddTrustExternalCARoot.crt UTNAddTrustSGCCA.crt ComodoUTNSGCCA.crt EssentialSSLCA_2.crt > intermediates.crt`

Next, to export the PFX file (actually PKCS12 format)... it will prompt you for a password, too.

`$ openssl pkcs12 -export -in 4thandmayor-wildcard.crt -inkey 4thandmayor-wildcard.key -certfile intermediates.crt -out 4thandmayor-wildcard.pfx`

Keep this file safe. Super safe. It has your private key, certificate, and everything in it. You'll upload it to Windows Azure soon.

Cloud Service
-------------
![Publishing a cloud service to Windows Azure.]({{ site.cdn }}4thwazblog/vsPublish.png =700x469 "The Publish dialog for Cloud Services in Visual Studio.")

![Configuring the cloud service by providing information about the certificate chain.]({{ site.cdn }}4thwazblog/vsCscfg.png =700x240 "A look at the CSCFG configuration for the cloud service.")

![Setting up the redirection options in the web.config that the redirection service uses.]({{ site.cdn }}4thwazblog/vsWebConfig.png =700x523 "The web.config file for the reverse proxy.")

![Uploading a certificate in the Azure management portal.]({{ site.cdn }}4thwazblog/cloudServicesUploadCertificate.png =496x348 "Uploading a certificate in the Azure management portal.")

![Viewing the certificates associated with a cloud service. This includes the certificate chain with intermediate certs.]({{ site.cdn }}4thwazblog/cloudServicesCertificates.png =700x229 "Viewing the certificates associated with a cloud service.")

![By scaling a cloud service beyond a single instance, I can be sure that my cloud service complies with the requirements to receive very high uptime in the Windows Azure cloud.]({{ site.cdn }}4thwazblog/scaleCloudService.png =700x264 "Scaling a Cloud Service.")


DNS
===

I actually had the application deployed both on Amazon and Microsoft's clouds using DNS round robin for a while, helping me make sure that I had a high level of confidence in the fault tolerance of my application.


Flipping DNS is all that is left.

![My DNS, hosted by Route 53, allows me to setup CNAMEs to direct traffic to cloud services or web sites as appropriate.]({{ site.cdn }}4thwazblog/route53.png =700x400 "Configuring Route 53 DNS.")

Here we go!

![A screen capture of the web browser showing the key icon and graphics to show that the site has been served in a secure manner.]({{ site.cdn }}4thwazblog/4thandmayorSsl.png =700x100 "4thandmayor.com with SSL, site hosted by Windows Azure")

The Future
==========

I keep hearing that someday we will have SNI SSL support in Windows Azure. That will make the second half of this post on "Web Sites + Custom SSL Certs" completely unncessary, and also this solution will be a lot more affordable: the need to host your own set of cloud services reverse proxies will no longer be there.

Can't wait for that! In the meantime, if custom SSL + Web Sites was holding you back, I hope with this post and/or (Brady Gaster's)[http://www.bradygaster.com/running-ssl-with-windows-azure-web-sites], you will have the information you need to get unblocked.
