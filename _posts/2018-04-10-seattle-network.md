---
layout: post
comments: true
title: "My home network: Ubiquiti UniFi gear, microwave gigabit Internet, CAT6 and CAT3 wiring"
categories: [tech]
tags: [network, networking, internet, waveg]
location: "SEATTLE, WA USA"
neighborhood: "BELLTOWN"
jumbotron: true
jumbotronStyle: "background: url('//az414997.vo.msecnd.net/waz/2018network/rooftop-pano-web.jpg') no-repeat left center; background-size: cover; overflow: hidden; min-height: 500px;"
jumbotronTitle: "A photo of the Belltown neighborhood and downtown Seattle, the Space Needle, and rooftop wireless backhaul networking equipment"
---
Fast access points mounted where they're useful. WiFi that just works. True 
symmetric gigabit Internet. Modern managed network gear. Pulling CAT6 cable 
while dealing with ancient CAT3 in a condo.

This is my long-overdue post about some of the delightful experiences, challenges,
and summary of the tech I'm thankful to have had the time to install and enjoy
at home.

In Seattle we're lucky to have broad access in apartments/condos to
gigabit Internet from providers such as 
[Wave G](https://waveg.wavebroadband.com/) (a.k.a. CondoInternet). My building 
is served by 60GHz millimeter wave connections, and I wanted to take the time
to describe some of how that is setup for our condo.

Beyond having access to fast connections, latency is super low. Our ISPs tend 
to be very close to cloud providers to the peering opportunities in downtown Seattle's 
colos and carrier hotels such as the 
[Westin Building Exchange](https://www.westinbldg.com/), home of the non-profit 
[Seattle Internet Exchange](https://www.seattleix.net/), moving terabits per second.

Having fast Internet creates pressure to be able to move a lot of packets to 
take advantage of the speed.

Like many other tech enthusiasts over the last few years, one of the best 
tech decisions at home was moving to the [Ubiquiti Networks](https://www.ubnt.com/) 
UniFi line of enterprise gear for routing, switching, and WiFi access points. 
I've been running a Ubiquiti network at home for over 2 years and have to 
share that story.

Finally, I wanted to document some of the challenges with old CAT3 and 
pulling new pulling CAT6 within the constraints of my condo building.

<img src="{{ site.cdn }}2018network/post-collage.jpg" class="img-responsive" title="From left-to-right: UniFi security gateway pro, PoE switch, and other rack gear; a screenshot of the deep packet inspection features of the UniFi Controller; an access point glowing; screenshot of my 2G RF environment; picture of one of the intermediate distribution frame (IDF) near my unit" />

Sorry, this post will be much too long, full of un-optimized images...

<small>Disclaimer:<br />
This post is from the perspective of a tech enthusiast in Seattle: I do not
represent any of the companies mentioned, and the information I have about the
Seattle region's Internet providers and services is only as accurate as what I
have researched and the stories I've heard. While all of my initial Ubiquiti 
equipment purchases were my own, in late 2017 I was provided a single UniFi 
AC-HD access point unit by Ubiquiti to try out. I've since purchased a new 
AC-HD access point at my own cost.</small>




<!-- ---------------- WAVE G ---------------- -->




# Wave G / CondoInternet

Even today, I remember the conversation with my friend Alex a decade ago when 15/2
(15Mbps down, 2Mbps up) was a pretty common cable Internet product offering, and
if you had to get DSL, it would be even slower.

> Alex: "Yeah, well, in my building we have CondoInternet now. It's symmetric 100 Mbps up and down."
>
> Me: "Hmm... that seems pretty hard to believe. That's like what I had at university... There must be caps or something. It can't be  that fast!"
>
> Alex: "Well, it's real. Also, they offer 1000Mbps up and down, a static IP if you want it, no bandwidth caps, no contract. The future!"

Turns out: it's real. If you live in an apartment or condo in Seattle, chances 
are you're reading this through your [Wave G](https://waveg.wavebroadband.com) 
connection, but for those that are not familiar with the service, this is a 
primer.

Wave G, known as CondoInternet before being acquired, was founded a decade ago 
by techies who ran their own wholesale bandwidth business and wanted to have 
fast Internet at home in their condos, too.

Today it is the gold standard for everyone from tech employees working from home 
to just being the best ISP to stream content through.

It's basically the opposite of Comcast, by the way: no contracts, no upward 
price changes, quick service, no cable modem required, no bundling.

All you have to do is setup your account and then plug an Ethernet cable 
into your homerun wallplate, and a few feet away, in a comms closet, is Wave G's 
managed switch equipment and network.

Interestingly Wave has more recently been purchased by a leveraged buyout and 
investment firm, TPG Capital, so it'll be interesting to see what happens to 
the service over time. There's also some competition in this space - while 
another similar service called Cascadelink was acquired by Wave as well, Google 
Fiber now owns Webpass, which is popping up in buildings in the neighborhood, 
offering slightly less expensive gigabit connections.

## Pricing

If you pay for gigabit, Wave G configures your switch port for full duplex 
1000Mbps, otherwise your link will negotiate to 100Mbps.

The pricing as far as I can remember has been $60/month for 100Mbps 
or $80/month for 1000Mbps. A few years ago gigabit was double the price of the 
hundred megs, so there was a positive price adjustment.

## Most of the web is slow...

Keep in mind, while 1000Mbps is the theoretical maximum, most web sites and 
cloud services aren't going to be able to make full use of your connection 
in any sustained way.

<img src="{{ site.cdn }}2018network/quick-windows-download.png" class="img-responsive" title="At least you can download Windows and Linux ISO images in a few minutes" />

While you can stream 4K content just fine without buffering, or download an OS 
image in seconds, at home you don't really need a gigabit connection for most 
daily web tasks (yet).

Having it there is great and you're ready for the future.

## Wave G's network

Once your home is connected to Wave G's network, they have their own 
efficient gear that connects to their fiber and rooftop microwave backhaul gear,
eventually peering inside datacenters and nearby colos like the 
[Westin Building Exchange](https://www.westinbldg.com/) and the 
[Seattle Internet Exchange (SIX)](https://www.seattleix.net/),
providing short hops around the Internet.

From my home network, my CAT6 networked machines get sub-millisecond - to - 1ms
ping times to Google, Microsoft, and all the major modern Internet services, just 
a few hops away...

<img src="{{ site.cdn }}2018network/waveg-ping-times.png" class="img-responsive" title="" />

## 890-940Mbps typical test speeds

Testing with [SpeedTest.net](http://www.speedtest.net/) I'll usually see 
download speeds between 850-950Mbps depending on the test site selected, and 
interestingly, my upload speeds are usually measured consistently around 950Mbps.

Only wired equipment will experience the full potential, as WiFi clients in my
urban neighborhood deal with a lot of interference from thousands of competing
wireless devices.

According to Netflix's [fast.com](https://fast.com), my connection is ~920Mbps.
I like that the Netflix service does a good job of estimating your ideal 
Netflix experience, a super common activity for home users.

<img src="{{ site.cdn }}2018network/netflix-fast.png"
class="img-responsive"
style="max-width: 360px"
title="According to Netflix fast.com, the connection speed is approximately 920 Mbps." />

## Rooftop millimeter wave radio backhaul

My building isn't connected to Wave G's network by fiber, but instead by 
millimeter wave / microwave backhaul radios.

If you look out from our tower's roof toward Elliott Bay, you can see a few of
the other nearby buildings that we connect to:

<img src="{{ site.cdn }}2018network/other-buildings.jpg" class="img-responsive" title="A look toward Elliott Bay, highlighting microwave Internet rooftop connections as part of the neighborhood mesh network." />

Turning around and facing downtown Seattle, looking across the Belltown
neighborhood, there are many rooftop sites:

<img src="{{ site.cdn }}2018network/other-buildings2.jpg" class="img-responsive" title="Looking across the Belltown neighborhood, nearly every rooftop has microwave backhaul equipment." />

Our roof has at least 6x [BridgeWave 60GHz millimeter wave radios](https://bridgewave.com/bw64/).
Each of these antennas provides a 1Gbps full-duplex encrypted link between locations,
essentially a large private mesh network between campuses.

<img src="{{ site.cdn }}2018network/rooftop-microwaves.jpg" class="img-responsive" title="Rooftop 60GHz microwave backhaul equipment." />

## Static IPs and IPv6 blocks

I don't actually know the latest on this story (whether it's a monthly or a
one-time charge now), but when I requested my static IP years ago, it was a one-time 
$15 fee for a static static IPv4 address, and now I also have my own IPv6 block.

## Great tech support

I've never experienced a large outage, but when I was first setting up my
connection, due to the CAT3 wiring to my unit, I was only able to get 100Mbps
connection to the carrier switch.

A tech was able to come out and help me diagnose the connectivity issue -
because of the token ring CAT3 wiring in my unit, the signal was being
heavily degraded.

We experimented with a few alternate locations and ideas, and in the end, found
that by terminating the CAT3 pairs for the network connection as soon as
reasonable (near where the CAT3 homerun came out of the concrete slab's conduit),
I could get a reliable 1000Mbps connection.

## Easy activation

Since there are no contracts, and multi-family buildings are all wired for
their service up to your local communications room, it's easy to get going.

If your unit has been served by Wave G in the past, chances are you have an
Ethernet jack in your unit that is still connected to their switch in a
nearby comms room.

I've lived in 3 different buildings with Wave G service in the past, and in all
cases was able to get up and running over the phone or quickly after signing up
for the service, as they can activate the port for the speed you need, and
you're on your way.

If your unit hasn't been served by them in the past, there are a few different
scenarios, but they all play out quickly by a tech:

- Your unit's cable may need to be punched down or patched to a Wave G switch port
- Your unit's interior network closet may need to get patched to the Wave G uplink
- You may need to have an existing telephone jack converted to a CAT6 keystone jack (if you're served by CAT3, which was my case)
- You might need a VDSL or other device (probably rare now)

## A valuable asset to apartments/condos

I made it a point while looking to purchase a home that I understood the current
Internet offerings available for each potential property.

I'm surprised that more apartment rental advertisements or real estate listings
do not clearly call out that they are served by a modern gigabit Internet
provider. While it feels like nearly every modern apartment building in the city
has such a provider available now, I still meet fellow tech employees and
building residents who aren't aware of how great the offering is.

Seems worth highlighting, similar to letting people know that your property
is within walking distance of a Microsoft Connector bus stop for employees.

## Building infrastructure

Having helped with enough projects around my condo building, I'm pretty familiar 
with its communications infrastructure. Here's how our building's comms work, 
and I imagine most condos designed in this era are pretty similar.

The Main Distribution Frame (MDF) is located 3 levels below ground (the "C level garage") 
in the core of our high-rise tower. The MDF is where the phone company, multiple cable
companies, and other services come together. For Wave G, this is where they 
have installed their core switching equipment, fiber splices, and UPS backup.

Here's a photo from within our MDF. From left to right, approximately:
- traditional telephone provider
- various business phone lines
- fire equipment
- VOIP lines and our building's private network
- Comcast coax
- Wave G rack of equipment
- Wave Broadband coax
- DirecTV

<img src="{{ site.cdn }}2018network/2018-mdf-2.jpg" class="img-responsive" title="A look at the main distribution frame (comms room) serving the building, including traditional telco, multiple cable providers, DirecTV, and our rooftop microwave backhaul provider." />

From the MDF, Wave G fiber runs in 2 directions: up 15 floors to the rooftop
where the millimeter wave gear is mounted, and the other several hundred feet 
through conduit in the garage, up several floors to the low-rise tower.

Within the core of the building, telcom rooms alternate with power generation 
and electric meter utility rooms. The communication rooms are also known
as Intermediate Distribution Frame (IDF) rooms.

The IDFs are  a mess, and I expect all the carriers are to blame a little bit. 
Respect to the contractors who visit and leave the IDFs cleaner than they found 
them.

Here's the IDF on my floor... from left to right, there's a panel where the fiber 
and some network cabling goes up to the rooftop, Comcast, some of our building's 
private network cable, Wave G equipment and switch, traditional telco, 
individual unit CAT3 patch panels, coax and other equipment, and a bunch of messy 
coax splitters and amplifiers.

<img src="{{ site.cdn }}2018network/idf-11.jpg" class="img-responsive" title="A sample IDF, full of equipment, switch, lots of different communications providers in one place." />

Each unit's homerun cabling comes into punchdown terminals where both POTS and 
Wave G can be patched in. Wave G customers then are patched to their switch.

Here's a closer look at the short patch runs from the switch down to the
CAT3 unit patch panels:

<img src="{{ site.cdn }}2018network/idf-patch.jpg" style="max-width: 300px" class="img-responsive" title="A closer look at the patch connections between the Wave G switch, individual units punchdown terminals, and telco pairs" />

A single CAT3 cable in our building can then support both
plain-old-telephone-service (POTS) and modern Wave G (Ethernet). Sigh.

From the punchdown panels, a unit's CAT3/5/6 cable runs through the ceiling in 
a rather tiny flex conduit embedded in the concrete slab. 

<img src="{{ site.cdn }}2018network/idf-conduit-homeruns.jpg" class="img-responsive" title="Conduit homeruns embedded in the slab" />





<!-- ---------------- SIX, WBX ---------------- -->





# Seattle's Internet connectivity

Not counting my favorite Azure data center where I spend a lot of my days, the 
Pacific Northwest's Internet gravity is at the edge of Belltown at the corner 
of Virginia Street and 6th Avenue... not because of the thousands of Amazonians 
looking for lunch around there every daym but because of the Westin Building 
next to the Westin hotel.

The Westin Building, named for the corporate headquarters of the Westin hotel 
chain (before they were purchased by Starwood Hotels and then a much more boring hotel
conglomerate), is an office building turned carrier and fiber hotel.

I don't know the network topology between my condo and the Westin Building, but 
Wave G is part of Spectrum, an extension member of the Seattle Internet Exchange 
hosted in the Westin Building... near my condo there's also the NYI SEA1 
datacenter on Western Ave, and there must be plenty of fiber between there and 
the Westin Building.

## Westin Building Exchange

Today the 34-story Westin Building is mostly colo space, tons of network gear 
and fiber, and I can only imagine the building's bandwidth, as they are home to 
over 200 ISPs. According to 
[the Westin Building Exchange datasheet](https://www.westinbldg.com/Content/PDF/WBX_Fact_Sheet.pdf),
they have over 19.5 megawatts of backup generation available from 17 diesel
generators.

If you've heard of Equinix, a major connectivity company, their SE2 data
center is located within the Westin Building, and a few years ago they built
an orange/concrete-colored 8-story building, SE3, located right next door to the
Westin Building's garage... and Palace Kitchen. Tasty.

## Seattle Internet Exchange (SIX)

The [Seattle Internet Exchange](https://www.seattleix.net/about) (SIX) has a cool 
story... as a non-profit that is now more than 20 years old, they offer the 
community a great service by peering terabits of traffic. They started out in 
a small closet in the Westin Building.

SIX is completely transparent, their website is full of near real-time graphs 
of their aggregate traffic, lists of all their peering members, etc. 
[Really do go check out the SIX statistics page now](https://www.seattleix.net/statistics/). 
While you're at it, I also enjoyed a [YouTube video about SIX with Jared Reimer](https://www.youtube.com/watch?v=N2ChhZcH2ok) that helps share some of this story from a conference.

The story about SIX is that a few engineers were super frustrated to find that 
they were seeing "a 111ms round trip time between 2 companies on the very same 
19th floor of the Westin Exchange"... turns out their traffic was going from 
the 19th floor... to Texas... back to the 19th floor of the building. Peering 
sure could help.

As of 2017 they had 284 participants in the exchange who pay a one-time
reasonable fee for their port; today at peak they aggregate over a
terabit of traffic.

Here's [their topology, including the switch equipment and models](https://www.seattleix.net/topology).

If you happen to be sitting nearby to SIX, they do not charge monthly port 
connection fees, just the one-time... $100 for a 1000Mbps port, $2,000 for 10GbE, 
and $10,000 for your 40GbE or 100GbE SFP module.

Since they are very transparent in all things, you can review [the whole list](https://www.seattleix.net/participants/) or 
[this list](https://www.seattleix.net/participants/switches/SIX_7512R.txt) and 
[that list](https://www.seattleix.net/participants/switches/SIX_7508E.txt) of 
the companies and providers who peer with them, including:

- Amazon
- Dropbox
- Facebook
- Google
- GitHub
- Microsoft
- Netflix

Having all the cloud computing providers close is great. Wave G / Spectrum is 
part of the SIX extension and has a 40Gbps port between its network and SIX.

If I `traceroute` from my home to a VM I have in Azure, I see just a hops,
each a millisecond or two at most:

1. My UniFi router
2. My building's router
3. Wave G / Spectrum
4. Seattle Internet Exchange router
5. Microsoft's SIX network edge
6. A few hops around Microsoft

If I trace the route to Google, they peer directly with Spectrum, so it's even
fewer hops to them (8 hops from my PC to 8.8.8.8).





<!-- ---------------- UBIQUITI ---------------- -->





# Ubiquiti UniFi

With a very fast Internet connection comes the responsibility of managing your
home network with a mind toward simplicity, performance, and awesomeness.

While many customers of CondoInternet enjoy the typical consumer gear - Asus,
Linksys, Apple - it makes sense to invest in business-grade equipment that
will last longer, offer advanced features, and be able to move as many packets
as possible.

I invested in a set of Ubiquiti Networks gear in 2016 after deciding I had had 
enough with consumer WiFi equipment. I had a decent Cisco managed switch sitting 
behind an Asus router, and an Apple AirPort Extreme acting as an additional AP. 
Nothing fit together, I had to reboot the router constantly, and I knew there 
had to be something better out there.

While I first adopted their EdgeRouter PoE device, and appreciated its declarative 
configuration story, I found myself wanting the integrated experience and dashboards 
that the Ubiquiti [UniFi line of enterprise WiFi systems"](https://unifi-sdn.ubnt.com/)
had.

Today my home network is built from:

- UniFi Security Gateway Pro
- UniFi 24-port 250W PoE switch
- 2x UniFi UAP AC-HD Access Points
- UniFi 8-port PoE switch
- UniFi CloudKey

With 2 years of experience with UniFi, I must say, I am a very happy customer, as
evidenced by the build-outs I've done in my unit, in my building at large,
convinced friends to do, and yes, my Twitter feed. I love their stuff!

I enjoyed reading [Troy Hunt's post](https://www.troyhunt.com/ubiquiti-all-the-things-how-i-finally-fixed-my-dodgy-wifi/);
also, a shoutout to [Clint Rutkas](https://twitter.com/ClintRutkas) for sharing his
experience - he embarked on a similar journey around the same time as I did,
and I know many of my coworkers at Microsoft also have great Ubiquiti experiences.

I absolutely love the advanced features that Ubiquiti offers at in easy-to-use manner. From
VLAN tagging to multiple wireless networks, guest network features and advanced
connectivity options, its all there.

So, what are some of the components, features, and so on?

## UniFi Controller (CloudKey)

All of your UniFi network sites are controlled through a central place, the
UniFi controller. While you could install the controller on a notebook or a
server, the best route to go is to pick up the UniFi CloudKey. The CloudKey
has the controller installed on it and then you can access the management
website from anywhere.

Instead of independently configuring your router's via its IP address and its
portal, then the same for your managed switches, everything is consistent in
the controller.

Think of the CloudKey as the best $100 investment for a Raspberry Pi-like server.

Here's a look at the home screen in the controller, where you can see overall
site status, stats on connected devices, throughput.

<img src="{{ site.cdn }}2018network/unifi-overview-home.png" class="img-responsive"
     title="Accessible from anywhere online, the UniFi controller software provides a simple, clean interface that lets you manage the family of network devices from a central place." />

### Devices view

All of the UniFi network devices that are a part of your network site appear within
the 'Devices' page.

This also includes devices that were "adopted" in the past, but are not actively
connected, as well as devices that are new, "pending adoption".

Once you adopt a device, it can be controlled through your controller instance.

In this view of my home UniFi network, you can see:

- My USG Security Gateway Pro (router)
- Multiple UniFi managed switches
- An access point
- A new UniFi AP AC-HD access point that is ready to be adopted
- A disconnected/disabled device - an old access point (that I was replacing in this screenshot)

<img src="{{ site.cdn }}2018network/unifi-device-adoption-screen.png" class="img-responsive"
     title="When you connect a new UniFi device to your local network, you 'adopt' the device through the controller, at which point you can configure and control it. You can also see devices that are disabled or not currently connected, but that have been adopted." />

Here's the condo building's security camera and office network - it has more devices, and I've
opened up the details for one of the PoE switches in this view.

For each connected port, you get high-level status, information about whether it is powered
by PoE, and then a summary for the device - stats including how long it's been up, what version
of the UniFi firmware it is running, overall power consumption and temperature.

<img src="{{ site.cdn }}2018network/unifi-devices-building.png" class="img-responsive"
     title="In the Devices view, you see all the Ubiquiti UniFi equipment you have such as access points, the router, and managed switches. This view is from a larger network deployment for our condo building common areas and staff use." />

### Clients view

Within the controller you can drill down into the client view that shows you
individual devices that have connected.

For each device you can learn how it is connected to the network, whether a switch
port or a specific wireless network, its current activity level and stats, and how
long it has been on the network.

You can filter and sort the view by type of connection or other properties.

You can also manually add clients or view all configured clients if you are managing
devices that have static IPs, specific tags or properties, but are currently not
connected.

This view is of the clients connected to my condo building's private network (this is
not my home network). It has more clients connected so looks more interesting.

On the right side, there's a panel open taking a look at one of the UniFi PoE switches
on the network and also one of the access points - you can have multiple configuration
panels open at once to maintain your productivity in managing the site.

<img src="{{ site.cdn }}2018network/unifi-clients-building.png" class="img-responsive"
     title="The  clients view shows all of the connected devices, high-level stats, current activity, and the ability to configure, tag and customize connections for that client." />



12
<img src="{{ site.cdn }}2018network/unifi-rf-utilized.png" class="img-responsive" title="" />

13
<img src="{{ site.cdn }}2018network/unifi-sg-home.png" class="img-responsive" title="" />

23
<img src="{{ site.cdn }}2018network/updated-home-network-rack.jpg" class="img-responsive" title="" />


<img src="{{ site.cdn }}2018network/rackview.jpg" class="img-responsive" title="" />

<img src="{{ site.cdn }}2018network/2018-rack.jpg" class="img-responsive" title="" />

<img src="{{ site.cdn }}2018network/office-rack6.jpg" class="img-responsive" title="" />

<img src="{{ site.cdn }}2018network/rack-with-sgpro.jpg" class="img-responsive" title="" />


### Events

A rolling stream of events can be accessed within the UniFi Controller, and I also have these events
streamed to a remote syslog server running on my network-attached storage server.

It's especially interesting to watch access points that experience interference and need to switch
channels and watch clients come and go.

<img src="{{ site.cdn }}2018network/unifi-events-building.png" class="img-responsive"
     title="Events such as interference on wireless channels, administrators signing into the controller, PoE devices coming online, and new clients are all shown in this area. I also pipe all of these events to my network attached storage." />

## UniFi Access Points

Power over Ethernet makes it super simple to add access points exactly where
you want them, instead of where it's close to your Internet router or cable
modem.

The only job of an AP is to make wireless happen; being able to offload that
from the router makes diagnostics easier.

Here's one of the access points I've installed along an edge of a kitchen living
area. Plenum CAT6 runs through the soffit to where the access point is mounted
on the wall.

<img src="{{ site.cdn }}2018network/ubnt-wifi-hallway.jpg" class="img-responsive" title="A UniFi access point is wall mounted above a hallway" />

In a bedroom, I have another access point installed. Visually it blends in to
the wall just like the emergency building intercom and Nest Protect already
on the wall.

<img src="{{ site.cdn }}2018network/ubnt-wifi-bedroom.jpg" class="img-responsive" title="A UniFi access point mounted alongside a bedroom wall" />

### Wall or ceiling mount

UniFi Access Points (UAP) are easy to mount - ceiling, wall mount, ceiling
tile in a business environment, etc.

While I would love to have this mounted on the ceiling for the best reception
and range, my ceiling is concrete, so no options there without running exposed
CAT6 along the ceiling.

While you could mount the access point around a low voltage old work box or
near a CAT6 keystone, I've chosen to keep a service loop of CAT6 in the wall
and then simply attached a CAT6 end that I've poked through the wall.

<img src="{{ site.cdn }}2018network/ubnt-uap-wall-install.jpg" class="img-responsive" title="Wall mounting an access point" style="max-width:500px" />

The access point rotates onto the base frame, and to remove it, you can use a
paperclip to wedge the removal point.

### LED indicator light

At the site-wide level you can toggle LED indicator lights on and off, and then
per Ubiquiti device, you can configure whether to override that setting by
forcing the LED on or off.

The soft blue glow when the access point may be nice in a business setting or
a living room to indicate that the connectivity is good, but I have chosen to
turn off the glow in my other location in a bedroom.

The indicator light can also illuminate in different colors and patterns if
it is upgrading firmware, having connectivity issues, etc.

<img src="{{ site.cdn }}2018network/ubnt-uap-blue-night.jpg" class="img-responsive" title="A soft blue glow indicates that the access point is powered, connected and healthy" />

#### Pro mounting system

While installing some access points in shared community areas of my condo
building, I discovered the [UniFi Professional Mounting System](https://store.ubnt.com/products/unifi-professional-mounting-plate)
which is a $9 precision-crafted bracket.

We've used these in our parking garage where we were able to easily mount the
access points to standard 4"x4" electrical boxes that were secured to the concrete
ceiling.

<img src="{{ site.cdn }}2018network/unifi-pro-kit.jpg" class="img-responsive" title="The pro mounting kit, useful in commercial or business environments" />

In the above photo, on the left: the bracket mounted to a 4"x4" square junction
box. Flexible conduit attaches to the j-box and CAT6 runs through it into the box
and then through the hole to be plugged into the AP. On the right, the access
point once mounted and powered up via PoE with its signature blue glow.

The brackets are a fair value and have holes for traditional wall mount, T-bar ceiling mounts (common commercial drop ceilings),
3.5" round j-boxes, 4" square j-boxes, 1-gang outlet boxes, 4" round j-boxes,
and european outlet boxes. Slick, simple design.

## Neighboring access point data

One of the unfortunate side effects of living in the city is that you are
competing with hundreds of other access points, wireless devices, even radar.

If I open my Mac and try and pick a wireless connection, there are hundreds to
scroll through.

The UniFi controller is also always collecting data on neighboring access points. In
the past they called this the "Rogue AP report", but it was renamed.

I could imagine a business using this to keep tabs on whether people are bringing
their own wireless access points or routers into the corporate environment,
but in a city, it's mostly interesting to just get a bird's eye view of how
much connectivity is around.

<img src="{{ site.cdn }}2018network/unifi-neighboring-access-points-home.png" class="img-responsive" title="" />

I regularly see 400-500 access points listed in this report.

## RF environment

If you are OK to take an access point offline for a few minutes, UniFi APs are
able to perform a scan of the 2G and 5G wireless utilization around that access
point. This can be very helpful in planning how to allocate channels and
diagnose performance issues.

Here's a side-by-side of the 2G and 5G environment in my main living area. The
2G wireless spectrum is almost entirely bogged down by all of the competing
devices, but the 5G channels are much more readily available.

<img src="{{ site.cdn }}2018network/unifi-wireless-rf-environment.png" class="img-responsive" title="A screenshot after performing radio frequency (RF) scans of both the 2.4GHz and 5GHz spectrum near one of my access points. Lots of contention in the 2G space." />

I must use 5GHz wireless devices as much as possible.

21
<img src="{{ site.cdn }}2018network/unifi-wireless-networks.png" class="img-responsive" title="" />

## AC-HD Upgrade

An overhead look at the UniFi UAP AC Pro next to the beefier UAP AC HD.
<img src="{{ site.cdn }}2018network/unifi-hd-pro-overhead.jpg" class="img-responsive"
     title="An overhead look at the UniFi UAP AC Pro next to the beefier UAP AC HD." />

A side view of the UniFi UAP AC Pro next to the beefier UAP AC HD.
<img src="{{ site.cdn }}2018network/unifi-hd-pro-side-by-side.jpg" class="img-responsive" title="A side view of the UniFi UAP AC Pro next to the beefier UAP AC HD." />

25
<img src="{{ site.cdn }}2018network/wireless-speed-testing.png" class="img-responsive" title="" />

Getting 400+ up an down over WiFi is quite an accomplishment for me, with all
the interference in the city, this is about the most that I've ever been able
to maintain beyond the wired network.


## Topology

While my home network is rather simple - a router, a primary switch, two access
points and a switch under my desk, the topology view for the UniFi network is
super interesting and helpful when building out larger networks.

<img src="{{ site.cdn }}2018network/unifi-topology-home-simple.png" class="img-responsive" title="" />

By being able to visualize the network, understand which ports are uplinks and
downlinks, the channels in use by various access points, all in one place is
super.

<!--
<img src="{{ site.cdn }}2018network/unifi-topology-home.png" class="img-responsive" title="" />
-->

<img src="{{ site.cdn }}2018network/unifi-topology-building.png" class="img-responsive" title="" />

You can toggle link labels and clients on/off.

## Switch stats

Similar to the topology view, there are multiple ways to dig through the
data regarding your switch ports. In the Switch Stats view you can see aggregate 
stats for individual ports over time, the name and type of connection for the 
client connected to a port, etc.

<img src="{{ site.cdn }}2018network/unifi-switchstats-graphs-home.png" class="img-responsive" title="The switch stats view helps show per-port aggregated stats and other information, such as the name of the connected client" />

For any individual switch, you can always see the summary of its ports and types 
of connections from any part of the UniFi UI.

<img src="{{ site.cdn }}2018network/unifi-switch-view-southb.png" class="img-responsive" style="max-width:420px" title="" />


## UniFi deep packet inspection

If you turn deep packet inspection (DPI) on, you begin to collect statistics 
and all sorts of interesting information about how your WAN connection is being
used by clients.

At a high level, in aggregate, you'll be able to learn where your household 
or business spends a lot of time, and at the individual client connection level, 
you can get summary stats there, too.

Since many web sites and services are encrypted these days (a good thing!), you 
end up with some easily identified sources of data and then a lot falls by the 
wayside... most sites are just "encrypted", and then the really big cloud 
services and streaming services I think are identified by IP range/bucket:

- 406 GB of HTTP over TLS (encrypted web traffic, could be nearly any site)
- 216 GB of HBO streaming
- 193 GB of Netflix
- 130 GB of SSL/TLS
- 58 GB of "Google User Content"
- 51 GB of YouTube
- 30.7 GB of "Microsoft Authentication via SSL"
- 16 GB of Amazon video streaming

<img src="{{ site.cdn }}2018network/unifi-traffic-home.png" class="img-responsive" title="" />

If I select a client from the clients view, like my Apple TV, I can then see
its individualized totals...

<img src="{{ site.cdn }}2018network/unifi-clients-home-plus-dpi-apple-tv.png" class="img-responsive"
     title="In this screenshot, I've selected my Apple TV client entry. The Deep Pack Inspection experience lets me see a summary of the services that the client has been using. Looks like we use most of our media streaming bandwidth on HBO Now, Netflix, etc." />

<!--
<img src="{{ site.cdn }}2018network/unifi-dpi-my-phone.png"
style="max-width: 320px"
class="img-responsive"
     title="The DPI view for my iPhone shows details about how I use my phone on the home network." />
-->

<!--
<img src="{{ site.cdn }}2018network/unifi-traffic-building.png" class="img-responsive" title="" />
-->

## VPN

Lots of great VPN support is of course built into the UniFi Security Gateway.

### Remote VPN

Being able to remotely connect via L2TP is nice to let me get to my home 
network and its devices from anywhere in the world, whether that's my iPhone,
a notebook computer somewhere, etc.

It's easy to setup and configure, and the latest release of the UniFi controller 
software has a built-in RADIUS server - so for me, I've found it even easier 
than before, when I used to run a RADIUS server on my network storage server instead.

### Site-to-site VPN

Although I no longer utilize it, I used to run an Azure site-to-site VPN 
connection between my local network and my personal vnet in the cloud. This
made it super simple to connect to and debug a Kubernetes cluster I was
experimenting with.

### Virtual LANs

I make use of VLAN tagging to keep my guest network separate from my primary 
network, and also to separate most of my "Internet of Things" connections from 
my other gear.

## Fan noise

The higher-end PoE and security gateway products are not quiet. They aren't
really designed for my use case - home office, media cabinet.

If sound is an issue, do note that the 8-port PoE switch would be a great 
product to buy if you want quiet, and the standard Security Gateway is very 
nice, too.

For me, I like having everything rackmounted, and so I end up with noisy
rackmount gear, because racks are supposed to be loud.

The fans in both the UniFi 24-port PoE switch and also the security gateway were too noisy for my taste, so I replaced them with Noctua brand quiet fans. It's much nicer now, though my warranty is probably voided. The cost for a quiet home environment.
<img src="{{ site.cdn }}2018network/unifi-fan-modification.jpg" class="img-responsive"
     title="Noctua replacement fans I have put in the security gateway device." />




<!-- ---------------- CONDO WIRING ---------------- -->





# Condo wiring challenges


The building I live in was built in 2003, a time when CAT5 is a very common
cabling choice. Several other buildings built in the same condo era have CAT5
from each floor's telecommunications closet to the unit.

For whatever reason, my building's developer was cheap, and so our building
was cursed with **Category 3 (CAT3)** network cable.

What is CAT3? It's not CAT5, that's for sure. [According to wikipedia](https://en.wikipedia.org/wiki/Category_3_cable), it "was widely
used in computer networking in the early 1990s for 10BASE-T Ethernet".

In my building, they've used 6-pair CAT3 cable, so that they can run
a 10/100 network alongside traditional teleco service on the same cable,
saving money.

Here's the fun part: through some in-unit modifications and luck, I'm able to
get full 1000Mbps connectivity through the CAT3 cable. While I'd love to
pull new CAT6 from the comms room, the flex conduit run inside the concrete
slab is only a quarter inch, and there are snags in the run, so it would be
a super fragile operation.









Upgrading and improving a wired network is pretty difficult in a building 
such as mine: we're a steel-and-concrete construction building, so unless
there's existing conduit that was placed when the concrete slab was originally 
poured, there's no way to get new capacity and technologies easily from the 
communications room to the unit.

Within the unit, besides the soffits and a few slightly dropped ceilings, you 
need to cable through the walls, making it really challenging to pull cable
through the studs.

On top of all this, my condo building developer was a little cheap (they all
are), and so in the end we got CAT3 to the home instead of CAT5 or newer.

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

<img src="{{ site.cdn }}2018network/ubntuap.jpg" class="img-responsive" title="" />

# References

Some interesting articles that I found while researching parts of this post:

- https://www.reddit.com/r/IAmA/comments/2m3awz/we_are_the_founders_of_condointernet_and_were/
- http://www.bbpmag.com/2013mags/october/BBC_Oct13_CondoInternet.pdf
- http://www.geekwire.com/2013/spectrum-wave-condointernet/
- http://www.geekwire.com/2013/condointernet-expands-service-ballard/
- http://www.bbpmag.com/2013mags/october/BBC_Oct13_CondoInternet.pdf
- https://www.geekwire.com/2015/seattle-city-council-approves-legislation-that-eliminates-cable-tv-franchise-districts/
