# Xerkus.github.io
Gotta start blogging =/

Install
=======

Requires globally installed composer as `composer` and node/npm

```sh
$ npm install
```

Usage
=====

```
$ node_modules/gulp <target>
```

Targets:

- `deploy`: Builds and deploys site. Requires branch `sculpin` to be checked
  out and clean repo state(no uncommitted changes).
- `build`: builds production version of site into `output_prod` folder
- `build:dev`: builds dev version into `output_dev` folder
- `watch`: starts sculpin server at port 8888 and watches assets and source changes
- `bower`: installs bower dependencies
