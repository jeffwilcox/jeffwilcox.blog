---
layout: post
comments: true
title: "Deploying Node.js apps in Azure App Service using private npm feeds from Visual Studio Team Services"
categories: [azure, cloud, open-source, vsts, node]
tags: [azure, cloud, npm, vsts, node, nodejs, keyvault, deployment]
---
In this post I'm going to walk through using Visual Studio Team Services Package Management as a private npm
registry for scoped npm packages using a custom deployment script for Azure App
Service.

Many Node.js developers are probably familiar with npm private feeds but may not have
used them yet in the Microsoft Cloud + Node.js stack. I wanted to share the experience that
I have had: my team is running a ton of small-to-medium Node.js services within Microsoft
and we're eager to share our experiences for the good of the community.

I'll also show how my team is able to use Azure KeyVault at deployment time to
enable credential rotation without having to manage secrets at the individual app level.

<img src="{{ site.cdn }}vstsnpm/vsts-new-package.PNG" class="img-responsive" title="The VSTS Package Management site" />

_While this is a long post in explanation and detail, someone using App Service for their Node.js
deployments today should be able to connect to a private npm feed in about 15-30 minutes if they have
not yet adopted a custom deployment script. Of course KeyVault and other aspects could add time._

Let's get started.

# Private NPM modules

Node.js developers know that "there's an npm module for nearly everything", but it turns
out that sometimes you need to host your own private npm registry to store [private modules](https://docs.npmjs.com/private-modules/intro)
specific to your organization, policies or business rules, or to share custom code
amongst your internal projects.

Common scenarios include corporate-specific Express middleware, private business
logic plugins to open source systems, supporting configuration-as-code,
and getting an npm module ready to ship to the world ahead of release.

## Scoped packages

When looking to use private npm registries, you'll need to decide whether you
intend for the private npm registry to be the "primary" registry for all packages,
including popular packages you would otherwise get from the public registry -
`express`, `moment`, etc. - or if you want to use scoping.

[Scopes are built into npm](https://docs.npmjs.com/misc/scope) and are the only native
way to support multiple registries. You can configure npm to visit a specific registry for a
given scope instead of the global registry.

A downside to using scopes is that modules intending to go public will cause some churn in `package.json` files. A
private npm that uses a scope today but ships to the world tomorrow will likely lose or change its scope, requiring
you to edit your various package and source files.

For this post I'm using a custom `@jeffwilcox` scope; within the Open Source Programs Office
at Microsoft we use the `@ospo` scope, since that's the short name we use for our team.

Scopes are not unique to private repos. For example, the `@microsoft` scope is for
Microsoft open source npm modules that are shipping to the world.

## Paid NPMJS

The official NPMJS registry sells private npm registry feeds for [$7/user/mo. or so](https://www.npmjs.com/pricing) and
this may be sufficient for many users.

However, those using Visual Studio Team Services may want to use the great
package management integration and private feed support available in that product. On our
team we like that the private NPM feeds live alongside our source code in
VSTS, are contained, and the existing permission settings we use for the team just
work with the private feed.

## Configuring your scoped npm environment

To enable private npm use you'll need to login to npm (for the official private npm feed support) or
configure your Node environment to use a specific credential or credential helper (i.e. `.npmrc` file
customizations).

```
npm config set @YOUR_SCOPE:always-auth true
npm config set @YOUR_SCOPE:registry REGISTRY_URL_HERE
```

If you didn't want to use scoping but were replacing the entire npm environment, you would leave
off the scope part of the commands.

For VSTS Package Management users on Windows, there is also a credential helper, but for the
deployment-focused purposes of this post, I am skipping that detail.

### Deployment environment

On a deployment or CI server, you will often need to commit a `.npmrc` file directly into
your environment; while that is out of scope for this post, do note that such files can
use environment variable replacement:

```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

For this guide, I'm going to use a custom script to customize the Azure App Service
environment at deployment time to handle other scenarios including KeyVault. If you are
interested in simple CI/CD environments you can [read about the scenarios at npmjs.com](https://docs.npmjs.com/private-modules/ci-server-config).

The custom script for this post is called [configure-azure-appservice-private-npm-feed](https://github.com/Microsoft/configure-azure-appservice-private-npm-feed). Very exciting name.

# VSTS Package Management

Visual Studio Team Services (VSTS), located at visualstudio.com, is a set of
clcoud-scale hosted Microsoft services for engineers to share code, track work, ship software, etc.
VSTS is fast, easy, and offers private source code hosting of Git repositories free for up to 5 users.

Package Management is a VSTS add-on, available as an extension that can be licensed,
and today it provides both NuGet and npm private feed/registry hosting capabilities. Your VSTS
administrator needs to install the extension and make it available to you.

## Adding the Package Management extension

VSTS administrators have an "extensions" menu under the project-wide settings.

<img src="{{ site.cdn }}vstsnpm/extensions-menu.PNG" class="img-responsive" />

From the extensions page, you can then browse the VSTS extensions marketplace.

<img src="{{ site.cdn }}vstsnpm/extensions-marketplace.PNG" class="img-responsive" />

Package Management is a key extension, you should be able to quickly locate it on one of the main pages
of the VSTS extensions marketplace.

<img src="{{ site.cdn }}vstsnpm/vsts-package-management.PNG" class="img-responsive" />

On the Package Management extension info page you can learn plenty more, but we are just interested in the "buy" button.
You can also start a 30-day trial easily.

<img src="{{ site.cdn }}vstsnpm/vsts-buy.PNG" class="img-responsive" />

The process will confirm your Azure subscription as part of the licensing process. It took me about 20 seconds to install.

<img src="{{ site.cdn }}vstsnpm/vsts-buy2.PNG" class="img-responsive" />

After installation, the _Build & Release_ menus within the project will light up with the new _Packages_ extension. Let's go there now.

## Creating a new private feed

From a project's _Packages_ extension, you'll find a mail delivery person character if you do not yet have any feeds.
Select "New feed".

<img src="{{ site.cdn }}vstsnpm/vsts-new-package.PNG" class="img-responsive" />

You can then configure the feed:

- The name for the feed
- Whether it will be open to your entire team, including who can publish to the feed
- Whether to include upstream sources (only select this if you are intending to completely replace the npm registy)

<img src="{{ site.cdn }}vstsnpm/create-new-feed.png" class="img-responsive" />

Now we're ready to go! We just need credentials to authorize our local NPM environment to be able to publish packages to the private feed hosted by VSTS.

<img src="{{ site.cdn }}vstsnpm/private-feed-ready.PNG" class="img-responsive" />

## Generating an access token

From the private feed's page within the _Packages_ extension, select "Connect to feed". This
screen will share the basic `.npmrc` configuration settings that you will need to get to the
feed:

- The registry URL
- The `always-auth` flag that should be true for private feeds

<img src="{{ site.cdn }}vstsnpm/connect-to-feed.png" class="img-responsive" />

While there's a command for Windows users to install the credential helper, `vsts-npm-auth`,
for this blog post I'm just going to use the non-Windows token. Part of the reason - I use a
MacBook Pro most of the day, so I'm going to need that token - but we'll also save it to use
with our deployment environment (though in a real prod scenario you will want to use a service
account to probably generate such a token).

Select "Generate npm credentials" to get the non-Windows token.

<img src="{{ site.cdn }}vstsnpm/connect-to-feed-non-windows.png" class="img-responsive" />

Make sure to safely and securely store the token from the generated `.npmrc` file. I
stored my token inside Azure KeyVault, since that is eventually where I will be grabbing
this token from in a more advanced, automated scenario.

## Configuring your development environment

If you are configuring for scoped private npm packages, here are the commands you will
want to enter.

First, follow the instructions from the token generation to update your `.npmrc` file with
the token for your private registry.

Second, configure the user-global environment using `npm` (though you could also just edit the same rc):

```
$ npm config set @jeffwilcox:always-auth true
$ npm config set @jeffwilcox:registry https://jeffwilcox.pkgs.visualstudio.com/_packaging/PrivateTeamFeed/registry
```

While you can confirm your settings with `npm config list`, note that private feed tokens will _not_ be shown
in this view:

<img src="{{ site.cdn }}vstsnpm/npm-config-output.PNG" class="img-responsive" />

## Publishing a private npm

It's time to ship some private code!

I've created a super simple npm module: a function that will return a string value when called to "prove" that it
came from the module. After creating this `index.js` file, I run `npm init` to create a new `package.json` file
in the folder, give the component a name and version, etc.

Include the scope in the name; in my case this means my package name is `@jeffwilcox/private-npm-package`. Here's my
`package.json` file:

```
{
  "name": "@jeffwilcox/private-npm-package",
  "version": "1.0.0",
  "description": "This is the best 1.0 package release ever",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Jeff Wilcox <...>",
  "license": "MIT"
}
```

Here is my `index.js` source file:

```
'use strict';

module.exports = function () {
  return 'This is a private npm package';
};
```

Time to publish! Since my token to publish and consume the private feed is in my `.npmrc` environment,
I can simply publish and it's good to go.

```
$ npm publish
+ @jeffwilcox/private-npm-package@1.0.0
```

Now I can go back to the Package Management extension within VSTS and refresh the feed to see my npm package.

<img src="{{ site.cdn }}vstsnpm/private-npm-feed-after-publish.PNG" class="img-responsive" />

VSTS provides some options including unpublishing and deprecating the package that will help in the
lifetime of the npm module.

## Using the module with your app

I have a basic Express web app created using `express-generator`.

```
npm install -g express-generator
...
express website
cd website
npm install
```

This generates a new folder called "website" that I can initialize as a Git repository to
deploy.

Now I'm ready to use my private NPM module. Let's install it, saving the module, too.

```
npm install --save @jeffwilcox/private-npm-package
```

And then I should get confirmation that this package was installed OK:

```
website@0.0.0 C:\local\website
`-- @jeffwilcox/private-npm-package@1.0.0
```

And to integrate with my private npm, this is what my `./routes/index.js` file ended up as; it will
set the title of the page, used by the view engine, to the value returned from the function exported
by my private npm:

```
'use strict';

const express = require('express');
const router = express.Router();

const privateNpmPackage = require('@jeffwilcox/private-npm-package');

router.get('/', (req, res, next) => {
  const title = privateNpmPackage();
  res.render('index', { title: title });
});

module.exports = router;
```

I can now run `npm start` and navigate to `localhost:3000` to confirm that the app is working just fine.

# Deploying to Azure App Service

## Selecting the deployment type

Azure App Service really is my favorite way of hosting Node.js apps on Azure. It's
so easy to configure the web site as a Git repository itself, or connect it to GitHub, or
use VSTS and its build system to deploy to the site.

Here I am using the Git repository hosted by the App Service instance, meaning
when I push to the repo, I am literally pushing and deploying right then onto the app service's
storage. The deployment experience will be echoed back to my Git client, making it easy to watch how
that goes.

I do not want to commit my `node_modules/` folder, however, because packages change and take up
space that is not my code - I want to use npm to resolve those packages at runtime. So my `.gitignore` has
the modules folder in it.

After committing I add my Git remote as the origin of this repo and push:

```
$ git remote add origin https://jmwblog@privatefeed.scm.azurewebsites.net:443/privatefeed.git
$ git push origin master:master
```

Within Git's `stdout`, since I am using an App Service-hosted deployment, I will
get updates about the deployment. If I had connected the service instead up to
GitHub or similar, I'd have to go to the "Deployment Options" part of the Azure
portal to see how it's doing... but this is a _#fail# visual:

<img src="{{ site.cdn }}vstsnpm/npm-push-fail.PNG" class="img-responsive" />

The deployment failed because the `@jeffwilcox/private-npm-package` scoped
npm module isn't in the global npmjs registry.

Because it's a private module.

And App Service does not have any idea about my scoped private registry nor what credential/token
it would even use to connect to it.

## Deployment scripts

### Automatic Kudu deployment script

By default the Kudu engine used for deployments actually dynamically generates a
deployment script based on how it identifies your application. If it looks like your
code is a Node.js app, it will generate a pretty good default.

You can retrieve the script that was generated for your environment by going to the
"Advanced Tools" part of the web site in the portal to open up the Kudu site
administrator tools where there's an option to download the script to take a peek.
The script generator itself is open source, too.

### Custom deployment scripts

To enable private NPM feed use, I'm going to need to go ahead and [https://github.com/projectkudu/kudu/wiki/Customizing-deployments](customize my deployment) with
a custom `deploy.cmd` script. I'll fork this from the best-known current generated
version for Node.js apps, adding value where I need to.

I first need to create a file called `.deployment` and commit it to my repo. The content of
the file points the deployment engine at my custom deployment script:

```
[config]
command = deploy.cmd
```

Here is my "current favorite" deployment script, reproduced here for anyone to use,
with the caveat that this is not in source control. That's another future blog post
I hope.

This is for Node.js deployment and it does a few things:

- It installs npm prod and development packages (since I want to use grunt and some other tools)
- It uses my npm deployment script for private repos, described at the end of this post, `configure-azure-appservice-private-npm-feed` to configure private npm feed support
- If you have a Gruntfile it will grunt
- If you have a `bower.json` file it will install any bower dependencies
- It installs npm packages _before_ copying over the actively deployed site
- Yes it is a batch file, because 2017. You can also write a `deploy.sh` bash script.

The important step for this blog post is just that it installs the `npm` script I wrote and executes it before installing npm modules. This way, scoped private feeds are configured either through the environment and/or configuration before the npm modules are officially installed.

```
@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

:: ----------------------
:: Forked from KUDU Deployment Script
:: Version: 1.0.6
:: ----------------------

:: Prerequisites
:: -------------

:: Verify node.js installed
where node 2>nul >nul
IF %ERRORLEVEL% NEQ 0 (
  echo Missing node.js executable, please install node.js, if already installed make sure it can be reached from current environment.
  goto error
)

:: Setup
:: -----

setlocal enabledelayedexpansion

SET ARTIFACTS=%~dp0%..\artifacts

IF NOT DEFINED DEPLOYMENT_SOURCE (
  SET DEPLOYMENT_SOURCE=%~dp0%.
)

IF NOT DEFINED DEPLOYMENT_TARGET (
  SET DEPLOYMENT_TARGET=%ARTIFACTS%\wwwroot
)

IF NOT DEFINED NEXT_MANIFEST_PATH (
  SET NEXT_MANIFEST_PATH=%ARTIFACTS%\manifest

  IF NOT DEFINED PREVIOUS_MANIFEST_PATH (
    SET PREVIOUS_MANIFEST_PATH=%ARTIFACTS%\manifest
  )
)

IF NOT DEFINED KUDU_SYNC_CMD (
  :: Install kudu sync
  echo Installing Kudu Sync
  call npm install kudusync -g --silent
  IF !ERRORLEVEL! NEQ 0 goto error

  :: Locally just running "kuduSync" would also work
  SET KUDU_SYNC_CMD=%appdata%\npm\kuduSync.cmd
)
goto Deployment

:: Utility Functions
:: -----------------

:SelectNodeVersion

IF DEFINED KUDU_SELECT_NODE_VERSION_CMD (
  :: The following are done only on Windows Azure Websites environment
  call %KUDU_SELECT_NODE_VERSION_CMD% "%DEPLOYMENT_SOURCE%" "%DEPLOYMENT_TARGET%" "%DEPLOYMENT_TEMP%"
  IF !ERRORLEVEL! NEQ 0 goto error

  IF EXIST "%DEPLOYMENT_TEMP%\__nodeVersion.tmp" (
    SET /p NODE_EXE=<"%DEPLOYMENT_TEMP%\__nodeVersion.tmp"
    IF !ERRORLEVEL! NEQ 0 goto error
  )

  IF EXIST "%DEPLOYMENT_TEMP%\__npmVersion.tmp" (
    SET /p NPM_JS_PATH=<"%DEPLOYMENT_TEMP%\__npmVersion.tmp"
    IF !ERRORLEVEL! NEQ 0 goto error
  )

  IF NOT DEFINED NODE_EXE (
    SET NODE_EXE=node
  )

  SET NPM_CMD="!NODE_EXE!" "!NPM_JS_PATH!"
) ELSE (
  SET NPM_CMD=npm
  SET NODE_EXE=node
)

goto :EOF

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Deployment
:: ----------

:Deployment
echo Handling customized node.js deployment.

:: Changes: KuduSync happens after installation of modules now

:: 1. Select node version
call :SelectNodeVersion

:: 2. Configure private npm feed
call npm install configure-azure-appservice-private-npm-feed -g --silent --only=prod
IF !ERRORLEVEL! NEQ 0 goto error

call :ExecuteCmd %APPDATA%\npm\kuduPrivateNpm.cmd
IF !ERRORLEVEL! NEQ 0 goto error

:: 3. Customize npm
IF EXIST "%DEPLOYMENT_SOURCE%\package.json" (
  pushd "%DEPLOYMENT_SOURCE%"
  call :ExecuteCmd !NPM_CMD! config set color false
  IF !ERRORLEVEL! NEQ 0 goto error
  call :ExecuteCmd !NPM_CMD! config set progress false
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)

:: 4. Install npm packages
IF EXIST "%DEPLOYMENT_SOURCE%\package.json" (
  pushd "%DEPLOYMENT_SOURCE%"
  echo Installing npm packages at the deploy source of %DEPLOYMENT_SOURCE%
  call :ExecuteCmd !NPM_CMD! install --production
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)

:: 5. Install npm development packages
IF EXIST "%DEPLOYMENT_SOURCE%\package.json" (
  pushd "%DEPLOYMENT_SOURCE%"
  call :ExecuteCmd !NPM_CMD! install --only=dev
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)

:: 6. Bower
IF EXIST "%DEPLOYMENT_SOURCE%\bower.json" (
  echo Installing Bower components...
  pushd "%DEPLOYMENT_SOURCE%"
  call node_modules\.bin\bower install
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)

:: 7. Grunt
IF EXIST "%DEPLOYMENT_SOURCE%\Gruntfile.js" (
  pushd "%DEPLOYMENT_SOURCE%"
  echo Grunting...
  call :ExecuteCmd !NPM_CMD! install grunt-cli
  IF !ERRORLEVEL! NEQ 0 goto error
  call node_modules\.bin\grunt --no-color default
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)

:: 8. KuduSync
IF /I "%IN_PLACE_DEPLOYMENT%" NEQ "1" (
  call :ExecuteCmd "%KUDU_SYNC_CMD%" -v 50 -f "%DEPLOYMENT_SOURCE%" -t "%DEPLOYMENT_TARGET%" -n "%NEXT_MANIFEST_PATH%" -p "%PREVIOUS_MANIFEST_PATH%" -i ".git;.hg;.deployment;deploy.cmd"
  IF !ERRORLEVEL! NEQ 0 goto error
)

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

:: Post deployment stub
IF DEFINED POST_DEPLOYMENT_ACTION call "%POST_DEPLOYMENT_ACTION%"
IF !ERRORLEVEL! NEQ 0 goto error

goto end

:: Execute command routine that will echo out when error
:ExecuteCmd
setlocal
set _CMD_=%*
call %_CMD_%
if "%ERRORLEVEL%" NEQ "0" echo Failed exitCode=%ERRORLEVEL%, command=%_CMD_%
exit /b %ERRORLEVEL%

:error
endlocal
echo An error has occurred during web site deployment.
call :exitSetErrorLevel
call :exitFromFunction 2>nul

:exitSetErrorLevel
exit /b 1

:exitFromFunction
()

:end
endlocal
echo Finished successfully.
```

## Configuring private feed settings

Now all that is left to do is to actually tell our custom deployment script about
the private npm feed token that we want to use.

By default the script used is configured to look for environment variables named:

- _NPM_PRIVATE_FEED_TOKEN_: The token credential from VSTS Package Management that we generated earlier
- _NPM_PRIVATE_FEED_SCOPE_: The scoped name to use, so `jeffwilcox` in my example. You can omit the @ symbol.
- _NPM_PRIVATE_FEED_: The path to the private feed hosted by VSTS for my npm scope

The custom script run during deployment will use these values, if present, to configure the `.npmrc` specific
to this single app service.

Here's a look at what this looks like, redacted partially:

<img src="{{ site.cdn }}vstsnpm/private-npm-config.PNG" class="img-responsive" />

After setting these values I'm ready to deploy again. Fingers crossed.

## Publishing with custom deployment

So I just need to commit these deployment files and push to the remote to kick off
another build attempt.

```
$ git add .deployment deploy.cmd
$ git commit .deployment deploy.cmd -m "Custom deployment script with private npm support"
$ git push origin master:master
```

And here it goes...

<img src="{{ site.cdn }}vstsnpm/deployment-success-1.png" class="img-responsive" />

Partly through the deployment process you should see that it installed the custom npm
script to help things get configured, and then it executed, since it recognized the
presence of the environment variables.

I get some feedback here about the private scoped feed being configured.

Also some good news: I see that the private npm package is successfully installed now
that the `.npmrc` on the App Service side is properly configured inside the sandboxed
environment.

Finally I get that great "deployment successful" message and know it's time to go visit
the site.

<img src="{{ site.cdn }}vstsnpm/deployment-success-2.png" class="img-responsive" />

## Success!

Navigating to the App Service web URL I will now see the title that is generated
by my private npm function.

<img src="{{ site.cdn }}vstsnpm/edge-private-npm-package.png" class="img-responsive" />

At this point we're done covering the basics and you could successfully use this
just fine to deploy App Services using your private npm package(s) for your Node.js apps.

# Azure KeyVault support

While storing the private feed token to get to my package inside the Application Settings
for the App Service works to an extent, it has some issues.

- The token has been manually placed inside the configuration. A typo or extra space
could cause problems.
- If I have 50 web site deployments that use the private npm feed, I have 50 places to configure the token
- If the credential leaks, is exposed, or as a general practice I want to reguarly rotate my secrets, I will have to update the secret token in at least 50 places. This will take time.
- If I accidentally grant someone broad access to my web site instance, they may easily get to the token

> The KeyVault support in this post, I should mention, is what works for my team, but is not official guidance. Use at your own risk and level of understanding of your needs and vault scenarios.

While KeyVault can be used for many scenarios, I'm most interested here in these:

- Preventing developer mistakes, especially from manual operation or settings data entry
- Potentially being able to build a production environment that very few, or no one, have access to, including the token
- Authorizing an individual app and its deployment to have access to a token, instead of having to configure more
- Being able to rotate a secret, knowing that the next deployment will pick up the latest secret version and use that to connect to my feed, enabling great cred rotation options
- Enabling configuration-as-code scenarios... I can actually store KeyVault secret paths inside private source control repositories without worrying the same way I would about committing an actual secret value

## Authoring the vault in the portal

There are many ways to authorize an app to have access to KeyVault, from client ID and secret pairs
to certificates and other methods. In the most simple case, supported in this script, my web site
has an Azure Active Directory application registration that provides an app client ID and a client secret
key that is good for 1-2 years.

I'm able to authorize the application identity to have access to the KeyVault, so it can read the
secrets, and then I can use a custom protocol scheme supported by this script to point the various
Application Settings to the vault.

So I'll end up with something similar to these values for the 3 environment variables to configure
the private npm feed, where the actual secret value is my token and then I use tags on the KeyVault entry
for the other values, keeping the feed URL and the secret token value pair together:

- _NPM_PRIVATE_FEED_: keyvault://feed@my_vault_name.vault.azure.net/secrets/my-vsts-private-feed
- _NPM_PRIVATE_FEED_SCOPE_: jeffwilcox
- _NPM_PRIVATE_FEED_TOKEN_: keyvault://my_vault_name.vault.azure.net/secrets/my-vsts-private-feed

Here's the secret entry inside the vault in the Azure portal. You can see some of the tags I've used to help
organize secrets.

<img src="{{ site.cdn }}vstsnpm/keyvault-secret-configuration.PNG" class="img-responsive" />

## Helping manage secrets

Another great value that KeyVault provide is a good way to gather and review
metadata about the secrets that I'm using in my set of apps.

By tagging secrets with my own representation for the type of secret, I'm able
to generate a rather useful dashboard that identifies secret age and other
properties, grouping similar types of secrets together.

Here in my custom portal I have a view that shows the metadata for a specific
secret version, including the tags I've defined, and also the custom `keyvault://`
scheme we've designed for this scenario, making it easy to copy and paste the
vault secret URL as needed.

<img src="{{ site.cdn }}vstsnpm/vault-npmjs-token.PNG" class="img-responsive" />

And here is a color-coded look at the current broader dashboard for a simple
application deployment covering about 10 different types of secrets that are
stored in this particular vault.

The private NPM feed key is stored under the "NPMJS Tokens" category to help
aid in understanding.

<img src="{{ site.cdn }}vstsnpm/vault-with-npmjs-tokens.PNG" class="img-responsive" />

I'll cover some of this dashboard work in a future post but wanted to share an early
look at some of this.

## Configuration as code

Finally, the custom deployment script supports "yet another" opinionated "painless" configuration-as-code story.

By defining a `CONFIGURATION_ENVIRONMENT` variable pointing to a known environment file, similar to a `NODE_ENV` setting,
the configuration system is able to read variable values from the right local file.

Since the configuration resolution code supports KeyVault, we're able to safely commit configuration information internally,
just pointing at KeyVault secrets, and then we can treat config changes as code. New secrets and environment changes can
be code reviewed and move through Git like any other set of changes.

For any given secret we have a choice: we can point to a secret name, resolving the latest version at
deployment or runtime, or we can point at a specific version. There are scenarios for both, but for the
private npm feed example, we're using the versionless secret URI. This enables token credential rotation easier.

Here's a quick look inside Visual Studio Code at the configuration environment settings for the secrets
used by this app:

<img src="{{ site.cdn }}vstsnpm/keyvault-configuration-as-code-with-private-feed.PNG" class="img-responsive" />

Thanks to config-as-code, we no longer need to configure the private NPM information on each app service, as
long as the app's identity is authorized to the vault. This helps reduce errors.

# Open source

The [configure-azure-appservice-private-npm-feed](https://github.com/Microsoft/configure-azure-appservice-private-npm-feed)
script is licensed MIT and is a small tool/utility. At this time it is also published as an npm, `configure-azure-appservice-private-npm-feed`.

It's worth noting that at this time only a single private scoped feed is supported by the script. The script has two top-level dependencies that flow to others:
- async
- [painless-config-resolver](https://github.com/Microsoft/painless-config-resolver)

Your contributions and feedback are always welcome.

# Closing

Hopefully you found this post interesting. It's really fun how we're able to piece together
so many great technologies: Node.js, npm; Azure App Service, Active Directory, KeyVault; VSTS
and VSTS Package Management.