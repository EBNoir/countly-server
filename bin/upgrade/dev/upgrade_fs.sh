#!/bin/bash

echo "Running filesystem modifications"

VER="20.04.2"

CONTINUE="$(countly check before upgrade fs "$VER")"

if [ "$CONTINUE" != "1" ] && [ "$1" != "combined" ]
then
    echo "Filesystem is already up to date with $VER"
    read -r -p "Are you sure you want to run this script? [y/N] " response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]
    then
        CONTINUE=1
    fi
fi

if [ "$CONTINUE" == "1" ]
then
    DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../.." && pwd )"
    # CUR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    npm install -g npm@latest;
    
    #upgrade nodejs
    if [ -f /etc/redhat-release ]; then
        curl -sL https://rpm.nodesource.com/setup_14.x | bash -
        yum clean all
        yum remove -y nodejs
        yum install -y nodejs bzip2
        if grep -q -i "release 6" /etc/redhat-release ; then
            bash "$DIR/scripts/install-google-chrome.sh";
        else
            yum install -y pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc
        fi
    fi
    
    if [ -f /etc/lsb-release ]; then
        wget -qO- https://deb.nodesource.com/setup_14.x | bash -
        apt-get -y --force-yes install nodejs || (echo "Failed to install nodejs." ; exit)
        apt-get -y install bzip2 gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
    fi

    #enable command line
    bash "$DIR/scripts/detect.init.sh"
    
    #removing moved files
    if [ -f "$DIR/../plugins/populator/frontend/public/stylesheets/banking.css" ]; then
        rm -rf "$DIR/../plugins/populator/frontend/public/stylesheets/banking.css";
    fi
    if [ -f "$DIR/../plugins/populator/frontend/public/stylesheets/ecommerce.css" ]; then
        rm -rf "$DIR/../plugins/populator/frontend/public/stylesheets/ecommerce.css";
    fi
    if [ -f "$DIR/../plugins/populator/frontend/public/stylesheets/gaming.css" ]; then
        rm -rf "$DIR/../plugins/populator/frontend/public/stylesheets/gaming.css";
    fi
    if [ -f "$DIR/../plugins/populator/frontend/public/stylesheets/healthcare.css" ]; then
        rm -rf "$DIR/../plugins/populator/frontend/public/stylesheets/healthcare.css";
    fi
    if [ -f "$DIR/../plugins/populator/frontend/public/stylesheets/navigation.css" ]; then
        rm -rf "$DIR/../plugins/populator/frontend/public/stylesheets/navigation.css";
    fi
    
    #remove previous dependencies, as they need to be rebuild for new nodejs version
    rm -rf "$DIR/../node_modules"
    
    (cd "$DIR/.." && sudo npm install --unsafe-perm)
    countly restart


    countly plugin upgrade star-rating
    countly plugin upgrade users
    countly plugin upgrade consolidate
    countly plugin upgrade push
    (cd "$DIR/../plugins/push/api/parts/apn" && npm install --unsafe-perm)

    #install dependencies, process files and restart countly
    countly task dist-all

    #call after check
    countly check after upgrade fs "$VER"
fi
