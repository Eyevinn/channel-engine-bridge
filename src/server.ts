import { HLSPullPush, VoidOutput } from '@eyevinn/hls-pull-push';
import api from './api';
import { MyLogger } from './logger';

const server = api({ title: 'channel-engine-brdige' });

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

  const pullPushService = new HLSPullPush(new MyLogger(process.env.NODE_ENV));
  let outputDest;
  if (destinationType == 'void') {
    const voidOutputPlugin = new VoidOutput();
    pullPushService.registerPlugin(destinationType, voidOutputPlugin);
    outputDest = voidOutputPlugin.createOutputDestination(
      undefined,
      pullPushService.getLogger()
    );
  }
  if (outputDest) {
    const sessionId = pullPushService.startFetcher({
      name: 'default',
      url: source.toString(),
      destPlugin: outputDest,
      destPluginName: destinationType
    });
    outputDest.attachSessionId(sessionId);
  }
});

export default server;
