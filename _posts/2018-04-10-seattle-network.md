---
layout: post
comments: true
title: "My home network: Ubiquiti UniFi gear, fiber gigabit Internet, CAT6 and CAT3 wiring"
categories: [tech]
tags: [network, networking, internet, waveg]
location: "SEATTLE, WA USA"
neighborhood: "BELLTOWN"
jumbotron: true
jumbotronStyle: "background: url('//az414997.vo.msecnd.net/waz/2018network/rooftop-pano-web.jpg') no-repeat left center; background-size: cover; overflow: hidden; min-height: 500px;"
jumbotronTitle: "A photo of the Belltown neighborhood and downtown Seattle, the Space Needle, and rooftop wireless backhaul networking equipment"
---
WiFi that just works with multiple mounted access points. Symmetric 1000 Mbps 
symmetric gigabit Internet. Centrally managed enterprise network gear. Pulling 
new CAT6 while dealing with old CAT3 in a condo.

This is my story, long overdue, about some of the experiences, challenges, and 
information about the connectivity tech I enjoyed at home. I love not having to 
worry about my WiFi ever having issues, even in the dense city, thanks to 
enterprise-grade gear.

In Seattle we're lucky to have broad access in apartments/condominiums to
gigabit Internet from providers such as 
[Wave G](https://waveg.wavebroadband.com/) (a.k.a. CondoInternet). Having a 
zippy connection without bandwidth caps means that I'm free to stream 4K content,
backup my on-premise storage to the cloud, and not worry about keeping 
operating system installation disc images around.

My building's gigabit is provided by a 10G fiber link to a data center just a 
few blocks away, which then has its own 40G link to classic peering location in
Seattle - . Our rooftop also has several 60GHz millimeter wave radio links, 
available either as backup or to serve nearby buildings. In this post 
I wanted to share how that infrastructure is deployed in my condo building.

With fiber to our building there are minimal hops between major cloud 
providers and big networks thanks to the many peering opportunities in downtown
Seattle. The 
[Westin Building Exchange](https://www.westinbldg.com/) carrier hotel/colo is 
home to the important non-profit 
[Seattle Internet Exchange](https://www.seattleix.net/), moving terabits per second, 
with a transparent approach that lets you peek at their stats, story and customers.

Having fast Internet creates pressure to be able to move a lot of packets to 
take advantage of the speed, and that's where enterprise-grade managed network
equipment comes in. There's a lot of value in the data and featureset of the 
UniFi line from [Ubiquiti Networks](https://www.ubnt.com/) when it comes to 
routing, switching, and access points.

I've been running a Ubiquiti network at home for over 2 years and have been very
happy with that investment.

<img src="{{ site.cdn }}2018network/post-collage.jpg" class="img-responsive" title="From left-to-right: UniFi security gateway pro, PoE switch, and other rack gear; a screenshot of the deep packet inspection features of the UniFi Controller; an access point glowing; screenshot of my 2G RF environment; picture of one of the intermediate distribution frame (IDF) near my unit" />

Finally, I wanted to document some of the challenges with old CAT3 and 
pulling new pulling CAT6 within the constraints of my condo building, mostly to
share my pain.

Apologies in advance, this post is full of up-optimized images and is much too
long.

<small>Disclaimer:<br />
I'm a tech enthusiast in this space but don't represent any of the companies 
mentioned. While my initial Ubiquiti buildout in Feb. 2016 was my own, in 
Dec. 2017 I was provided a demo AC-HD access point to evaluate. 
I've since purchased my own AC-HD.</small>

<strong>4/15/18 update:<br />
Through follow-up conversations on Twitter following this post, I discovered 
something amazing: our building was originally provided Internet through 
millimeter wave, and still has it as a backup and to provide coverage to other 
nearby buildings, but our building is actually connected directly through a 
10 Gigabit fiber link. Cool!
</strong>

<strong>4/16/18 update:<br />
Wave G (Spectrum and family) actually has at least 1x 100 Gbit fiber connection 
to the SIX, soon to have a second.
</strong>



<!-- ---------------- WAVE G ---------------- -->





# Wave G / CondoInternet

Even today, I remember a conversation with my friend Alex a decade ago when 
15 Mbps down, 2 Mbps up cable Internet was a common offering from Comcast and 
competitors, and if you used DSL, it'd be even slower.

> Alex (in 2008): "My apartment building just got CondoInternet. 100 Mbps up and down, no caps or contracts."
>
> Jeff: "That's hard to believe, that's like what I had in my university dorm room, but no commercial providers offer that sort of speed. There must be caps or something. It can't be  that fast!"
>
> Alex: "It's true, and I hear you can also get a 1000 Mbps connection. This is the future."

Alex was right, I was wrong. 
If you live in an apartment or condo in Seattle, chances are you're reading this 
via your [Wave G](https://waveg.wavebroadband.com) connection, but for those 
that are not familiar with the service, this is a primer.

Wave G, formerly known as CondoInternet before being acquired by the Wave 
conglomerate, was founded a decade ago by techies who ran their own wholesale 
bandwidth business and wanted to have fast Internet at home in their condos.

Today, the Wave G gigabit product is the gold standard for everyone from tech 
employees working from home to being the best ISP in town to stream content with.
It's basically the opposite of Comcast: no contracts, no upward pricing pressure,
quick service, no cable modem required, no bundling.

If your multi-family building is connected to Wave G (hundreds are), often you
only need to make a phone call and patch your unit's home run network cable 
to your router or computer.

From the home run, a nearby comms closet holds Wave G's managed switch equipment,
at which point you're on their network: fiber from our building runs to a 
nearby data center, then Seattle's central peering fiber hotel.

## Locations

Wave G is available today in several cities in Western Washington including 
Seattle, Bellevue and Everett; Portland, Oregon; and in California, Roseville 
and then San Francisco all the way to San Jose.

<img src="{{ site.cdn }}2018network/wave-locator.png" class="img-responsive" title="A screenshot of the Wave G service locator" />

There's some competition, too - while Wave acquired a previous similar company,
Cascadelink, Google Fiber's Webpass is available in the neighborhood,
and I'm seeing more expansion there. Wave was recently purchased by a 
leveraged buyout and investment firm, TPG Capital, and I'm interesting to see 
what happens to the service. Hopefully no change.

## Pricing

If you pay for gigabit, Wave G configures your switch port for full duplex 
1000 Mbps negotiation; otherwise your link will negotiate to 100 Mbps.

The pricing as far as I can remember has been $60/month for 100 Mbps 
or $80/month for 1000 Mbps. A few years ago gigabit was double the price of the 
hundred megs, so there was a price reduction.

## Most of the web is slow...

While you can stream 4K content just fine without buffering, or download an OS 
image in seconds, at home you don't really need a gigabit connection for most 
daily web tasks (yet).

While just under 1000 Mbps is the theoretical gigabit maximum, most web sites 
and cloud services aren't going to be able to make full use of your connection 
in a sustained manner. Large files hosted on CDNs should be quick at least:

<img src="{{ site.cdn }}2018network/quick-windows-download.png" class="img-responsive" title="At least you can download Windows and Linux ISO images in a few minutes" />

Having gigabit at least feels like a key requirement to experiment with 4K
content, keeping all your storage in the cloud, VR, and other up-and-coming 
advancements.

## Wave G's network

Once your home is connected to Wave G's network, they have their own 
efficient gear that connects to their fiber, eventually peering with 
others inside data centers and nearby colo facilities like the 
[Westin Building Exchange (WBX)](https://www.westinbldg.com/) and the 
[Seattle Internet Exchange (SIX)](https://www.seattleix.net/),
providing short hops and low latency. Buildings near ours connect to the 
10 Gbit fiber backhaul our building has underground using millimeter wave 
radios on the roof of our building.

This is where the original Condo Internet company took advantage of their
parent company, Spectrum Networks, and their wholesale bandwidth offerings and
connectivity.

From my home network, my CAT6 networked machines get sub-millisecond - to - 1ms
ping times to Google, Microsoft, and all the major modern Internet services, just 
a few hops away...

<img src="{{ site.cdn }}2018network/waveg-ping-times.png" class="img-responsive" title="" />

## 890-940 Mbps typical test speeds

Testing with [SpeedTest.net](http://www.speedtest.net/) I'll usually see 
download speeds between 850-950 Mbps depending on the test site selected, and 
interestingly, my upload speeds are usually measured consistently around 950 Mbps.

In my home, only wired equipment experiences the full potential of this
connectivity, since WiFi is very dense in my neighborhood - lots of interference 
means that devices individually often connect at a slower line rate.

According to Netflix's [fast.com](https://fast.com), when I recently checked, 
my connection was approximated to 920 Mbps. Fast.com does a nice job of 
estimating various data sources to find a number that represents how your 
Netflix experience should be.

<img src="{{ site.cdn }}2018network/netflix-fast.png"
class="img-responsive"
style="max-width: 360px"
title="According to Netflix fast.com, the connection speed is approximately 920 Mbps." />

## Fiber backbone

While many buildings in Wave G's network are connected by millimeter wave 
rooftop connections, our building has a 10G fiber connection. Our building also
has rooftop millimeter wave dishes to serve other nearby buildings that do not
have fiber runs.

If you look out from our tower's roof toward Elliott Bay, you can see a few of
the other nearby buildings that we connect to:

<img src="{{ site.cdn }}2018network/other-buildings.jpg" class="img-responsive" title="A look toward Elliott Bay, highlighting microwave Internet rooftop connections as part of the neighborhood mesh network." />

Turning around and facing downtown Seattle, looking across the Belltown
neighborhood, there are many rooftop sites, likely all part of the Wave G
network:

<img src="{{ site.cdn }}2018network/other-buildings2.jpg" class="img-responsive" title="Looking across the Belltown neighborhood, nearly every rooftop has microwave backhaul equipment." />

Our roof has 6+ [BridgeWave 60GHz millimeter wave radios](https://bridgewave.com/bw64/).
Each of these antennas provides a 1 Gbps full-duplex encrypted link between locations,
essentially a large private mesh network.

<img src="{{ site.cdn }}2018network/rooftop-microwaves.jpg" class="img-responsive" title="Rooftop 60GHz microwave backhaul equipment." />

In our building's garage basement, that network connects to the 10 Gigabit 
backbone network that Spectrum networks and Wave G runs.

## Static IPv4, IPv6 blocks

I don't actually know the latest on this story (whether it's a monthly or a
one-time charge now), but when I requested my static IP years ago, it was a one-time 
$15 fee for a static static IPv4 address, and now I also have my own IPv6 block.

When moving between buildings and units, I've needed to get a new static IP 
address, but have been happy with the great support experience in requesting 
those changes and coordinating my moves.

## Great tech support

I've never experienced a large outage, but when I was first setting up my
connection, due to the CAT3 wiring to my unit, I was only able to get 100 Mbps
connection to the carrier switch.

Wave G's primary equipment has commercial UPS units present, and the switching
gear throughout the building runs off of the emergency generator circuit in
our building.

When I first moved to my condo, I had a tech come out to help me look into why 
I was only able to get a 100 Mbps connection, and in the end I learned a lot
about CAT3 and the heavy signal degradation I was experiencing. (More about my
CAT3 woes later in this post)

The tech even came out with a box of CAT5e cable in case we wanted to pull a new
home run to my unit. Appreciate the enthusiasm and free support.

## Easy activation

Since there are no contracts, and so many multi-family buildings are already
wired for Wave G - with a switch near you - it's easy to get going.

If your unit has been served by Wave G in the past, chances are you have an
Ethernet jack in your unit that is still patched into to their switch, with
a disabled port. This can be remotely reactivated once you establish an
account.

I've lived in 3 different buildings with Wave G service in the past, and in all
cases was able to get up and running over the phone or quickly after signing up
for the service.

If your unit hasn't been served by them in the past, there are a few different
scenarios, but they all play out quickly by a tech:

- Your unit's cable may need to be punched down or patched to a Wave G switch port
- Your unit's interior network closet may need to get patched to the Wave G uplink
- You may need to have an existing telephone jack converted to a CAT6 keystone jack (if you're served by CAT3, which was my case)
- You might need a VDSL or other device to handle very old wiring (probably more rare today)

## A valuable building amenity

I made it a point while looking to purchase a home that I know what current
Internet offerings available for each potential property.

I'm surprised that more apartment rental ads and real estate listings don't
clearly call out that they are served by a gigabit Internet provider beyond the
cable company. I still meet fellow tech employees and residents in my building
who aren't aware of how great the offering is.

One other small branding issue - when Wave renamed Condo Internet to Wave G,
I've found that some of my building's residents believe that Wave G is the same
thing as the Wave cable/coax-based broadband product.

I try to tell them that Wave G is an amazing product, great connectivity and all.

Seems worth highlighting, similar to letting people know that your property
is within walking distance of a Microsoft Connector bus stop for employees.

## Building infrastructure

Having helped maintain and upgrade some of our building's tech, I'm familiar
with its communication infrastructure. Here's how our building's communications
equipment works.

The Main Distribution Frame (MDF) is located 3 levels below ground (the "C level garage") 
in the core of our high-rise tower. The MDF is where the phone company, multiple cable
companies, and other services come together. For Wave G, this is where they 
have installed their core switching equipment, fiber splices, and UPS backup.

Here's our MDF:

<img src="{{ site.cdn }}2018network/2018-mdf-2.jpg" class="img-responsive" title="A look at the main distribution frame (comms room) serving the building, including traditional telco, multiple cable providers, DirecTV, and our rooftop microwave backhaul provider." />

From left to right::

- traditional telephone provider
- various business phone lines
- fire equipment
- VoIP lines and our building's private network
- Comcast coax cable
- Wave G network rack
- Wave G fiber underground run from a nearby data center
- Wave Broadband coax cable
- DirecTV cable

Focusing on Wave G, from the MDF, fiber and CAT5 runs in 3 directions: the fiber
splits off - it runs up 15 floors to the rooftop, another connects 
hundreds of feet away to the other tower in our building, into its first 
communications room, and the backbone comes from an armored fiber run 
that goes several blocks away to the data center at 3101 Western Ave.

Within the core of the building, telco rooms alternate with power generation 
and electric meter utility rooms as you move up the risers. The communication 
rooms are also known as Intermediate Distribution Frame (IDF) rooms.

The IDFs are  a mess, mostly the cable companies who leave the rooms full of
splitters and amplifiers. I respect the contractors who visit and leave the IDF
cleaner than they found 'em!

Here's the IDF on my floor... from left to right: a panel where the fiber 
and some network cabling goes up to the rooftop, Comcast, some of our building's 
private network cable, Wave G equipment and switch, traditional telco, 
individual unit CAT3 patch panels, coax and other equipment, and a bunch of messy 
coax splitters and amplifiers.

<img src="{{ site.cdn }}2018network/idf-11.jpg" class="img-responsive" title="A sample IDF, full of equipment, switch, lots of different communications providers in one place." />

Each unit in our building has a choice between multiple providers, so a unit's 
coax cable connects to either Comcast, Wave broadband, or DirecTV in the IDF.

The network home run for our units is a single CAT3 6-pair cable that can carry
both network signals and POTS. Wave G patch cable is then punched into the network
terminals for customer units.

Here's a closer look at the short patch runs from the switch down to the
CAT3 patch panels:

<img src="{{ site.cdn }}2018network/idf-patch.jpg" style="max-width: 300px" class="img-responsive" title="A closer look at the patch connections between the Wave G switch, individual units punchdown terminals, and telco pairs" />

From the punchdown panels, the cables for all the units run to the ceiling 
and then into conduit embedded in the concrete slab.

<img src="{{ site.cdn }}2018network/idf-conduit-homeruns.jpg" class="img-responsive" title="Conduit homeruns embedded in the slab" />





<!-- ---------------- SIX, WBX ---------------- -->





# Seattle's Internet connectivity

Not counting my favorite Azure data center where I spend a lot of my days
virtually, the Pacific Northwest's Internet gravity is at the edge of Belltown, 
at the corner of Virginia Street and 6th Avenue... not because of the thousands 
of Amazonians looking for lunch around there every day, but because of the 
Westin Building office tower next to the Westin hotel.

The Westin Building, named for the corporate headquarters of the Westin hotel 
chain (before they were purchased by Starwood Hotels and then a much more boring hotel
conglomerate), is an office building turned carrier and fiber hotel.

From my condo building we have fiber to a data center a few blocks away at 
3101 Western Ave - home of the NYI SEA1 DC - and Wave / Spectrum has multiple 
fiber connections to the Westin Building from there, at least one of which is 
a 100 Gbit connection. Spectrum is also an extension member of the Seattle Internet Exchange 
hosted in the Westin Building.

## Westin Building Exchange

Today the 34-story Westin Building is mostly colo space, tons of network gear 
and fiber, and I can only imagine the building's bandwidth, as they are home to 
over 200 ISPs. According to 
[the Westin Building Exchange datasheet](https://www.westinbldg.com/Content/PDF/WBX_Fact_Sheet.pdf),
they have over 19.5 megawatts of backup generation available from 17 diesel
generators.

While a lot of the classic hosters and companies are located here, an example 
of the scale is Equinix, a major connectivity company: their SE2 data
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
terabit of traffic, and their members have over 4 Tbps of capacity.

Here's [their topology, including the switch equipment and models](https://www.seattleix.net/topology).

If you happen to be sitting nearby to SIX, they do not charge monthly port 
connection fees, just the one-time... $100 for a 1000 Mbps port, $2,000 for 10 GbE, 
and $10,000 for 40 GbE or 100 GbE SFP modules.

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
part of the SIX extension and has a 100 Gbps port between its network and SIX, 
[soon to be more](https://twitter.com/jwvo/status/986104140307750912).

If I `traceroute` from my home to a VM I have in Azure, I see just a hops,
each a millisecond or two at most:

1. My UniFi router
2. My building's router
3. Wave G / Spectrum network
4. Seattle Internet Exchange router
5. Microsoft's network edge at the Seattle Internet Exchange
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

## Rackmount

A favorite of mine is that the UniFi line has a silver distinctive finish that 
looks great in a home media rack.

<img src="{{ site.cdn }}2018network/2018-rack.jpg" class="img-responsive" title="My home media rack, including a UniFi Security Gateway Pro, UniFi 24-port PoE switch, a Synology storage device, and an Xbox One" />

While the Security Gateway Pro router that I have is rackmount-only, the 
Security Gateway model does a great job for home use and is tiny, like a simple 
network switch.

The UniFi 8-port switches are desktop friendly, and with the 16-port switches 
you have a choice of included rack ears for mounting or keeping it on a shelf 
or desktop. The 24+ switches are rackmount only.

<!--
<img src="{{ site.cdn }}2018network/updated-home-network-rack.jpg" class="img-responsive" title="" />
-->
<!--
<img src="{{ site.cdn }}2018network/rackview.jpg" class="img-responsive" title="" />
-->
<!--
<img src="{{ site.cdn }}2018network/rack-with-sgpro.jpg" class="img-responsive" title="" />
-->

## UniFi CloudKey Controller

All of your UniFi equipment's managed through the central UniFi controller. 
While you could install the controller software on a notebook or a
server, the best route to go is to pick up the UniFi CloudKey - that way you 
can avoid having to install the Java runtime. The CloudKey
has the controller installed on it and then you can access the management
website from anywhere.

Instead of independently configuring your router's via its IP address and its
portal, then the same for your managed switches, everything is consistent in
the controller.

Think of the CloudKey as the best $100 investment in the UniFi lineup, saving 
you from Java. It's a nice, small PoE-powered Raspberry Pi-like server. Here 
is the key attached to a simple rack tray.

<img src="{{ site.cdn }}2018network/cloudkeytray1.jpg" class="img-responsive" title="A CloudKey controller attached to a rack tray, providing UniFi Controller services to manage the network" />

Here's a look at the home screen in the controller, where you can see overall
site status, stats on connected devices, throughput.

<img src="{{ site.cdn }}2018network/unifi-overview-home.png" class="img-responsive"
     title="Accessible from anywhere online, the UniFi controller software provides a simple, clean interface that lets you manage the family of network devices from a central place." />

### Devices view

All of the UniFi network devices that are a part of your network site appear within
the 'Devices' page.

#### Device adoption

New devices need to be "adopted" into your managed network.  In this "devices"
view of my home UniFi network, you can see:

- My USG Security Gateway Pro (router)
- Multiple UniFi managed switches
- An access point
- A new UniFi AP AC-HD access point that is ready to be adopted
- A disconnected/disabled device - an old access point (that I was replacing in this screenshot)

<img src="{{ site.cdn }}2018network/unifi-device-adoption-screen.png" class="img-responsive"
     title="When you connect a new UniFi device to your local network, you 'adopt' the device through the controller, at which point you can configure and control it. You can also see devices that are disabled or not currently connected, but that have been adopted." />

Here's my condo building's security camera and office network - it has more devices, and I've
opened up the details for one of the PoE switches in this view.

For each connected port, you get high-level status, information about whether it is powered
by PoE, and then a summary for the device - stats including how long it's been up, what version
of the UniFi firmware it is running, overall power consumption and temperature.

#### WAN config

The security gateway can be configured with multiple WAN connections, in case 
you need redundant providers.

<img src="{{ site.cdn }}2018network/unifi-sg-home.png" class="img-responsive" title="" style="max-width:480px" />

#### Configuring a switch

<img src="{{ site.cdn }}2018network/unifi-devices-building.png" class="img-responsive"
     title="In the Devices view, you see all the Ubiquiti UniFi equipment you have such as access points, the router, and managed switches. This view is from a larger network deployment for our condo building common areas and staff use." />

#### Access point properties

For each access point you can configure the various wireless networks that 
should be broadcast by the AP, radio settings, and get an idea of the RF 
utilization near the device.

<img src="{{ site.cdn }}2018network/unifi-rf-utilized.png" class="img-responsive" title="Access point properties and RF utilization information" style="max-width:420px" />

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

### Events

A rolling stream of events can be accessed within the UniFi Controller, and I also have these events
streamed to a remote syslog server running on my network-attached storage server.

It's especially interesting to watch access points that experience interference and need to switch
channels and watch clients come and go.

<img src="{{ site.cdn }}2018network/unifi-events-building.png" class="img-responsive"
     title="Events such as interference on wireless channels, administrators signing into the controller, PoE devices coming online, and new clients are all shown in this area. I also pipe all of these events to my network attached storage." />

### Topology

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

### Switch stats

Similar to the topology view, there are multiple ways to dig through the
data regarding your switch ports. In the Switch Stats view you can see aggregate 
stats for individual ports over time, the name and type of connection for the 
client connected to a port, etc.

<img src="{{ site.cdn }}2018network/unifi-switchstats-graphs-home.png" class="img-responsive" title="The switch stats view helps show per-port aggregated stats and other information, such as the name of the connected client" />

For any individual switch, you can always see the summary of its ports and types 
of connections from any part of the UniFi UI.

<img src="{{ site.cdn }}2018network/unifi-switch-view-southb.png" class="img-responsive" style="max-width:420px" title="" />

### VPN

Lots of great VPN support is of course built into the UniFi Security Gateway.

#### Remote VPN

Being able to remotely connect via L2TP is nice to let me get to my home 
network and its devices from anywhere in the world, whether that's my iPhone,
a notebook computer somewhere, etc.

It's easy to setup and configure, and the latest release of the UniFi controller 
software has a built-in RADIUS server - so for me, I've found it even easier 
than before, when I used to run a RADIUS server on my network storage server instead.

#### Site-to-site VPN

Although I no longer utilize it, I used to run an Azure site-to-site VPN 
connection between my local network and my personal vnet in the cloud. This
made it super simple to connect to and debug a Kubernetes cluster I was
experimenting with.

#### Virtual LANs

I make use of VLAN tagging to keep my guest network separate from my primary 
network, and also to separate most of my "Internet of Things" connections from 
my other gear.


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

In a bedroom, I have installed another access point.

<img src="{{ site.cdn }}2018network/ubnt-wifi-bedroom.jpg" class="img-responsive" title="A UniFi access point mounted alongside a bedroom wall" />

### Wall or ceiling mount

UniFi Access Points (UAP) are easy to mount to the wall or ceiling.

While I would love to have this mounted on the ceiling for the best reception
and range, my ceiling is concrete, so no options there without running exposed
CAT6 or conduit along the ceiling.

While you could mount the access point around a low voltage old work box or
near a CAT6 keystone, I've chosen to keep a service loop of CAT6 in the wall
and then simply attached a CAT6 end that I've poked through the wall.

<img src="{{ site.cdn }}2018network/ubnt-uap-wall-install.jpg" class="img-responsive" title="Wall mounting an access point" style="max-width:500px" />

The access point rotates onto the base frame, and to remove it, you can use a
paperclip or removal tool to wedge tab and allow you to rotate the AP.

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

### Pro mounting system

While installing some access points in shared community areas of my condo
building, I discovered the [UniFi Professional Mounting System](https://store.ubnt.com/products/unifi-professional-mounting-plate)
which is a $9 precision-crafted bracket.

We've used this system in our parking garage to easily mount to j-boxes on
the ceiling.

<img src="{{ site.cdn }}2018network/unifi-pro-kit.jpg" class="img-responsive" title="The pro mounting kit, useful in commercial or business environments" />

<em>In the above photo, on the left: the bracket mounted to a 4"x4" square junction
box. Flexible conduit attaches to the j-box and CAT6 runs through it into the box
and then through the hole to be plugged into the AP. On the right, the access
point once mounted and powered up via PoE with its signature blue glow.</em>

The brackets are a fair value and have holes for traditional wall mount, 
T-bar ceiling mounts (common commercial drop ceilings), 3.5" round j-boxes, 
4" square j-boxes, 1-gang outlet boxes, 4" round j-boxes, and European outlet 
boxes.

### Configuring WiFi networks

You can configure several WiFi networks, for your corporate or private use, 
guests, and other purposes.

<img src="{{ site.cdn }}2018network/unifi-wireless-networks.png" class="img-responsive" title="The controller configuration screen" />

With VLAN tagging, the ability to configure different auth profiles, you can 
setup a more advanced RADIUS-backed network for yourself, then let everyone 
else use a more general traffic network when they visit.

While I don't use the guest portal features, there's a whole system to setup 
accepting payments, generating use tokens, etc., if you feel the urge to 
start a cybercafe.

### Neighboring access point data

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

I regularly see 200-300 access points listed in this report.

## RF environment

If you are OK to take an access point offline for a few minutes, UniFi APs are
able to perform a scan of the 2G and 5G wireless utilization around that access
point. This can be very helpful in planning how to allocate channels and
diagnose performance issues.

Here's a side-by-side of the 2G and 5G environment in my main living area. The
2G wireless spectrum is almost entirely bogged down by all of the competing
devices, but the 5G channels are much more readily available.

<img src="{{ site.cdn }}2018network/unifi-wireless-rf-environment.png" class="img-responsive" title="A screenshot after performing radio frequency (RF) scans of both the 2.4GHz and 5GHz spectrum near one of my access points. Lots of contention in the 2G space." />

I must use 5GHz wireless devices as much as possible!

<img src="{{ site.cdn }}2018network/living-room-problem-connection.png" class="img-responsive" title="" />

## UAP AC-HD Upgrade

In late 2017 I moved to the [UAP AC-HD](https://unifi-hd.ubnt.com/)
and have been very happy with this beefier 
access point. A swap-in replacement for the UAP AC Pro, it can reuse the pro's 
mounting bracket, making it a very quick swap out.

The HD access points are 802.11ac Wave 2 MU‑MIMO (Multi‑User, Multiple Input, Multiple Output) 
devices, designed to support tons of clients. For me, I believe this helps me 
better cut through the noise and still get decent performance in the 
interference-ridden city.

Comparing specs, the pro has a radio rate 450 Mbps (2.4 GHz) and 1300 Mbps (5 GHz), 
the HD has respective rates of 800 Mbps and 1733 Mbps max.

The units are physically larger; here's an overhead shot of the UAP AC HD on the 
left of the previous UAP AC Pro model.

<img src="{{ site.cdn }}2018network/unifi-hd-pro-overhead.jpg" class="img-responsive"
     title="An overhead look at the UniFi UAP AC Pro next to the beefier UAP AC HD." />

And a side view shows that the AC HD does protrude more from the mounting surface.

<img src="{{ site.cdn }}2018network/unifi-hd-pro-side-by-side.jpg" class="img-responsive" title="A side view of the UniFi UAP AC Pro next to the beefier UAP AC HD." />

After upgrading to the UAP AC-HD, I'm able to get 400 Mbps+ from my wireless devices,
where before I was more often in the 140 Mbps range.

<img src="{{ site.cdn }}2018network/wireless-speed-testing.png" class="img-responsive" title="Over WiFi, a speed test showing download speeds of 423 Mbp and upload of 474 Mbps with the UAP AC-HD" />

Getting 400+ up an down over WiFi is quite an accomplishment for me, with all
the interference in the city, this is about the most that I've ever been able
to maintain beyond the wired network.

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
- 51 GB of YouTube

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

## Fan noise

The higher-end PoE and security gateway products are not quiet. They aren't
really designed for my use case - home office, media cabinet.

If sound is an issue, do note that the 8-port PoE switch would be a great 
product to buy if you want quiet, and the standard Security Gateway is very 
nice, too.

I replaced the Ubiquiti stock fans with Noctua's quiet fans. It's very quiet
now, though my warranty is probably void.

<img src="{{ site.cdn }}2018network/unifi-fan-modification.jpg" class="img-responsive"
     title="Noctua replacement fans I have put in the security gateway device." />





<!-- ---------------- CONDO WIRING ---------------- -->





# Condo wiring

Many condos today are built with at least a modern Ethernet network in mind, so 
when they pull coax to the media jacks in the unit, they also pull CAT5e or CAT6.

These then terminate in a structured media cabinet (SMC) enclosure embedded in a 
wall. Usually made by Leviton, they tend to be in an office or by the electrical 
panel.

Here's one from a condo I used to live in at Hotel 1000 / Madison Tower in 
Seattle. Pretty good work was done, and I was able to add a CAT6 patch panel to 
the SMC to easily build a wired network in that unit. The SMC has:

- A simple map of the unit and the jack identifiers
- CAT5e punch-down block
- Simple switch for the VOIP phone system
- Unterminated coax running to all the wall plates
- Terminated CAT5e (though not patched to wall jacks)
- Home runs from the various providers

<img src="{{ site.cdn }}2018network/leviton-in-wall.jpg" class="img-responsive" title="A Leviton SMC with unterminated and terminated cables including network and coax, VOIP switch, etc." />

The building I live in was built in 2003, a time when CAT5 or CAT5e would be 
an entirely common cabling choice, but ... yeah, I wasn't so lucky. While I was 
aware of this before closing my real estate transaction, this isn't the sort of 
thing that is a deal breaker.

Even worse than not having an SMC were 2 other things: the home run to my unit 
was not modern network cable, and also that the units in my building were 
not built with network drops running throughout the units!

## Office rack

My network terminates in the office/media closet: a simple small rack that
houses the UniFi network equipment, UPS, storage, media and IoT systems.

<img src="{{ site.cdn }}2018network/office-rack6.jpg" class="img-responsive" title="In the office closet is a simple small rack with the network equipment, 3-zone media receiver, and other devices like an Xbox One and an Apple TV" />

The CAT6 I've pulled through my walls terminates into keystone jacks along the 
closet ceiling, and then patch cables connect to the switch.

This was different than a more traditional commercial termination where you 
might bring the network bundles together to a patch panel in the rack itself.
This way, if and when I move out, the keystone jacks will be able to stay as-is.

<!--
<img src="{{ site.cdn }}2018network/closet-running-cat6.jpg" class="img-responsive" title="A photo from the process of running wire down to the rack during installation" style="max-width: 420px" />
-->

Getting here took a lot of time and effort...

## CAT3

My building's developer was cheap, and unfortunately that means that we were 
cursed with *Category 3* (CAT3) cable daisy-chained throughout the individual 
unit, running all the way from the telecommunication room through to the last 
RJ11 jack in the unit after being terminated at 5 wall plates along the way.

Not knowing the intentions of the developer, my guess is that they saw CAT3 as 
a great way to save money when building out 200 units... while our original 
building electrical plan includes reference to structured media centers and 
network cable, all we got was CAT3.

What's CAT3? [According to wikipedia](https://en.wikipedia.org/wiki/Category_3_cable), it "was widely
used in computer networking in the early 1990s for 10BASE-T Ethernet".

My building used 6-pair CAT3 (12 conductors), the idea being that it was a 
compromise: you could offer a 10/100 network potentially alongside traditional 
telephone service on the same cable.

## Home run: risky to replace

A conundrum with the CAT3 run between my unit and the IDF runs 
through 1/4" flex conduit that's embedded in the concrete slab of the ceiling. 
It isn't an entirely straight shot.

While it does have a pull string, preliminary testing and planning to replace 
the CAT3 with 2x CAT6 cables indicates that there may be snags or other 
obstacles in the conduit.

The risk: trying to replace the CAT3 could risk being left without phone or 
Internet service to the unit. The decision was to not try and replace it at all.

## CAT3: Terminating daisy chain

For units in my building, the daisy chain design means that at most you can 
punch down a single network jack in the unit, and in the name of not making 
large alterations to units, this means that when Condo Internet first came by 
to install their service for a previous owner of my unit, they punched down 
the jack without terminating the CAT3 cable there...

As a result, by my estimates after poking around inside the walls, the length 
of the CAT3 wire being used was: 

- 60 feet from the IDF to the conduit termination in the ceiling above my kitchen
- 15 feet from the conduit to a blank wall plate and junction box in a closet
- 300 feet from the j-box past 4 RJ11 jacks and a few rooms
- The office Ethernet jack
- 150 feet of additional cable past 2 RJ11 jacks

This means an effective cable distance of 525 feet, likely leading to cross-talk or 
general signal degradation. Higher-grade CAT6 spec cable should only be 
run 328 ft. (100 m).

My link was therefore negotiating to 100 Mbps full duplex. Not horrible, but 
also not 1000 Mbps, and not as future-friendly.

I went into experimentation mode and tested punching down network jacks at all 
the RJ11 jacks in the unit to see what my network test equipment would say for 
distance, as well as the negotiated link quality with Condo Internet, and nothing 
improved much.

This is not your standard T56B coloring, by the way, since the 
orange and blue pairs are used for POTS.

<img src="{{ site.cdn }}2018network/cat3-jack.jpg" class="img-responsive" title="Connecting to CAT3 - note the conductor colors, not traditional T56B" style="max-width: 420px" />

At one of the closer jacks in terms of cable distance, I finally was able to 
get a full duplex 1000 Mbps connection negotiated, but then the connection was 
rather poor: speed test results around 200 Mbps, lots of dropped packets, etc.

Back at the original blank wall plate (where a structured media cabinet really 
should've been), I decided to clip and terminate the 4 pairs of network wire 
right there. 

While not clean, you'll see that this 2-gang junction box is stuffed with the 
coax splitter and cables, CAT3 cable, and now I've added to it keystone jacks 
for CAT6 I later pulled. This lets me tap into whichever segment I need.

<img src="{{ site.cdn }}2018network/cat6-cat3-wall-mess3.jpg" class="img-responsive" title="" style="max-width: 420px" />

I connected my Asus router I was using as a test, turned it on, and was 
happy to discover a 1000 Mbps full duplex gigabit connection to Condo Internet, 
yielding speed tests over 900 Mbps up and down. Low latency. No dropped packets. 
Hooray! Good outcome.

## Pulling CAT6 in-unit

While I wouldn't be able to replace the home run CAT3 to my unit easily, I did 
decide that having a wired network is very important to my home network 
configuration.

I wanted to be able to install a small rack as a media closet, and that was 
located 80 feet away from the termination point. I also wanted to hardwire my 
office computers, pull CAT6 to the television mounts to do HDMI-over-HDBase, etc.

<!--
<img src="{{ site.cdn }}2018network/cat6-splicing.jpg" class="img-responsive" title="CAT6 keystone punchdown" />
-->

In the end I pulled over 2,400 feet of CAT6 throughout my condo and was able to 
bring online 20 CAT6 jacks.

## Steel studs 

My condo does not have wood studs, but instead steel, supporting the walls. 

Metal studs are perforated already with holes for wires to be pulled through, 
as long as you remember to use wire grommits to protect from fraying and damaging 
the wire.

A positive for metal studs is that there's no drilling through wood fire blocks 
or studs themselves, as long as you can carefully fish wire through the 
existing wire holes.

## Interior vs exterior walls

Our condo association rules are well-defined and strict about any changes to 
"limited common" shared walls. While it's easy to run wires within my interior 
walls, I'm not able to just run cable through the shared walls, and instead 
would need to use exposed concrete, wire behind the baseboards, or under the 
floors. I've had to use all of these approaches in my unit.

In my office I run speaker wire, several CAT6 pulls, and 2x digital optical 
audio cables through the floor instead of the shared wall with an adjacent 
unit.

### Drop ceilings

Thankfully my unit's utilities tend to run in the ceiling above the kitchen, 
bathrooms and other spaces. The living areas have no drop ceiling, so there is 
only concrete above, leaving no wiring space.

Here's a look inside the ceiling above a bathroom - lots of electrical 
steel conduit.

<img src="{{ site.cdn }}2018network/electrical-in-ceiling.jpg" class="img-responsive" title="A peek inside the ceiling above a bathroom at the electrical flex conduit" />

Challenges include:

- Not running network cable parallel to electrical when close
- Pulling conduit and wire with minimal wall damage and patching
- Navigating obstacles including fire systems and forced air ducts

In several locations I decided to run flex conduit to make pulling wire later 
easier, and then have both CAT6 and speaker wire running inside. Here you 
can see a flex conduit coupling, ductwork, sprinker system water pipes, and 
the hot and cold water pipes running above the kitchen cabinets:

<img src="{{ site.cdn }}2018network/ceiling-running-cables.jpg" class="img-responsive" title="Running conduit and cabling in the ceiling above the kitchen cabinets" style="max-width: 420px" />

Old work low voltage boxes are used where CAT6 terminates in closets, along 
walls and other locations. Besides the service loop with 2x CAT6 runs is also 
pull cord to make future changes easier.

<img src="{{ site.cdn }}2018network/cat6-wiring-service-loop.jpg" class="img-responsive" title="A 2-gang old work low voltage opening with pull cord and CAT6" style="max-width: 420px" />

<!--
<img src="{{ site.cdn }}2018network/ubntuap.jpg" class="img-responsive" title="" />
-->

# References

Some interesting resources I found while researching parts of this post:

- https://www.reddit.com/r/IAmA/comments/2m3awz/we_are_the_founders_of_condointernet_and_were/
- http://www.bbpmag.com/2013mags/october/BBC_Oct13_CondoInternet.pdf
- http://www.geekwire.com/2013/spectrum-wave-condointernet/
- http://www.geekwire.com/2013/condointernet-expands-service-ballard/
- http://www.bbpmag.com/2013mags/october/BBC_Oct13_CondoInternet.pdf
- https://twitter.com/TimB0nd/status/985638564984573952
