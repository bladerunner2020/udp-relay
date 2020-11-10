const debug = require('debug')('udp-relay');
const { createSocket } = require('dgram');
const { EventEmitter } = require('events');
const { getIPAddress } = require('./tools');

const serverIpAddress = getIPAddress();

const parseAddress = (address) => {
  const res = address.split(':');
  if (res.length > 2) throw new Error('Invalid address');
  if (res.length === 1) {
    if (address.indexOf('.') === -1) {
      res.unshift(undefined);
    } else {
      res.push(undefined);
    }
  }
  if (res[1]) res[1] = Number(res[1]);

  return res; // [address, port]
};

class UdpServer extends EventEmitter {
  constructor() {
    super();

    this.routes = {};
    this.udpServers = {};
  }

  createUdpServer(port) {
    const { routes } = this;
    const server = createSocket({ type: 'udp4', reuseAddr: true });
    server.on('error', (err) => this.emit('error', err));
    server.on('message', (msg, rinfo) => {
      if (rinfo.address === serverIpAddress) return;

      debug(`message: ${msg.length} bytes from ${rinfo.address}:${rinfo.port}`);
      const destinations = routes[port];
      destinations.forEach(({ port: destPort, host }) => {
        this.sendMessage(host, destPort, msg);
      });
    });
    server.bind(port);
    return server;
  }

  sendMessage(host, port, msg) {
    const client = createSocket({ type: 'udp4', reuseAddr: true });
    client.on('error', (err) => this.emit('error', err));
    client.bind(port, () => {
      client.setBroadcast(true);

      client.send(msg, 0, msg.length, port, host, (err) => {
        client.close();
        if (err) this.emit('error', err);
      });
    });
  }

  add(source, destination) {
    const { routes } = this;
    const [, port] = parseAddress(source);
    const [destHost, destPort] = parseAddress(destination);

    if (typeof routes[source] === 'undefined') {
      routes[source] = [];
    }

    if (typeof this.udpServers[port] === 'undefined') {
      this.udpServers[port] = this.createUdpServer(port);
    }

    routes[source].push({ port: destPort || port, host: destHost || '255.255.255.255' });
  }
}

module.exports = UdpServer;
