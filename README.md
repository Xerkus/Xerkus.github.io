# Xerkus.github.io
Gotta start blogging =/

Install
=======

Requires git, php and composer for site generator and docker with
docker-compose for assets

Note: Nodejs with all the modules moved into docker container.

Usage
=====

Setup:

```
$ sudo UID=$UID docker-compose up
composer install
```

Building assets:

```
$ sudo UID=$UID docker-compose run gulp build
$ sudo UID=$UID docker-compose run gulp build:dev
```

Sculpin:

```
vendor/bin/sculpin
```

Helper bash script to build and deploying generated content.
Requires branch `sculpin` and no uncommitted changes.  
Invokes `sudo UID=$UID docker-compose run gulp build'
and `sculpin generate --env=prod` as part of the deploy process.

```
./build.sh deploy
```

Gulp targets:

- `build`: builds production version of assets into source/assets folder
- `build:dev`: builds dev version of assets into source/assets folder
- `bower`: installs bower dependencies, runs as part of `docker-compose up`
