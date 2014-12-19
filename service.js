var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Food App Server',
  description: 'The food app node server.',
  script: 'E:\\tools\\npm\\server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
