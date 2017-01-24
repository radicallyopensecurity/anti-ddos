/******************************************************************************
 * source.js - dispatcher for source requests                                 *
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

// export every function
exports.process = process;

// functions start here

function process(request) {
	// DEBUG 
	console.log(' [i] returning source request '+JSON.stringify(xpath));
	if (xpath.length == 1) {
		// do something when the command has only one argument
		result = {error:1, info:'Please use an source function!', data:['sensor','database']};
	} 
	if (xpath.length > 1) {
		result = {error:1, info:'Source function not found!'};
		if ( xpath[1] == 'sensor' ) {
			// send message
			if ( xpath.length > 2 ) {
            result = activate('mysql',{command:'select',select:'*',from:'Logs',where:'id='+xpath[2]});
			} else {
				// not enough arguments given
				result = {error:1, info:'Sensor request missing data. Please add /target .'};
			} 
		}
		if ( xpath[1] == 'database' ) {
			// send message
			if ( xpath.length > 2 ) {
				result = {error:1, info:'Database request missing data. Please add /FROM/WHERE .'};
        if ( xpath[2] == 'select' ) {        
          if ( xpath.length > 4 ) {
            result = activate('mysql',{command:'select',select:'*',from:xpath[3],where:xpath[4]});
          }
        }
			} else {
				// not enough arguments given
				result = {error:1, info:'Database request missing data. Please add /select/FROM/WHERE .'};
			} 
		}    
	}
	return result;
}

function activate(module,data) {
  // init new process
  var processID = scheduler.init(0);
  // run the module connector function - disconnects and sends results to processID!
  if(typeof modules.module[module] != 'undefined') {
    modules.module[module].main.exec({processID,data});
    var result = {error:0, info:'Command process ID.', id:'id', request:data.command, data:processID};
  } else {
    console.log(' [!] module '+module+': not loaded, or disfunctional!');
    var result = {error:1, info:'Module not found or disfunctional!'};
  }
	return result;
}
