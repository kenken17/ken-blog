---
title: "Hermes on the cloud."
pubDate: 2026-07-14
description: ""
tags: ["ai", "hermes"]
---

After using Hermes on local Docker for roughly 2 months time, I decided to migrate everything on the cloud! It actually proved that I am happy with what it could help me with, be it with work or life style.

Chatting with peers, it seems getting a basic VM would be sufficed to run it effectively. [Linode](https://www.linode.com/) was my choice since it's base node is only SGD5 /month. What a steal!

Since I have Hermes' memories on my local. My first thing to do was to ask for a tar ball for all my memories, logs, crons, and configs. Then I spun up a VM with new Hermes installed. 

I still went through the whole full setup, i.e. including model APIs and Telegram token and ID. For memories, I copied over the _/opt/data/memories/_ to /root/.hermes/memories/ and asked Hermes to read the tar for crons setup. With some waiting times, all my crons are up and running.

Now I am officially having a 24/7 AI partner. I call him **Ken Jr.** by the way.

