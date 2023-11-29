import {
  HLSPullPush,
  MediaPackageOutput,
  MediaStoreOutput,
  VoidOutput
} from '@eyevinn/hls-pull-push';

export function getOutputDest({
  pullPushService,
  destinationUrl,
  destinationType
}: {
  pullPushService: HLSPullPush;
  destinationUrl?: URL;
  destinationType: string;
}) {
  let outputDest;
  if (destinationType == 'void') {
    const voidOutputPlugin = new VoidOutput();
    pullPushService.registerPlugin(destinationType, voidOutputPlugin);
    outputDest = voidOutputPlugin.createOutputDestination(
      {},
      pullPushService.getLogger()
    );
  } else if (destinationType == 'mediapackage') {
    if (destinationUrl) {
      const username = destinationUrl.username;
      const password = destinationUrl.password;
      const destUrl = new URL(
        destinationUrl.pathname + destinationUrl.searchParams,
        destinationUrl.origin
      );
      pullPushService
        .getLogger()
        .verbose(`${username} ${password} ${destUrl.toString()}`);
      const mediaPackagePlugin = new MediaPackageOutput();
      pullPushService.registerPlugin(destinationType, mediaPackagePlugin);
      outputDest = mediaPackagePlugin.createOutputDestination(
        {
          ingestUrls: [
            {
              url: destUrl.toString(),
              username,
              password
            }
          ]
        },
        pullPushService.getLogger()
      );
    } else {
      throw new Error(
        `Destination type 'mediapackage' requires DEST_URL to be set`
      );
    }
  } else if (destinationType == 'mediastore') {
    if (destinationUrl) {
      pullPushService.getLogger().verbose(`${destinationUrl.toString()}`);
      const mediaStorePlugin = new MediaStoreOutput();
      pullPushService.registerPlugin(destinationType, mediaStorePlugin);
      outputDest = mediaStorePlugin.createOutputDestination(
        {
          dataEndpoint: destinationUrl.origin,
          folder: destinationUrl.pathname.replace(/\/$/, '')
        },
        pullPushService.getLogger()
      );
    }
  } else {
    throw new Error(`Unsupported destination type '${destinationType}'`);
  }
  return outputDest;
}
