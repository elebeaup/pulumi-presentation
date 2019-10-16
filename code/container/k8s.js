const pulumi = require('@pulumi/pulumi');
const k8s = require('@pulumi/kubernetes');

class ServiceDeployment extends pulumi.ComponentResource {

  /**
   * Create a ServiceDeployment resource with the given unique name, arguments, and options.
   * 
   * @param {string} name _Unique_ name used to register this resource with Pulumi.
   * @param {{image:string,replicas:number, ports:Array<{port:number, targetPort:number, nodePort:number}>}} args The arguments to use to populate this resource's properties.
   * @param opts A bag of options that control this resource's behavior. 
   *
   */
  constructor(name, args = {}, opts) {
    super("k8s:service:ServiceDeployment", name, {}, opts);

    const appLabels = {app: name};

    this.deployment = new k8s.apps.v1.Deployment(name, {
      spec: {
        selector: {matchLabels: appLabels},
        replicas: args.replicas || 1,
        template: {
          metadata: {labels: appLabels},
          spec: {containers: [{name, image: args.image}]}
        }
      }
    }, {parent: this});

    this.service = new k8s.core.v1.Service(name, {
      metadata: {
        labels: this.deployment.metadata.labels,
      },
      spec: {
        ports: args.ports,
        selector: this.deployment.spec.template.metadata.labels,
        type: "NodePort"
      },
    }, {parent: this});
  }
}

module.exports.ServiceDeployment = ServiceDeployment;
