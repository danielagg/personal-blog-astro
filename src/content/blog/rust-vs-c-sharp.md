---
author: Daniel Agg
pubDatetime: 2023-05-13T18:49:00Z
title: Rust, coming from C#
postSlug: rust-vs-c-sharp
draft: false
description: Checking out and comparing Rust to C#.
---

In this post, I would like compare a few examples of C# and Rust to highlight conceptual differences between the two languages. In my day-to-day job, for the last few years C# became my main tool, and features like LINQ, records, pattern matching made it quite easy to fall in love with the language. As a software developer, I find it important to break free from your comfort zone every now and then. Don't be afraid to mix things up by diving into a different programming language, trying out a new framework, or even experimenting with a new database engine. We never know what we might discover - a fresh perspective, a new trick, anything. Plus, this kind of adventurous exploration can help us avoid burning out.

This time, I’ve decided to give Rust a go.

Rust has quite a few unique things going for it, some of its concepts and philosophies differ from languages like C#, Go or TypeScript. Some articles go a little over the top, selling it as a silver bullet of a language where you cannot write incorrect, unsafe or slow code. That is not the case, of course, and I’m fully aware that in my code examples below, I also could probably have done better.

## Accidental mutation

I believe an example could save a lot of talk, so let’s consider the following piece of C# code.

```csharp
class DataManager
{
    private readonly List<int> myPrivateData;
    public List<int> GetData() => myPrivateData;

    public DataManager()
    {
        myPrivateData = new List<int> { 1, 2, 3, 4, 5 };
    }
}
```

Nothing special so far, a simple class that has a private field called myPrivateData, which is only accessible to read via the GetData() function. When we instantiate the class, the myPrivateData field is populated with 5 entries. Let’s now do something with our DataManager:

```csharp
static void Main()
{
    var dataManager = new DataManager();
    var data = dataManager.GetData();

    // do some processing with the data
    data.Add(6);
    data = data.Skip(2).Take(4).ToList();

    Console.WriteLine(string.Join(", ", data));
    Console.WriteLine(string.Join(", ", dataManager.GetData()));
}
```

After creating an instance of our DataManager class, we create a new variable named ‘data’, which initially, of course, will contain 1, 2, 3, 4, 5. Then, we add 6 to the list. Then, we skip two elements of the array (1 and 2), and take the next four elements (3, 4, 5, 6). The interesting part comes next - we print the contents of data, by joining the entries in it with a comma, as well as printing dataManager.GetData(), which we may assume points to the same list, since we only have one instance of our dataManager in scope, and our variable ‘data’ was created by calling the same exact GetData() function.

Right?

Well, not quite.

If we expected the first Console.WriteLine(), where we print ‘data’ to display “3, 4, 5, 6”, we would be indeed correct. However, when we print a “fresh version” of GetData() in the following line, we see “1, 2, 3, 4, 5, 6”.

What even happened? We probably assume that “okay, when we called data.Add(6), that modified the underlying myPrivateData field, even though our intention was to make it readonly, but… the next operation, where we skipped two and took four entries had no effect? Really?

It may seem a bit confusing, but if we dig a little deeper on what’s happening under the hood, we will eventually realize that yes, Add(6) did mutate myPrivateData, even though it’s a private, readonly list. If we sprinkle in some GetHashCode()s, to see who-is-who, we get the following:

```csharp
data.Add(6);
Console.WriteLine(data.GetHashCode()); // 58225482

data = data.Skip(2).Take(4).ToList();
Console.WriteLine(data.GetHashCode()); // 54267293 -- woah, ‘data’ is now something new?

Console.WriteLine(dataManager.GetData().GetHashCode()); // 58225482 -- same as the first
```

Essentially, when we Skip and Take and then call ToList(), we create a new collection, and assign it to our data variable. We no longer refer to the collection of [1, 2, 3, 4, 5, 6].

To avoid shooting ourselves in the foot, we could change our DataManager class, and make myPrivateData an ImmutableList<int>, rather than a List<int>, thus also changing the ToList() call to a ToImmutableList() in our Main function:

```csharp
class DataManager
{
    private readonly ImmutableList<int> myPrivateData;
    public ImmutableList<int> GetData() => myPrivateData;

    public DataManager()
    {
        myPrivateData = ImmutableList.Create<int>(1, 2, 3, 4, 5);
    }
}

static void Main()
{
    var dataManager = new DataManager();
    var data = dataManager.GetData();

    // here we do some processing with the data
    data.Add(6);
    data = data.Skip(2).Take(4).ToImmutableList();

    Console.WriteLine(string.Join(", ", data));
    Console.WriteLine(string.Join(", ", dataManager.GetData()));
}

```

When printing ‘data’, we see no change, it still shows 3, 4, 5, however the second WriteLine prints 1, 2, 3, 4, 5, the “original” values. In my experience, in the large majority of C# code bases, when there is a need to store a collection, it is simply going to be a List or an IEnumerable, it’s rarely ImmutableLists, even if it would make more sense. Of course, with proper testing, we hopefully would have spotted this behavior before shipping our code.

Let’s now switch gears, and see how Rust’s ownership model makes it a little bit more difficult for us to shoot our feet.

First, let’s create our DataManager:

```rust
struct DataManager {
    my_private_data: Vec<i32>,
}

impl Default for DataManager {
    fn default() -> Self {
        DataManager {
            my_private_data: vec![1, 2, 3, 4, 5],
        }
    }
}

impl DataManager {
    fn get_data(&self) -> &Vec<i32> {
        return &self.my_private_data;
    }
}
```

Unlike with C#, in Rust we separate our properties from behavior. We’re implementing Default, where we populate my_private_data, then we create the get_data function.

In our main function, then we can try to do the same operations:

```rust
fn main() {
    let data_manager = DataManager::default();
    let mut data = data_manager.get_data();

    data.push(6);
    let data: Vec<&i32> = data.into_iter().skip(2).take(4).collect();

    println!(
        "{}",
        data.iter()
            .map(|&x| x.to_string())
            .collect::<Vec<String>>()
            .join(", ")
    );

    println!(
        "{}",
        data_manager
            .get_data()
            .iter()
            .map(|&x| x.to_string())
            .collect::<Vec<String>>()
            .join(", ")
    );
}
```
