#!/usr/bin/env node
'use strict';
const { promisify } = require("util");
const debug = require("debug")('nothing-major');
const tempy = require('tempy');
const meow = require('meow');
const execa = require('execa');
const conventionalRecommendedBump = promisify(require(`conventional-recommended-bump`));

const args = meow(`
  Usage
    $ nothing-major [[test files]]

  Options
    --build, -b 'build command'
    --test, -t 'test command'
    --verbose, -v
`, {
  flags: {
    build: {
      type: "string",
      alias: "b"
    }, 
    test: {
      type: "string",
      alias: "t"
    },
    verbose: {
      type: "boolean",
      alias: "v",
      default: false
    }
  } 
})

const preset = "angular"; // TODO: support others
const buildCommand = args.flags.build || showHelp();
const testCommand = args.flags.test || showHelp();
const testFiles = Array.isArray(args.input) ? args.input : showHelp();
debug.enabled = args.flags.verbose;

(async () => {
  const {releaseType} = await conventionalRecommendedBump({ preset });
  debug('Recommended bump is: %s', releaseType);
  
  if (releaseType === "major") {
    console.error('Already a major bump according to commit logs. Exiting');
    process.exit(0);
  }
  
  const tempDir = tempy.directory();
  debug('Checkout out worktree to %s', tempDir);
  await pipeToParent(execa('git', ['worktree', 'add', '--detach', tempDir]));

  process.on('exit', () => { cleanup(tempDir) });

  debug('Building project in temporary directory with: %s', buildCommand);
  await pipeToParent(execa.shell(buildCommand, {cwd: tempDir}));

  debug('Checking out test files: %s', testFiles);
  await pipeToParent(execa('git', ['checkout', 'HEAD^', '--'].concat(...testFiles), {cwd: tempDir}));

  debug('Running test with command: %s', testCommand);
  await pipeToParent(execa.shell(testCommand, {cwd: tempDir}))
    .catch(({code}) => {
      debug('Test exited with: %d', code);
      if (code !== 0) {
        console.error('Breaking changes detected. Please amend your commit.');
      } else {
        console.error('No breaking changes detected.');
      }
      process.exit(code);
    });
})();

function showHelp() {
  args.showHelp();
  process.exit(1);
}

function pipeToParent(child) {
  child.stderr.pipe(process.stderr);
  child.stdout.pipe(process.stderr);
  return child
}

function cleanup(dir) {
  debug('Cleaning up.');
  execa.sync('rm', ['-rf', dir]);
  execa.sync('git', ['worktree', 'prune']);  
}