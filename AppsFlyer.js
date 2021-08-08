import appsFlyer from 'react-native-appsflyer';
import {Platform} from 'react-native';
import APP_CONFIG from './app-config';

const options = {
  devKey: APP_CONFIG.APPS_FLYER_DEV_KEY,
  isDebug: true,
  onInstallConversionData: true,
};

if (Platform.OS === 'ios') {
  options.appId = APP_CONFIG.IOS_APP_ID;
}

const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
  (res) => {
    if (JSON.parse(res.data.is_first_launch) == true) {
      if (res.data.af_status === 'Non-organic') {
        const media_source = res.data.media_source;
        const campaign = res.data.campaign;
        console.log(
          '### This is first launch and a Non-Organic install. Media source: ' +
            media_source +
            ' Campaign: ' +
            campaign,
        );
      } else if (res.data.af_status === 'Organic') {
        console.log('### This is first launch and a Organic Install');
      }
    } else {
      console.log('### This is not first launch');
    }
  },
);

const onAppOpenAttributionCanceller = appsFlyer.onAppOpenAttribution((data) => {
  console.log('### onAppOpenAttribution called', data);
});

export const initAppsFlyer = () => {
  appsFlyer.initSdk(
    options,
    (result) => {
      console.log('### AppsFlyer successfully initialized! Result:', {
        options,
        result,
      });
    },
    (error) => {
      console.error(error);
      console.log('### AppsFlyer init errored! Error:', error);
    },
  );
};

export const cancelAppsFlyer = () => {
  console.log('### cancelAppsFlyer called!');
  onInstallConversionDataCanceller();
  onAppOpenAttributionCanceller();
};
