#!/usr/bin/env bats

@test "foo.txt does not exist" {
  [ ! -e "foo.txt" ]
}

@test "bar.txt exists" {
  [ -e "bar.txt" ]
}