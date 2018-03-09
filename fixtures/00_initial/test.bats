#!/usr/bin/env bats

@test "foo.txt exists" {
  [ -e "foo.txt" ]
}