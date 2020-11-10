const { networkInterfaces } = require('os');

exports.getIPAddress = () => {
  const interfaces = networkInterfaces();
  const names = Object.keys(interfaces);
  for (let i = 0; i < names.length; i++) {
    const iface = interfaces[names[i]];
    for (let j = 0; j < iface.length; j++) {
      const alias = iface[j];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) return alias.address;
    }
  }

  return '0.0.0.0';
};
