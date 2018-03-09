#!/bin/bash
# set -x
set -euo pipefail

cleanup() {
  popd
}

destdir=$1
rm -rf $destdir
mkdir -p $destdir
cp -r . $destdir/.fixtures
pushd $destdir
trap cleanup EXIT

git init
echo '.fixtures' > .gitignore
for stagedir in .fixtures/*/; do
  stagename=$(basename $stagedir)
  rm -f $destdir/*.{txt,bats}
  cp -r $stagedir/* $destdir
  bats test.bats
  git add .
  git commit -F .fixtures/$stagename.txt
  git tag $stagename
done