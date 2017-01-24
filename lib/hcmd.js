/******************************************************************************
 * hcmd.js - hybridd command line client                                      *
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
 
 function responder(a,b){"undefined"==typeof b&&(b=0);var c="";a.on("data",function(a){c+=a}),a.on("end",function(){var a=JSON.parse(c),d=a.id,e=a.progress,f="undefined"!=typeof a.stopped?a.stopped:null;cmd_data=a.data,"id"==d?setTimeout(function(){options.path="/proc/"+cmd_data;var a=http.get(options,function(a){responder(a)});a.on("error",function(a){console.log("Request error: "+a.message)})},100):80>b&&1!=e&&null==f&&void 0!=d&&-1==["proc","asset","source"].indexOf(d)?(b++,process.stdout.write("."),setTimeout(function(){var a=http.get(options,function(a){responder(a,b)});a.on("error",function(a){process.stdout.write("x\n\nSerious error occurred! Please check if hybridd is still running.\n\n")})},100,b)):(process.stdout.write("\n\n"),console.log(c+(80==b?"\n\n [!] process is unfinished!":"")),process.stdout.write("\n"))})}timeoutvalue=150,timeoutcnt=0,functions=require("./functions");var fs=require("fs"),ini=require("./ini");global.hybridd=ini.parse(fs.readFileSync("../hybridd.conf","utf-8"));var http=require("http"),path=process.argv;path.shift(),path.shift(),options={host:global.hybridd.restbind,port:global.hybridd.restport,path:path};var req=http.get(options,function(a){responder(a)});req.on("error",function(a){console.log("Request error: "+a.message)});
