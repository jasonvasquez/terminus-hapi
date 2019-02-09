import { Plugin } from "hapi";
import Signals = NodeJS.Signals;

const { createTerminus } = require("@godaddy/terminus");

type TerminusHealthCheck = () => Promise<any>;

interface TerminusHealthChecks {
  /** a promise returning function indicating service health */
  [route: string]: TerminusHealthCheck;
}

type TerminusEventHandler = () => Promise<any>;

interface TerminusPluginOptions {
  healthChecks: TerminusHealthChecks;

  /** [optional = 1000] number of milliseconds before forcefully exiting */
  timeout?: number;

  /** [optional = 'SIGTERM'] what signal to listen for relative to shutdown */
  signal?: Signals;

  /** [optional = []] array of signals to listen for relative to shutdown */
  signals?: Signals[];

  /** [optional] called before the HTTP server starts its shutdown */
  beforeShutdown?: TerminusEventHandler;
  /** [optional] cleanup function, returning a promise (used to be onSigterm) */
  onSignal?: TerminusEventHandler;
  /** [optional] called right before exiting */
  onShutdown?: TerminusEventHandler;
  /** [optional] called before sending each 503 during shutdowns */
  onSendFailureDuringShutdown?: TerminusEventHandler;

  /** [optional] logger function to be called with errors */
  logger?: typeof console.log;
}

const name = "PACKAGE_NAME"; // replaced at build-time with package.json name
const version = "PACKAGE_VERSION"; // replaced at build-time with package.json version

const TerminusPlugin: Plugin<TerminusPluginOptions> = {
  name,
  version,
  once: true,
  register: async function(server, options) {
    createTerminus(server.listener, options);
  },
};

export default TerminusPlugin;
export {
  TerminusPluginOptions,
  TerminusEventHandler,
  TerminusHealthChecks,
  TerminusHealthCheck,
};
