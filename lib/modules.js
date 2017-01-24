/******************************************************************************
 * modules.js - asynchronous module loader                                    *
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
 
function init(){fs.readdir(modulesdirectory,function(a,b){a?console.log(" [!] warning: error when reading "+a):(console.log(" [.] scanning modules in "+modulesdirectory),b.sort().forEach(scanmodules),modulelist.forEach(function(a,b,c){console.log(" [.] loading module "+a),module[a]=[],fs.existsSync(path.join(modulesdirectory+a+"/package.json"))?module[a].info=function(){return JSON.parse(fs.readFileSync(modulesdirectory+a+"/package.json","utf8"))}:(console.log(" [!] warning: non existant "+modulesdirectory+a+"/package.json"),module[a].info=null),module[a].main=require(modulesdirectory+a+"/module.js"),module[a].main.init()}))})}function scanmodules(a,b,c){fs.statSync(path.join(modulesdirectory+a)).isDirectory()&&(fs.existsSync(path.join(modulesdirectory+a+"/module.js"))?(modulelist.push(a),console.log(" [i] found module "+a)):console.log(" [!] cannot load module "+a+"!"))}var fs=require("fs"),path=require("path"),modulesdirectory=path.normalize(process.cwd()+"/../modules/"),modulelist=[],module=[];exports.init=init,exports.module=module;
