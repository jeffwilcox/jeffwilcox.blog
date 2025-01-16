// import Link from 'next/link';
// import { getAllPosts } from '../lib/posts';
import Image from "next/image";
import { BlogPostsHomepage } from '@/components/posts';
import Link from "next/link";

export default function Page() {
  const started = new Date('2005-07-11');
  const today = new Date();
  const years = Math.floor((today.getTime() - started.getTime()) / (1000 * 60 * 60 * 24 * 365));

  let additive = '';
  if (years < 20) {
    // show the months; if == 11 months, show days
    const months = Math.floor((today.getTime() - started.getTime()) / (1000 * 60 * 60 * 24 * 30));
    additive += ` ${months} months`;
    if (months === 11) {
      // number of days in that last month
      const days = Math.floor((today.getTime() - started.getTime()) / (1000 * 60 * 60 * 24));
      additive = ` 11 months and ${days} days`;
    } else {
      additive = `and ${months} months `;
    }
  }

  return (
    <section>
      <div className="mb-8 mt-8 flex place-items-center gap-x-2 sm:mb-12 sm:gap-x-4">
        <Image
          src="/jeffwilcox.jpg"
          alt="Jeff Wilcox (avatar)"
          width={48}
          height={48}
          className="h-12 w-12 rounded-full bg-zinc-100 sm:h-16 sm:w-16" 
        />
        <h1 className="text-4.5xl font-bold sm:text-5xl">jeffwilcox</h1>
      </div>

      <p>
        <strong>Seattle, WA, USA</strong> &bull;{' '}
        {years} years {additive} at Microsoft &bull;{' '}
        University of Michigan graduate &bull;{' '}
        Cities, cycling, &amp; coffee
      </p>
      <p className="mt-2">
        I manage <a target="_new" href="https://opensource.microsoft.com" className="text-main underline">Microsoft&apos;s Open Source Programs Office</a> (OSPO). 
        Open source is an essential part of Microsoft culture: 
        our teams depend on and contribute to open source, and we work in the open across thousands of repos on GitHub.
      </p>
      <p className="mt-2">
        You can find me on 
        {' '}
        <a href="https://bsky.app/profile/jeffwilcox.com" className="text-main underline">BlueSky</a>,{' '}
        <a href="https://github.com/jeffwilcox" className="text-main underline">GitHub</a>,{' '}
        <a href="http://linkedin.com/in/jeffreywilcox" className="text-main underline">LinkedIn</a>,{' '}
        and <a href="https://x.com/jeffwilcox" className="text-main underline">X</a>.{' '}
        You can professionally email me at <code>jwilcox at microsoft</code> and 
        personally at <code>jeffwilcox at jeffwilcox</code> <em>(both .com)</em>.
      </p>

      <section className="mt-12">
        <h2 className="text-2.5xl font-semibold sm:font-bold">Blog</h2>
        <div className="mt-4 flex flex-col gap-y-4">
          <BlogPostsHomepage />
          <p><Link href="/posts">Past posts...</Link></p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2.5xl font-semibold sm:font-bold">Work: GitHub at scale</h2>
        <div className="mt-4 flex flex-col gap-y-4">

          <p className="mt-2">
            I work on what I love: building great developer tools and experiences for developers, by developers. 
            The self-service GitHub tools I built at Microsoft have scaled the number of engineers working in 
            the open on GitHub from 2,000 to over 70,000.
          </p>
          <p className="mt-2">
            In past software engineering and engineering manager roles at Microsoft I&apos;ve worked on
            making our Azure cloud work great on all operating systems and with many great open source 
            languages. I also have worked on server software, client and phone platforms, and
            plenty of ambitious failed products.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2.5xl font-semibold sm:font-bold">Fun: Built a popular mobile app</h2>
        <div className="mt-4 flex flex-col gap-y-4">
          <p className="mt-2">
            <Image src="/img/home-4thandmayor.png" alt="The 4th & Mayor logo." width={56} height={56} className="rounded-lg float-left" />
            I built the now-discontinued app <a target="_new" href="https://4thandmayor.com">4th &amp; Mayor</a>, which reached the #1 top-rated social app on the Windows Phone Store regularly from 2011-2014. The app launched in 2011 and had over 100,000 daily active users and a 300k+ installed base at its peak.
          </p>
          <p className="mt-2">
            The app was a third-party Foursquare app, and the name was inspired from city living, maps, and intersections. The backend was written in Node.js & ran on AWS before migrating to Azure.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2.5xl font-semibold sm:font-bold">Work: Cross-platform cloud</h2>
        <div className="mt-4 flex flex-col gap-y-4">
          <p className="mt-2">
            As a software architect on the Microsoft Azure team, I got to define our early open source strategy, leading a team of engineers to deliver cross-platform Azure command line tools as well as the family of Azure SDK REST libraries for languages including Node.js, Java, PHP, Python, Ruby and .NET.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2.5xl font-semibold sm:font-bold">Work: Early open source at Microsoft</h2>
        <div className="mt-4 flex flex-col gap-y-4">
          <p className="mt-2">
            Early in my career I brought my Mac to campus to work on the ASP.NET AJAX Control Toolkit, Silverlight Toolkit, and later the Windows Phone Toolkit. Designed to be a great code-available out-of-box update for devs, each toolkit generation brought improvements to Microsoft&apos;s adoption of reference source, working in the open, and paved the path to today&apos;s approach whereby most Microsoft open source is offered under OSI-approved licenses.
          </p>
        </div>
      </section>

    </section>
  )
}
