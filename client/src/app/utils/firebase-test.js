var gcloud = require('gcloud');

var storage = gcloud.storage({
    projectId: 'blog-9fe50',
    keyFilename: '/media/vikram/hdk/MERN/client/src/assets/blog-9fe50-firebase-adminsdk-bj8u5-d860183873.json'
});

var bucket = storage.bucket('blog-9fe50.appspot.com');

// Create a new blob in the bucket and upload the file data.
var blob = bucket.file("/media/vikram/hdk/MERN/client/src/logo.svg");
var blobStream = blob.createWriteStream();

blobStream.on('error', function (err) {
    console.error(err);
});

blobStream.on('finish', function () {
    var publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    console.log(publicUrl);
});