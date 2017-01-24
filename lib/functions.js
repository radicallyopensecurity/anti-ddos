/******************************************************************************
 * functions.js -> helper functions for hybridd                               *
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

function exportglobal(name,object){if("undefined"!=typeof GLOBAL)eval(name+" = "+JSON.stringify(object)),console.log(name+" = "+JSON.stringify(object));else{if("undefined"==typeof window)throw new Error("Unkown run-time environment. Currently only browsers and Node.js are supported.");eval(name+" = "+JSON.stringify(object))}}function clean(a){var b=a.toString().replace(/[^A-Za-z0-9\.\*]/g,"");return b}function clean_num(a){var b=a.toString().replace(/[^0-9]/g,"");return b}function timestamp(a){var b=a.getFullYear()+"-"+(a.getMonth()+1).toString().lZero(2)+"-"+a.getDate().toString().lZero(2)+" "+a.getHours().toString().lZero(2)+":"+a.getMinutes().toString().lZero(2)+":"+a.getSeconds().toString().lZero(2)+"."+a.getMilliseconds().toString().lZero(3);return b}function cloneobj(a){var b=[];for(key in a)b[key]=a[key];return b}function confdefaults(a){for(var b in a)"undefined"==typeof a[b].port&&("undefined"!=typeof a[b].host&&"https"===a[b].host.substring(0,5)?a[b].port=443:a[b].port=80),"undefined"==typeof a[b].path&&(a[b].path="/q");return a}function isset(strVariableName){try{eval(strVariableName)}catch(e){if(e instanceof ReferenceError)return!1}return!0}function implode(a,b){var c="",d="",e="";if(1===arguments.length&&(b=a,a=""),"object"==typeof b){if("[object Array]"===Object.prototype.toString.call(b))return b.join(a);for(c in b)d+=e+b[c],e=a;return d}return b}function JSONvalid(a){var b={};return"string"==typeof a&&a&&(b=!/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(a.replace(/"(\\.|[^"\\])*"/g,""))&&JSON.parse(a)),b}function randomstring(a,b){b=b||"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(var c="",d=0;a>d;d++){var e=Math.floor(Math.random()*b.length);c+=b.substring(e,e+1)}return c}exports.timestamp=timestamp,exports.JSONvalid=JSONvalid,exports.isset=isset,exports.implode=implode,exports.cloneobj=cloneobj,exports.clean=clean,exports.clean_num=clean_num,exports.confdefaults=confdefaults,exports.exportglobal=exportglobal,exports.randomstring=randomstring;
