const assert = require("assert");
const mocha = require("mocha");
const pulumi = require("@pulumi/pulumi");
const infra = require("../index");

describe("Infrastructure", function () {
  const group = infra.group;
  // Instances must not have SSH open to the Internet
  it("must not open port 22 (SSH) to the Internet", function (done) {
    pulumi.all([group.urn, group.ingress]).apply(([urn, ingress]) => {
      if (ingress.find(rule =>
        rule.fromPort == 22 && rule.cidrBlocks.find(block => block === "0.0.0.0/0"))) {
        done(new Error(`Illegal SSH port 22 open to the Internet (CIDR 0.0.0.0/0) on group ${urn}`));
      } else {
        done();
      }
    });
  });
});