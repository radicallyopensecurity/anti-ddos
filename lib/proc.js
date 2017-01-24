/******************************************************************************
 * proc.js - process manager of the hybridd engine                            *
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

function process(a){return 1==xpath.length?result=proclist():"peek"!=xpath[1]||a["public"]?"queue"!=xpath[1]||a["public"]?result=procdata(xpath[1]):3==xpath.length?"undefined"!=typeof global.hybridd.procqueue[xpath[2]]?result={error:0,info:"Queue item.",id:xpath[2],data:global.hybridd.procqueue[xpath[2]]}:result={error:1,info:"The queue item specified does not exist!"}:result=queuelist():3==xpath.length&&(result=procdata(xpath[2],!0)),result}function queuelist(){var a=0,b=[];for(var c in global.hybridd.procqueue)b[a]=c,a++;return{error:0,info:"List of queue items.",id:"proc/queue",count:a,data:b}}function proclist(){var a=0,b=0,c=[];for(var d in global.hybridd.proc)-1==d.indexOf(".",15)?(c[a]=d,a++):b++;return{error:0,info:"List of processes.",id:"proc",count:a,subprocesses:b,data:c}}function procdata(a,b){if("undefined"!=typeof global.hybridd.proc[a])if(b)var c=global.hybridd.proc[a];else var d=global.hybridd.proc[a].err,e="undefined"!=typeof global.hybridd.proc[a].info?global.hybridd.proc[a].info:"Process data.",c={error:d?d:0,info:e,id:a,progress:global.hybridd.proc[a].progress,started:global.hybridd.proc[a].started,stopped:global.hybridd.proc[a].stopped,data:global.hybridd.proc[a].data};else var c={error:1,info:"The process specified does not exist!"};return c}exports.process=process;
