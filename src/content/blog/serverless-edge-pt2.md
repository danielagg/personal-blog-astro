---
author: Daniel Agg
pubDatetime: 2023-06-20T00:00:00Z
title: Serverless and Edge - Part 2
draft: false
description: "Exploring Serverless in Software Development: Part 2 - The Edge"
postSlug: serverless-edge-pt2
---

This is the second post in a two-part series, exploring the world of Serverless and Edge Runtime. The main focus of this post will be the Edge Runtime, after we've detailed what Serverless is, where it can be useful, and what are its caveats in the first post.

# Edge Location or Edge Runtime

While defining what serverless is was quite straight forward, with edge, we have a little more trouble. When 'edge' is mentioned, it can refer to a few, quite different concepts: it can refer to "edge location", or "edge runtime", or even "edge functions". Let's go through each, and see what exactly they mean.

1. Edge, the Location: the concept of running servers closer to the users. If we take AWS Lambda, we might have one instance running on the region us-east-2, meaning that's where our server spins up and serves users who are close to it. At the same time, we might also spin up a serverless function at ap-east-1, to serve users from the east. Lambda@Edge from AWS fits into this category - we are essentially running multiple instances of our serverless function, and each user will be served by the instance being geographically closest to them.

2. Edge, the Runtime: unlike serverless functions, where an actual server has to spin up (cold start), and then serve the request, the edge runtime guarantees an environment where our code can execute immediately on a V8 platform, without the need to spin up any new servers. It is a technology that is designed to be integrated into frameworks, not directly into applications - probably most notable, NextJS uses it, but providers like Supabase also built products on top of it. A massive caveat to note is that the Edge Runtime uses Javascript's V8 engine under the hood, therefore our application must be in Javascript/Typescript as well.

3. Edge Functions: functions running on the Edge Runtime. While the Edge Runtime provides the platform for frameworks to use, Edge Functions are our small applications.

## Pros and cons, comparing to Serverless

Pros:

- No more cold starts
- Even closer proximity to users and database: what if we deploy a server in Australia, but our DB is in West EU? Server is close to the user, but if our frontend calls 1 server call, but the serverless function calls multiple requests to the DB (get authorizations, get profile information, get avatar, get notifications, etc -> return user entity) --> poor server does round trips from AUs to EU, rather than if we had the server close to the database, than 1 call from AUS to EU, then 5 inner-EU calls

- Cost: with serverless, we are paying for the compute we've used, but with edge functions, we pay per request. This makes it difficult to compare the cost

Cons:

- V8 dependency: Javascript/Typescript apps can be executed only. Vercel mentions Node, Supabase mentions deno.
  Edge has no native runtime layer (C++/Rust native code cannot be run)
  eg. we can't run PRISMA, cause it uses Rust
  but: Planetscale's DatabaseJS --> infra is interesting: serverless driver, to POST request to an endpoint (POST can be SQL string) [no connection to the DB is necessary]
- Maturity

## Cost comparison

Cost on edge here from Vercel here. With Lambda, we pay to how much compute we've used, but with Edge, we pay per each request: difficult to compare, and it really depends on our usecase.

# Data on the Edge

---

https://edge-data-latency.vercel.app/

# References

https://www.youtube.com/watch?v=UPo_Xahee1g
https://edge-runtime.vercel.sh/
https://vercel.com/docs/concepts/functions/edge-functions
https://supabase.com/docs/guides/functions
https://vercel.com/docs/concepts/functions/edge-functions
https://docs.turso.tech/
