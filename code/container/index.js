"use strict";
const k8s = require("@pulumi/kubernetes");

const appLabels = {app: "nginx"};
const deployment = new k8s.apps.v1.Deployment("nginx", {
  spec: {
    selector: {matchLabels: appLabels},
    replicas: 1,
    template: {
      metadata: {labels: appLabels},
      spec: {containers: [{name: "nginx", image: "nginx:1.17"}]}
    }
  }
});

const frontend = new k8s.core.v1.Service("nginx", {
  metadata: {labels: appLabels},
  spec: {
    type: "NodePort",
    ports: [{port: 8000, targetPort: 80, nodePort: 30001}],
    selector: appLabels,
  },
});
