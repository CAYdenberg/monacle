#! /bin/bash

cd ../lens-starter/
substance --bundle
cp -f ./dist/lens.js ../monacle/public/js/lens.js
cp -f ./dist/lens.css ../monacle/public/css/lens.css
cd ../monacle/
npm start