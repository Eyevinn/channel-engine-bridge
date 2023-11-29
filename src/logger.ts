import { ILogger } from '@eyevinn/hls-pull-push';
import { Logger } from '@pieropatron/tinylogger';

export class MyLogger implements ILogger {
  private logger: Logger;

  constructor(nodeEnv?: string) {
    this.logger = new Logger('channel-engine-bridge');
    this.logger.level = 'debug';
    if (nodeEnv && nodeEnv === 'production') {
      this.logger.level = 'info';
    }
  }

  info(message: string) {
    this.logger.info(message);
  }

  verbose(message: string) {
    this.logger.debug(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string) {
    this.logger.error(message);
  }
}
