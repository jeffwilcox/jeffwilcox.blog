---
layout: post
comments: true
title: "My zippy Ubiquiti/UniFi home network powered by CAT3, Seattle's Wave-G, and CAT3"
categories: []
tags: [tech, networking, seattle]
---
Today I enjoy gigabit Internet and a Ubiquiti UniFi network at home; while there are
many upstarts today in wireless home mesh networks and other products today, as an
engineer I love separation of concerns, and having a gateway whose job is routing separate
from access points to do the WiFi just makes great sense.

>>> SPEED screen capture

While there are many other Ubiquiti success stories on the Internet, this one is mine. I
strongly recommend [Troy Hunt's post](https://www.troyhunt.com/ubiquiti-all-the-things-how-i-finally-fixed-my-dodgy-wifi/);
also, a special shoutout to [Clint Rutkas](https://twitter.com/ClintRutkas) for sharing his
experience - he embarked on a similar journey around the same time, and I know many of my
coworkers at Microsoft also have great Ubiquiti experiences.

>> UniFi screen capture

This is also a great opportunity for me to rain praise upon Wave G, Seattle's finest
gigabit Internet provider, and a super interesting success story of its own: while Wave G
is high tech, my building is not so much, so the last 100 feet to my apartment is
[CAT3 cable](https://en.wikipedia.org/wiki/Category_3_cable), something I'd never
heard of, and I hope you do not need to deal with.

>>> WAVE G / MICROWAVE

I absolutely love the advanced features that Ubiquiti offers at in easy-to-use manner. From
VLAN tagging and separate SSIDs for guest networks, to advanced connectivity options; I have
a site-to-site VPN running between a one of my Azure (Microsoft Cloud) virtual networks in a Microsoft datacenter
and my home. Technically Ubiquiti hardware is based on the open source Vyatta OS.

>> Azure portal screenshot

I have not blogged in ages, but two years ago I closed on an apartment in downtown Seattle
and embarked on an adventure upgrading my networking equipment, replacing mid-grade wireless and
switching equipment from three vendors (Asus, Apple and Cisco) with equipment
from Ubiquiti Networks, all powered by the legendary gigabit Internet connectivity of
Wave G (CondoInternet).

Here's the rough outline I've prepared for this post:

- Ubiquiti UniFi
  - The pitch
  - The hardware
  - My EdgeMax experience
  - Fan replacement
  - My network
- Wave G (formerly CondoInternet)
  - The intrastructure
  - Speed
  - Why Wave G is so valuable to Seattle apartment and condo developers
- Apartment/condo wiring challenges (CAT3)
  - CAT3 "last mile"
  - Running a new CAT6/Fiber network



Over the past two years I've invested in my home network powered by Ubiquiti Networks, replacing
three vendors - Asus, Apple and Cisco - with a single vendor, Ubiquiti.

Asus and Apple routers


Over the past few years it has become clear to me that Ubiquiti, a relatively unheard of
player in the consumer space, has been "winning" when it comes to wireless technology.


In late 2015 I closed on an apartment in downtown Seattle

Like many other geeks over the past few years, I've invested much time and effort in
building a great home network, trying to balance speed, ease of use, investment of time,
and so today I

Separation of concerns is central to any software developer's mindset, and when it comes
to the ever-important home network, until recently "enterprise-grade" networking has been
rather expensive and frankly not always worth it.

Highlights
- Speed test results
- UniFi controller interface
- Wave G (formerly CondoInternet) overview
- CAT3

UBNT networking equipment

Wave G - CondoInternet

CAT3 cabling

Condo cabling

Looking forward

