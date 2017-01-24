/******************************************************************************
 * main.js - core of the hybridd engine                                       *
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
 
function main(a){function b(b,c){b["public"]=!1,b["private"]=!0,c.writeHead(200,{"Content-Type":"application/json"}),c.write(a(b,modules)),c.end()}function c(b,c){if(-1==b.url.indexOf("/api",0,4)){var d=fs.readFileSync("../views/index.html","utf8");c.writeHead(200,{"Content-Type":"text/html"}),c.write(d),c.end()}else b["public"]=!0,b["private"]=!1,b.url=b.url.substring(4),c.writeHead(200,{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}),c.write(a(b,modules)),c.end()}if(modules.init(),http.createServer(b).listen(global.hybridd.restport,global.hybridd.restbind),console.log(" [i] REST API running on: http://"+global.hybridd.restbind+":"+global.hybridd.restport),scheduler.initialize(),"undefined"!=typeof global.hybridd.userport){var d="undefined"!=typeof global.hybridd.userport?global.hybridd.userport:8080;http.createServer(c).listen(d,global.hybridd.userbind),console.log(" [i] user interface running on: http://"+global.hybridd.userbind+":"+global.hybridd.userport)}}exports.main=main;var http=require("http"),fs=require("fs"),ini=require("./ini");global.hybridd=ini.parse(fs.readFileSync("../hybridd.conf","utf-8")),global.hybridd.proc={},global.hybridd.procqueue={},global.hybridd.xauth={},global.hybridd.xauth.session=[],last_xpath="",modules=require("./modules"),scheduler=require("./scheduler");
