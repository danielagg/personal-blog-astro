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

Yes, every request gets it's own server.

These instance (usually) get deleted right after the request is served.

It is quite a radical paradigm shift: it highlights the importance of developers addressing business problems at hand, rather than worry about the server infrastructure. We, as developer no longer have to think about how many server we have, where, and which one takes which request. We don't have to try to make enough server for the requests, but the requests 'make' servers for themselves. Then these servers scale down to nothing, and we only paid for the compute we used. Even at massive scales, this approach can often be cheaper than owning and managing our own, persistent servers.

![Alt text](https://blog.danielagg.com/assets/serverless_1_dark.png)

If you have been building monoliths, with hundreds of APIs, this might just sound insane - surely, if our thousands of users per minute, hitting up thousands of APIs, the cost of this would be unimaginable! And you might just be right - this post was written weeks after Amazon Prime Video came out with an <a href="https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90" target="_blank">impressively transparent post of their own</a>, in which they detail how they migrated one of their solutions from a distributed, serverless architecture to a classic monolith, reducing their cost by 90%.

As with most thing in software engineering, whether the idea to go serverless is a good one depends on your circustances. It might be a wise decision to go with it, if you are an indie developer or startup, with a few hundred users, who ocassionally might call one of your APIs. You could end up with a monthly bill of cents, while providing the same experience to your users as with a more traditional VPS. Case in point calls to mind <a href="https://www.youtube.com/watch?v=kqHYN1Y7pIc&t=41s" target="_blank">Brandon Minnick's recent talk at NDC Oslo</a>, in which he explains how he hosts the backend of his personal mobile apps on AWS Lambdas, with a cost-concious

## Scalability

This is probably the point where the scalability of serverless has to be discussed. Of course, going serverless is not only for small projects. In hindsight, Amazon Prime's huge project didn't benefit going serverless with their huge solution, due to their unique bottlenecks, but this does not mean that serverless solution does not scale. Since we are not managing the instances of the servers, when the traffic hitting our serverless functions increase, they will auto-increase to facility the higher load. Vice versa, when the traffic decreases, they scale down, even to being completely idle, charging nothing (as in a pay-as-you-go model of charging). With traditional, managed servers, this might be a bit more challenging, especially if auto-scaling is not available.

### Avoiding unexpected bills from autoscale

Since our serverless solution autoscales depending on how much traffic it gets, it is a fair question to ask what happens if an unexpectedly large amount of requests starts to hit our functions, in worst case with a malicious indent, trying to DDoS our system. With the pay-as-you-go model, this could ramp up a rather large invoice at the end of the month. In early 2023, there was quite a discussion around this topic on tech Twitter, as multiple open source products, probably most notably ping.gg, an online video-call product was getting 1 TB of traffic going through in a 20 minute window. At the end of the day, with sensible cost-capping, budget alerting and quote-limits, having our bills sky-rocket should not happen, as most cloud providers do offer these features. Rate limiters and throttling are also approaches that could be useful in avoiding situation like so. Of course, there are and probably always will be horror stories of unexpectedly high bills, but if the above mentioned steps are considered, deploying a serverless architecture should not be any scarier than provisioning a standard server.

## Event-Driven

## Stateless

WRite to FS? Fucked. System level stuff? Nope. Stateless development.
also good: memory leaks! when writing big monoliths, if you are not using RUst (lol), it will come back to bite you. but, if you spin up a server and throw it away after 1 request, this becomes an irrelevant concern (that 'what ifs' might still haunt you)

# Considerations

## Cold starts

spin up when request is received
[User makes request -> request goes to the server (large, but depends, eg. C#'s) -> cold start -> ORM spins up, connects to DB -> query the DB -> render/format output -> response sent back to the user]

Warm start: lamba hangs around after a request is done, with state persisted, and if another request comes, we already have an instance running. Meh.

## What can't be done?

- any long running stuff/long compute
- stateful stuff
- websockets? we'd want to keep that open, stateful -> but serverless is fast, quick to spin up and die, not hang around --> workarounds exist, like AWS API gateway, but limitations, eg. 2 hour connection duration
- system/file system IO

## Caching

## Serverless data, databases

- what if we deploy a server in Australia, but our DB is in West EU? Server is close to the user, but if our frontend calls 1 server call, but the serverless function calls multiple requests to the DB (get authorizations, get profile information, get avatar, get notifications, etc -> return user entity) --> poor server does round trips from AUs to EU, rather than if we had the server close to the database, than 1 call from AUS to EU, then 5 inner-EU calls

Azure Cosmos DB
Vercel Serverless Functions
AWS?

# Build and deploy a simple serverless function

Most major cloud providers like AWS, Azure, Google Cloud, Cloudflare offer their own version of a serverless product. In my experience, using Vercel tends to be the simplest, as the company puts a lot of effort into creating an amazing developer experience. In this quick demo, I will build a simple Go serverless function and deploy it to Vercel, hosted on GitHub, with Vercel's default CI/CD pipeline. The function will expect a JSON payload from an HTTP POST request's body and convert it to a CSV file, then return it in base64 encoding to the caller.

We'll first need to install vercel's CLI, then create a new folder, with an "api" folder in it, where we can place our .go files. If we create an index.go file, the API will serve requests for http://localhost:3000/api. Given the following folder strucure:

```
/api/index.go
/api/weather/index.go
/api/weather/forecast.go
```

Then three we will have three APIs:

1. http://localhost:3000/api
2. http://localhost:3000/api/weather
3. http://localhost:3000/api/weather/forecast

Following Vercel's template, let's first add the following to our index.go under the root /api folder:

```go
package handler

import (
	"fmt"
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintf(w, "<h1>Hello from Go!</h1>")
}
```

`vercel dev`
Set up and develop “~/hobby-projects/vercel-go-serverless-example”? [Y/n]

`vercel deploy`

Let's change to API to only accept POST requests, and respond in JSON:

```go
package handler

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	Message string `json:"response"`
}

func Handler(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Only POST requests are allowed.", http.StatusMethodNotAllowed)
		return
	}

	response := Response{
		Message: "OK",
	}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}
```

With Vercel,

# References

- Cloudflare (2023). What is serverless computing? | Serverless definition. https://www.cloudflare.com/learning/serverless/
- AWS (2023). API Gateway quotas for configuring and running a WebSocket API. https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html#apigateway-execution-service-websocket-limits-table
- Vercel (2023). Serverless Functions Overview. https://vercel.com/docs/concepts/functions/serverless-functions
- Theo - t3․gg (2023). That's It, I'm Done With Serverless\*. https://www.youtube.com/watch?v=UPo_Xahee1g
- Theo - t3.gg (2023). Two Weeks Of DDOS Attacks - Did We Survive?. https://www.youtube.com/watch?v=U3fycWWA1tg
- Melkey (2023). You Don't Know Vercel Infrastructure. https://www.youtube.com/watch?v=tgpQx3cdVr8
