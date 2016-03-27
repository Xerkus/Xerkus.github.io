#!/usr/bin/env bash

set -e

REQUIRED_BRANCH="sculpin"

if [ "$1" != "force" ] && \
  [ "$(git symbolic-ref -q HEAD 2>/dev/null)" != "refs/heads/$REQUIRED_BRANCH" ]
then
    >&2 echo "It appears we are not in '$REQUIRED_BRANCH' branch."
    >&2 echo "Aborting..."
    exit 1
fi

# intentionally not possible to use together with push
if [ "$1" != "force" ] && [ "$(git status --porcelain | wc -l)" -ne 0 ]
then
    >&2 echo "Working copy is dirty:"
    >&2 git status --short
    >&2 echo "Aborting..."
    exit 1
fi

CURR_COMMIT=$(git rev-parse --short HEAD)

rm -rf ./output_prod
sudo UID=$UID docker-compose run gulp build
./vendor/bin/sculpin generate --env=prod
echo

rm -rf ./.gh-pages-publish
git clone https://github.com/Xerkus/Xerkus.github.io.git -b master --depth 1 \
    ./.gh-pages-publish
cd .gh-pages-publish

rsync --quiet --archive \
    --filter="P .git*" --filter="P CNAME" --filter="P .nojekyll" \
    --delete ../output_prod/ ./
rm -rf ../output_prod

git add -A :/
# non-zero exit code on no changes, no new commit or pushing
git commit -a -m "Deploying sculpin-generated pages at #$CURR_COMMIT"

if [ "$1" == "push" ]
then
    git push origin master
    echo "Done and pushed"
    exit
fi

echo "Done. Now cd to .gh-pages-publish, verify and push to origin master"
