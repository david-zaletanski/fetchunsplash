# fetchunsplash
A NodeJS command line tool that downloads curated images from Unsplash.

## Installation

To install fetchunsplash simply run the following command:

```sh
npm install fetchunsplash
```

### Configuration

Unsplash requires registration to use their API. To register and get the necessary appId and appSecret, first create an Unsplash API account. Then [register an Application](https://unsplash.com/documentation#registering-your-application) in order to receive your *UNSPLASH_APPID* and *UNSPLASH_APPSECRET*, both of which are required for fetchunsplash to work. You may want to read up on [Unsplash API Rate Limits](https://unsplash.com/documentation#rate-limiting) while there.

Prior to running fetchunsplash you must either set the following system environment variables to the values provided by Unsplash for your application:

 * UNSPLASH_APPID=<required, unsplash_app_id>
 * UNSPLASH_APPSECRET=<required, unsplash_app_secret>
 * UNSPLASH_CALLBACK=<optional, unused>


**OR** place them in a `.env` file in the same directory as `fetchunsplash.js`.

## Usage

```sh
dzale@srv:~/Downloads$ node fetchunsplash.js 
Download curated images from Unsplash.
Usage: /usr/bin/node ./fetchunsplash.js

Options:
  -d, --directory  Output images to directory         [required]
  -c, --count      Number of images                   [required]
  -s, --sort       Sort by [latest,oldest,popular]    [default: "latest"]
  -v, --verbose    Enable verbose logging to console

Missing required arguments: d, c

```


### What Do I Do With This?

I made this to fetch new source material for the Gnome shell extension [Random Walls](https://github.com/rodakorn/randwall) which randomly changes your wallpaper/lockscreen every X minutes. It finds potential wallpapers by searching in a configurable directory, so I have set up a *cron* job to download 24 new images to my `~/Pictures/wallpapers` directory every day. Then I set Random Walls to switch wallpapers every hour, providing an endles supply of interesting desktop art!

As such I've included a script to help set this up for you too! Run `./fetchunsplash-install.sh` to be taken through the guided installer which well set up a *cron* job that runs it daily.
