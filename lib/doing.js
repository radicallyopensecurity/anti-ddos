/******************************************************************************
 * doing.js -> handle do requests (do something for me)                       *
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

function process(a){if(console.log(" [i] returning do action request "+JSON.stringify(xpath)),1==xpath.length&&(result={error:1,info:"Please specify a do function"}),xpath.length>1&&(result={error:0,info:"Specified do function: "+xpath[1]},"log"==xpath[1]&&(xpath.length>2?""!=xpath[2]:result={error:2,info:"Please specify what to log"}),"read"==xpath[1]))if(xpath.length>2){if(""!=xpath[2]){var b='SELECT * FROM Sensors WHERE id="'+functions.clean_num(xpath[2])+'";';db.query(b,function(a,c,d){if(a)throw a;console.log("Original query was:"+b),console.log("The sensor data is: ",c[0].address);var e=["1"+c[0].address];snmphost.get(e,function(a,b){if(a)console.error(a);else for(var c=0;c<b.length;c++)snmp.isVarbindError(b[c])?console.error(snmp.varbindError(b[c])):console.log(b[c].oid+" = "+b[c].value)})})}}else result={error:2,info:"Please specify sensor to read"};return result}exports.process=process;
