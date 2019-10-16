const pulumi = require("@pulumi/pulumi");
const gcp = require("@pulumi/gcp");

const reportsBucket = new gcp.storage.Bucket("bucket-reports", {
  forceDestroy: true
});

// Cloud Function
// Create a GCS Bucket containing the zip archive which contains the function.
const sourceArchiveBucket = new gcp.storage.Bucket("bucket-cf", {
  forceDestroy: true
});

// The archive object which contains the function.
const archive = new gcp.storage.BucketObject("archive", {
  bucket: sourceArchiveBucket.name,
  source: new pulumi.asset.FileArchive("./app")
});

// The function
const helloFunction = new gcp.cloudfunctions.Function("hello", {
  entryPoint: "hello",
  runtime: "nodejs10",
  sourceArchiveBucket: sourceArchiveBucket.name,
  sourceArchiveObject: archive.name,
  eventTrigger: { // The source which triggers the function
    eventType: "google.storage.object.finalize",
    resource: reportsBucket.name
  }
});
