#!/bin/sh
TARGET=$@
OLDPATH=$PATH
WHEREAMI=`pwd`
export PATH=$WHEREAMI/node/bin:"$PATH"
NPMINST=`which npm`
echo "Using npm executable $NPMINST"

npm install $TARGET

export PATH=$OLDPATH
