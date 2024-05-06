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
    h264encoder,
    overlay
  }: {
    name: string;
    url: string;
    destinationUrl: URL;
    h264encoder?: string;
    overlay?: string;
  }) {
    this.logger.info(
      `Starting ffmpeg fetcher to fetch ${url} and push to ${destinationUrl}`
    );
    const container = destinationUrl.protocol === 'rtmp:' ? 'flv' : 'mpegts';
    let logo: string[] = [];

    if (overlay) {
      logo = [
        '-i',
        overlay,
        '-filter_complex',
        '[1]scale=60:60[overlay]; [0:4][overlay]overlay=x=(main_w-overlay_w-20):y=20'
      ];
    }
    const process = spawn(
      'ffmpeg',
      ['-fflags', '+genpts', '-re', '-i', url]
        .concat(logo)
        .concat([
          '-c:v',
          h264encoder || 'copy',
          '-b:v',
          '15000k',
          '-c:a',
          h264encoder ? 'aac' : 'copy',
          '-f',
          container,
          destinationUrl.toString()
        ])
    );
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
