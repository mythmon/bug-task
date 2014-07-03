var spawn = require('child_process').spawn;

var Promise = require('es6-promises');

function _task(args) {
  args = args || [];

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

  return _task(args)
  .then(function(data) {
    var match = data.stdout.match(/Created task (\d+)\./);
    if (match) {
      var id = match[1];
      return new Task(id);
    } else {
      throw new Error('Unknown output "' + data.stdout + '".');
    }
  });
}

function Task(id) {
  this.id = id;
}

module.exports = {
  addTask: addTask,
};
