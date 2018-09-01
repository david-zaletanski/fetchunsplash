# fetchunsplash

A NodeJS command line tool that finds recent curated images on Unsplash and downloads them to a directory you choose.

## Installation

To install fetchunsplash simply run the following command:

```sh
npm install fetchunsplash
```

### Configuration

Unsplash requires registration to use their API. To register and get the necessary appId and appSecret, first create an Unsplash API account. Then [register an Application](https://unsplash.com/documentation#registering-your-application) in order to receive your *UNSPLASH_APPID* and *UNSPLASH_APPSECRET*, both of which are required for fetchunsplash to work. You may want to read up on [Unsplash API Rate Limits](https://unsplash.com/documentation#rate-limiting) while there.

Prior to running fetchunsplash, you must either set the following system environment variables to the values provided by Unsplash for your application:

 * **UNSPLASH_APPID**=<required, unsplash_app_id>
 * **UNSPLASH_APPSECRET**=<required, unsplash_app_secret>
 * UNSPLASH_CALLBACK=<optional, unused>

**OR** 

Place these three properties in a `.env` file, and put it in the same directory as `fetchunsplash.js` and it will read in these values.


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


## What do I do with this?

That's up to you. I see it being useful in any sort of scenario where a generic, constantly rotating image is involved.

### Dynamic Desktop Wallpaper

Personally, I just began using the [Random Walls](https://github.com/rodakorn/randwall) Gnome shell extension, which every X minutes will change your wallpaper and/or lockscreen to a random image. Random Walls... well, randomly... picks your next wallpaper from a number of potential images in a configurable directory. In my case, `~/Pictures/wallpapers/`
I wanted to keep it interesting without constantly having to find pictures myself. So I set up *Random Walls* to switch wallpapers every 60 minutes.
I then added a simple bash script to `/cron.daily/` called *fetchunsplash.sh* which executed `node ~/dev/fetchunsplash.js -d ~/Pictures/wallpapers/ -c 24 -s popular`.
The final step was to use `crontab -u USER -e` to schedule the *cron* job to execute it every day at midnight by appending a new line with `0 0 * * * /etc/cron.daily/fetchunsplash.sh`, providing an endles supply of interesting desktop art!

#### Seems Like A Lot of Work...

Fair, I've included a script to help you get set up. Just register on Unsplash to get your API application key/secret, and run `./fetchunsplash-install.sh` to be taken through a guided installer that will setup the environment file, schedule the cron job, and file your taxes for you.

##### Enjoy It?

I release as much as I can for free with the knowledge that I've learned most everything I know from others that have done the same. The world is a great place to live in when everyone does. Until then, I'm still a poor developer, any [contributions to the cause](https://dzale.net/donate) you feel are deserved, [kind words](mailto:david.zaletanski@gmail.com) of encouragement, or [feedback](https://github.com/david-zaletanski/fetchunsplash/issues) to help improve are all greatly appreciated. 
