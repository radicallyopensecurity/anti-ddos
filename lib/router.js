/******************************************************************************
 * router.js - routing of incoming requests                                   *
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

function route(a,b){xpath=a.url.split("/");for(var c=0;c<xpath.length;c++)""==xpath[c]?(xpath.splice(c,1),c--):xpath[c]=decodeURIComponent(xpath[c]);var d={error:1,info:"Your request was not understood!"};return JSON.stringify(xpath)!=JSON.stringify(last_xpath)&&console.log(" [.] routing request "+JSON.stringify(xpath)),last_xpath=xpath,0==xpath.length?d={info:" *** Welcome to the NAD JSON REST-API. Please enter a path. For example: /do/log *** ",error:0}:(("a"==xpath[0]||"action"==xpath[0])&&(d=action.process(a)),("d"==xpath[0]||"do"==xpath[0])&&(d=doing.process(a)),("n"==xpath[0]||"net"==xpath[0]||"network"==xpath[0])&&xpath.length>1&&"peers"==xpath[1]&&(d=network.getPeers()),("p"==xpath[0]||"proc"==xpath[0])&&(d=proc.process(a)),("s"==xpath[0]||"source"==xpath[0])&&(d=source.process(a)),("v"==xpath[0]||"view"==xpath[0])&&(d=view.serve(a)),("x"==xpath[0]||"xauth"==xpath[0])&&xpath.length>1&&(d=xauth.xauth(a)),xpath[0].length<=1&&(d.info=void 0)),JSON.stringify(d)}functions=require("./functions"),action=require("./action"),source=require("./source"),doing=require("./doing"),proc=require("./proc"),xauth=require("./xauth"),url=require("url"),exports.route=route;
