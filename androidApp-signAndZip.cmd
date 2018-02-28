jarsigner -verbose -keystore keyStoreFile\planetcal.keystore platforms\android\build\outputs\apk\android-release-unsigned.apk planetcalkey
jarsigner -verify platforms\android\build\outputs\apk\android-release-unsigned.apk
zipalign -v 4 platforms\android\build\outputs\apk\android-release-unsigned.apk platforms\android\build\outputs\apk\PlanetCal.apk
