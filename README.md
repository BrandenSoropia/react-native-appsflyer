# react-native-appsflyer

Testing React Native with AppsFlyer to build and track an iOS app. I'm finding with XCode `12.4` and `12.5.1`, I consistently get an error:
```In /Users/brandensoropia/Library/Developer/Xcode/DerivedData/ReactNativeAppsflyer-aqckwkdpnacpiwfgqrmtxiosvotv/Build/Products/Debug-iphoneos/AppsFlyerLib.framework/AppsFlyerLib(AFSDKDevice.o), building for iOS, but linking in object file built for Mac Catalyst, file '/Users/brandensoropia/Library/Developer/Xcode/DerivedData/ReactNativeAppsflyer-aqckwkdpnacpiwfgqrmtxiosvotv/Build/Products/Debug-iphoneos/AppsFlyerLib.framework/AppsFlyerLib' for architecture arm64```
This repo attempts to document tests and failed fixes, in hopes of finding one that works!

## Specs
- MacOS 11.5.1
- MacBook Pro (16-inch, 2019)

**Dependencies**
- React Native: `0.63.3`
- AppsFlyer React Native Plugin: `6.3.20`
- yarn (classic): `1.22.4`

**Target XCode versions to test**
- `12.5.1`
- `12.4`

**Simulator Specs**
- iPhone 11
- iOS `14.5` or `14.4`

**Phone Specs**
- iPhone Xs
- iOS `14.7.1`

## Setup

Official AppsFlyer React Native Setup Docs: https://support.appsflyer.com/hc/en-us/articles/217108646-React-Native-plugin#introduction

> Note: Had to disable Flipper-Folly to even build on device with XCode 12.5.1.
> Build test results will specify if enabled or disabled.
> Source: https://github.com/react-native-community/upgrade-support/issues/155
>
> Rememberwhen enabling/disabling Flipper-Folly:
> - Kill Metro server
> - Delete and re-install pods

**Requires you own fake iOS app added in AppsFlyer dashboard.**

> "Fake iOS app in AppsFlyer" means adding an app in AppsFlyer dashboard but doesn't need an actual AppStore app.
> It is just a unique app id in this format: `11111xxxx`. [Mentioned here](https://support.appsflyer.com/hc/en-us/articles/360001559405#debug-apps-creating-an-ios-test-app))
> AppsFlyer will let you know if the id is taken or not it seems!

1. Download a copy of this repo.
2. In terminal, navigate to your local copy.
3. Create a file called `app-config.js` in root directory:
  - This is needed to pass in your app credentials to AppsFlyer SDK.

```javascript
const APP_CONFIG = {
APPS_FLYER_DEV_KEY: '',
IOS_APP_ID: '*********', // Fake id
};

export default APP_CONFIG;
```

4. Run `yarn`.
5. Go into `/ios` and install pods: `pod install`.
6. Now open XCode, opening the `ReactNativeAppsflyer.xcworkspace`.
7. Create your signing certificate/profile by:
    1. In Project Navigator, click "ReactNativeAppsflyer".
    1. Click the "Signing and Capabilities" tab.
    1. Set "Team" to yourself (your Apple developer account)
    1. Connect your iOS device to your computer. Select it as the target scheme to build to, by selecting your device in the drop down directly right of the play button in the top navbar.
    1. It will automatically generate your certificate/profile now!

## Running Locally via Simulator or Connected iOS Device

Device: 
1. Connect your iOS device to your computer.
1. Open `ReactNativeAppsflyer.xcworkspace`.
1. In the top nav bar to the right of the play button, select your device as the build scheme.
1. Now press the play button. 
   
It should now build and open on device!

Simulator:
1. Navigate to the root folder of your copy of this repo in terminal.
1. Run `yarn ios`.

A simulator should open up and after a bit, it will have the app installed and opened!

**Useful Debug Stuff**
-  Open React Native debug menu
   - Simulator: `Command` + `D`
   - Device: shake your iOS device
- I left some `console.log`s in the AppsFlyer SDK integration to show success, error, cancel message etc. Debug the app, open the console and filter console for `###`. Refresh the app if you don't see them.
- For maximum clean installs, I've been using the following commands:
  1. To clean install Node/Pod dependencies, clear yarn cache, clear watchmen:
   `watchman watch-del-all && rm -rf node_modules/ && yarn cache clean && yarn install`
  2. To clean install pods, do one at a time in `/ios` folder: 
     `rm -rf Pods` then `pod install` (must have Node/installed first!)
  3. Clean XCode builds by clicking Product > Clean Build Folder in XCode options.

## Testing AppsFlyer Integration

Official AppsFlyer Testing Docs: https://support.appsflyer.com/hc/en-us/articles/360001559405#introduction

1. Open XCode.
1. Select either app to build on device or simulator, and press play.
   1. Once installed, delete it. This is needed to make sure XCode builds to the same simulator and sets up a report for the type of attribution.
1. Fill in this link with your fake app id and test device idfa pen this link in the browser:
`https://app.appsflyer.com/id<app_id>?pid=Test&c=Test&idfa=<test-device-idfa>`
   - You will see a page saying "app not in the market...". This is fine.
1. Now, install the app by pressing play again.
1. In AppsFlyer dashboard, wait about few minutes to see attributions!

## Attempt Build Results:

### Flipper-Folly Disabled only

**XCode 12.5.1**
- ✅ Simulator - Builds. AppsFlyer init shows success and reports attributions.
- ❌ Device - Fails build with message:
> ```In /Users/brandensoropia/Library/Developer/Xcode/DerivedData/ReactNativeAppsflyer-aqckwkdpnacpiwfgqrmtxiosvotv/Build/Products/Debug-iphoneos/AppsFlyerLib.framework/AppsFlyerLib(AFSDKDevice.o), building for iOS, but linking in object file built for Mac Catalyst, file '/Users/brandensoropia/Library/Developer/Xcode/DerivedData/ReactNativeAppsflyer-aqckwkdpnacpiwfgqrmtxiosvotv/Build/Products/Debug-iphoneos/AppsFlyerLib.framework/AppsFlyerLib' for architecture arm64```

**XCode 12.4**
- ✅ Simulator - Builds. AppsFlyer init shows success and reports organic attributions.
- ❌ Device - Failed build with same AppsFlyer issue as above.

### Flipper-Folly Enabled only

**XCode 12.5.1**
- ❌ Simulator - Fails build. Same AppsFlyer error message as above. But also various some Flipper-Folly errors too.
- ❌ Device - Fails build. Same AppsFlyer error message as above, but not Flipper-Folly errors.

**XCode 12.4**
- ❌ Simulator - Fails build only due to Flipper-Folly issue.
- ❌ Device - Failed build with same AppsFlyer issue as above.

### “Build Active Architecture Only” to all “Yes”, with Flipper-Folly disabled

**Both XCode 12.4 and XCode 12.5.1**
- ❌ Device - Failed build with same AppsFlyer issue as above.

### Ignore `arm64`, with Flipper-Folly disabled

**XCode 12.4 and XCode 12.5.1**
- ❌ Device - Failed build with same AppsFlyer issue as above.

