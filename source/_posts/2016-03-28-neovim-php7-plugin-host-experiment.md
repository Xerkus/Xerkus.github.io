---
layout: post
title: Experiment with building Neovim php7 plugin host
summary: Implementing plugin host for neovim with msgpack-rpc, php7 and pthreads
draft: true
tags:
  - neovim
  - php
categories:
  - neovim
---

[<img src="/img/posts/neovim-mark.svg" alt="Neovim" style="height: 1rem" /> Neovim](https://neovim.io)
is a project set out to modernize vim. It is rocking with a cleaned up
codebase, extensible remote plugin based architecture, powered by msgpack-rpc,
with a fast paced development and much love from the community.

I switched from Vim to Neovim in january this year and transition was very
smooth. I had it up and running with my existing vim config, after a bit of
cleanup, in less than an hour. Nice. I am definitely in love with it.

## The experiment

So, the other day i was poking at python client library to learn Neovim better
and it struck me: why don't I write one for php?
The only problem is PHP is not exactly the best tool for this kind of task.
Well, it is time to finally give [php
pthreads](https://github.com/krakjoe/pthreads) a try, besides I won't have
better opportunity anytime soon anyway.

And so I started this little experiment: [Neovim php7 plugin
host](https://github.com/Xerkus/neovim_php7_host)

### Considerations for the plugin host 

Some of the concerns I initially identified that needed to be addressed:

- allow plugins to run independenly to fully utilize async notifications
- keep plugins separated to prevent dependencies conflicts
- ability to stop and restart plugins individually
- plugin must be able to keep its state
- plugin must be able to talk back to neovim interactively
- non-blocking synchronous calls to neovim: if call to neovim is made and it
  comes back to plugin, it must be able to handle it without deadlock

Some options I considered:

- Force all plugins to install and use shared dependencies.
- Let plugins handle the async themselves but potentially allow one badly
  written plugin to block all others
- Use proc_open and run independent process for each plugin.
- PCNTL forking
- pthreads

