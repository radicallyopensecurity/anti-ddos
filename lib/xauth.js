/******************************************************************************
 * xauth.js - authentication crypto library for hybridd engine                *
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

function xauth(a){var b={error:1},c=xpath[1],d=nacl.crypto_box_random_nonce(),e=nacl.to_hex(d);return"undefined"==typeof global.hybridd.xauth.session[c]?64==c.length&&(global.hybridd.xauth.session[c]={nonce1:e},b={error:0,nonce1:global.hybridd.xauth.session[c].nonce1}):"POST"==a.method&&("undefined"!=typeof global.hybridd.xauth.session[c].server_session_seckey,"undefined"!=typeof global.hybridd.xauth.session[c].nonce1&&a.on("data",function(a){console.log("POST: "+a);var b=functions.clean(a),d=nacl.from_hex(b),e=nacl.from_hex(c),f=nacl.crypto_sign_open(d,e);if(f){var g=nacl.decode_utf8(f),h=JSON.parse(g);if(console.log("Session secrets: "+g),global.hybridd.xauth.session[c].nonce2=functions.clean(h.nonce2),h.nonce1===global.hybridd.xauth.session[c].nonce1){var i=nacl.random_bytes(4096),j=nacl.crypto_box_keypair_from_seed(i);global.hybridd.xauth.session[c].server_session_seckey=nacl.to_hex(j.boxSk),nacl.to_hex(j.boxPk),global.hybridd.xauth.session[c].client_session_pubkey=h.client_session_pubkey;var k=nacl.crypto_hash_sha256(i),l=nacl.crypto_sign_keypair_from_seed(k);global.hybridd.xauth.session[c].server_sign_seckey=nacl.to_hex(l.signSk);var m=nacl.to_hex(l.signPk);crypt_data={server_sign_pubkey:m,server_session_pubkey:global.hybridd.xauth.session[c].server_session_pubkey};var g=JSON.stringify(crypt_data);console.log("JSON secrets: "+g);var d=nacl.encode_utf8(g),n=nacl.crypto_sign(d,l.signSk),o=nacl.to_hex(n);JSON.stringify({server_sign_pubkey:m,crhex:o})}}})),console.log("REQUEST METHOD: "+a.method+"<br/>hexkey: "+global.hybridd.xauth.session[c].nonce1),b}function xcrypt(a,b){}function xplain(a,b){}exports.xauth=xauth,exports.xcrypt=xcrypt,exports.xplain=xplain,functions=require("./functions");
