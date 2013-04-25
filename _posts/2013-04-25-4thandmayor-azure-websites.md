---
layout: post
comments: true
title: Moving 4th & Mayor to Windows Azure Web Sites
categories: [windows-azure, cloud, nodejs, 4thandmayor]
tags: [windows-azure, 4thandmayor, nodejs, cloud, express, websites]
---
After several years of hosting the production web services and web site for my foursquare application (4th & Mayor)[https://www.4thandmayor.com/]) with AWS, last month I finally was able to spend a little time to migrate most of the service over to Windows Azure. It has been several weeks and production traffic continues to do well, with no downtime. I'm hosting the core set of services using Windows Azure Web Sites

 I wanted to write a little about the migration, mostly as an introduction to the Web Sites product that is in preview mode over in the Microsoft cloud world.

Thanks to the magic of DNS, I actually had the application deployed both on Amazon and Microsoft's clouds using DNS round robin for a while, helping me make sure that I had a high level of confidence in the fault tolerance of my application. Fun stuff.

SSL FTW
=======

My application makes connections to the cloud to work with API surface area that I expose for live tiles, push notification registration, and other services. I need these requests to be secured with HTTPS to protect information like push channel URIs, potential customer data, and other situations.

I'd also like to be able to expose functionality on my web site for the app's marketing and users to do their own diagnostics work. This should also support SSL. Everything should be SSL today!

![A screen capture of the web browser showing the key icon and graphics to show that the site has been served in a secure manner.]({{ site.cdn }}4thwazblog/4thandmayorSsl.png =700x100 "4thandmayor.com with SSL, site hosted by Windows Azure")

Here's the kicker: Web Sites supports SSL using Microsoft's wildcard certs for `*.azurewebsites.net` - this is great and completely secure for a ton of applications today. In time, the service will support custom certificates for Web Sites.

Brady Gaster has a really good solution for the interim here: (Running SSL with Windows Azure Web Sites Today)[http://www.bradygaster.com/running-ssl-with-windows-azure-web-sites] - this is what I have gone with, and though it is a little scary for about 5 minutes when you first read about this solution, it was pretty darn easy to setup and it has completely unblocked me.

Production (4th & Mayor)[https://www.4thandmayor.com/] app and site traffic today is using SSL to communicate with the awesome Git-deployed goodness of (Windows Azure Web Sites)[http://www.windowsazure.com/en-us/home/scenarios/web-sites/]. Yes. Winning!

Now let's talk about the background a little more before jumping into the "how".

The background: my Node.js app
==============================

Implemented in Node.js, the web services and site for the app are super portable as a result: thanks to the nice Node.js support in Windows Azure, the actual application was easy to move with very little changes. I also use some secondary services like MongoDB hosting (provided by the MongoLab guys) and table/blob storage, and a nice thing of this infrastructure world is that I can move and migrate them as I please - it isn't all strongly coupled and is just a matter of identifying resources the right way and having the appropriate credentials available to my app, wherever it may live.

I was using pure infrastructure services with AWS, and though I loved that level of control, with this migration I've moved to the nice deployment model that Azure Web Sites offers - reducing the complexity in scaling and provisioning new virtual machines as I used to do in AWS. Although not exactly the same, Amazon's Elastic Beanstalk product is pretty similar in some ways, FYI.

> Full disclosure: I'm a development lead on the Windows Azure team and looked to this exercise to learn more about the tools, products and services that we offer. My application is a member of the most excellent [Microsoft BizSpark program](http://www.microsoft.com/bizspark/) which offers a nice set of free cloud services for the time being, helping me to control my app's CapEx.

New Web Site...
===============

![The Windows Azure management portal has an easy way to select New service, Compute, Web Site, to add a new site to a region and associate with a specific subscription.]({{ site.cdn }}4thwazblog/createWebSite.png =700x400 "Adding a new Web Site to Azure")

![The portal dashboard view shows information about web endpoints, graphics and charts of recent data transfers, CPU use, and other metrics of interest.]({{ site.cdn }}4thwazblog/dashboard.png =700x411 "The dashboard view of a Windows Azure Web Sites app.")

![Using the standard Git command I am able to deploy my local code to the Windows Azure web site. Azure takes care then of making sure everything is setup for the Node.js application to be served live. The app experiences no downtime with the new deployment across all the reserved instances I have setup.]({{ site.cdn }}4thwazblog/deployedNodeApp.png =700x400 "Mac Terminal - Git deployment to a Web Site")

![While the Git deployment is in progress, you will see live status updates inside the portal. You can also revert to previous deployments in the portal if need be.]({{ site.cdn }}4thwazblog/deploying.png =700x400 "Watching an active deployment in the management portal.")

![Endpoint monitoring is a preview feature available for both Cloud Services as well as Web Sites. It allows you to have data centers regularly check that your site is running and prove information on the response times for endpoints of interest.]({{ site.cdn }}4thwazblog/endpointMonitoring.png =700x190 "Configuring endpoint monitoring.")

![While setting up the deployment for a site, you can easily pick from a service like hosted Team Foundation Service, CodePlex, GitHub, Dropbox, Bitbucket, or a local Git repo on your machine.]({{ site.cdn }}4thwazblog/git.png =700x400 "Configuring a local git repo for site deployment.")

![Inside the Windows Azure management portal you can configure the app settings which become environment variables for the specific Web Site.]({{ site.cdn }}4thwazblog/productionNodeEnvironment.png =700x129 "Setting the NODE_ENV to production.")

![By moving to the Reserved web site model, all your Web Sites in a region under the same subscription can share the same deployed virtual machine instances.]({{ site.cdn }}4thwazblog/reservedScale.png =700x500 "Scaling your subscription's Web Sites to use a reserved model and set of instances of a specific size.")

![All the Web Sites in the same region and with the same subscription will share the same virtual machine instances, load balancing across all instances.]({{ site.cdn }}4thwazblog/reservedSites.png =700x400 "Reserved Web Sites.")

![By scaling a cloud service beyond a single instance, I can be sure that my cloud service complies with the requirements to receive very high uptime in the Windows Azure cloud.]({{ site.cdn }}4thwazblog/scaleCloudService.png =700x264 "Scaling a Cloud Service.")

![My application looks for an environment variable named MODE that then tells it which configuration files to use. This lets me use the same exact application source for dev, staging, and production environments, without worrying too much about the specifics of implementing such a system.]({{ site.cdn }}4thwazblog/stagingMode.png =700x400 "Setting up an app-specific environment variable.")

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

`$ openssl req -nodes -newkey rsa:2048 -nodes -keyout 4thandmayor-wildcard.key -out 4thandmayor-wildcard.csr -subj "/C=US/ST=Washington/L=Seattle/O=Wilcox Digital, LLC/OU=Corporate/CN=*.4thandmayor.com"`

It will then generate and save the `.key` file - save that - it is your private key - keep it safe, like Frodo.

```
Generating a 2048 bit RSA private key
..................................................................+++
.......................................+++
writing new private key to '4thandmayor-wildcard.key'
```

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

DNS
===

Flipping DNS is all that is left.

![My DNS, hosted by Route 53, allows me to setup CNAMEs to direct traffic to cloud services or web sites as appropriate.]({{ site.cdn }}4thwazblog/route53.png =700x400 "Configuring Route 53 DNS.")

Here we go!

![A screen capture of the web browser showing the key icon and graphics to show that the site has been served in a secure manner.]({{ site.cdn }}4thwazblog/4thandmayorSsl.png =700x100 "4thandmayor.com with SSL, site hosted by Windows Azure")

The Future
==========

I keep hearing that someday we will have SNI SSL support in Windows Azure. That will make the second half of this post on "Web Sites + Custom SSL Certs" completely unncessary, and also this solution will be a lot more affordable: the need to host your own set of cloud services reverse proxies will no longer be there.

Can't wait for that! In the meantime, if custom SSL + Web Sites was holding you back, I hope with this post and/or (Brady Gaster's)[http://www.bradygaster.com/running-ssl-with-windows-azure-web-sites], you will have the information you need to get unblocked.
