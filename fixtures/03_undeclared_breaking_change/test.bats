#!/usr/bin/env bats

@test "foo.txt does not exist" {
  [ ! -e "foo.txt" ]
}

@test "bar.txt does not exist" {
  [ ! -e "bar.txt" ]
}