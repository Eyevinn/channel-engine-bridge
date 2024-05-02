import { HLSPullPush, VoidOutput } from '@eyevinn/hls-pull-push';
import api from './api';
import { MyLogger } from './logger';
import { getOutputDest } from './output';
import { StreamOutput } from './stream_output';

const server = api({ title: 'channel-engine-bridge' });

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

if (!process.env.SOURCE) {
  console.error('Missing environment variable SOURCE');
  process.exit(1);
}

const destinationType = process.env.DEST_TYPE || 'void';

server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    throw err;
  }
  console.log(`Server listening on ${address}`);

  const source = new URL(
    process.env.SOURCE ||
      'https://demo.vc.eyevinn.technology/channels/demo/master.m3u8'
  );

  if (destinationType == 'stream') {
    const streamService = new StreamOutput(new MyLogger(process.env.NODE_ENV));
    if (!process.env.DEST_URL) {
      throw new Error(`Destination type 'stream' requires DEST_URL to be set`);
    }
    streamService.startFetcher({
      name: 'default',
      url: source.toString(),
      destinationUrl: new URL(process.env.DEST_URL),
      h264encoder: process.env.H264ENCODER
    });
  } else {
    const pullPushService = new HLSPullPush(new MyLogger(process.env.NODE_ENV));
    const outputDest = getOutputDest({
      pullPushService,
      destinationUrl: process.env.DEST_URL
        ? new URL(process.env.DEST_URL)
        : undefined,
      destinationType
    });
    if (outputDest) {
      const sessionId = pullPushService.startFetcher({
        name: 'default',
        url: source.toString(),
        destPlugin: outputDest,
        destPluginName: destinationType
      });
      outputDest.attachSessionId(sessionId);
    }
  }
});

export default server;
