#!/usr/bin/env bats

@test "foo.txt exists" {
  [ -e "foo.txt" ]
}

@test "bar.txt exists" {
  [ -e "bar.txt" ]
}