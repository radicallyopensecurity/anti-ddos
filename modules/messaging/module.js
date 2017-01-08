/******************************************************************************
 * module.js : messaging -> send chat messages                                *
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
exports.send = send;
exports.verify = verify;
exports.transport = transport;

function init() {
  ﻿// store nodemailer
  modules.module.messaging.nodemailer = require('nodemailer');

  modules.module.messaging.config = {
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
      
  // message comes from
  modules.module.messaging.source = 'ddospattern@nbip.nl';
	console.log(' [i] initialised module messaging');    
}

function exec(properties) {
  var processID = properties.processID;
  var data = properties.data;

  switch(data.command) {
    case 'send':
      var messagetemplate = { from:modules.module.messaging.source, to: 'text.'+data.target+'@svsnet.nl', subject: 'NAD message: '+data.message.substr(0,64), text: data.message }
      var subprocesses = [];  
      //subprocesses.push('func("mysql","query",{sql:"'+esc('SELECT * FROM Configuration WHERE smtp_configuration LIKE "NaWaS_prototype"')+'"})');
      //subprocesses.push('poke("smtp_transport",json(data[0].smtp_transport),data)');
      //subprocesses.push('poke("messagetemplate",'+JSON.stringify(messagetemplate)+',data)');
      subprocesses.push('time(120000)');          // set long timeout for slow servers
      subprocesses.push('func("messaging","transport",{cfg:'+JSON.stringify(modules.module.messaging.config)+'})');  
      subprocesses.push('func("messaging","verify")');
      subprocesses.push('test(err,1,2,data)');    // if transport does not work, stop and report error
      subprocesses.push('stop(1,data)');
      subprocesses.push('func("messaging","send",{msg:'+JSON.stringify(messagetemplate)+'})');  
      subprocesses.push('stop(err,data)');  
    break;
  }

  // shoot the Four-language program in to the subprocess queue
  if(subprocesses) {
    scheduler.fire(processID,subprocesses);  
  }
}

// set up the transport
function transport(data) {
  var processID = data.processID;
  if(typeof data.cfg != 'undefined') {
    try {
      modules.module.messaging.transporter = modules.module.messaging.nodemailer.createTransport(data.cfg);
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
  modules.module.messaging.transporter.sendMail(mailOptions, function(error, info){
    if(error){
      scheduler.stopproc(processID,{err:1,data:error});
    }
    scheduler.stopproc(processID,{err:0,data:info});
  });  
}
