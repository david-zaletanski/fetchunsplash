/**
 * fetchunsplash.js
 * Node.js Application
 * fetchunsplash
 * Author: 	David Zaletanski <david.zaletanski@gmail.com>
 * Desc: 	Downloads curated image(s) from Unsplash.
 *
 * Warning:
 * Basic Unsplash API accounts can make 50 requests max per hour.
 *
 * To Install Dependencis:
 * npm i --save isomorphic-fetch
 * npm i --save unsplash-js
 * npm i --save optimist
 * npm i --save dotenv
 *
 * Execute in Bash Script:
 * $ node -e "console.log('hello')"
 * $ node fetchunsplash.js -d ./ -c 5 -s popular
 */

var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');

// Isomorphic Fetch - Required for Unsplash JS API
var fetch = require('isomorphic-fetch');

// Unsplash JS API - https://github.com/unsplash/unsplash-js
const Unsplash = require('unsplash-js').default;
const toJson = require('unsplash-js').toJson;

// Environment File Configuration - https://www.npmjs.com/package/dotenv
require('dotenv').config();

// Command Line Parsing - https://github.com/substack/node-optimist
var argv = require('optimist')
	.usage('Download curated images from Unsplash.\nUsage: $0')
	.demand(['d','c']) // enable to require options
	.alias('d', 'directory')
	.describe('d', 'Output images to directory')
	.alias('c', 'count')
	.describe('c', 'Number of images')
	.alias('s', 'sort')
	.describe('s', 'Sort by [latest,oldest,popular]')
	.default('s', 'latest')
	.alias('k', 'skip-dupes')
	.describe('k', 'Skip Downloading Duplicates')
	.default('k', false)
	.boolean('v')
	.alias('v', 'verbose')
	.describe('v', 'Enable verbose logging to console')
	.argv;

// TODO Verify directory structure string fixer is working
const imageDir = argv.d.slice(-1) != '/' ? argv.d+'/' : argv.d;

function countValueFailValidation() {
	log.console("c\tCount must be between 1 and 50 inclusive.");
	process.exit(1);
}
function sortValueFailValidation() {
	log.console("s\tSort must be one of 'latest', 'oldest', 'popular' (default: 'latest')");
	process.exit(1);
}
function undefinedEnvironmentVariables() {
	console.log("One of the following environment variables is undefined:\n - UNSPLASH_APPID\n - UNSPLASH_APPSECRET");
	console.log("Register using the following instructions to receive your APPID and APPSECRET:\nhttps://unsplash.com/documentation#registering-your-application");
	process.exit(1);
}

const count = argv.c;
if(count == null ||
	count > 50 ||
	count <= 0) {
	countValueFailValidation();
}

const sort = argv.s;
if(sort != 'latest' &&
	sort != 'oldest' &&
	sort != 'popular') {
	sortValueFailValidation();
}

const keepDuplicates = argv.k;

const verbose = argv.v;


// Environment Variables
if (process.env.UNSPLASH_APPID == null || process.env.UNSPLASH_APPSECRET == null) {
	undefinedEnvironmentVariables();
}
const appId = process.env.UNSPLASH_APPID || null;
const appSecret = process.env.UNSPLASH_APPSECRET || null;
const appCallbackUrl = process.env.UNSPLASH_CALLBACK || "https://dzale.net";

console.log("Downloading "+count+" images to '"+imageDir+"' sorted by "+sort);

const unsplash = new Unsplash({
  applicationId: appId,
  secret: appSecret,
  callbackUrl: appCallbackUrl
});

var counter=0;
const page = 1;
const per_page = count;
const order_by = sort; // latest, oldest, popular (default: latest)
var response = unsplash.photos.listCuratedPhotos(page, per_page, order_by)
	.then(toJson)
	.then(json => {
		var existingImages = getFetchUnsplashImagesInDir(imageDir);
		existingImages.forEach(function(name) {
			console.log('Found duplicate image: ', name);
		})
		json.forEach(function(photo) {
			counter++;
			if (verbose) {
				console.log("Image #"+counter);
				console.log("Image ID: '"+photo.id+"'");
				console.log("Image Desc: '"+photo.description+"'")
				console.log("Image RAW URL: '"+photo.urls.raw+"'");
			}
			var now = new Date();
			var dateStr = now.getFullYear()+'-'+now.getMonth()+'-'+now.getDate()+'_'+now.getHours()+'-'+now.getMinutes()+'-'+now.getSeconds();

			// Check Directory Accessibility
			if (!fs.existsSync(imageDir)) {
				try {
					fs.mkdirSync(imageDir, 0744);
				} catch (err) {
					console.log("Error trying to create directory: '"+imageDir+"'");
					console.log(err);
					process.exit(1);
				}
			}
			// Collect Existing Image IDs to Avoid Duplicates
			if(keepDuplicates && existingImages.indexOf(photo.id) < 0) {
				var fileName = dateStr+'_'+photo.id+'.jpg';
				var fullFileName = imageDir+fileName;
				if (verbose) { console.log("Image Full Filename: '"+fullFileName+"'"); }
				var file = fs.createWriteStream(fullFileName);
				file.on('error', function(err) {
					console.log(err);
					file.end();
				});

				var request = https.get(photo.urls.raw,
					function(response) {
						response.pipe(file);
					});
				request.on('error', function(err) {
					log.console(err);
				})
			} else {
				console.log('Image ID #'+photo.id+' is a duplicate.');
			}
		});
	})
	.catch(err => {
		console.log(err);
	});

// Testing this function out to avoid duplicate images
function getFetchUnsplashImagesInDir(directory) {
	var imageIds = [];
	try {
		fs.readdir(directory, function(err,files) {
			if (err) {
				console.error("Could not list directory.", err);
				return;
			}

			files.forEach(function(file, index) {
				var filename = path.join(directory, file);

				fs.stat(filename, function(error, stat) {
					if (error) {
						console.error("Could not stat file.", error);
						return;
					}
					if (stat.isFile()) {
						console.log("'%s' is a file.", filename);
						var split = filename.split("_");
						if (typeof split !== 'undefined' && split && split.length > 0) {
							var idExt = split[split.length-1];
							if (typeof idExt !== 'undefined' && idExt) {
								var imgIdSplit = idExt.split(".");
								if (imgIdSplit > 0) {
									var imgId = imgIdSplit[0];
									console.log("Found image ID: %s", imgId);
									if (typeof imgId !== 'undefined' && imgId) {
										imageIds.push(imgId);
									}
								}
							}
						} else {
							console.log("Found file with odd name (must not be fetchunsplash image): %s", filename);
						}
					}
				});
			});
		});
	} catch (err) {
		console.error("Error occured while reading files...", err);
	}
	return imageIds;
}
