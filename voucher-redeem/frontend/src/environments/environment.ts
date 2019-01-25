// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  endpointAssets: 'http://localhost:4200',
  endpoint: 'http://localhost:8080',
  firebase: {
    apiKey: 'AIzaSyBTy2r9WBShG9dptmvynfmSmFAdIpCDWQE',
    authDomain: 'pktfredeemandwalletserver.firebaseapp.com',
    databaseURL: 'https://pktfredeemandwalletserver.firebaseio.com',
    projectId: 'pktfredeemandwalletserver',
    storageBucket: 'pktfredeemandwalletserver.appspot.com',
    messagingSenderId: '400276150615'
  }
};
