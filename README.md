# Nothing Major

Ensures that you've marked your breaking change commits.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Usage

Right now, this assumes that you're using the [Angular commit message format](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits). In the future, this may be configurable.

```sh
$ nothing-major -b 'build script' -t 'test script' [[test files]]
```

This will do the following:

1. Check and see if you've already noted that the current commit has breaking changes.
2. Creates a temporary directory.
3. Checks out your code into a [`git-worktree`](https://git-scm.com/docs/git-worktree) in the temporary directory.
4. Runs the supplied build script.
5. Checks out the test files from the previous commit.
6. Runs the supplied test script, exiting cleanly if it passes.
7. Cleans up the temporary directory and the git worktree.

For an NPM project, this script may look like:

```sh
$ nothing-major -b 'npm install' -t 'npm test' test/*
```

The intention is that this would be setup to run as a [`post-commit`](https://git-scm.com/docs/githooks#_post_commit) hook. The build script runs a bit slowly right now (which I'm guessing has to do with building in a fresh directory), so it hasn't seemed practical yet. However, I plan to experiment further.

### Debugging

The script uses the [`debug`](https://www.npmjs.com/package/debug) library. Debugging can be turned on with the `-v` or `--verbose` flag or the `DEBUG='nothing-major'` environment variable.