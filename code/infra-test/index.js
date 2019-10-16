const aws = require("@pulumi/aws");

const group = new aws.ec2.SecurityGroup("web-sg", {
  ingress: [
    {protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"]},
    {protocol: "tcp", fromPort: 80, toPort: 80, cidrBlocks: ["0.0.0.0/0"]},
  ],
});

const server = new aws.ec2.Instance("web-server", {
  instanceType: "t2.micro",
  securityGroups: [group.name],
  ami: "ami-c55673a0"
});

exports.group = group;
exports.server = server;
exports.publicIp = server.publicIp;
exports.publicHostName = server.publicDns;
