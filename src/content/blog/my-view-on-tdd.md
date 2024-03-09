---
author: Daniel Agg
pubDatetime: 2024-03-10T00:00:00Z
title: My view on Test Driven Development
draft: true
description: My personal views on using (or not?) TDD.
---

I admire the hell out of Kent Beck, the gentleman who coined TDD, a genuine pillar of the industry - if you haven’t checked his latest book out (as of early-2024), please do so: <a href="https://www.amazon.com/Tidy-First-Personal-Exercise-Empirical/dp/1098151240" target="_blank">Tidy First</a>, an absolute banger, a practical book, a fun and fast read with quite some gems to take away.

I am nowhere near his caliber, being just a random dev in his early-30s, bored on a Saturday evening with a glass of whiskey who got brave enough to write his thoughts out - but not in mad faith.

## So, should I do TDD?

A lot of people will reply with a hard no, while a lot of people will argue that it’s the best thing that came about in our industry in the last two decade or so.

Or be it 25% and 75%.

Maybe the other way around.

It all depends on where you ask: Twitter, Discord, reddit or your colleagues? God forbid you ask on LinkedIn? (maybe don’t)

Either way, both camps will be quite vocal, and people will be very passionate about their answers - almost as passionate as if talking about Tailwind versus vanilla CSS. Or TypeScript versus Javascript.

I have opinions on all of these, and I know you do too.

(scroll down for the correct answer for all of these questions, btw)

Everyone’s experience is different.

Our strongest opinions form upon our own experience, not based on watching YouTube videos, reading posts, or pretending to watch Udemy courses.

As such, some may have had an amazing experience developing software with TDD: the lucky bastards who had a well defined problems and requirements. Yet, some may have had the most miserable time with it.

I fall into the latter category

--

**Test-driven development** (**TDD**) is a [software development process](https://en.wikipedia.org/wiki/Software_development_process) relying on software requirements being converted to [test cases](https://en.wikipedia.org/wiki/Test_case) before software is fully developed

1. Requirements are unclear
   got served a murky mess of conflicting requirements.
2. Even if requirements are clear, you are testing for an interface you aren’t sure is the correct one

clear difference between people who work in enterprise software, where Domain Driven Design and TDD lends itself: it’s a slow moving mess.

but at the end of the day, it will boil down to the same: requirements constantly change.

“hey, we need a page where our users can see their progress” - pings you the PO. Should you really think about making an admin panel where KPIs can be viewed for all users progress-es? Export the data to Excel? Refactor the login screen to make it more modern?

To me, trying to write tests for this murky requirements fits in the same category as trying to do something like that above - it doesn’t move you closer to your goal.

Sure, the intention is good, but …

I don’t mean to advocate for

Hell, it moves you more away, because you get bogged down on nonsen.

also do not think about tests firsts, because this requirement is as clear as one’s girlfriend’s preference for dinner - fuck all.

I remember in an interview I’ve had, noting that in my last workplace we’ve used event storming, and the interviewer asking ‘was it worth it’. How do you even quantify that? It’s difficult to quantify . The vibes were good, yes.

## My approach to testing

I solve the problem first. Make sure I’ve got a working solution. It’s ugly af. There’s no tests in sights. I just downed a Red Bull and coded up a terribly messy spaghetti that will solve the original problem, period. Separation of concerns? To the bin. Dependency inversion? To the bin. DRY? KISS? SOLID? Nope, just code vomit.

I’m cooking fast, so forget the bay leaf, the parsley and accoutrements. I’m serving it on a paper plate with a plastic spoon. The code’s a damn mess, it’s terribly ugly and if I had to maintain it, I would quit immediately - but it works, it solves a problem. Hell, I will even bribe the PR’s reviewer and deploy it to Prod.

But it’s not the end of the story.

Sleep. Think about it in the shower or during working out. Recharge. Think about the problem while taking a walk or working out.

A day or two later I have a thousand ideas to make my V1 solution better. Refactor this, refactor that, do Y instead of X and so on. I also understand the problem now more in depth. I can see the edge cases more clearly. I have a fucking clue of what we’re trying to build.

I didn’t have that on day one.

And this is normal.

I know for a fact that I’m not the only one who went though this - Hell, isn’t this the norm of our daily work? There’s no way we get served a set of requirements, fully defined every business rule, unthinked state set in stone.

How can you write a test for something you have no idea if it’s a fact/business-rule/invariant or not?

TDD is a tecnique. a technique in golf or fishing. works for some, not for others.

does it fit with Agile?

But I do now, and it’s a luxury. I have more context, I can rethink my solution,

Building something from the ground up, a greenfield solution to a problem is

My V2 sucks less. It usually can go to prod, it won’t be a nightmare to debug - because I, or we will have to debug it. The author, past-me, the fucking asshole wasn’t aware of all the nicks and crannies yet.

V3 would have been perfect.

V4 perfecter.

V5 perfecterer.

V6 perfecetererereeeeeeeeeek - are we rewriting it in Rust yet? Haskell? Odin? Someone summon Ginger Bill!

Thanks for reading my rambling my article. Hi, I’m Daniel, a software developer for OpenUp.

Correct answers:

- CSS vs Tailwind - I don’t give a shit anymore - I like Tailwind, but you picky fuckers can suit yourselves.
- JS vs TS - types. TYPES. HAVE FUCKING TYPES IN YOUR CODEBASE, EVEN IF JSDOCS. I joined countless projects where developers with terroristic coding approaches wrote thousand line javascript files without types and it made me bust my head into concrete so many times. Sure, you fuckheads understood what was going on, but then you left, and some unlucky bastard joined 2 years later who just saw the variable ‘entity’. WHAT THE FUCK IS AN ‘entity’? USE FUCKING TYPES YOU DIPSHITS. JESUS. You are not a fucking library author, you don’t even have to learn generics, ‘keyof’s, whatever - just simple fucking annotations. Damnit.

to TDD if possible - but it takes a special kind of guy to push to have event storming, clear requirements, etc. beforehand
