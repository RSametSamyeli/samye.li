Some of the work I am proudest of was never a product. It was people, many of them strangers, building something together because it needed to exist that week.

## Open Software Network (AYA)

On 6 February 2023, two earthquakes, of magnitude 7.7 and 7.6, struck southern Türkiye within hours of each other and shook ten provinces. Calls for help started pouring onto social media from under the rubble, with addresses, names and floor numbers, faster than anyone could read them. The answer started on Twitter too. My friends [Eser Özvataf](https://eser.dev/) and [Furkan Kılıç](https://x.com/benfurkankilic) posted a call for developers that night, and when I saw their tweets I went straight into the Discord server and got to work. So did my friend [Eray Gündoğmuş](https://eraygundogmus.com/), and thousands of others. Within days that server was the **Open Software Network (AYA)**, and I became one of its founders: a channel for every discipline, an owner for every project, a way to ship. It grew to **25,000+ volunteer developers**.

### AfetHarita: from a tweet to a point on the map

A call for help on Twitter was a sentence: a name, a street, a floor, "we can hear voices". Thousands of them, buried under retweets and screenshots. **[AfetHarita](https://afetharita.com)** read them, pulled the address out (OCR for the screenshots, a language model for the text) and put each one on a map as a point a rescue team could drive to. It was live about **30 hours after the first earthquake**. **AFAD**, Türkiye's disaster and emergency agency, used it.

<figure>
<img src="/images/community/afetharita-map.webp" width="1400" height="694" loading="lazy" decoding="async" alt="AfetHarita's map of Türkiye covered in markers: help requests grouped into numbered clusters and a heatmap over the earthquake region, with hospitals, shelters and hot-meal points as icons, a filter panel, and a 'search this area' button at the top.">
<figcaption>AfetHarita in February 2023: calls for help as clusters and heat, with hospitals, shelters and hot-meal points layered on top.</figcaption>
</figure>

It was built for the conditions it was used in:

- **Phones on a broken network.** Mobile first, tuned for 2G and 3G. The map is [Leaflet](https://leafletjs.com/), 42 KB and open source, instead of a heavy map SDK. Nearby points merge into numbered clusters and dense areas turn into a heatmap, so a phone never has to draw ten thousand pins.
- **More than calls for help.** Institutions sent their data and it became layers: Ahbap locations, hospitals, hot-meal points. Then satellite and terrain views, filters by source and time, and English.
- **A backend that would not fall over.** The first version was rewritten in Go, in containers, with deploys across more than one cloud.
- **Shipped like a product, under pressure.** Separate main, release-candidate and development branches, a preview build for every pull request, templates for issues and PRs, and a triage team that checked every report before it went in.

<figure>
<img src="/images/community/afetharita-traffic.webp" width="960" height="800" loading="lazy" decoding="async" alt="Cloudflare analytics for 17 January to 16 February 2023: every line is flat until 6 February, then jumps. 627,120 unique visitors, 34.24 million requests, 2 TB of data served.">
<figcaption>The month in traffic: nothing, then 627,000 people.</figcaption>
</figure>

In its first month the site had **627,000 unique visitors and 34 million requests**. [AKUT](https://www.akut.org.tr/), the volunteer search-and-rescue association, brought the data into its own incident management. The launch announcement was seen 4.2 million times. Copies of the map followed people abroad, to Berlin, London and the Netherlands, to show where donations could be dropped off, and news sites embedded it on their pages. Beyond [TIME](https://time.com/6254500/turkey-earthquake-twitter-musk-rescue/) and [NBC San Diego](https://www.nbcsandiego.com/video/news/local/rancho-penasquitos-man-working-with-thousands-online-to-help-turkey-earthquake-victims/3170373/), it was covered by Wired, Euronews and Yahoo.

When the emergency was over, the data went too: the personal information was deleted under KVKK, Türkiye's data protection law, and the address now points to [afet.org](https://afet.org). The code is open at [github.com/acikyazilimagi](https://github.com/acikyazilimagi), so the next team facing a disaster does not start from zero.

Eray, who led AfetHarita's frontend, wrote the whole story in Turkish, from the first commit to the last deploy: [How afetharita.com helped thousands of earthquake survivors](https://gundogmuseray.medium.com/afetharita-com-binlerce-depremzedeye-nas%C4%B1l-yard%C4%B1m-etti-f3ec0cd4adbe).

### deprem.io

**[deprem.io](https://deprem.io)**, built by the same network, coordinated relief: who needed what, and who could bring it.

### What it taught me

In a crisis, the bottleneck is rarely code. It is coordination: knowing who owns what, deciding fast, and getting something that works to the people who need it today rather than something perfect next week.

## gazla.co

I founded **[gazla.co](https://gazla.co)** as a place for founders to find each other. It grew to **50,000+ people and 280+ startups**, without any outside funding.

Running it meant events, messages, content and partners in a dozen different tools, with all the context in one head: mine. That problem is the one [lodos.md](/lodos/) now solves. gazla.co is paused while I build it, and the community is still there.

## Open source

- **[OHIF](https://ohif.org/)**: a viewport-aware grayscale tool for the open-source medical imaging viewer that hospitals build on.
- **[Need for Speed Underground 2 in the browser](https://github.com/th0mk/nfsu2-web)**, live at [nfsu2.xyz](https://nfsu2.xyz): I contribute to it regularly and keep an eye on the repository. The Turkish translation is mine, all 3,918 of the game's texts by hand, and so is the change that opens the game in the reader's own language.
- **[This site](https://github.com/RSametSamyeli/samye.li)**: its source is open, from the build checks to the markdown mirrors. How it is made is on the [colophon](/colophon/).

If you run a community or a volunteer effort and think I can help, write to [sam@samye.li](mailto:sam@samye.li).
