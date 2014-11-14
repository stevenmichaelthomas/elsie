Elsie
====

Elsie is a Windows frontend to a lovely LCBO API (http://lcboapi.com/).  
A simple v1 release is slated for later this year.

## Setup ##

* `$ npm install`
* `$ grunt build`
* `$ cordova platform add windows`

## Running ##

* `$ cordova build windows --phone` 
* Run VS and run the app (on either an emulator or a phone.)

## Known Issues ##

* Occasionally, the app can't get a location on a new project build. If this is the case, you need to remove and re-add the geolocation plugin.
