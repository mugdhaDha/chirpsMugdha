import environment from './environment';
import config from './auth-config';
import regeneratorRuntime from 'regenerator-runtime';
window.regeneratorRuntime = regeneratorRuntime; 



//Configure Bluebird Promises.
Promise.config({
  longStackTraces: environment.debug,
  warnings: {    wForgottenReturn: false  }
});

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin('aurelia-validation')
    .plugin('aurelia-auth', (baseConfig)=>{
    baseConfig.configure(config);
    })

    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
