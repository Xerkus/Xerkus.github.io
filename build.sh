#! /bin/bash

REQUIRED_BRANCH="sculpin"

if [ "$(git symbolic-ref -q HEAD 2>/dev/null)" != "refs/heads/$REQUIRED_BRANCH" ]
then
    >&2 echo "It appears we are not in '$REQUIRED_BRANCH' branch."
    >&2 echo "Aborting..."
    exit 1
fi

if [ "$(git status --porcelain | wc -l)" -ne 0 ]
then
    >&2 echo "Working copy is dirty:"
    >&2 git status --short
    >&2 echo "Aborting..."
    exit 1
fi

CURR_COMMIT=$(git rev-parse --short HEAD)

composer.phar install
echo

rm -rf ./output_prod
./vendor/bin/sculpin generate --env=prod
echo

rm -rf ./gh-pages-deployment
git clone git@github.com:Xerkus/Xerkus.github.io.git ./gh-pages-deployment
cd gh-pages-deployment

git checkout -f master

rsync --quiet --archive \
    --filter="P .git*" --filter="P CNAME" --filter="P .nojekyll" \
    --delete ../output_prod/ ./
rm -rf ./output_prod

git add -A :/
git commit -a -m "Deploying sculpin-generated pages at #$CURR_COMMIT"

if [ "$1" == "push" ]
then
    git push origin master
    echo "Done and pushed"
    exit
fi


echo "Done. Now cd to gh-pages-deployment, verify and push to origin master"
