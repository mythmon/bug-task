var spawn = require('child_process').spawn;

var Promise = require('es6-promises');

function addTask(opts) {
  if (!('description' in opts)) {
    throw new Error('No description given for task.');
  }

  var args = ['add'];
  for (var key in opts) {
    if (!opts.hasOwnProperty(key)) {
      continue;
    }
    args.push(key + ':' + opts[key]);
  }

  return new Promise(function(resolve, reject) {
    var tw = spawn('task', args);
    var stdout = '';
    var stderr = '';

    tw.stdout.on('data', function(data) {
      stdout += data.toString();
    });
    tw.stderr.on('data', function(data) {
      stderr += data.toString();
    });

    tw.on('close', function(code) {
      var data = {
        code: code,
        stdout: stdout,
        stderr: stderr,
      };
      if (code === 0) {
        resolve(data);
      } else {
        reject(data);
      }
    });

    tw.on('error', function(err) {
      reject(err);
    });
  });
}

module.exports = {
  addTask: addTask,
};
