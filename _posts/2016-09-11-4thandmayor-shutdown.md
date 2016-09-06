---
layout: post
comments: true
title: "4th & Mayor: Checking out"
categories: [windows-phone, 4thandmayor]
tags: [tech, windowsphone, windows-phone]
---
I am retiring my app, 4th & Mayor, from the Windows Phone Store. 4th & Mayor is a free
third-party Foursquare app, exclusive to the Windows Phone.

Although still serving thousands of users today, its peak was years ago, and I am unable
to invest in rebuilding the app: Foursquare has evolved with new features and experiences,
and the phone platform has converged and improved - yet my codebase is so old and full
of hacks that it would be a huge project to modernize.

I'm very proud of the high-level stats given the niche market:

- Used to check-in on Foursquare 19,236,000 times as measured by the # of times the check-in page was shown
- 167,856,000 unique "page views" inside the app exploring places, categories, friends' activity, etc.
- At its height, 4th & Mayor was the top-rated social app on the Windows Phone Store, rocking all 5's. Today is has a 4.6 star rating, even after years of neglect!
- Over 332,000 downloads from the app store
- Just under 95,000 daily active users at its peak

_Note that these stats exclude anyone who disabled the app telemetry_

Pre-announce March 10 2011: http://www.jeff.wilcox.name/2011/03/building-an-unofficial-4sq-app-for-wp7/
Launched March 20, 2011: http://www.jeff.wilcox.name/2011/03/announcing-4thandmayor/
June 28, 2011: v2 http://www.jeff.wilcox.name/2011/06/4am-v2/
March 2012: http://www.jeff.wilcox.name/2012/03/one-year-of-4thandmayor/
AWS to Azure April 2013: http://www.jeff.wilcox.name/2013/04/4thandmayor-azure-websites/

Random guidance:
progress indicator, global to app: http://www.jeff.wilcox.name/2011/07/creating-a-global-progressindicator-experience-using-the-windows-phone-7-1-sdk-beta-2/
Metro Grid design helper - margins and all: http://www.jeff.wilcox.name/2011/10/metrogridhelper/
MPNS Node.js module: http://www.jeff.wilcox.name/2011/12/node-mpns/


It was a really fun project to build, and although never monetized (I could never get
behind mobile ads), I learned a lot and had a lot of fun building a brand, a community,
and meeting so many passionate Windows Phone users along this journey. It was a true labor
of love and I will miss it.

I am told that the official app is pretty good these days, so recommend that people
consider using that for their checking-in needs.

I am also intending to open source the app for
historical reasons, similar to what the Vesper developers did recently while retiring
their iOS app. I guarantee you that you don't want to touch the app's source, though, it
was built for an entirely different application platform generation and had to work
around a lot to make things feel smooth.



Bringing the app to market was such an engaging, challenging and fun experience. I
want to personally thank everyone who has been a part of the app, reviewed the
app, provided feedback to make it better, and for being a part of the early,
exciting phase of the Windows Phone app world.

The app itself will continue to function as-is as long as Foursquare keeps the
API compatible and the application token alive. The map services in the app will
continue to render as long as the Bing Maps mobile developer plan continues to
allow that use at no cost. The notification features have honestly been turned
off for a few years now, so no change there.

I intend to open source the app as-is with a name-restrictive custom license:
the 4th & Mayor name will remain mine, and so any derived or inspired apps will
need to build their own brand and reputation.

# Why I am unpublishing the app

After reading about the shutdown of another app - Vesper - the words of Brent Simmons and
John Gruber really resonated with me. To be honest, I think I've written an outline
sounding more or less the same a few times now. Time to make it real.

I really enjoyed interacting with the Windows Phone community - meeting new people,
especially seeing people using my app out in the real world, was really fun. I think
the scrappy nature of the Windows Phone die hards really helped make it special.

Seeing someone with a Windows Phone outside of the 98052 zip code was always a treat,
and even more so was politely asking if they ever used Foursquare. Chances were, if they
said yes, they'd go and show me my own app and rave about it.

Although I never made a penny on the app, all said and done my affair with the
app cost me about $30,000.

I had grand aspirations to rewrite for the newer Windows platforms, to work with
the passionate set of users to localize the app across many languages, and to
build an even better version of the app. The truth is, I don't have the time, I
no longer use a Windows Phone, and I no longer find the Foursquare premise of
"checking in" to be very intruiguing. I do still love what Foursquare has done,
enjoy using it when I travel to remember where I've been and build a solid
travel journal, but I miss my own enthusiasm for their product and the social
interactions they were enabling through friends.

# The highlights

x

## Windows Phone design was great

x

So simple, crisp, clean - even a developer could land it

Margins

Grid

Keeping it simple

### The Pivot control

Mine!

My day job

Super frustrating having to work around issues with my own control

I share the pain!

## Building and polishing an app and brand is fun

x

## The Microsoft Company Meeting

x

JoeB at Key Arena

NFC tag feature for check-in with custom URI

## Meeting Windows Phone developers around the world

??

Australia
Britain
Canada
Denmark
Finland
France
Germany
Israel
Ireland
New Zealand
Sweden

## Meeting my users

x

## People really do recognize quality

x

## Moonlighting at Microsoft

x

Special moonlighting program, great vote of confidence

Takes a lot of work to truly separate the worlds

Proud of the app but the gray areas between work and not were too blurry

## Building a supporting cloud

Live tiles

MongoDB

Node.js

Amazon

Azure

# The abbridged story

x

## Origins of the name and logo

Although the idea of being a "Mayor" of a business or venue was core to Foursquare
at the time (and later abandoned, only to be brought back), it was not a part of their
core brand nor name, so I felt comfortable in building a name around that general concept.

I'm a nice guy, and I felt it was very important to follow the wishes of the primary
service (Foursquare) regarding naming of third-party apps. Totally get it, and so I
had to make sure to have something that fit into their guidance at the time.

At the time I wrote the app, I lived in the center of downtown Seattle, in the business
and financial district. I regularly walked by a big green street sign for "Madison St"
on my way to and from exploring the city, checking in to places. The thinking in my head
was that an intersection - a pinpoint - a spot - a place to checkin - it just fit. Here's
what that sign looks like today:

xyz

And here is what the original app icon looked like:

xxx

Over time I wanted to move to a solid color to better reflect the clean
design of the Windows Phone design language, and so I iterated and honed my
college skills in Photoshop to build the icon.

> Key lesson: build your app icon at the highest possible resolution!

Looking back I probably should have learned how to use Illustrator in order
to just have a solid vector representation of my app logo. Eventually I did
build Photoshop paths that pretty much reflected that.

## Shipping for free, early

x

## Deciding not to have any advertisements or monetization

x

# A look at some analytics

X

## Redmond

x

## New York City

x

# Lowlights

x

## Ever-changing application platform

x

The app was built targeting the first phone release and chock full of custom controls

Difficult to build the legacy source today

## Corporate politics

x

Legal and moonlighting misunderstandings

Field politics and business relationships

Royalty free license to the source

# Thank You.

If you read this far, wow. Thanks. It's been fun!






Last Vesper Update, Sync Shutting down
http://inessential.com/2016/08/21/last_vesper_update_sync_shutting_down

Vesper shutting down
http://daringfireball.net/linked/2016/08/22/vesper-shutting-down

Vesper, Adieu
http://daringfireball.net/2016/08/vesper_adieu

Brent Simmons:
I loved working on Vesper. It was one of the great software-making experiences
of my life. We’d get on a roll and it was wonderful.

And now it hurts to turn it off, but it’s time.

I’m working on a postmortem — or maybe more of a eulogy — but for now, I can’t
express my feelings any better than those two short paragraphs from Brent.

