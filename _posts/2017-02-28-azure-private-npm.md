---
layout: post
comments: true
title: "Deploying Node.js apps in Azure App Service using private npm feeds from Visual Studio Team Services"
categories: [azure, cloud, open-source, vsts, node]
tags: [azure, cloud, npm, vsts, node, nodejs, keyvault, deployment]
---
In this post I'm going to walk through using Visual Studio Team Services Package Management as a private npm
registry for scoped npm packages using a simple custom deployment script alongside Azure App
Service. I'll also show how my team is able to use this with Azure KeyVault at deployment time.

Many Node.js developers are probably familiar with npm private feeds, but may not have
put them all together on the Microsoft Cloud stack. I wanted to share the experience that
I have had, since my team is running a ton of small-to-medium Node.js services within Microsoft
built on this great tech stack and Azure.

<img src="{{ site.cdn }}vstsnpm/vsts-new-package.PNG" class="img-responsive" />

Let's get started.

# Private NPM modules

Node.js developers know that there's an npm module for nearly everything, but it turns
out that sometimes you need to host your own private npm registry to store private code
that is specific to your organization, policies and business rules, or otherwise shared
amongst your code.

## Scoped vs X

x

## Paid NPM

x

## Configuring your Node environment

x

# VSTS Package Management

First, an intro to Visual Studio Team Services (VSTS): VSTS (visualstudio.com) is a set of
Microsoft services for engineers to share code, track work, ship software, etc. It is
cloud-scale, offers private source code hosting of Git repositories, and is free for up to
5 users.

## Adding the Package Management extension

x

<img src="{{ site.cdn }}vstsnpm/extensions-menu.PNG" class="img-responsive" />

<img src="{{ site.cdn }}vstsnpm/extensions-marketplace.PNG" class="img-responsive" />

<img src="{{ site.cdn }}vstsnpm/vsts-package-management.PNG" class="img-responsive" />

<img src="{{ site.cdn }}vstsnpm/vsts-buy.PNG" class="img-responsive" />

<img src="{{ site.cdn }}vstsnpm/vsts-buy2.PNG" class="img-responsive" />


## Creating a new private feed

x



<img src="{{ site.cdn }}vstsnpm/vsts-new-package.PNG" class="img-responsive" />

<img src="{{ site.cdn }}vstsnpm/create-new-feed.png" class="img-responsive" />

<img src="{{ site.cdn }}vstsnpm/private-feed-ready.PNG" class="img-responsive" />

## Generating an access token

x

<img src="{{ site.cdn }}vstsnpm/connect-to-feed.png" class="img-responsive" />

<img src="{{ site.cdn }}vstsnpm/connect-to-feed-non-windows.png" class="img-responsive" />

Note - service account ?

## Configuring your development environment

x

<img src="{{ site.cdn }}vstsnpm/npm-config-output.PNG" class="img-responsive" />

## Publishing a private npm

x

<img src="{{ site.cdn }}vstsnpm/npm-publish-private.PNG" class="img-responsive" />

<img src="{{ site.cdn }}vstsnpm/private-npm-feed-after-publish.PNG" class="img-responsive" />

## Using the module with your app

<img src="{{ site.cdn }}vstsnpm/npm-install-save.PNG" class="img-responsive" />

<img src="{{ site.cdn }}vstsnpm/npm-install.PNG" class="img-responsive" />

# Using with Azure App Service

x



## Deploying your app

x

<img src="{{ site.cdn }}vstsnpm/express-app-with-private-package.png" class="img-responsive" />

## Deployment scripts

x

### Automatic Kudu deployment script

x

<img src="{{ site.cdn }}vstsnpm/npm-push-fail.PNG" class="img-responsive" />


### Custom deployment scripts

x

## Configuring private feed settings

x

<img src="{{ site.cdn }}vstsnpm/private-npm-config.PNG" class="img-responsive" />

## Publishing with custom deployment

<img src="{{ site.cdn }}vstsnpm/deployment-success-1.png" class="img-responsive" />

<img src="{{ site.cdn }}vstsnpm/deployment-success-2.png" class="img-responsive" />

## Success!

x

<img src="{{ site.cdn }}vstsnpm/edge-private-npm-package.png" class="img-responsive" />

# Azure KeyVault

x

## Supporting secret rotation

x

## Setting secrets in the portal

x

<img src="{{ site.cdn }}vstsnpm/portal-keyvault-private-npm.PNG" class="img-responsive" />

<img src="{{ site.cdn }}vstsnpm/keyvault-secrets-list.PNG" class="img-responsive" />

<img src="{{ site.cdn }}vstsnpm/keyvault-secret-configuration.PNG" class="img-responsive" />

## Setting secrets elsewhere

x

<img src="{{ site.cdn }}vstsnpm/vault-npmjs-token.PNG" class="img-responsive" />

<img src="{{ site.cdn }}vstsnpm/vault-with-npmjs-tokens.PNG" class="img-responsive" />

<img src="{{ site.cdn }}vstsnpm/keyvault-configuration-as-code-with-private-feed.PNG" class="img-responsive" />

## Tied to app identity

x

## Configuring the App Service

x

# Open source

x

# Closing

