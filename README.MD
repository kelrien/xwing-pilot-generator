# How to run in dev mode
To debug the application I stronly advise to to it by running it through the electron binary. With this you can open the chrome dev tools (F12 on Windows or CMD+shift+i on Mac). To debug both the backend and frontend apps in the pilot generator.
* `npm install`
* run `./node_modules/.bin/electron app/main.js`

## Building the app
To make the app run without the need of electron or node installed on. The app needs to be build with electron-packager:
* `npm run package`

Currently the build script builds for all platforms (Mac, Linux, Windows and ARM7 devices)


### Enjoy!