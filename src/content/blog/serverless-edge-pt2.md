---
author: Daniel Agg
pubDatetime: 2023-06-20T00:00:00Z
title: Serverless and Edge - Part 2
draft: false
description: "Exploring Serverless in Software Development: Part 2 - The Edge"
postSlug: serverless-edge-pt2
---

This is the second post in a two-part series, exploring the world of Serverless and Edge Runtime. The main focus of this post will be the Edge Runtime, after we've detailed what is Serverless, where it can be useful, and what are its caveats in the first post.

# Edge Location or Edge Runtime

Edge Location: running servers closer to the users. With Lambda, eg. us-east-2, and that's where our server spins up, serving users who are close to it, while we might also spin up a serverless function at ap-east-1, to serve users from the east. Lambda@Edge from AWS fits into this category.

Edge Runtime: No more coldstarts! We have move our serverless functions to the Edge Runtime.
It is a technology that is designed to be integrated into frameworks, not directly into applications.
A massive caveat to note is that the Edge Runtime uses Javascript's V8 engine under the hood, therefore our application must be in Javascript/Typescript as well.

Vercel offers Edge Functions, built on top of the runtime:

## Cost comparison

Cost on edge here from Vercel here. With Lambda, we pay to how much compute we've used, but with Edge, we pay per each request: difficult to compare, and it really depends on our usecase.

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

---

https://edge-data-latency.vercel.app/

- what if we deploy a server in Australia, but our DB is in West EU? Server is close to the user, but if our frontend calls 1 server call, but the serverless function calls multiple requests to the DB (get authorizations, get profile information, get avatar, get notifications, etc -> return user entity) --> poor server does round trips from AUs to EU, rather than if we had the server close to the database, than 1 call from AUS to EU, then 5 inner-EU calls

Azure Cosmos DB
Vercel Serverless Functions
AWS?

# References

https://www.youtube.com/watch?v=UPo_Xahee1g
https://edge-runtime.vercel.sh/
https://vercel.com/docs/concepts/functions/edge-functions
