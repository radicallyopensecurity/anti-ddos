/******************************************************************************
 * module.js : execute -> execute external code                               *
 * Copyright © 2016 Joachim de Koning, Amadeus de Koning                      *
 *                                                                            *
 * This work is licensed under the GPLv3. See the LICENSE files at            *
 * the top-level directory of this distribution for the individual copyright  *
 * holder information and the developer policies on copyright and licensing.  *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * this software, including this file, may be copied, modified, propagated,   *
 * or distributed except according to the terms contained in the LICENSE      *
 * file.                                                                      *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

// exports
exports.init = init;
exports.exec = exec;
exports.commandline = commandline;

function init() {
  ﻿// store nodemailer
  modules.module.execute.config = null;
	console.log(' [i] initialised module execute');  
}

function exec(properties) {
  var processID = properties.processID;
  var data = properties.data;
  var subprocesses = [];
  switch(data.command) {
    case 'commandline':
      subprocesses.push('func("execute","commandline",{command:'+JSON.stringify(data.cmdline)+'})');  
      subprocesses.push('stop(err,data)');  
    break;
  }

  // shoot the Four-language program in to the subprocess queue
  if(subprocesses) {
    scheduler.fire(processID,subprocesses);  
  }
}

// execute commandline
function commandline(data) {
  var processID = data.processID;
  if(typeof data.options == 'undefined') { data.options = []; }
  if(typeof data.command != 'undefined') {
    // TODO: ONLY ALLOW CERTAIN COMMANDS HERE!
    var fs = require('fs');
    var file_executable = false;
    try {
      file_executable = fs.statSync('../modules/execute/scripts/'+data.command);
      if(file_executable) {
        try {
          foo = new cmd_exec(processID, '../modules/execute/scripts/'+data.command, data.options, 
            function (me, data) { global.hybridd.proc[processID].data=data.toString(); },
            function (me) { scheduler.stop(processID,{err:0,data:data}); }
          );
          scheduler.stop(processID,{err:0,data:{command:data.command,options:data.options}});
        } catch(e) {
          scheduler.stop(processID,{err:1,data:e});
        }
      } else {
        scheduler.stop(processID,{err:1,data:'Error: Command file is not executable!'});
      }
    } catch(e) {
      scheduler.stop(processID,{err:1,data:'Error: Command file does not exist!'});
    }
  } else {
    scheduler.stop(processID,{err:1,data:'Error: Command is not defined!'});
  }
}

function cmd_exec(processID, cmd, args, cb_stdout, cb_end) {
      var spawn = require('child_process').spawn;
      var child = spawn(cmd, args);
      var me = this;
      me.exit = 0;  // Send a cb to set 1 when cmd exits
      me.stdout = '';
      child.stdout.on('data', function (data) { cb_stdout(me, data) });
      child.stdout.on('end', function () { cb_end(me) });
}
