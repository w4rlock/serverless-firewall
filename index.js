const _ = require('lodash');
const BaseServerlessPlugin = require('base-serverless-plugin');
const utils = require('./src/utils');

const LOG_PREFFIX = '[ServerlessFirewall] -';
const USR_CONF = 'cdnStack';

class ServerlessPlugin extends BaseServerlessPlugin {
  /**
   * Default Constructor
   *
   * @param {object} serverless the serverless instance
   * @param {object} options command line arguments
   */
  constructor(serverless, options) {
    super(serverless, options, LOG_PREFFIX, USR_CONF);
    Object.assign(this, utils);

    this.pluginPath = __dirname;
    this.onceInit = _.once(() => this.initialize());

    this.hooks = {
      'package:initialize': this.dispatchAction.bind(this, this.injectTemplate),
    };
  }

  /**
   * Action Wrapper check plugin condition before perform action
   *
   * @param {function} funAction serverless plugin action
   *
   */
  async dispatchAction(funAction, varResolver = undefined) {
    if (this.isPluginDisabled()) {
      this.log('warning: plugin is disabled');
      return '';
    }

    await this.onceInit();
    return funAction.call(this, varResolver);
  }

  /**
   * Initialize and call another hook plugin
   *
   * @returns {promise} another hook plugin promise if need
   */
  async initialize() {
    this.cfg = {};
    this.cfg.scope = 'CLOUDFRONT';
    // CLOUD FLARE IPS
    this.cfg.whiteListIpsBlock = [
      '173.245.48.0/20',
      '103.21.244.0/22',
      '103.22.200.0/22',
      '103.31.4.0/22',
      '141.101.64.0/18',
      '108.162.192.0/18',
      '190.93.240.0/20',
      '188.114.96.0/20',
      '197.234.240.0/22',
      '198.41.128.0/17',
      '162.158.0.0/15',
      '104.16.0.0/12',
      '172.64.0.0/13',
      '131.0.72.0/22',
    ];

    return Promise.resolve();
  }

  /**
   * Add yml templates rendered on demand
   * to CloudFormation template
   *
   */
  async injectTemplate() {
    this.mergeCFormationResources(this.render('./resources/waf.hbs', this.cfg));
  }
}

module.exports = ServerlessPlugin;
