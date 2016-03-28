---
layout: post
title: On the matter of immutables
summary: Some thoughts and a bit of practical guide to immutability.
tags:
  - OOP
  - immutability
  - draft
categories:
  - coding-practices
---

Yesterday I was asked to give feedback on some issue related to handling
immutable object. It felt counterintuitive but author couldn't put his finger
on what exactly was wrong. Issue was more architectural and on a broader scale but i
want to focus on immutable part of it.

Immutability concept is old but recently it got spike of popularity in web development.
It spurred less experienced developers to try and apply it without understanding fully
its upsides and downsides. Frankly, that is not that bad on itself,
it is the normal process of learning if only it was a bit less eager.


So, immutability, what is it about?
-----------------------------------

Immutability is an assurance that the object you have will not be unexpectedly
changed elsewhere. It opens a way for safe sharing of objects. It might not
look like that much of an issue, but don't underestimate it! Subtle
inconsistent bugs are extremely hard to debug and can lead to devastating
consequences.


When immutability is applicable?
--------------------------------

As an adept of It Depends Driven Development, I can not stress enough that what
object looks like does not matter nearly as much as in which context it is used
and which concept it represents. Look at the context when in doubt, learn more
of it, it is the key.

Lets look at the practical applications:

<aside class="side-note rule-of-thumb">
<p>Value Objects are natural candidates for immutability.</p>
</aside>

Object representing concept whose identity construed of the sum of the
values is a strong candidate for immutability. Indeed, should you change
street in address you will get new address and that correlates well with
producing new object for new value.

Hot example right now is PSR-7 Request and Response. It is no longer same
request should any of the values change and at the same time original unchanged
request is still valid.

Immutability can be partial, for example Zend\ServiceManager configuration is
immutable. That prevents issues such as attempting to pull service which is not
yet configured or configuration being ignored since it was modified after
service was created. Again, producing new service manager with new
configuration does not invalidate existing service manager.

<aside class="side-note rule-of-thumb">
<p>Do not apply immutability if previous state is immediately invalidated upon
change.</p>
</aside>

Now lets consider object with longer lifecycle, say entitiy representing user:
if user changes his username or email, he stays the same user. Only one
canonical representation for user can exist at a time, that means previous
state is immediately invalidated and replaced.
Now one might think "Hold on a second, but what about user who placed order? His
info should not change!" And he will be correct but not right. This is implicit
business rule and it should be handled differently.
User becomes customer the moment he places that order, as such it makes much
more sense to create new immutable customer object from user object.


