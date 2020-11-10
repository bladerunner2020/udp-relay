/* eslint-disable no-console */
const UdpServer = require('./lib/udp-server');

const server = new UdpServer();
server.on('error', (err) => console.log(err.message));
server.add('9', '255.255.255.255:9');
