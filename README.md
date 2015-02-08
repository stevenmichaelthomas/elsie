Elsie
====

Elsie is fast, clean frontend to a lovely LCBO API (http://lcboapi.com/) that has no affiliation whatsoever with the LCBO.

## Setup ##

* `$ npm install`
* `$ cordova platform add [windows|android|ios]`
* `$ cordova plugin add org.apache.cordova.geolocation`
* `$ cordova plugin add org.apache.cordova.dialogs`
* `$ cordova plugin add org.apache.cordova.splashscreen`
* `$ cordova plugin add org.apache.cordova.statusbar`

You need to check out the branch that corresponds to the platform you wish to run.
* `$ git checkout [windows|android|ios]`

## Building ##
* `$ grunt build`

## Running ##

On Windows Phone:
* `$ cordova build windows` 
* Run Visual Studio and run the app (on either an emulator or a phone.)

On Android:
* Install the Android SDK.
* `$ cordova emulate android`

On iOS:
* Install Xcode.
* `$ cordova emulate ios`

