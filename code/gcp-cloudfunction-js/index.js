const pulumi = require("@pulumi/pulumi");
const gcp = require("@pulumi/gcp");
const emoji = require('node-emoji');

const hello = (name) => {
  return `Hello ${name} ${emoji.get('guitar')}`
};

const greeting = new gcp.cloudfunctions.HttpCallbackFunction("greeting", (req, res) => {
  res.send(hello(req.query.name));
});

exports.url = greeting.httpsTriggerUrl;


