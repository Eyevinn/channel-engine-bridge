import { ILogger } from '@eyevinn/hls-pull-push';
import { MyLogger } from './logger';
import { spawn } from 'child_process';

export class StreamOutput {
  private logger: ILogger;

  constructor(logger?: ILogger) {
    this.logger = logger || new MyLogger(process.env.NODE_ENV);
  }

  async startFetcher({
    name,
    url,
    destinationUrl,
    h264encoder
  }: {
    name: string;
    url: string;
    destinationUrl: URL;
    h264encoder?: string;
  }) {
    this.logger.info(
      `Starting ffmpeg fetcher to fetch ${url} and push to ${destinationUrl}`
    );
    const container = destinationUrl.protocol === 'rtmp:' ? 'flv' : 'mpegts';
    const process = spawn('ffmpeg', [
      '-fflags',
      '+genpts',
      '-re',
      '-i',
      url,
      '-c:v',
      h264encoder || 'libx264',
      '-b:v',
      '8000k',
      '-c:a',
      'aac',
      '-f',
      container,
      destinationUrl.toString()
    ]);
    this.logger.verbose(process.spawnargs.join(' '));
    await new Promise((resolve, reject) => {
      process.on('close', resolve);
      process.stderr.on('data', (data) => {
        this.logger.info(data.toString());
      });
      process.on('error', reject);
    });
  }
}
