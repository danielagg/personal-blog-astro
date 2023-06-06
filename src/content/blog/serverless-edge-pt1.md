---
author: Daniel Agg
pubDatetime: 2023-06-05T00:00:00Z
title: Serverless and Edge - Part 1
postSlug: serverless-edge-pt1
draft: true
description: Exploring Serverless in Software Development: Part 1 - An Overview
---

# Understanding the Serverless Paradigm

Meaning of the word. Largely AWS Lambda kickstarts it, do not think about how many server we have, where, which takes which request, but we spin up, based on requests being made, instances of the server. Every request gets a new instance, deleted right after the request is served. We as devs don't try to maske enough server for the requests, but requests 'make' servers for themselves. Scale down to none. Pay only for the compute we use, even at massive scales, often can be cheaper than owning our own servers. No persistent server, that waits for requests. There's nothing, until a request comes.

what can't be done with serverless?

- any long running stuff/long compute
- stateful stuff
- websockets? we'd want to keep that open, stateful -> but serverless is fast, quick to spin up and die, not hang around --> workarounds exist, like AWS lambda
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

https://www.youtube.com/watch?v=UPo_Xahee1g
https://www.youtube.com/watch?v=tgpQx3cdVr8
https://edge-data-latency.vercel.app/
