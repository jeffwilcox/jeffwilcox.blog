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

* This app is currently live, hosted with Azure Web Sites: [https://waztable.azurewebsites.net/](https://waztable.azurewebsites.net/)
* The app is deployed and stored in GitHub: [https://github.com/jeffwilcox/azure-table-explorer](https://github.com/jeffwilcox/azure-table-explorer)

Getting started
===============

Windows Azure Table Service
---------------------------

The Windows Azure Table Service lets you store large amounts of structured non-relational data. Behind the scenes, the Azure storage service scales to meet throughput demands. There is a partitioning story.

I'm building this table explorer app because the Windows Azure management site doesn't display table information today, but instead just basic info about your blob containers and the blob contents. So I'm building this site to iterate through the table contents easily from any web browser. Note that the nice Visual Studio tooling that we ship also lets you query tables.

### Schemaless entities

When you store data in the table, you simply list the set of key/object pairs for the row of data. You do not need to define the columns ahead of time for the entities - each can be unique; so in this situation, where I am building out a table explorer, I am sort of expecting a homogeneous set of data: I'm going to show the table of data using a superset of all the columns for a given page of data.

Each entity is a set of properties and can be up to 1MB in size. Entities can have up to 252 properties. It is actually 255 once you mentally include the system properties, PartitionKey, RowKey, and Timestamp, that Windows Azure's storage service maintains for its use. `(PartitionKey, RowKey)` is the unique pair that identifies any row within the table.

### Awesome pricing

IMO one thing that I really like about the Table Service in Windows Azure is the pricing model: it is priced the same way as all other storage, including blobs and queues - a price per GB per month, and then also a very small price for transactions. I found that for my application, table was cheaper than Amazon SimpleDB, for example. It lets me store loose data in the cloud that I can query outside of a SQL server or more complicated NoSQL solution.

You can find [current storage pricing details here](http://www.windowsazure.com/en-us/pricing/details/#header-4).

How I'm logging data in the cloud
---------------------------------

I have an application in the cloud today in production that logs debug-style information to the cloud to make it easy to monitor what's going on. The log provider I use writes to the Windows Azure Table Service through the standard Node.js module that many use for logging called [Winston](https://github.com/flatiron/winston) and an extension to support table storage.

Windows Azure SDK for Node.js
-----------------------------

To actually interact with Windows Azure's services I am using the [Windows Azure SDK for Node.js](https://github.com/WindowsAzure/azure-sdk-for-node), a product that my dev team has done a really nice amount of work on.

The Node.js SDK is powerful, simple, and acts exactly like any Node.js module. You'll find it on npm as `azure`. It supports blob storage, table, queues, service bus, and many other services. We also have built out a cross-platform command line interface (CLI) for Windows Azure that you can grab in the `azure-cli` module - more on that another day.

All interactions with the table service are done through a simple table service instance that lets you query entities, insert entities, etc.

<pre class="js" name="code">
var azure = require('azure');
var tableService = azure.createTableService();
</pre>

You'll find a good set of documentation on this in the [Wiki on GitHub](https://github.com/WindowsAzure/azure-sdk-for-node/wiki/Table-Storage) or by walking through the [Node + table service tutorial on WindowsAzure.com](http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/table-services/)

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

If you do this, then the site will greet you right away with a choice of tables as it does not required authentication/credentials. This is really only good for testing or temporary use while developing an app that uses the table service.

![The Getting Started page in the app is shown initially if cloud-stored credentials are used instead of prompting the user for their credentials.]({{ site.cdn }}table/blog/gettingstarted.png =700x284 "The getting started page immediately appears when using cloud-stored credentials.")

Building the site & service
===========================

I'm building the web service side using Node.js. JavaScript is ironically becoming so nice.

Node modules and components
---------------------------

For this project, I'm using Express 3, a fairly typical and friendly way to build up a simple web site complete with routes, middleware for processing requests, and serving static files as well if needed.

So my full set of dependencies include:

* Node.js 0.8.x
* Express 3.1 `npm install express -g && express`
* Windows Azure SDK for Node.js `npm install azure`

You can explore the complete source code of the running application on GitHub at [https://github.com/jeffwilcox/azure-table-explorer](https://github.com/jeffwilcox/azure-table-explorer).

Exposing simple json/ajax
-------------------------

To expose JSON-serving endpoints for my web app, I'm creating a small [Express](http://expressjs.com/) submodule for my site. Express is a super easy way to do this: it natively recognizes JSON requests and can respond with a simple JSON payload, making AJAX sites super easy to build out.

> What I am doing in this app is actually exposing this sub-route for JSON as an Express module itself. This way, it can easily be added to another web site using Express through a simple import.

So for my Express JSON routes, I just expose 2 GET operations: getting the name of all the tables in my storage account, and then also one to work on returning a set of rows from a table. I then have a DELETE operation for removing rows from a table.

<pre class="js" name="code">
var   express = require('express')
    , app = module.exports = express()
    , queryTables = require('./json/queryTables')
    , queryTable = require('./json/queryTable')
    , deleteRow = require('./json/deleteRow');

app.get('/table', queryTables);
app.get('/table/:tableName', queryTable);
app.delete('/table/:tableName/:partitionKey/:rowKey', deleteRow);
</pre>

Now if you look at this code, you will see a few things if you're familiar with Express:

* Restricting routes to specific operations (DELETE, which will impact the service and data, is an important HTTP construct vs just exposing as a GET)
* Using parameter names, which will appear as `request.params.*`, row tableName, partitionKey, etc. These are non-optional in my use cases here.
* I've kept the source files really short by not including all the code in this file, but instead placing the specifics in sub-files that I then import with a `require` statement.

We'll open up one of those sub files like queryTables.js in a little bit...

Creating the table service with Express middleware
--------------------------------------------------

One thing that I decided I wanted to do was allow the application to work in one of two ways:

* in the more generic case, you enter credentials on the site secured with SSL, and those are used to browse a table. This allows any Windows Azure customer to use this app to securely explore their tables.
* in a specialized case, mostly for debugging and use while building apps, is storing credentials as environment variables - useful for local development environments or specialized cases when hosted on the net securely.

This is easy to do since the Azure SDK will look for credentials using environment variables first. The magical environment variable names are `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_ACCESS_KEY`. This makes it easy to deploy your app using source control, such as how I have done with GitHub: the credentials are stored in the cloud configuration and not in source code.

So these lines of code are the same when you use the environment variables:

<pre class="js" name="code">
var azure = require('azure');
var tableService = azure.createTableService(); // implicitly use env variables

tableService = azure.createTableService(
  process.env.AZURE_STORAGE_ACCOUNT,
  process.env.AZURE_STORAGE_ACCESS_KEY); // explicit
</pre>

So to do this, whenever a request comes in for the `/json/*` routes of my application, I'm going to use a piece of simple middleware to look for query string parameters for account key and access key. If I find them, I use them.

Here's the Express middleware I am exposing. I am wrapping the createTableService call in a try/catch as the function will perform some basic validation, such as checking for a base64 access key - it will throw if these conditions are not met.

<pre class="js" name="code">
var azure = require('azure');

module.exports = function getTableServiceInstance(req, res, next) {
	var account = process.env.AZURE_STORAGE_ACCOUNT || req.query["account"];
	var key     = process.env.AZURE_STORAGE_ACCESS_KEY || req.query["key"];
	if (account === undefined && key === undefined) {
		return res.send(403);
	}

	try {
		req.tableService = azure.createTableService(account, key);
	}
	catch (err) {
		return res.send(403);
	}

	next();
}
</pre>

And then to plug this in to the routes, here is the routing source I am using with Express for my json endpoints:

<pre class="js" name="code">
var   express = require('express')
    , app = module.exports = express()

    , queryTables = require('./json/queryTables')
    , queryTable = require('./json/queryTable')
    , deleteRow = require('./json/deleteRow')

    , tableServiceMiddleware = require('./json/tableServiceMiddleware');

app.use(tableServiceMiddleware);

app.get('/table', queryTables);
app.get('/table/:tableName', queryTable);
app.delete('/table/:tableName/:partitionKey/:rowKey', deleteRow);
</pre>

So by calling `app.use(...)` with the `tableServiceMiddleware` code I created, I'm actually going to automatically create the table service and place it inside the `request` object for all of the code in the `/json` paths on my server. Very simple, and it really cuts down on code duplication and provides a single code path for instantiating the Windows Azure SDK.

Exposing all the tables in a storage account
--------------------------------------------

Now for the raw implementation details, I'd like to fill out the source code for what will be returned when someone hits the `/json/table` endpoint of my web service with either authenticated credentials or cloud-configured credentials.

For this I know that `tableService` will be a property already hanging off of the `request` object that Express is now using, thanks to the simple middleware I have written.

So the actual implementation is super quick:

* Call the `queryTables` function that the Azure table service object exposes
* I use a few helper functions in a [send.js](https://github.com/jeffwilcox/azure-table-explorer/blob/master/routes/json/send.js) file I coded real quick
* Iterate the table names, returning in a simple array
* If an error happens, the `send` code will send back a response that my AJAX app can use to share the error message.

Here's the entire file for `routes/json/queryTables.js`:

<pre class="js" name="code">
var send = require('./send');

module.exports = function queryTables (req, res, next) {
	req.tableService.queryTables(function (error, result, response) {
		send.errorElse(res, error, function () {
			var tables = [];
			for (var tbl in result) {
				var table = result[tbl];
				if (table.TableName) {
					tables.push(table.TableName);
				}
			}

			send.content(res, {
				tables: tables,
				name: req.tableService.storageAccount,
			}, 'result');
		})
	});
}
</pre>

Running locally
---------------
Now we are ready to start interacting with this locally. No matter what platform you are using, Node.js is awesome at this. The development environment for Express is nice, too, since it will actually show you some nice, simple diagnostics information in your terminal window about any and all requests.

All I need to do in my terminal window is run `node server` and it will attach locally. Here's what it looks like as I use the site from a command prompt:

![A screenshot of the command prompt in Windows showing the running Node.js express site.]({{ site.cdn }}table/blog/commandprompt.png =700x136 "The local development environment with Node.js has nice debugging information showing each HTTP request, how long it took, and the content length of the response.")

Now, I'm getting ahead of myself a little here, but realize that I'm using a local HTTP endpoint without any encryption. In my app I have added special code to warn users that their credentials will not be securely stored in this situation: here is what that looks like:

![An error message showing a warning about sending credentials over an unsecured HTTP endpoint.]({{ site.cdn }}table/blog/httpendpoint.png =700x341 "When using an unsecured HTTP endpoint, a big warning message appears on the credentials page in this app.")

So locally it is easy to work on debugging the AJAX app, server code, you name it.

Deploying to Azure Web Sites
----------------------------

Now to actually get this from my local dev environment to the cloud, well this is getting so easy now. I've been coding up this project as a Git repo, with its origin being in GitHub.

So locally, I just do a `git push origin master` call, use my Git account credentials, and then the source is pushed to GitHub.

Windows Azure Web Sites automatically gets notified of this change and then will update the Node.js deployment to re-launch the site. For now I've called my Azure web site `waztable` and it is deployed in just a few seconds to `waztable.azurewebsites.net`. As part of this process, for a Node.js application, it looks at the `package.json` file and will go ahead and automatically `npm install` both the Azure and express modules for me.

Storing credentials in the cloud
--------------------------------

For the scenario where I want to store the credentials in the cloud, I can do this really quickly right inside the management portal for my Azure Web Site.

Just go to the CONFIGURE tab inside the site, and under app settings, you just add the environment variable key/value pairs.

![Inside the Windows Azure management portal you can store configuration variables including environment variables. This can used to securely store the storage credentials (account name and access key) in the cloud.]({{ site.cdn }}table/blog/appsettings.png =700x136 "Storing environment variables in the management portal.")

Easy! Since my data is not mission critical, just logging data, and also not personal or private information, I'm OK having this unsecured for demo purposes - but do realize I'm exposing the entire set of table data and the ability to delete rows.

Realistically I would want to wrap this with another more traditional authentication mechanism.

SSL and Web Sites
-----------------

For my app to be secure when I am not storing the credentials in the cloud configuration, I need to prompt the user and then have this information securely sent with every AJAX HTTP request. Clearly, I need SSL encryption.

Web Sites supports HTTPS: `azurewebsites.net` has a wildcard certificate that encrypts and allows for this scenario.

Earlier you saw the "scary" version of my app's entrance page - when you are using a non-SSL connection, it shows a big orange alert. For local debugging purposes I allow the credentials to be entered.

Now, when I point my browser to [https://waztable.azurewebsites.net/](https://waztable.azurewebsites.net/), I instead get greeted with this nice, simple, non-scary dialog.

![When connecting through a secured HTTPS endpoint, the warning message does not appear.]({{ site.cdn }}table/blog/secureendpoint.png =700x651 "When using a secure endpoint, a simple message appears letting the user know that their credentials will be safely stored.")

Building the client app
=======================

To interact with the web service, I'm creating a single-page application that is a static HTML file, built on a lot of great JavaScript frameworks and Bootstrap. All my other client logic will be in a simple application-specific JavaScript file.

Client frameworks
-----------------

I'm using these client goodies to make development quick and easy:

* [Twitter Bootstrap](http://twitter.github.io/bootstrap/) - awesome, basic CSS that just makes sense. I use this everywhere these days.
* ['Cosmo' Bootstrap theme on Bootswatch](http://bootswatch.com/cosmo/) - it looks more like the Microsoft design style
* [jQuery](http://jquery.com/) - the way to do AJAX
* [Moment.js](http://momentjs.com/) - a simple parser and data processor to show dates a little more pretty

This will save a lot of time and just let me focus on my JavaScript client code. Since it is a single page application, things are easy, but clearly you'll need a modern HTML5-compliant browser and JavaScript enabled.

For serving these frameworks I am using appropriate CDN locations: jQuery from one of its CDN spots, and then for the frameworks I'm using like Bootstrap with a custom theme, I've [setup my own Windows Azure CDN endpoint](http://www.windowsazure.com/en-us/develop/net/common-tasks/cdn/) for these assets.

Then, in the `public` folder of my Express site, I am placing the app-specific CSS and JavaScript files to make local debuggin easy. I have an index.html, table.js, and table.css file - thats it for this app on the client side. You can explore the [public/ folder](https://github.com/jeffwilcox/azure-table-explorer/tree/master/public) on GitHub.

Preparing for AJAX
------------------

This isn't designed to be a tutorial on jQuery or using AJAX. This isn't 2003 `:-)`. I am also doing a lot of jQuery `.html(...)` shortcuts in this app. When I wrote this simple app, I was more focused on the cloud code, so I'll admit my JavaScript on the client isn't the prettiest or most well-formatted. But it works!

Once the page is ready, jQuery will let me go ahead and start writing code to make things happen. In my init code I do a lot of things:

* Performing the SSL check to display the proper UI if you have not yet authenticated
* Setting up global events for AJAX requests, to display it in the UI
* Hooking up specific UI buttons to JavaScript functions
* Figuring out how many appropriate rows I should show in the UI based on the current height of the page

I also hook up a global AJAX error event with jQuery. This will make it easy to at least display a message or show the credentials entry portion of the UI. Here's my AjaxError code.

<pre class="js" name="code">
$(document).ajaxError(function (event, request, settings) {
    ++ajaxErrorCount;

    var subject = 'Error';
    var text = 'Something went wrong. Oops.';

    if (request.status == 403) {
      credentialsNeeded();

      if (ajaxErrorCount == 1) {
        return;
      }

      subject = '403 Unauthorized';
      text = '<p>An unauthorized response was returned. Most likely this means:</p><ul><li>The storage account credentials are incorrect</li><li>No credentials have been provided</li></ul><p><small>Also: you can configure environment variables on the cloud side to automatically authenticate the table explorer.</small></p>';
    } else {
      text = request.statusText || request.responseText;
    }

    showError(subject, text);
  });
</pre>

This will just show a modal Bootstrap dialog with the error information whenever it comes back.

The last thing I do is make an AJAX request to list all the tables in the storage account. The logic here is simple: If I receive a HTTP 403 response, the storage account credentials are incorrect or not yet entered. Show the credential UI. Otherwise, show the main UI.

Listing all the tables in an account
------------------------------------

We've already looked at the code exposed in the `/json/table` endpoint to return all of the tables in my storage account. Let's wire that up in my application code.

<pre class="js" name="code">
 var loadTablesList = function () {
    $.ajax({ 
    	url: "/json/table",
      data: getStandardAjaxData(),
    	success: function (data) {
        showErrorElse(data, function () {
          $('#results').show();

          dr = data.result;
          if (dr.name) {
            storageAccount = dr.name;
            $('#accountName').html(storageAccount);
          }

          window.tables = [];
          var tableList = $("#tableList");
          tableList.empty();

          var html = '<ul class="nav nav-list">';
          html += '<li class="nav-header">Tables</li>';
          
          var c = 0;
          for (var tbl in dr.tables) {
            var table = dr.tables[tbl];

            html += '<li id="table-link-' + table + '">';
            html += '<a href="#" onclick="';
            html += 'return window.getTable(' + "'" + table + "'" + ');">' + table + '</a></li>';

            window.tables.push(table);
            ++c;
          }

          if (c == 0) {
            html += '<li>No tables</li>';
          }

          html += '</ul>';
          tableList.append(html);
        });
    	}});
  }
</pre>

So to walk through the code,

* `$.ajax` jQuery call is used to hit the `/json/table` endpoint that was exposed by Express on the server side
* In the success handler, I show the main results area inside the UI and parse out the list of tables
* In the sidebar on the right, I create a simple Bootstrap `nav-list` and add list items for each table

Show rows and details
---------------------

To actually show table results, I have a general function that is pretty horrible JS code. It iterates through the list of rows for the current view, creates a table by hand in HTML (I didn't want to take on a complete jQuery data grid solution for this, but probably should have), etc.

The function takes in the tableName, current page number, and the continuation token to use if we are requesting the next page:

<pre class="js" name="code">
 function loadTable(tableName, page, continuation) {
    currentTableName = tableName;

    var data = getStandardAjaxData();
    if (continuation) {
      data.nextRowKey = continuation.nextRowKey;
      data.nextPartitionKey = continuation.nextPartitionKey;
    }

  	$.ajax({
  		url: "/json/table/" + tableName,
      data: data,
  		success: function (data) {
        showErrorElse(data, function () {
          loadTableData(tableName, data.table, page);
        });
  		}
  	});
  }
</pre>

I also store locally the view's rows in JavaScript so that I can show detailed information such as the system properties for rows including the partition and row key data. I hook up a row click event to this code.

![When clicking on a row, a small details view appears on the right side with the core information about the table row including a link to it with PartitionKey and RowKey.]({{ site.cdn }}table/blog/details.png =700x294 "The details view for a table row.")

I also store an array in code of all the currently selected rows, similar to the Outlook.com user interface. This will allow for multi-select functions like delete.

The `loadTableData` function does all the dirty HTML work of building out the table and wiring up events.

Pagination / continuation tokens
--------------------------------

When the table service sends back a result, it optionally also includes a *continuation token* that has information about the next page of data: the next page's starting PartitionKey and RowKey. These are used for walking an entire table's results and effectively mean "there is another page of data to show".

In this scenarios, I want to make sure that the pagination UI in the app is updated and that I wire up an event to request the next set of data. That data is sent in the optional `continuation` parameter to the `loadTable` function above.

![The 11th page of the app - pagination is supported in the app.]({{ site.cdn }}table/blog/page11.png =700x180 "Pagination is supported in the app.")

A continuation token from the Node SDK is very simple:

<pre class="js" name="code">
{
	nextPartitionKey: "NEXT_PARTITION_KEY_HERE",
	nextRowKey: "NEXT_ROW_KEY"
};
</pre>

So in the pagination list of pages, each of the associated "pages" (a concept local just to the app) is actually a pair: `(PartitionKey, RowKey)`.

On the server side, this is what the code looks like for our `queryTable` JSON endpoint in Node.js. The code uses SELECT statement, plus optional TOP (# of max results to return) as well as optional starting Continuation Token. It then iterates through and returns this raw JSON data to the AJAX app:

<pre class="js" name="code">
var   send = require('./send')
    , azure = require('azure')
    , TableQuery = azure.TableQuery;

module.exports = function queryTable (req, res, next) {
	var top = req.query.top;

	var query = TableQuery
    		.select()
    		.from(req.params.tableName);
	if (top) {
		query = query.top(top);
	}
    if (req.query.nextRowKey && req.query.nextPartitionKey) {
    	query = query.whereNextKeys(req.query.nextPartitionKey, req.query.nextRowKey);
    }

	req.tableService.queryEntities(query, function (error, result, continuation, response) {
		send.errorElse(res, error, function () {
			var table = { };
			if (continuation && continuation.nextPartitionKey && continuation.nextRowKey) {
				table.continuation = {
					nextPartitionKey: continuation.nextPartitionKey,
					nextRowKey: continuation.nextRowKey
				};
			}
			table.rows = result;

			send.content(res, table, 'table');
		});
	});
}
</pre>

> The continuation token information is returned with the JSON results as well, enabling the UI to show the pagination page numbers and make those additional requests.

Supporting multi-row delete
---------------------------

The local JavaScript variable `selectedRows` keeps a list of the row numbers in the current view that are selected, allowing me to lookup that data for uniquely identifying it.

I have a delete function that then takes this row, sending HTTP DELETE requests to my service. Once all the DELETE calls are done, I then refresh the current page's view using the same continuation token as before.

![Multi-selection is supported for deleting rows inside the table explorer.]({{ site.cdn }}table/blog/multiselect.png =700x651 "Multi-select delete is supported for removing rows in the app.")

At this time I have not implemented a batch delete operation.

Considering a 'count' property
------------------------------

One thing that the user interface does not show is a concrete number of rows remaining in the table. Instead, with the pagination model, it simply shows the next page when there is information about the next page's row and partition keys. This is an implementation detail of the Windows Azure table service: there is no "number of rows" property that is returned.

In order to show count, I would have to walk through and scan the entire table: something that could be very long and expensive for something like a web app that is always logging hundreds of thousands of fields of interest, for example. Although I could do this behind the scenes in a long-running AJAX call, or instead occassionally generate for the table, I've decided not to worry about it today.

Next steps
==========

Check out the app
-----------------

This application is live and hosted on Azure Web Sites in April 2013. I'll probably eventually need to move the endpoint elsewhere, but for now, you will find the app live at [https://waztable.azurewebsites.net/](https://waztable.azurewebsites.net/)

The open source code is online at [https://github.com/jeffwilcox/azure-table-explorer](https://github.com/jeffwilcox/azure-table-explorer)

Potential other features
------------------------

When I have time I'd like to add the ability to clear all rows from a table (delete and re-create the table), create a new table through the site, or add a basic entity to the table. I also thought about directly hitting table storage through AJAX instead of going through the server that then pipes back JSON to the app - but for now, I don't see this as a huge issue with the app. I also thought about adding the ability to get a one-time approximation of the number of rows in the table.

Open Source Windows Azure
-------------------------

Have a few minutes? Check out our open source work at [http://windowsazure.github.io/](http://windowsazure.github.io/).

> We actually accept contributions. We license everything Apache 2. We are on GitHub. Please join our community today!

Related Windows Azure resources
-------------------------------

If you want to learn more, check out:

* [Using the Table Service and the Node.js SDK](http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/table-services/)
* [Table service Node.js Wiki page](https://github.com/WindowsAzure/azure-sdk-for-node/wiki/Table-Storage)
* [Table Service REST API documentation](http://msdn.microsoft.com/en-us/library/windowsazure/dd179423.aspx)
* [How to use the Table Service - a .NET example](http://www.windowsazure.com/en-us/develop/net/how-to-guides/table-services/)
* [Windows Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/)
* [GitHub repository - Windows Azure SDK for Node.js](https://github.com/WindowsAzure/azure-sdk-for-node)
* [Open Source at Windows Azure information](http://windowsazure.github.io/)

Hope this helps, and let me know what you think on Twitter!