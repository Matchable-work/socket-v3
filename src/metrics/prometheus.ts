import client from 'prom-client';

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const totalConnections = new client.Counter({
  name: 'socket_connections_total',
  help: 'Total socket connections',
  registers: [register],
});

export const totalDisconnects = new client.Counter({
  name: 'socket_disconnects_total',
  help: 'Total socket disconnects',
  registers: [register],
});

export const totalEvents = new client.Counter({
  name: 'socket_events_total',
  help: 'Total socket events',
  labelNames: ['event'],
  registers: [register],
});
