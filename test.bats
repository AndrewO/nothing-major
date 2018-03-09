#!/usr/bin/env bats

test_repo=./tmp

setup() {
  pushd $test_repo
}

teardown() {
  popd
}

@test "When the commit doesn't declare a breaking change, and tests pass, exit with success" {
  git checkout 01_minor_change
  run node ../cli.js -t 'bats *.bats' test.bats
  [ "$status" -eq 0 ]
}

@test "When the commit declares a breaking change, exit with success" {
  git checkout 02_breaking_change
  run node ../cli.js -t 'bats *.bats' test.bats
  [ "$status" -eq 0 ]
}


@test "When the commit doesn't declare a breaking change, and tests fail, exit with error" {
  git checkout 03_undeclared_breaking_change
  run node ../cli.js -t 'bats *.bats' test.bats
  [ "$status" -eq 0 ]  
}