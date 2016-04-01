---
layout: post
title: Trying php pthreads
summary: PHP pthreads add some threading support to php but they have limitations and here is what i found out
draft: true
tags:
  - php
  - pthreads
categories:
  - php
---

PHP thread safety goal is to isolate threads, unlike languages with native
threading which aim at safe threads interactions.

pthreads extension introducing threading into userspace but what it can provide
is severely limited by safeguard measures of php.

In this blog post i will try to gather what i learned about pthreads, its
limitations and workarounds

- Phantom objects for threaded objects
- Threaded properties unserialized on access, read: deep clone, changes are not tracked.
- destroyed Threaded when phantom copy is already created
