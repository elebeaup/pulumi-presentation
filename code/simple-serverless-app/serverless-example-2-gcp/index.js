const pulumi = require("@pulumi/pulumi");
const gcp = require("@pulumi/gcp");

const {hello: helloFunction} = require('./app');

const reportsBucket = new gcp.storage.Bucket("bucket-reports", {
  forceDestroy: true
});

// Cloud Function
reportsBucket.onObjectFinalized("newFiles", helloFunction);
