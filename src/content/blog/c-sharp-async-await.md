---
author: Daniel Agg
pubDatetime: 2023-05-28T00:00:00Z
title: Patching knowledge gaps on C#'s async/await
postSlug: c-sharp-async-await
draft: false
description: Diving a bit deeper under the hood of how C#'s async/await works.
---

> The async and await keywords don't cause additional threads to be created.

This sentence was directly copied from the official documentation of the <a href="https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/task-asynchronous-programming-model#BKMK_Threads" target="_blank">Task asynchronous programming model</a>. Yet, so many blog posts, tutorials, YouTube videos explain the concept of async/await as if they would span a different thread and execute there.

# How does it actually work?

Yes, async methods are intended to be non-blocking for the current thread, when calling await. These ‘special’ methods still run on the current synchronization context, but only uses time from the thread when the method is active. This does sound a little bit confusing, even if it’s only a paraphrased version of the official documentation - I suppose the next natural question would be, then how does the UI stay responsive when I am awaiting a call, if we are still running in the current context? Surely, our long-running async method is running on a different thread?

When we use the await keyword, it temporarily pauses the execution of the current method (the method in which the await keyword is used) and allows the calling code (the code that invokes or calls the async method) to proceed, essentially unblocking it.

The asynchronous method is transformed into a state machine that remembers where it left off - in the next section, we will dive a bit deeper on what exactly this state machine is. The responsibility of tracking the execution context is handed over to this state machine.

While the awaited operation is in progress, the calling thread (in our case, it’s the UI thread) is free to do other tasks. It's not blocked, so the UI remains responsive, and our user can interact with the application.

Once the awaited operation completes, the remainder of the code after the await is scheduled to resume on the same context, which again, in our case is the main UI thread. This allows the method to pick up where it left off, as if it never paused, and continue executing seamlessly.

So, to summarize: the await keyword temporarily pauses the method, frees up the calling thread to do other work, and ensures that the method resumes execution on the same context once the awaited operation is finished. This is the reason that enables us to have an efficient way to write async code, and have our UI thread stay responsive, without long-running operations blocking it.

Let’s look at some code, to illustrate this:

```c-sharp
// todo
```

# What is a state machine?

In the previous section, we came across the concept of a state machine - what even is that? In layman’s terms, it’s simply a model that describes the behavior of a system based on its current state and inputs. It defined how this system transitions from one state to another, in response to events or actions. The concept of a state machine is a mathematical abstraction, used for designing algorithms - read a little more about this on <a href="https://developer.mozilla.org/en-US/docs/Glossary/State_machine" target="_blank">MDN Web Docs</a>.

As with most concepts, an example could speak a thousand words. Let’s take a look at a (simplified) state machine for a webshop’s order processing state machine.

We have three events, represented with diamond/rhombus shapes:

1. Order Received
2. Payment Succeeded
3. Order Delivered

Again, in reality, we probably would have a lot more events occur in this process, but depending on the result of each event, different actions (represented with rectangles) might be performed. For example, when we receive an order, we start performing one action, processing the payment. However, the outcome of this action, “Payment Succeeded” may be true, but it may be false (for example, the user’s credit card got declined). Depending on the result of the event, we might take different actions (canceling the order, or start to actually complete the user’s order).

![Alt text](https://danielagg.com/OrderStateMachine.svg)
