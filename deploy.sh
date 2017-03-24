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

rm -rf ./.gh-pages-publish
git fetch origin master:master
git worktree add ./.gh-pages-publish master
cd .gh-pages-publish

rsync --quiet --archive \
    --filter="P .git*" --filter="P CNAME" --filter="P .nojekyll" \
    --delete ../output_prod/ ./
rm -rf ../output_prod

git add -A :/
if [ "$(git status --porcelain | wc -l)" -ne 0 ]
then
    git commit -m "Deploying sculpin-generated pages at #$CURR_COMMIT"
fi

git push origin master
echo "Done and pushed"
