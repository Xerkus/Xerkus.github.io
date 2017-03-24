# Xerkus.github.io
Gotta start blogging =/

Install
=======

Requires git, php 7 and composer for site generator and nodejs 6 with npm for assets

```
npm install
composer install
```

Usage
=====

- `composer build-all` build assets then build site
- `composer build-assets` build assets
- `composer build` build site
- `composer clean` do cleanup
- `composer deploy` build site and deploy, does not build assets

`composer deploy` requires current branch to be `sculpin` with no uncommitted changes

Assets and source watching as well as local development server are available via
direct usage of webpack and sculpin
