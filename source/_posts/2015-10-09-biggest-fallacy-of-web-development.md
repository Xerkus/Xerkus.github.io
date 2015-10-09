---
layout: post
title: Biggest fallacy of mainstream web development
summary: 
tags:
  - rant
  - programming-practices
---

Today I want to expand on the topic I kept ranting for years. On biggest
fallacy of mainstream web development, the underlying issue why i believe
CRUDish apps suck so much.

For years I was learning programming principles, best practices, various
structures and patterns. I heavily invested into getting better with writing
code.  At some point, I got lured by very popular CRUDish approach to
application architecture. Indeed, it looked as a great thing, allowed to
jump-start writing code from day one, it promised great abstractions and code
reusability. It promised all I need is to master it to start writing great
applications. It took me considerable time to adjust my thought process to
"right" way. Years passed, experience accumualted, but greatness did not really
come. Instead I started notice more and more issues.

From all of my experience i suddenly saw horrifying depths of my ignorance.
I understood finally the truth so simple and obvious yet so easy to
underestimate and overlook. Truth in that most important aspect of any code, of
any application architecture - programmer's understanding of the problem, is,
in fact, neglected and wasted.

Yes, we neglect it by forming mental model to complement amorphous anemic code,
by hiding important business logic, decisions and processes in side effects.
Mental model blurs fast along with really important details scattered and
hidden, understanding fades. What is worse solutions get reused for similar
problems, solutions we no longer fully understand and do not really try to.
We get code that is dead, sterile, even before it is fully implemented.

touch here projects getting unwieldy, which are easier to rewrite than to fix.

Frankly, it is a tough one to notice, to pay due attention when there is so
much technology to learn and pressure to immediately apply it in practice while keeping up
with insane industry tempo. Severe shortage of a highly experienced senior
software engineers needed to teach and guide only underscores the issue. Many
newcoming and inexperienced developers getting sucked into this whirlpool with
little breather time to try to gain comprehension of the bigger picture.
Juniors get their experience and inevitably become seniors only to get their
turn to sustain this vicious circle.



----

Appaling thought, isn't it? It surely can't be true, or can it?

Well, lets us try to put aside what whe think we know and look at the most common
application.

Here is our typical model:

```php
<?php

namespace MyModel\Entity;

class User
{
    protected $id;
    protected $email;
    protected $name;

    public function getId() {}

    public function setId($id) {}

    public function getEmail() {}

    public function setEmail() {}

    public function getName() {}

    public function setName() {}
}

```


