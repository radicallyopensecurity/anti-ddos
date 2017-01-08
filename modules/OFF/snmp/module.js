/******************************************************************************
 * module.js : snmp -> talk to switches that speak the snmp protocol          *
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
exports.read_sensors = read_sensors;
exports.process_sensors = process_sensors;
exports.read_check = read_check;
exports.process_checks = process_checks;

function init() {
  ﻿// both variables must be global
  snmp = require('net-snmp');

  // to do: create function that takes values from hybridd.conf  				  
  snmphost = snmp.createSession('127.0.0.1','public');
  
  // get all checks
  read_check('');
  
  

}

// gets all checks and schedules each one of them with the right timeout
function read_check(tag) { 

  var processID = scheduler.initproc(0,{timeout:0});  
  
  // set timeout to never time out (so subprocs can loop forever using jump)
  //global.hybridd.proc[processID].timeout = 0;
  
  var subprocesses = [];

  // fetch checks from Checks table and place into scheduler

  // retrieve all checks from db
  if ( tag == '' ) {  
  	var sqlstr = esc('SELECT * FROM Checks WHERE 1;');	  
  } else {
  	var sqlstr = esc('SELECT * FROM Checks WHERE tag="'+tag+'";');	
  }

  subprocesses.push('time(0)');  // ze eternal timeout!
  subprocesses.push('modules.module.mysql.main.query({"processID":"'+processID+'","sql":"'+sqlstr+'"})');

  // process checks to put into scheduler
  subprocesses.push('modules.module.snmp.main.process_checks({"processID":"'+processID+'","data":data})');  

  scheduler.subqueue(processID,subprocesses);
  
}

function process_checks(properties) {
  var processID = properties.processID;
  
  // set timeout to never time out (so subprocs can loop forever using jump)
  //global.hybridd.proc[processID].timeout = 0;
  
  var checks = properties.data;  

  var subprocesses = [];

  subprocesses.push('time(0)');  // ze eternal timeout!

  for ( var b=0; b<checks.length; b++) {
    console.log("Process checks ["+b+"]: "+JSON.stringify(checks[b]));

    // find sensor descriptions/rows
    subprocesses.push('modules.module.snmp.main.read_sensors({"processID":"'+processID+'","data":'+JSON.stringify(checks[b])+'})');

    // turn sensor rows into oids
    subprocesses.push('modules.module.snmp.main.process_sensors({"processID":"'+processID+'","data":data})');  

    // wait for the right amount of time
    // use properties.data.checks[b].poll_freq    
    subprocesses.push('wait('+checks[b].poll_freq+')');

    // jump to the first command in the scheduler to loop
    subprocesses.push('jump(-3)');
        
  }

  scheduler.subqueue(processID,subprocesses);

}

// constructs an snmp call using sensor description rows from read_sensors
function process_sensors(properties) {
  var processID = properties.processID;
  var sensors = properties.data;  

  var sensor_oidstr = [];
  
  for ( var b=0; b<sensors.length; b++) {
    console.log("Process sensors data ["+b+"]: "+JSON.stringify(sensors[b]));
    
    sensor_oidstr[b] = sensors[b][0].target+'.'+sensors[b][0].units+string2oid(sensors[b][0].filter,sensors[b][0].filter_fill,sensors[b][0].filter_prefix)+string2oid(sensors[b][0].counter,sensors[b][0].counter_fill,sensors[b][0].counter_prefix);
  	
    console.log('Sensor oid: '+sensor_oidstr[b]);

    snmphost.get (sensor_oidstr, function (error, varbinds) {
    
      if (error) {
          console.error (error);
      } else {
          for (var i = 0; i < varbinds.length; i++)
              if (snmp.isVarbindError (varbinds[i]))
                  console.error (snmp.varbindError (varbinds[i]))
              else
                  console.log (varbinds[i].oid + " = " + varbinds[i].value);
      }
    
    });

    snmphost.trap (snmp.TrapType.LinkDown, function (error) {
    
      if (error) {
        console.error (error);
      }
    
    });
    
  }
  
  //global.hybridd.proc[processID].err=err;
  global.hybridd.proc[processID].data=sensor_oidstr;
  global.hybridd.proc[processID].progress=1;
  global.hybridd.proc[processID].stopped=Date.now();
  
}
 

// returns array of sensor descriptions
function read_sensors(properties) {  
  var processID = properties.processID;
  var checkrow = properties.data;
  console.log("Read sensors data:"+JSON.stringify(checkrow));
  var subprocesses = [];
  var sensors_ray = checkrow.sensors.split(',');
  
  for ( var a=0; a<sensors_ray.length; a++ ) {
    var sqlstr = esc('SELECT * FROM Sensors WHERE id="'+sensors_ray[a]+'";');
    // push all sensor id's onto query queue
    subprocesses.push('modules.module.mysql.main.query({"processID":"'+processID+'","sql":"'+sqlstr+'"})');
   
  }  
  
  // collate data
  subprocesses.push('coll(0)');  

  // stop process
  subprocesses.push('stop(0,data)');  
  
  scheduler.subqueue(processID,subprocesses);

}

function string2oid(inputstring,fixedlength,filterprefix) {
	var outputstring = '';
	// prefix length
	if ( filterprefix ) {
	    outputstring += '.' + inputstring.length;
	}
	// render string as dot-notated ascii values
	for ( var i=0; i<inputstring.length; i++ ) {
		outputstring += '.' + inputstring.charCodeAt(i);
	}
	
	// attach trailing zeroes suffix if called for
	if ( fixedlength > 0 ) {
		var suffixlength = fixedlength - inputstring.length;
		for ( var a=0; a<suffixlength; a++ ) {
			outputstring += '.0';
		}
	}

	return outputstring;
} 

function esc(escapestring) {
  return escapestring.replace(/"/g,'\\"');
}

