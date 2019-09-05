rm -f ../../angular-front/src/index.html
rm -f ../../angular-front/src/main.ts
cp -f ../../angular-front/MobileWeb/indexesMobileWeb/indexWeb.html ../../angular-front/src/index.html
cp -f ../../angular-front/MobileWeb/mainsMobileWeb/mainWeb.ts ../../angular-front/src/main.ts
cd ../../angular-front
npm run electron:build