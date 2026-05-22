---
title: "A taste of Hermes"
pubDate: 2026-05-22
description: ""
tags: ["ai", "hermes"]
---

Due to all the vibe & hype, mixed with peer pressure, tried [Hermes](https://hermes-agent.nousresearch.com/) just now. It's actually cool! Run smoothly on my local docker container. Doc down the nooks and crannies for reference.

Since i am just trying out, not wise to spend 12-month subscription on VPS. I chose docker as my deploy medium.

create the yaml docker file:

```yaml title="docker-compose.yaml"
services:
  hermes:
    image: nousresearch/hermes-agent
    container_name: hermes
    restart: unless-stopped
    command: gateway run
    ports:
      - "8642:8642"
    volumes:
      - ~/.hermes:/opt/data
      - /var/run/docker.sock:/var/run/docker.sock
```

Note: the _dock.sock_ map is needed if you choose to isolate tool calls into sandbox, which means, the agent will create another sandbox container to run tools.

Make the host mapping volume:

```bash
mkdir ~/.hermes
```

Run the docker compose file:

```bash
docker compose up -d
```

Viola! You have an Hermes agent! Of course it will do nothing for now. Let's dive into the container and kick off the setup:

```bash
docker exec -it hermes bash
```

Run the agent setup and follow the instruction. I suggest do the quick setup:

```bash
$ .venv/bin/hermes setup
```

The setup process will walk through the chat integration too. I chose **Telegram** as my message channel, so just follow the default _@BotFather_ way to create a new app and add the user ID (whom he can access the bot).

Done. Now we can start chatting with Hermes!

![Telegram](/images/2026-05-22_1.png)
