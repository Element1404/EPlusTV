# EPlusTV

<p align="center">
  <img src="https://i.imgur.com/FIGZdR3.png">
</p>

Current version: **2.0.0-beta3**

## About
This takes ESPN+ and transforms it into a "live TV" experience with virtual linear channels. It will discover what is on, and generate a schedule of channels that will give you M3U and XMLTV files that you can import into something like [Jellyfin](https://jellyfin.org), [Channels](https://getchannels.com), or [xTeVe](https://github.com/xteve-project/xTeVe).

#### Notes
* This was not made for pirating streams. This is made for using your own credentials and have a different presentation than the ESPN+ app currently gives.
* There are some questions about how boundaries work when a scheduled entry ends or when a new entry starts if it will pick it up automatically.
* The Mouse might not like it and it could be taken down at any minute. Enjoy it while it lasts. ¯\\_(ツ)_/¯

## Using
The server exposes 2 main endpoints:

| Endpoint | Description |
|---|---|
| /channels.m3u | The channel list you'll import into your client |
| /xmltv.xml | The schedule that you'll import into your client |

## Running
The recommended way of running is to pull the image from [Docker Hub](https://hub.docker.com/r/m0ngr31/eplustv).

### Docker Setup

#### Environement Variables
| Environment Variable | Description | Required? |
|---|---|---|
| START_CHANNEL | What the first channel number should be. Keep in mind this generates 100 channels to keep a healthy buffer. | No. If not set, the start channel will default to 1. |
| STREAM_RESOLUTION | What stream resolution to use. Valid options are `720p60`, `720p`, and `540p` | No. If not set, `720p60` is the default. |
| PUID | Current user ID. Use if you have permission issues. Needs to be combined with PGID. | No |
| PGID | Current group ID. Use if you have permission issues. Needs to be combined with PUID. | No |
| USE_ESPN3 | Set if your ISP is an [affiliate for ESPN3](https://www.espn.com/espn3/affList). (THIS WILL SCHEDULE ESPN3 EVENTS BUT PLAYBACK IS NOT SUPPORTED YET) | No |


#### Volumes
| Volume Name | Description | Required? |
|---|---|---|
| /app/config | Used to store DB and application state. | Yes |
| /app/tmp | Used to store temporary segments generated by the streams. Recommended to use something like `/dev/shm`. | No. Only use this if you know what you're doing. |


#### Docker Run
By default, the easiest way to get running is:

```bash
docker run -p 8000:8000 -v config_dir:/app/config m0ngr31/eplustv
```

If you run into permissions issues:

```bash
docker run -p 8000:8000 -v config_dir:/app/config -e PUID=$(id -u $USER) -e PGID=$(id -g $USER) m0ngr31/eplustv
```

Once it runs for the first time, check the Docker logs to see what the next steps for authentication are.
