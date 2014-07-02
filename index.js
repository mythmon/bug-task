#!/usr/bin/env node
var PromiseProxy = require('proxied-promise-object');
var Promise = require('es6-promises');
var bz = require('bz');
var nomnom = require('nomnom');

var tw = require('./lib/taskwarrior');
var utils = require('./lib/utils');

var opts = nomnom.parse();
var bugzilla = PromiseProxy(Promise, bz.createClient());
var error = false;

if (opts._.length === 0) {
  console.log('Usage:', process.argv[0], 'BUG [BUG ...]');
  process.exit(1);
}

Promise.all(opts._.map(function(bugNo) {
  return bugzilla.getBug(bugNo)
  .then(function(bug) {
    return tw.addTask({
      description: bug.summary + ' [Bug ' + bugNo + ']',
    });
  })
  .then(function() {
    console.log(bugNo, '✓');
  })
  .catch(function(err) {
    console.log(bugNo, '✗');
    console.error(err);
    error = true;
  });
}))
.then(function() {
  process.exit(error);
})
.catch(function(err) {
  console.log('Error', error);
  process.exit(1);
});
