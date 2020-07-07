const BaseServerlessPlugin = require('base-serverless-plugin');

const LOG_PREFFIX = '[ServerlessPlugin] -';
const USR_CONF = 'pluginConfig';

class ServerlessPlugin extends BaseServerlessPlugin {
  /**
   * Default Constructor
   *
   * @param {object} serverless the serverless instance
   * @param {object} options command line arguments
   */
  constructor(serverless, options) {
    super(serverless, options, LOG_PREFFIX, USR_CONF);

    this.hooks = {
      'after:deploy:deploy': this.dispatchAction.bind(this, this.deploy),
      'after:info:info': this.dispatchAction.bind(this, this.info),
      'after:remove:remove': this.dispatchAction.bind(this, this.remove),
    };
  }

  /**
   * Action Wrapper check plugin condition before perform action
   *
   * @param {function} funAction serverless plugin action
   */
  async dispatchAction(funAction, varResolver = undefined) {
    if (this.isPluginDisabled()) {
      this.log('warning: plugin is disabled');
      return '';
    }

    this.loadConfig();
    return funAction.call(this, varResolver);
  }

  /**
   * Load user config
   *
   */
  loadConfig() {
    this.cfg = {};
    this.cfg.prop = this.getConf('prop', 'default_value');
    this.cfg.requiredProp = this.getConf('prop');
  }

  /**
   * Deploy
   *
   */
  async deploy() {
    this.log('Deploy...');
  }

  /**
   * Info
   *
   */
  async info() {
    this.log('Info...');
  }

  /**
   * Remove
   *
   */
  async remove() {
    this.log('Removing...');
  }
}

module.exports = ServerlessPlugin;
