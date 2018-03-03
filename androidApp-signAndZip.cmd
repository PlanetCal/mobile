jarsigner -verbose -keystore keyStoreFile\planetcal2048.keystore platforms\android\build\outputs\apk\android-release-unsigned.apk PlanetCal
jarsigner -verify platforms\android\build\outputs\apk\android-release-unsigned.apk
zipalign -v 4 platforms\android\build\outputs\apk\android-release-unsigned.apk platforms\android\build\outputs\apk\android-release-unsigned-aligned.apk
apksigner sign --ks keyStoreFile\planetcal2048.keystore --ks-pass pass:Testing123 --key-pass pass:Testing123 --out platforms\android\build\outputs\apk\android-release-signed.apk platforms\android\build\outputs\apk\android-release-unsigned-aligned.apk

