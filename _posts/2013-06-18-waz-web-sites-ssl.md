---
layout: post
comments: true
title: Windows Azure Web Sites + custom SSL certificate for my app
categories: [windows-azure, cloud, nodejs, 4thandmayor]
tags: [windows-azure, 4thandmayor, nodejs, cloud, express, websites]
---
To start June 2013 off, [Windows Azure Web Sites](http://www.windowsazure.com/en-us/manage/services/web-sites/) released in preview form custom SSL hosting options for Windows Azure Web Sites.

Last night I flipped the switch (CNAME DNS updated) to redirect traffic directly to my Azure Web Site vs using a reverse proxy solution I had in production use before. Things are working great and later today I will spin down and delete the cloud service that was providing the SSL capability for me in the past.

The [https://www.4thandmayor.com/](https://www.4thandmayor.com/) secure site and underlying web services are now being hosted by Azure Web Sites with my custom certificate.

![Querying DNS for my site's CNAME.]({{ site.cdn }}4thsnissl/AddressLookup.png =700x530 "Querying DNS for my site's CNAME.")

Previously, the CNAME resolved to `4thssl.cloudapp.net`, a Cloud Service Web Role that I was running that sat between clients and my Azure Web Site.

In the spirit of showing how much easier things are now, I wanted to show the certificate upload process, describe some differences and options, and then follow with general information about how I host my site on Azure today.

Note that SSL bindings require the paid Web Sites options. For 4th & Mayor and its app traffic of hundreds of thousands of mobile phones, I'm using multiple Small reserved instances.

# A great value

This change has a financial impact on my mobile application as I'll be able to cut out the 2-instance Small (A1) Cloud Service deployment that was costing me $60 per instance x 2 = $120 US per month in base compute cost on top of the standard Web Sites costs.

Removing the workaround is a solid win for me and I believe Azure is providing a very good value with its custom SSL service, especially when I compare it to the former costs I had on Amazon with ELB.

I'm going to be using SNI SSL support with Web Sites which currently costs $6/month (this price includes a 33% preview discount) as of 6/18/13. So my savings now will be $112 per month or $1,344 yearly.

When I was using Amazon Web Services with multiple EC2 instances and an elastic load balancer (I had the load balancer do the SSL work with my custom certificate), the load balancer cost me $18/month plus data transfer - a clear win over the Cloud Service workaround, but also a comparable value to the SNI SSL pricing. In general Windows Azure provides load balancing for free as a valuable service on top of the underlying cloud or web site services.

My custom SSL wildcard certificate runs me about $199/year, so ~$17 per month. This is through a 3rd party SSL reseller service.

# SSL support in Windows Azure Web Sites

Basic SSL is available at no cost with Azure Web Sites, but custom certificates (in preview form) are an additional cost. Custom SSL certs were not available prior to 6/2013 without going through workarounds such as reverse proxies.

## Free built-in Microsoft certificate and SSL

You can offer a secure connection between your Web Site and your customers today: Microsoft produces a wildcard `*.azurewebsites.net` certificate and built-in SSL server support. This is often enough for a secure application on the simple scale, mobile apps, or web services.

However clearly providing a custom SSL certificate is a professional feature for a professional web presence, application or corporate deployment. Let's look at these options that are in preview form as of mid-June.

## Uploading my custom SSL certificate *.4thandmayor.com

The [Windows Azure Management Portal](https://manage.windowsazure.com/) now exposes SSL certificates within the 'Configure' tab for your web sites.

![The Configure tab in the Windows Azure portal.]({{ site.cdn }}4thsnissl/ConfigureTab.png =700x137 "The Configure tab in the Windows Azure portal.")

From the Configure tab you can set properties such as environment variables, associated domain names, connection strings, .NET and PHP runtime versions, etc.

Under the new "certificates" section you first off need to upload a passcode-protected PFX certificate (PKCS12 package). Select the "Upload a certificate" option, find the file on your machine, and then provide the passcode.

![Uploading a PFX PKCS12 certificate.]({{ site.cdn }}4thsnissl/UploadCertificate.png =552x393 "Uploading a PFX PKCS12 certificate.")

If you're new to this process, you can follow my previous post about [SSL certificates in general](http://www.jeff.wilcox.name/2013/04/4thandmayor-azure-websites/) when it comes to the CSR, creating the PFX file, etc.

Once uploaded, you should see the certificate appear along with its thumbprint and other information.

![Viewing uploaded certificates.]({{ site.cdn }}4thsnissl/UploadedCertificates.png =700x141 "Viewing uploaded certificates.")

Once the certificate is uploaded there's still a few more things to do:

* Make sure the custom domain name is setup and authorized
* Setup an SSL binding for the Web Site

## Domain names

Make sure that your domain name is setup for the Web Site. In the Configure tab this is done with the "Manage Domains" button. You may need to create CNAME or other verification DNS entries for this to work properly and prove that you control the domain.

This is pretty easy and just involves your DNS provider.

## Looking at pricing and technical implementation options

Two options exist in preview form for Web Sites right now. You can find current pricing information on the Windows Azure site at [http://www.windowsazure.com/en-us/pricing/details/web-sites/](http://www.windowsazure.com/en-us/pricing/details/web-sites/) under the "SSL Connections" tab.

There is currently a preview pricing discount of 33% as of 6/18/2013. Reproducing this list here:

<table class="table">
<thead>
	<tr><th>Technology</th>
	<th>Preview Price</th>
	<th>Compatibility</th>
	</tr>
</thead>
<tbody>
<tr>
	<td>*.azurewebsites.net SSL</td>
	<td>Free</td>
	<td></td>
</tr>
<tr>
	<td>SNI SSL</td>
	<td>$6/month per certificate</td>
	<td>Modern browsers</td>
</tr>
<tr>
	<td>IP SSL</td>
	<td>$26/month per cert</td>
	<td>All browsers</td>
</tr>
</tbody>
</table>

Briefly let's go over what SNI is: yes, more affordable and modern, but why?

### About SSL Server Name Indication (SNI)

Per [Wikipedia's page about SNI](http://en.wikipedia.org/wiki/Server_Name_Indication), Server Name Indication (SNI) is effectively the protocol-level support for secure server certificate exchange for virtual hosts and servers. It is to SSL what HTTP 1.1 was for basic HTTP traffic: an excellent enabler.

It is well-supported today in a variety of modern browser and operating system implementations but SNI is not universal.

SNI helps effectively reduce the price and implementation complexity of SSL because you no longer need dedicated virtual IPs (VIPs) per host name that is being served by a web server, load balancer, or other infrastructure component - these components can instead implement their SSL by performing a certificate lookup and then presenting that custom cert as part of the TLS handshake for that web site.

#### SNI: Browser/server/stack compat

You can read up on the support notes of [Wikipedia for SNI](http://en.wikipedia.org/wiki/Server_Name_Indication) but the basics go like this. Do your own testing and research before you commit to your technical SSL implementation choice, of course.

For 4th & Mayor, I have decided that SNI SSL is perfect: my application targets Windows Phone, which supports SNI SSL; I also expose some management functionality through the web site, and for this, I'm expecting modern browsers only. The value is good for my business needs.

Supported:

* IE7 and newer on Windows Vista, Windows 7, Windows 8 and newer
* Firefox 2.0 and newer
* Google Chrome
* Safari 3.0 and newer (OS X 10.5.6, Vista)
* Android default browser on Honeycomb (v3.x+)
* Windows Phone
* Pretty much all modern servers and libraries

Not supported per Wikipedia on 6/18/13:

* IE, Safari on Windows XP
* Python 2.x
* BlackBerry browser
* Windows Mobile (pre-Windows Phone devices)
* Android <= 2.0
* wget before 1.14
* Java before 1.7
* Some Symbian OS do not have support

## Creating SSL Bindings

In the Configure tab for the Web Site, you can configure bindings for the paid SSL options. The free shared certificate for yoursitename.azurewebsites.net just works without a need for any configuration, fyi.

When creating a binding, you create a new entry and pick the underlying SSL technology option. I'm using SNI SSL:

![Selecting the technical SSL implementation option.]({{ site.cdn }}4thsnissl/SNI_or_IP.png =226x144 "Selecting the technical SSL implementation option.")

Finally you select the certificate, associated domain name, etc.

![Preparing SSL bindings]({{ site.cdn }}4thsnissl/SSLBindings.png =700x121 "Preparing SSL bindings")

This change should be fairly quick, just hit the Save button in the toolbar.

You should now be live on the hosting side.

## Updating DNS

Finally you need to update your DNS entries using CNAMEs to redirect your www (or other custom domain) traffic to the site - in my example this is `4th.azurewebsites.net`.

Before updating DNS, I tested by updates my machine's local `/etc/hosts` file (or `%SystemRoot%\System32\Drivers\Etc\LMHOSTS` on Windows) to redirect `www.4thandmayor.com` to the new `4th.azurewebsites.net` name.

This allowed me to use my browser to navigate to the HTTPS endpoint and make sure everything looked OK, certificate was being resolved properly, the cert chain was present, etc.

Once I was happy, I updated my DNS CNAME entry, initially with a short 60 second TTL setting - and since then I have now popped that up to a multiple-hour TTL since things are working great.

# Background

For more than a year the cloud backend for my mobile application, 4th & Mayor, has been powered by Node.js, a powerful server-side JavaScript framework.

In the past I hosted this in the Amazon cloud, but during the month of April 2013, I worked to start moving it over to Windows Azure and have been very happy with the results. Full disclosure, I work on the team!

Windows Azure Web Sites is a really powerful hosting environment that lets me pay for reserved computing power with an easy deployment model (just Git pushes of Node.js JS source files). It is a lot easier than standing up my own EC2 or Azure VM instances, configuring software, `yum install`s, etc.

My earlier workaround is detailed here: [http://www.jeff.wilcox.name/2013/04/4thandmayor-azure-websites/](http://www.jeff.wilcox.name/2013/04/4thandmayor-azure-websites/)

Hope this all helps. Happy secure web hosting!