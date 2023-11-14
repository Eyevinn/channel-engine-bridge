# FAST Engine Bridge

Bridging [Channel Engine vod2live](https://github.com/Eyevinn/docker-fast) to other distribution platforms.

## Installation / Usage

To pull from a Channel Engine powered FAST channel and push to AWS MediaPackage.

```
docker run -d \
  -e SOURCE=https://eyevinn.ce.prod.osaas.io/channels/demo/master.m3u8 \
  -e DEST_TYPE=mediapackage \
  -e DEST_URL=https://<username>:<password>@xxxxx.mediapackage.xxxxxx.amazonaws.com/in/v2/146950c8d69d45c7a20f2995803d622e/146950c8d69d45c7a20f2995803d622e/channel \
  eyevinntechnology/fast-engine-bridge
```

or to push to AWS MediaStore.

```
docker run -d \
  -e SOURCE=https://eyevinn.ce.prod.osaas.io/channels/demo/master.m3u8 \
  -e DEST_TYPE=mediastore \
  -e DEST_URL=https://xxxxxx.data.mediastore.xxxxxx.amazonaws.com/demo/ \
  eyevinntechnology/fast-engine-bridge
```

<!--
## Development

Add clear instructions on how to start development of the project here

-->

### Contributing

See [CONTRIBUTING](CONTRIBUTING.md)

# Support

Join our [community on Slack](http://slack.streamingtech.se) where you can post any questions regarding any of our open source projects. Eyevinn's consulting business can also offer you:

- Further development of this component
- Customization and integration of this component into your platform
- Support and maintenance agreement

Contact [sales@eyevinn.se](mailto:sales@eyevinn.se) if you are interested.

# About Eyevinn Technology

[Eyevinn Technology](https://www.eyevinntechnology.se) is an independent consultant firm specialized in video and streaming. Independent in a way that we are not commercially tied to any platform or technology vendor. As our way to innovate and push the industry forward we develop proof-of-concepts and tools. The things we learn and the code we write we share with the industry in [blogs](https://dev.to/video) and by open sourcing the code we have written.

Want to know more about Eyevinn and how it is to work here. Contact us at work@eyevinn.se!
