/******************************************************************************
 * module.js : mysql -> connects to mysql databases                           *
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
exports.query = query;

function init() {

	var mysql      = require('mysql');

	modules.module.mysql.db = mysql.createConnection({
	  host     : global.hybridd.dbhost,
	  user     : global.hybridd.dbuser,
	  password : global.hybridd.dbpass,
	  database : global.hybridd.dbbase
	});
	
	console.log(' [i] initialised module mysql');

}

function exec(properties) {
  var processID = properties.processID;
  var data = properties.data;

  var subprocesses = [];
  switch(data.command) {
    case 'select':
      var sqlstr = esc('SELECT '+data.select+' FROM '+data.from+' WHERE '+data.where+';');
      subprocesses.push('func("mysql","query",{sql:"'+sqlstr+'"})');
      subprocesses.push('stop(err,data)');  
    break;
  }

  // shoot the Four-language program in to the subprocess queue
  if(subprocesses) {
    scheduler.fire(processID,subprocesses);  
  }
}

function query(properties) {

	var processID = properties.processID;
  var querystr = properties.sql;

  try {
    modules.module.mysql.db.query(querystr, function(err, rows, fields) {
      if (err) throw err;
      console.log('Data found is: '+JSON.stringify(rows));
    
      //global.hybridd.proc[processID].err=err;
      global.hybridd.proc[processID].data=rows;
      global.hybridd.proc[processID].progress=1;
      global.hybridd.proc[processID].stopped=Date.now();
      
    });
  } catch(e) {
    scheduler.stop(processID,{err:1,data:'Error: There is an error in the SQL syntax!'})
  }
}

function esc(escapestring) {
  return escapestring.replace(/"/g,'\\"');
}

