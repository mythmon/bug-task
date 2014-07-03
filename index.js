#!/usr/bin/env node
var PromiseProxy = require('proxied-promise-object');
var Promise = require('es6-promises');
var bz = require('bz');
var nomnom = require('nomnom');

var tw = require('./lib/taskwarrior');
var utils = require('./lib/utils');

var opts = nomnom
  .script('bugtask')
  .options({
    bugs: {
      position: 0,
      help: 'Bug numbers to add tasks for.',
      list: true,
      required: true,
    },
  })
  .parse();

var bugzilla = PromiseProxy(Promise, bz.createClient());
var error = false;

Promise.all(opts.bugs.map(function(bugNo) {
  return bugzilla.getBug(bugNo)
  .then(function(bug) {
    return tw.addTask({
      description: bug.summary + ' [Bug ' + bugNo + ']',
    });
  })
  .then(function(task) {
    console.log('Bug ' + bugNo + ': Added task ' + task.id);
  })
  .catch(function(err) {
    console.log('Bug ' + bugNo + ' ', err.message);
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
