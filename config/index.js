const env = process.env.NODE_ENV;
const conf = {env};
switch (env) {
  case 'development':
    Object.assign(conf, require('./config.test').default);
    break;
  case 'production':
    Object.assign(conf, require('./config.product').default);
    break;

}
//console.log('conf:',conf);
export default conf;
