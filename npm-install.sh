#!/bin/sh
#
#   ******************************************************************************
#   * npm-install.sh -> shim for issuing local npm install command               *
#   * Copyright © 2016 Joachim de Koning, Amadeus de Koning                      *
#   *                                                                            *
#   * This work is licensed under the GPLv3. See the LICENSE files at            *
#   * the top-level directory of this distribution for the individual copyright  *
#   * holder information and the developer policies on copyright and licensing.  *
#   *                                                                            *
#   * Unless otherwise agreed in a custom licensing agreement, no part of the    *
#   * this software, including this file, may be copied, modified, propagated,   *
#   * or distributed except according to the terms contained in the LICENSE      *
#   * file.                                                                      *
#   *                                                                            *
#   * Removal or modification of this copyright notice is prohibited.            *
#   *                                                                            *
#   ******************************************************************************
#

TARGET=$@
OLDPATH=$PATH
WHEREAMI=`pwd`
export PATH=$WHEREAMI/node/bin:"$PATH"
NPMINST=`which npm`
echo "Using npm executable $NPMINST"

npm install $TARGET

export PATH=$OLDPATH
