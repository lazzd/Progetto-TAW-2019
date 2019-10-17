#!/bin/bash

rm -f ../../angular-front/src/index.html
rm -f ../../angular-front/src/main.ts
cp -f ../../angular-front/MobileWeb/indexesMobileWeb/indexMobile.html ../../angular-front/src/index.html
cp -f ../../angular-front/MobileWeb/mainsMobileWeb/mainMobile.ts ../../angular-front/src/main.ts