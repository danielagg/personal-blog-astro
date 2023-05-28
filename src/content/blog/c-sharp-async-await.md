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

```csharp
// todo
```

# What is a state machine?

In the previous section, we came across the concept of a state machine - what even is that? In layman’s terms, it’s simply a model that describes the behavior of a system based on its current state and inputs. It defined how this system transitions from one state to another, in response to events or actions. The concept of a state machine is a mathematical abstraction, used for designing algorithms - read a little more about this on <a href="https://developer.mozilla.org/en-US/docs/Glossary/State_machine" target="_blank">MDN Web Docs</a>.

As with most concepts, an example could speak a thousand words. Let’s take a look at a (simplified) state machine for a webshop’s order processing state machine.

![Alt text](https://blog.danielagg.com/assets/OrderStateMachine.svg)

We have three events, represented with diamond/rhombus shapes:

1. Order Received
2. Payment Succeeded
3. Order Delivered

Again, in reality, we probably would have a lot more events occur in this process, but depending on the result of each event, different actions (represented with rectangles) might be performed. For example, when we receive an order, we start performing one action, processing the payment. However, the outcome of this action, “Payment Succeeded” may be true, but it may be false (for example, the user’s credit card got declined). Depending on the result of the event, we might take different actions (canceling the order, or start to actually complete the user’s order).

In the context of async/await, a state machine refers to a mechanism used by the compiler to transform asynchronous methods into a form that allows them to suspend and resume execution seamlessly.

When we mark a method as async and use the await keyword within it, the compiler generates a state machine to handle the asynchronous behavior: this state machine keeps track of the current execution point and the state of local variables when the method is suspended.

1. When an await is encountered, the state machine records the current execution point and the state of local variables.
2. The state machine then returns control to the caller, allowing it to continue executing, ~unblocking it.
3. The state machine is notified when the awaited operation completes.
4. The state machine retrieves the previously recorded execution point and the state of variables and resumes execution from that point.
5. The method continues running from where it left off, using the results of the awaited operation.

Again, this state machine is an implementation detail that is automatically generated by the compiler when we use async/await. It abstracts away the complexity of managing asynchronous execution, so we're provided with a simpler programming model for handling asynchronous operations.

# Tasks

Ordinary methods have only a single entry and exit points - for async, this is a little bit different. Whoever calls the method, can immediately retrieve the result, in the form of a Task or Task<T>, but when awaited, the actual result of the method is returned.

```csharp
var getPostsTask = GetPostsAsync(); // Task<IEnumerable<Post>>
var posts = await getPostsTask; // IEnumerable<Post>

// or:
var posts = await GetPostsAsync(); // IEnumerable<Post>
```

But what actually is a Task? It represents a unit of work, promising to give us back the results in the future. In other programming languages, a variation of this concept might appear, like Promises in JavaScript, or Futures in Rust.

To be continued.

## Why should we avoid 'async void', and prefer 'async Task'?

Coming soon!

## ValueTask

Coming soon!

# WhenAll, WaitAll, WhenAny, WaitAny

Coming soon!

# References

- Microsoft (2023). Task asynchronous programming model. https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/task-asynchronous-programming-model. (Contributors: BillWagner, pkulikov)
- Cleary, S. (2019). Concurrency in C# Cookbook, 2nd Edition. O'Reilly Media, Inc.
- Tepliakov, S. (2017). Dissecting the async methods in C#.
- Cleary, S. (2013). There Is No Thread. https://blog.stephencleary.com/2013/11/there-is-no-thread.html
