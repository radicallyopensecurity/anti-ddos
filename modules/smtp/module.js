/******************************************************************************
 * module.js : smtp -> sends e-mails via smtp                                 *
 * Copyright © 2016 Joachim de Koning, Amadeus de Koning                      *
 *                                                                            *
 * See the LICENSE files at                                                   *
 * the top-level directory of this distribution for the individual copyright  *
 * holder information and the developer policies on copyright and licensing.  *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * Waves software, including this file, may be copied, modified, propagated,  *
 * or distributed except according to the terms contained in the LICENSE      *
 * file.                                                                      *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

// exports
exports.init = init;
exports.send = send;
exports.verify = verify;
exports.transport = transport;
exports.testmail = testmail;

function init() {
  ﻿// both variables must be global
  modules.module.smtp.nodemailer = require('nodemailer');

  /* HARD CODED TEST:
  var smtpConfig = {
          host: 'mail.nbip.nl',
          port: 25,
          auth: {
              user: 'ddospattern',
              pass: 'RoHyekun6quic'
          },
          secure: false,                // TLS requires secure (SSL) to be false
          tls: {
            rejectUnauthorized: false   // optionally force ciphers -> ciphers:'SSLv3'
          }
      };
  */

  //var subprocesses = [];  
  //subprocesses.push('func("mysql","query",{sql:"'+esc('SELECT * FROM Configuration WHERE smtp_configuration LIKE "NaWaS_prototype"')+'"})');
  //subprocesses.push('modules.module.smtp.config = data[0].smtp_transport');
  ////subprocesses.push('poke("smtp_transport",json(data[0].smtp_transport),data)');
  //subprocesses.push('poke("smtp_messagetemplate",json(data[0].smtp_messagetemplate),data)');
  //subprocesses.push('func("smtp","transport",{cfg:peek("smtp_transport")})');  
  //subprocesses.push('func("smtp","testmail")');  

  // shoot the Four-language program in to the subprocess queue
  //var processID = scheduler.init(0);  // ,{timeout:0}
  //scheduler.fire(processID,subprocesses);
  console.log(' [i] initialised module smtp');
}

// gets all checks and schedules each one of them with the right timeout
function testmail(data) { 
  var processID = data.processID;
  var subprocesses = [];

  // TODO:
  // DB: get mail targets
  // DB: get messages
  // var sqlstr = esc('SELECT * FROM Checks WHERE 1;');	  
  //subprocesses.push('modules.module.mysql.main.query({"processID":"'+processID+'","sql":"'+sqlstr+'"})');

  // send message
  /* HARD CODED TEST:
    message = { from:'"Anti-DDOS engine" <ddospattern@nbip.nl>',
                to: 'joachim@sheraga.net',
                subject: 'Test mail ✔',
                text: 'Hello world!',
                html: '<b>Hello world ?</b>' }
  */
  subprocesses.push('time(120000)');          // set long timeout for slow servers
  subprocesses.push('func("smtp","verify")');
  subprocesses.push('test(err,1,2,data)');    // if transport does not work, stop and report error
  subprocesses.push('stop(1,data)');
  subprocesses.push('func("smtp","send",{msg:peek("smtp_messagetemplate")})');  
  subprocesses.push('stop(err,data)');  

  // shoot the Four-language program in to the subprocess queue
  scheduler.fire(processID,subprocesses);  
}

// set up the transport
function transport(data) {
  var processID = data.processID;
  if(typeof data.cfg != 'undefined') {
    try {
      modules.module.smtp.transporter = modules.module.smtp.nodemailer.createTransport(data.cfg);
      scheduler.stop(processID,{err:0,data:'Transport initialized OK.'});
    } catch(e) {
      scheduler.stop(processID,{err:1,data:e});
    }
  } else {
    scheduler.stop(processID,{err:1,data:'Error: Missing smtp_transport data!'});
  }
}

// verify connection configuration
function verify(data) {
  var processID = data.processID;
  setTimeout(function() {
    scheduler.stop(processID,{err:1,data:'Error: Transport not responding!'});
  }, 14000);
  try {
    modules.module.messaging.transporter.verify(function(err, success) {
      if (err) {
        scheduler.stop(processID,{err:1,data:err});
      } else {
        scheduler.stop(processID,{err:0,data:'Verified transport OK.'});
      }
    });
  } catch(e) {
    scheduler.stop(processID,{err:1,data:'Error calling verify function!'});
  }  
}

function send(data) {
  var processID = data.processID;
  // setup e-mail data with unicode symbols
  var mailOptions = {
        from: data.msg.from,
        to: data.msg.to,
        subject: data.msg.subject,
        text: data.msg.text,
        html: data.msg.html };
  // send mail with defined transport object
  modules.module.smtp.transporter.sendMail(mailOptions, function(error, info){
    if(error){
      scheduler.stop(processID,{err:1,data:error});
    }
    scheduler.stop(processID,{err:0,data:info});
  });  
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

  scheduler.fire(processID,subprocesses);

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
  
  scheduler.fire(processID,subprocesses);

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

