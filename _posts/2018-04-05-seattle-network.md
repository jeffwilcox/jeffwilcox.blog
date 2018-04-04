---
layout: post
comments: true
title: "My home network: Ubiquiti UniFi, Microwave Wave G Internet, CAT6 and CAT3 wiring"
categories: [tech]
tags: [network, networking, internet, waveg]
location: "SEATTLE, WA USA"
jumbotron: true
jumbotronStyle: "background: url('//az414997.vo.msecnd.net/waz/2018network/rooftop-pano-web.jpg') no-repeat left center; background-size: cover; overflow: hidden; min-height: 500px;"
jumbotronTitle: "A photo of the Belltown neighborhood and downtown Seattle, the Space Needle, and rooftop wireless backhaul networking equipment"
---

In Seattle we're spoiled in multi-family residential buildings thanks to affordable symmetric 1000 Mbps Internet, served by a 
great regional network.

It's been an interesting journey improving my home network over the past few years after purchasing 
my apartment, evolving from the rotating Asus-Linksys-Apple-Cisco network tech of the day at home to finally making the jump and 
adopting Ubiquiti Networks equipment in 2016.

After 2 years with Ubiquiti Networks equipment (18 months on their UniFi platform), I'm a huge fan, as evidenced through the 
build-outs I've done at home, our building, encouraging friends and family, and yeah, my Twitter feed. Decoupling routing and wireless 
access points at home was a big win for me and I cannot be happier.

This post will be much too long, full of unoptimized large images, and partially humblebrag. I hope to cover:

- the Pacific Northwest Iternet connectivity and gigabit scene
- the microwave tech that enables many condo and apartment buildings to be served by Wave G (a.k.a. CondoInternet) and other ISPs
- my home network gear featuring the UniFi line of managed gear from Ubiquiti Networks
- challenges, including a CAT3 *(yes, CAT3 - Category 3)* home run and pulling new CAT6 in a steel/concrete condominium

> This post is from the perspective of a tech enthusiast in Seattle: I do not represent any of the companies mentioned, and the information I have about the Seattle region's Internet providers and services is only as accurate as what I have researched and the stories I've heard. Full disclosure: while my initial Ubiquiti investments were 
my own, in late 2017 I was provided 1 UniFi AC-HD access point unit to evaluate my upgrade from the AC-Pro to HD line. I have since purchased an AC-HD AP at my own cost.

# Seattle Internet Connectivity

Even today I remember the conversation with my friend Alex a decade ago when 15Mbps down and 1Mbps up was a pretty common cable Internet product offering:

> Alex: "Yeah, well, we have CondoInternet. It's symmetric 100 Mbps up and down."
> Me: "Hmm... that seems pretty hard to believe. There must be caps or something. It's not that fast. That's like university-grade."
> Alex: "Well, it's real. Also, they offer 1000Mbps up and down."

I love being 3 milliseconds away from the Westin Building Exchange, Seattle Internet Exchange and all of that lovely peering, with a 1000Mbps connection and solid gear in the rack at home.

Turns out it's real. Seattle has great Internet, and with a little more competition, it hopefully will spur some more innovation in this space. Comcast is even starting to bow to the pressure of "gigabit" and they are starting to offer gigabit+ speeds in some areas powered by DOCSIS 3.1, if you're willing to keep with them and their bandwidth limitations and other policies.

## Competition

Three years ago, the [Seattle City Council ended the "cable franchise" system](https://www.geekwire.com/2015/seattle-city-council-approves-legislation-that-eliminates-cable-tv-franchise-districts/) in the city, enabling multiple 
cable providers to finally compete for service. This is most evident in our condo now: for over a decade our 
building was served by what is today known as "Wave Broadband", but has had other names such as Millennium Digital in the 
past. In late 2017, Comcast brought conduit into our building's main distribution frame and then to each floor's independent 
distribution frame, so today every unit in our building has complete choice between 5 providers, including 2 cable providers for TV, Internet, etc..

While the franchise rules were removed a few years ago, only recently did our building's 10-year contract expire (with an exclusivity clause) expire, allowing us to open the cable portion of the building up to multiple providers.

Our condominium has several connectivity choices, a more common thing now that the quasi-monopoly of a single cable provider per building has been struck down. Every individual unit in our building has their own choice between the following providers:

- CenturyLink traditional phone and DSL
- Wave broadband cable TV, Internet, phone
- Comcast cable TV, Internet, phone
- Wave G Gigabit Internet
- DirecTV satellite TV service

I believe that most people in our building use Wave G for Internet, but I do not have data. Not having a modem between the provider is clean and simple.

## Wave G - CondoInternet

  - The intrastructure
  - Speed
  - Why Wave G is so valuable to Seattle apartment and condo developers

## 60GHz Microwave Internet

60 GHz unlicensed spectrum; BridgeWave hardware; SFP; 45 watts consumption https://www.bridgewavedirect.com/wp-content/uploads/2015/10/BW64_64X_Datasheet.pdf

Today we're also seeing a lot of Ubiquiti equipment appearing on rooftops, but our building is still served by the BridgeWave product line.

## Seattle: Westin Building Exchange

I still remember the disbelief when a good friend told me they had "true 100mbps Internet at home, but could upgrade to gigabit" in 2009. Their Internet service was powered by CondoInternet. Turns out I also lived in a building served by CondoInternet and so was active with the service a few hours later after a quick phone call to activate my account, where they flipped on my unit's Ethernet drop from their network closet. That was easy. Working at Microsoft I appreciate the world-class network I have access to at work, but I love that when I work from home, I have Internet that is as fast, or faster, than what I have at work, with lower latencies and a very direct connection to the Westin Building Exchange.

Techies in Seattle living in apartments and condo buildings have had blazing fast Internet for almost a decade. I am blessed to have gigabit Internet connectivity at home for the monthly cost of $80. While gigabit speeds are very common today across the region and especially worldwide, across the United States the cable monopoly and lobbyists tend to prevent any competition in this space. Wave G provides a high-value service in dense areas, essentially cashing in on customers with high expectations for connectivity and being able to cherry pick great opportunities for installations.

Today Wave G is the same service - CondoInternet (and its parent, Spectrum Networks) was acquired. Wave has also recently snatched up other niche providers in the area. CondoInternet was a boutique Seattle-area ISP serving multi-family dwellings, providing awesome connectivity, no bandwidth caps, taking advantage of the ease of wiring modern construction for Ethernet, all while monopolies like Comcast offered compartively slow, expensive services.

Since CondoInternet became available, I have lived in 3 buildings served by CondoInternet, most recently purchasing a condo a few years ago in a building with the service. I find it interesting that buildings and realtors do not more prominently advertise the availability of gigabit Internet service in the same way that Seattle Craigslist ads regularly mention "one block away from the Microsoft Connector", etc., to help draw in the tech crowd.

Westin Building Exchange
Over 200 ISPs, carriers, service providers; 19.5 MW of backup generation capacity
Rooftop line of site
34 stories tall
Hosts the Seattle Internet Exchange (SIX)
Also has lots of folks - is Equinix SE2
Next door is the relatively new Equinix SE3 facility
Largest non-commercial member-governed Internet exchange in the US; funded by donations and one-time 10Gbps port fees
Peers include Microsoft, Yahoo, Amazon, Twitter, Netflix, Google, Facebook, Peer 1, and more
http://www.datacenterknowledge.com/archives/2014/09/17/amazon-to-recycle-data-center-heat-in-seattle-offices/
https://www.westinbldg.com/Connectivity
6th and Virginia on the edge of Belltown and the Denny Triange
Datacenter heat from the building is recycled to heat Amazon's Day One/Doppler building complexes

Neighborhood also has the New York Internet (NYI) SEA1 data center on Western Ave
I believe Spectrum has fiber between WBE and NYI

<img src="{{ site.cdn }}2018network/other-buildings.jpg" class="img-responsive" title="A look toward Elliott Bay, highlighting microwave Internet rooftop connections as part of the neighborhood mesh network." />

A look toward Elliott Bay, highlighting microwave Internet rooftop connections as part of the neighborhood mesh network.

<img src="{{ site.cdn }}2018network/other-buildings2.jpg" class="img-responsive" title="Looking across the Belltown neighborhood, nearly every rooftop has microwave backhaul equipment." />

Looking across the Belltown neighborhood, nearly every rooftop has microwave backhaul equipment.

<img src="{{ site.cdn }}2018network/waveg-fiber.jpg" class="img-responsive" title="A large service loop of fiber in one of the intermediate distribution frames. Fiber runs from the rooftop down to the communications room (the main distribution frame) through the risers in the building alongside other communications providers. Fiber also runs between the two towers in our building." />

A large service loop of fiber in one of the intermediate distribution frames. Fiber runs from the rooftop down to the communications room (the main distribution frame) through the risers in the building alongside other communications providers. Fiber also runs between the two towers in our building.

<img src="{{ site.cdn }}2018network/2018-mdf-2.jpg" class="img-responsive" title="A look at the main distribution frame (comms room) serving the building, including traditional telco, multiple cable providers, DirecTV, and our rooftop microwave backhaul provider." />

A look at the main distribution frame (comms room) serving the building, including traditional telco, multiple cable providers, DirecTV, and our rooftop microwave backhaul provider.

<img src="{{ site.cdn }}2018network/2018-mdf.jpg" class="img-responsive" title="A closer look at some of the backhaul equipment including routing, switching and fiber patching." />

A closer look at some of the backhaul equipment including routing, switching and fiber patching.

<img src="{{ site.cdn }}2018network/rooftop-microwaves.jpg" class="img-responsive" title="Rooftop 60GHz microwave backhaul equipment." />

Rooftop 60GHz microwave backhaul equipment.

<img src="{{ site.cdn }}2018network/rooftop-waveg1.jpg" class="img-responsive" title="The roof has multiple clusters of bakhaul equipment to cover many buildings that are a part of the backhaul network." />

The roof has multiple clusters of bakhaul equipment to cover many buildings that are a part of the backhaul network.

<img src="{{ site.cdn }}2018network/netflix-fast.png" class="img-responsive" title="According to Netflix fast.com, the connection speed is approximately 920 Mbps." />

According to Netflix fast.com, the connection speed is approximately 920 Mbps.

# My UniFi network

- Ubiquiti UniFi
  - The pitch
  - The hardware
  - My EdgeMax experience
  - Fan replacement
  - My network

Separation of concerns is central to any software developer's mindset, and when it comes
to the ever-important home network, until recently "enterprise-grade" networking has been
rather expensive and frankly not always worth it.


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

<img src="{{ site.cdn }}2018network/unifi-overview-home.png" class="img-responsive" 
     title="Accessible from anywhere online, the UniFi controller software provides a simple, clean interface that lets you manage the family of network devices from a central place." />

Accessible from anywhere online, the UniFi controller software provides a simple, clean interface that lets you manage the family of network devices from a central place.

<img src="{{ site.cdn }}2018network/unifi-clients-building.png" class="img-responsive" 
     title="The  clients view shows all of the connected devices, high-level stats, current activity, and the ability to configure, tag and customize connections for that client." />

The  clients view shows all of the connected devices, high-level stats, current activity, and the ability to configure, tag and customize connections for that client.

<img src="{{ site.cdn }}2018network/unifi-clients-home-plus-dpi-apple-tv.png" class="img-responsive" 
     title="In this screenshot, I've selected my Apple TV client entry. The Deep Pack Inspection experience lets me see a summary of the services that the client has been using. Looks like we use most of our media streaming bandwidth on HBO Now, Netflix, etc." />

In this screenshot, I've selected my Apple TV client entry. The Deep Pack Inspection experience lets me see a summary of the services that the client has been using. Looks like we use most of our media streaming bandwidth on HBO Now, Netflix, etc.

<img src="{{ site.cdn }}2018network/unifi-dpi-my-phone.png" class="img-responsive" 
     title="The DPI view for my iPhone shows details about how I use my phone on the home network." />

The DPI view for my iPhone shows details about how I use my phone on the home network.

<img src="{{ site.cdn }}2018network/unifi-device-adoption-screen.png" class="img-responsive" 
     title="When you connect a new UniFi device to your local network, you 'adopt' the device through the controller, at which point you can configure and control it. You can also see devices that are disabled or not currently connected, but that have been adopted." />

When you connect a new UniFi device to your local network, you 'adopt' the device through the controller, at which point you can configure and control it. You can also see devices that are disabled or not currently connected, but that have been adopted.

<img src="{{ site.cdn }}2018network/unifi-devices-building.png" class="img-responsive" 
     title="In the Devices view, you see all the Ubiquiti UniFi equipment you have such as access points, the router, and managed switches. This view is from a larger network deployment for our condo building common areas and staff use." />

In the Devices view, you see all the Ubiquiti UniFi equipment you have such as access points, the router, and managed switches. This view is from a larger network deployment for our condo building common areas and staff use.

<img src="{{ site.cdn }}2018network/unifi-events-building.png" class="img-responsive" 
     title="Events such as interference on wireless channels, administrators signing into the controller, PoE devices coming online, and new clients are all shown in this area. I also pipe all of these events to my network attached storage." />

Events such as interference on wireless channels, administrators signing into the controller, PoE devices coming online, and new clients are all shown in this area. I also pipe all of these events to my network attached storage.

<img src="{{ site.cdn }}2018network/unifi-fan-modification.jpg" class="img-responsive" 
     title="Noctua replacement fans I have put in the security gateway device." />

One issue I had, with my home office use of the UniFi equipment, is that I do not have a nicely cooled server room to store the equipment in. Instead, the equipment is in the media cabinet connected to my home office.

The fans in both the UniFi 24-port PoE switch and also the security gateway were too noisy for my taste, so I replaced them with Noctua brand quiet fans. It's much nicer now, though my warranty is probably voided. The cost for a quiet home environment.

<img src="{{ site.cdn }}2018network/unifi-hd-pro-overhead.jpg" class="img-responsive" 
     title="An overhead look at the UniFi UAP AC Pro next to the beefier UAP AC HD." />

An overhead look at the UniFi UAP AC Pro next to the beefier UAP AC HD.


<img src="{{ site.cdn }}2018network/unifi-hd-pro-side-by-side.jpg" class="img-responsive" title="A side view of the UniFi UAP AC Pro next to the beefier UAP AC HD." />

A side view of the UniFi UAP AC Pro next to the beefier UAP AC HD.

10
<img src="{{ site.cdn }}2018network/unifi-neighboring-access-points-home.png" class="img-responsive" title="" />

12
<img src="{{ site.cdn }}2018network/unifi-rf-utilized.png" class="img-responsive" title="" />

13
<img src="{{ site.cdn }}2018network/unifi-sg-home.png" class="img-responsive" title="" />

14
<img src="{{ site.cdn }}2018network/unifi-switch-view-southb.png" class="img-responsive" title="" />

15
<img src="{{ site.cdn }}2018network/unifi-switchstats-graphs-home.png" class="img-responsive" title="" />

16
<img src="{{ site.cdn }}2018network/unifi-topology-building.png" class="img-responsive" title="" />

17
<img src="{{ site.cdn }}2018network/unifi-topology-home.png" class="img-responsive" title="" />

18
<img src="{{ site.cdn }}2018network/unifi-topology-home-simple.png" class="img-responsive" title="" />

19
<img src="{{ site.cdn }}2018network/unifi-traffic-building.png" class="img-responsive" title="" />

20
<img src="{{ site.cdn }}2018network/unifi-traffic-home.png" class="img-responsive" title="" />

21
<img src="{{ site.cdn }}2018network/unifi-wireless-networks.png" class="img-responsive" title="" />

22
<img src="{{ site.cdn }}2018network/unifi-wireless-rf-environment.png" class="img-responsive" title="" />

23
<img src="{{ site.cdn }}2018network/updated-home-network-rack.jpg" class="img-responsive" title="" />

24
<img src="{{ site.cdn }}2018network/waveg-ping-times.png" class="img-responsive" title="" />

25
<img src="{{ site.cdn }}2018network/wireless-speed-testing.png" class="img-responsive" title="" />



>> Azure portal screenshot


<img src="{{ site.cdn }}2018network/ubnt-wifi-hallway.jpg" class="img-responsive" title="" />

<img src="{{ site.cdn }}2018network/rackview.jpg" class="img-responsive" title="" />

<img src="{{ site.cdn }}2018network/2018-rack.jpg" class="img-responsive" title="" />

<img src="{{ site.cdn }}2018network/office-rack6.jpg" class="img-responsive" title="" />

<img src="{{ site.cdn }}2018network/rack-with-sgpro.jpg" class="img-responsive" title="" />

## 2016: UniFi + EdgeRouter

## 2017: UniFi everywhere

## 2018: UniFi UAP AC-HD

## UniFi deep packet inspection

## Ease of PoE

## Remote VPN

## Site-to-site VPN

## Cloud connectivity

Cloud Access

able to connect to my home
family
our building also has UniFi equipment I help maintain

## Remote syslog

write to synology

## Fan noise

## Consumer AmpliFi line

Someone else who lives in my building recently purchased the AmpliFi line of consumer wireless 
equipment from Ubiquiti, but unfortunately I haven't spent the time to learn about it. People 
do say it's a nice and easy product, and it has some nice features.

# Condo challenges

## WiFi in the city

## CAT3

## As-built records

## Metal studs

An interesting side effect of living in a high-rise building is that our tower is constructed 
with common commercial construction materials, so in our building we have steel studs supporting 
the walls as opposed to wood.

This makes pulling wires more difficult, you need to use wire grommits to protect the wires, and 
if you cannot find an existing penetration in the studs, you need to improvise. A positive of the 
metal studs, however, is that there is a not a wood fire block halfway up the wall as you might 
find if you're wiring CAT6 across multiple levels in a traditional American home.

## Interior vs exterior walls

Our condo association rules are more strict about "limited common" walls (those shared with the community 
or other owners), so it's easy to run wires and things within your own interior walls, but if you are 
dealing with the exterior walls you need to instead run cables through exposed conduit, behind the baseboards, 
under the floors, etc.

Fun stuff.

In my office, which shares a common wall with another unit, I have several cables running under the floor 
now, including speaker wire, several CAT6 pulls, and 2x digital optical audio cables.

## Carlon RiserGard for "the future"

## HDMI over Fiber, HDMI over CAT6

cloudk1

<img src="{{ site.cdn }}2018network/cloudkeytray1.jpg" class="img-responsive" title="" />

ck2

<img src="{{ site.cdn }}2018network/cloudkeytray2.jpg" class="img-responsive" title="" />

micfmch

<img src="{{ site.cdn }}2018network/microfische-machine.jpg" class="img-responsive" title="" />

catj

<img src="{{ site.cdn }}2018network/cat3-jack.jpg" class="img-responsive" title="" />

cat6 cat3 mess
<img src="{{ site.cdn }}2018network/cat6-cat3-wall-mess3.jpg" class="img-responsive" title="" />

cat6 splicing
<img src="{{ site.cdn }}2018network/cat6-splicing.jpg" class="img-responsive" title="" />

cat6 wiring svc loop
<img src="{{ site.cdn }}2018network/cat6-wiring-service-loop.jpg" class="img-responsive" title="" />

structured media
leviton
hotel/condo

<img src="{{ site.cdn }}2018network/leviton-in-wall.jpg" class="img-responsive" title="" />

<img src="{{ site.cdn }}2018network/living-room-problem-connection.png" class="img-responsive" title="" />

ceiling 1
<img src="{{ site.cdn }}2018network/ceiling-running-cables.jpg" class="img-responsive" title="" />

closet 1
<img src="{{ site.cdn }}2018network/closet-running-cat6.jpg" class="img-responsive" title="" />

elec in ceil
<img src="{{ site.cdn }}2018network/electrical-in-ceiling.jpg" class="img-responsive" title="" />

ent kitchen ceiling
<img src="{{ site.cdn }}2018network/running-ent-through-kitchen-ceiling-walls.jpg" class="img-responsive" title="" />

uap blue
<img src="{{ site.cdn }}2018network/ubnt-uap-blue-night.jpg" class="img-responsive" title="" />

uap in wall install
<img src="{{ site.cdn }}2018network/ubnt-uap-wall-install.jpg" class="img-responsive" title="" />

ubnt wifi bedroom
<img src="{{ site.cdn }}2018network/ubnt-wifi-bedroom.jpg" class="img-responsive" title="" />

<img src="{{ site.cdn }}2018network/ubntuap.jpg" class="img-responsive" title="" />

# References

Some interesting articles that I found while researching parts of this post:

- https://www.reddit.com/r/IAmA/comments/2m3awz/we_are_the_founders_of_condointernet_and_were/
- http://www.bbpmag.com/2013mags/october/BBC_Oct13_CondoInternet.pdf
- http://www.geekwire.com/2013/spectrum-wave-condointernet/
- http://www.geekwire.com/2013/condointernet-expands-service-ballard/
- http://www.bbpmag.com/2013mags/october/BBC_Oct13_CondoInternet.pdf
- https://www.geekwire.com/2015/seattle-city-council-approves-legislation-that-eliminates-cable-tv-franchise-districts/
