---
author: Daniel Agg
pubDatetime: 2023-06-05T00:00:00Z
title: Serverless and Edge - Part 2
draft: false
description: "Exploring Serverless in Software Development: Part 2 - The Edge"
postSlug: serverless-edge-pt2
---

This is the introductory post in a two-part series, exploring the world of Serverless and Edge Runtime. The main focus of this post will be Serverless, while the second one will focus on an alternative, newer approach in the form of Edge Computing.

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

---

https://edge-data-latency.vercel.app/
