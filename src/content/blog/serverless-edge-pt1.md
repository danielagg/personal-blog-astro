---
author: Daniel Agg
pubDatetime: 2023-06-05T00:00:00Z
title: Serverless and Edge - Part 1
draft: false
description: "Exploring Serverless in Software Development: Part 1 - An Overview"
postSlug: serverless-edge-pt1
---

This is the introductory post in a two-part series, exploring the world of Serverless and Edge Runtime. The main focus of this post will be Serverless, while the second one will focus on an alternative, newer approach in the form of Edge Computing.

# Understanding the Serverless Paradigm

It is probably best to first try to define what exactly are people talking about, when referring to "serverless". With serverless, we as developers are no longer responsible to provision and maintain the underlying servers for our applications, hence the name server-less. Coming from a more traditional way-of-working, this might seem like a crazy idea. If we aren't responsible to manage our servers, then how would our APIs be served to our customers? Of course, it is just an arguably questionable choice of a word: there still are servers under the hood, but these are no longer created, scaled, nor maintained by us, the developers. In a serverless architecture, our cloud provider spins up new instances of a server based on each requests being received.

Yes, every request gets it's own, wee little server.

These instance (usually) get deleted right after the request is served.

![Alt text](https://blog.danielagg.com/assets/serverless_1_dark.png)

If you have been building monoliths, with hundreds of APIs, this might just sound crazy - surely, if our thousands of users per minute, hitting up thousands of APIs, the cost of this would be unimaginable! And you might just be right - this post was written weeks after AWS came out with an impressively transparent post of their own, where ...

As with everything in software architecture, this approach of managing your backend service will depend on your usecase. It might be a good way to go: if you are an indie developer, with a few hundred users, who ocassionally might call one of your APIs, you could end up with a monthly bill of cents, while providing the same experience to your users as with a more traditional VPS.

--

This is a relatively new approach to building applications on the cloud, which can auto-scale, have no charges when idling and demand considerably less maintenance, than more traditional approaches.

It is quite a radical paradigm shift: it highlights the importance of developers addressing the current business problem rather than worry about the server infrastructure. We no longer have to think about how many server we have, where, and which one takes which request.

We as devs don't try to maske enough server for the requests, but requests 'make' servers for themselves. Scale down to none. Pay only for the compute we use, even at massive scales, often can be cheaper than owning our own servers. No persistent server, that waits for requests. There's nothing, until a request comes.

Largely it was kickstarted by AWS Lambda, back in 2014.

Gamechanger, because it's very fast to get things going, but infinite scale can bite back, in producing a rather large bill. DDoS attacks?
todo: Theo's breakdown here of ping

but if you are an indie developer, with an app with a couple of users, you can get away with single digit dollar bills per months, or even cents.

also good: memory leaks! when writing big monoliths, if you are not using RUst (lol), it will come back to bite you. but, if you spin up a server and throw it away after 1 request, this becomes an irrelevant concern (that 'what ifs' might still haunt you)

what can't be done with serverless?

- any long running stuff/long compute
- stateful stuff
- websockets? we'd want to keep that open, stateful -> but serverless is fast, quick to spin up and die, not hang around --> workarounds exist, like AWS API gateway, but limitations, eg. 2 hour connection duration
- system/file system IO

## Event-Driven

## Stateless

WRite to FS? Fucked. System level stuff? Nope. Stateless development.

## Scalable

# Pros & Cons

Biggest: cold starts. spin up when request is received
[User makes request -> request goes to the server (large, but depends, eg. C#'s) -> cold start -> ORM spins up, connects to DB -> query the DB -> render/format output -> response sent back to the user]

Warm start: lamba hangs around after a request is done, with state persisted, and if another request comes, we already have an instance running. Meh.

- cold start

- DDoS? looots of request
- time limitation?
- size of bundle?
- what if we deploy a server in Australia, but our DB is in West EU? Server is close to the user, but if our frontend calls 1 server call, but the serverless function calls multiple requests to the DB (get authorizations, get profile information, get avatar, get notifications, etc -> return user entity) --> poor server does round trips from AUs to EU, rather than if we had the server close to the database, than 1 call from AUS to EU, then 5 inner-EU calls
- too late? with Edge?

Lambda

# Scaling Serverless Applications

Design Patterns and Auto-scaling Capabilities

# Caching

# Serverless Providers:

Vercel & Azure & AWS
Cloudflare edge functions

# Serverless Data Storage

Azure Cosmos DB
Vercel Serverless Functions
AWS?

# Serverless Deployment Models

Functions-as-a-Service (FaaS)
Backend-as-a-Service (BaaS)

# Future Trends in Serverless Computing

Multi-cloud
Edge Computing:
confusing: Edge Location and Edge Runtime.

1. Edge Runtime
2. Edge location: run servers closer to users

   no cold starts, run in parallel at any time. JS only. AWS has Lambda@Edge (NOT runtime, but Edge location --> not really, cause AWS has a fairly limited amount of locations)
   COST: Lambda's cost isn't cheap, per hour, time spend doing requests
   functions can be moved here
   edge: pay per request (Vercel = 1 mil request, $0.65) --> insanely cheap

   regional edge functions: functions can only run around West-EU-2

   https://edge-data-latency.vercel.app/

   Edge has no native runtime layer (C++/Rust native code cannot be run)
   eg. we can't run PRISMA, cause it uses Rust
   but: Planetscale's DatabaseJS --> infra is interesting: serverless driver, to POST request to an endpoint (POST can be SQL string) [no connection to the DB is necessary]

   Turso!

IoT

# References

https://www.cloudflare.com/learning/serverless/
https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html#apigateway-execution-service-websocket-limits-table
https://www.youtube.com/watch?v=UPo_Xahee1g
https://www.youtube.com/watch?v=tgpQx3cdVr8
https://edge-data-latency.vercel.app/
