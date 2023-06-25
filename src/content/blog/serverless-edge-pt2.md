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

## Global vs Regional Edge

Of course, on paper it sounds better if our servers/functions are as close to the users as possible, since surely, this would reduce the response time for the requests.

Right?

A point to consider here is where our database is, geographically. Do we have a single Postgres instance running in East US? Since most of the them, our clients (hopefully) do not query the database directly, but go through a backend server, this can get quite important. If this backend is close to the database (in the same region), then the first request between the user and our backend might take a few miliseconds. However, if the endpoint the user hit up on the server does a number of roundtrips to the database (eg. make a query first to see if the user is authorized, then query again to get some data, then query again to fetch something more, and so on), since the backend server is regionally close to the database, these n requests will not introduce much latency.

However, if we move our backend away from the database's region, and place it as close to the user as possible, then the first, initial request between the user and backend will be quicker, but then the server has to make longer roundtrips to the database. This can get out of hand quickly, if our endpoint makes a considerable amount of queries towards the database.

Vercel recommends regional edge functions in thise case, which are deployed near to the database dependencies, or we could even use globally-distributed databases. Vercel started to offer solutions for these as well, with Vercel Postgres KV, Blob and Edge Config. By default, however, edge functions will run in every region globally, therefore this regional way of working is something to configure ourselves.

## Turso

The company Turso offers an interesting solution to help with this potential issue as well: edge hosted libSQL (SQLite) databases, which are deployed to <a href="https://fly.io/" target="_blank">Fly.io</a>, to 26 locations across the globe. We can strategically choose which locations to deploy to, aiming them to be closest to our edge functions to reduce latency. It works by creating a primary instance of our database, which is once created, cannot be moved to a different location. Then, we can spin up replicas of it, which will get synchronized up to the primary database. Read operations will be quick from these replicas, however, write operations would still need to go to the primary database.

# Pros and cons, comparing to Serverless

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

# Migrating our JSON-CSV converter to an Edge Function

Since our JSON to CSV converter serverless function from the first part of these posts was written in Go, we cannot port it one-to-one to the Edge Runtime, on Vercel. We'll have to convert our code either to TypeScript, or Javascript.

We can keep the same project structure, with an "api" folder, however, inside it, we'll create an index.ts file, with the following, example content from Vercel:

```ts
export const config = {
  runtime: "edge",
};

export default (request: Request) => {
  return new Response(`Hello, from ${request.url} I'm now an Edge Function!`);
};
```

The 'config' object is necessary to indicate that this is in fact not a serverless function, but an edge function - if we were writing a NextJS app, we'd have to use a similar notation as well.

Just like before, the CLI command of `vercel deploy` can be used to create a staging environment, and `vercel --prod` to push our API to a production environment.

![Vercel deployment summary](https://blog.danielagg.com/assets/vercel_edge_function_deploy.png)

Request, Response are standard web API objects.
https://developer.mozilla.org/en-US/docs/Web/API/Response

with that in mind, rewritten:

```ts
export const config = {
  runtime: "edge",
};

interface EmployeeData {
  name: string;
  age: number;
  jobTitle: string;
  badgeNumber: number;
}

export default async (request: Request) => {
  if (request.method !== "POST") {
    return new Response("Only POST requests are allowed.", { status: 405 });
  }

  const res = new Response();

  res.headers.append("Content-Type", "text/csv");
  res.headers.append("Content-Disposition", "attachment; filename=data.csv");

  const rows: string[][] = [];
  rows.push(["Name", "Age", "Job Title", "Badge Number"]);

  let employees: EmployeeData[] = [];

  try {
    employees = await request.json();
  } catch (error) {
    return new Response("Could not parse the JSON payload.", { status: 400 });
  }

  try {
    for (const employee of employees) {
      const row: string[] = [
        employee.name,
        employee.age.toString(),
        employee.jobTitle,
        employee.badgeNumber.toString(),
      ];
      rows.push(row);
    }

    const csvData = rows.map(row => row.join(",")).join("\n");

    return new Response(csvData);
  } catch (error) {
    return new Response("Could not write CSV data.", { status: 500 });
  }
};
```

After deploying it to Vercel, my URL this time is: https://vercel-ts-edge-example.vercel.app/
Just like in the previous post, if you decide to run the following curl, you will be able to convert employees data to a CSV - and this time, no cold starts should be experienced.

```console
curl --location 'https://vercel-ts-edge-example.vercel.app/api' \
--header 'Content-Type: application/json' \
--data '[
    {
        "name": "John Doe",
        "age": 45,
        "jobTitle": "Software Developer",
        "badgeNumber": 58195
    },
    {
        "name": "Jane Doe",
        "age": 32,
        "jobTitle": "Software Developer",
        "badgeNumber": 58191
    }
]'
```

# References

- Theo - t3․gg (2023). That's It, I'm Done With Serverless\*. https://www.youtube.com/watch?v=UPo_Xahee1g
- Vercel (2023). The Edge Runtime. https://edge-runtime.vercel.sh/
- Vercel (2023). Edge Functions Overview. https://vercel.com/docs/concepts/functions/edge-functions
- Vercel (2023). Vercel Edge Functions + Database Latency. https://edge-data-latency.vercel.app/
- Vercel (2022). Vercel Edge Functions can now be regional or global. https://vercel.com/changelog/regional-edge-functions-are-now-available
- Supabase (2023). Edge Functions. https://supabase.com/docs/guides/functions
- Turso (2023). Turso documentation. https://docs.turso.tech/
