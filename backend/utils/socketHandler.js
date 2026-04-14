/**
 * Socket.IO Handler — Simulated Live Bus Tracking
 * Emits bus positions every 3 seconds per connected client
 */

// Sample bus routes with GPS waypoints (simulated)
const busRoutes = {
  R01: {
    name: 'City Centre - University',
    waypoints: [
      { lat: 13.0827, lng: 80.2707, stop: 'City Bus Stand' },
      { lat: 13.0850, lng: 80.2750, stop: 'Market Stop' },
      { lat: 13.0890, lng: 80.2800, stop: 'Railway Station' },
      { lat: 13.0930, lng: 80.2850, stop: 'Library Road' },
      { lat: 13.0980, lng: 80.2900, stop: 'University Gate' },
    ],
  },
  R02: {
    name: 'North Campus Express',
    waypoints: [
      { lat: 13.1000, lng: 80.2600, stop: 'North Avenue' },
      { lat: 13.1020, lng: 80.2640, stop: 'North Park' },
      { lat: 13.1050, lng: 80.2680, stop: 'Sports Complex' },
      { lat: 13.1080, lng: 80.2720, stop: 'Admin Block' },
      { lat: 13.1100, lng: 80.2760, stop: 'Engineering Block' },
    ],
  },
};

const busState = {};

const setupSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Initialize bus positions
    Object.keys(busRoutes).forEach((routeId) => {
      if (!busState[routeId]) {
        busState[routeId] = { waypointIndex: 0, progress: 0 };
      }
    });

    // Subscribe to a specific bus route
    socket.on('subscribe:route', (routeId) => {
      socket.join(`route:${routeId}`);
      console.log(`📍 ${socket.id} subscribed to route ${routeId}`);
    });

    // Start bus position simulation
    const interval = setInterval(() => {
      Object.keys(busRoutes).forEach((routeId) => {
        const route = busRoutes[routeId];
        const state = busState[routeId];
        const current = route.waypoints[state.waypointIndex];
        const next    = route.waypoints[Math.min(state.waypointIndex + 1, route.waypoints.length - 1)];

        // Interpolate between waypoints
        state.progress += 0.05;
        if (state.progress >= 1) {
          state.progress = 0;
          state.waypointIndex = (state.waypointIndex + 1) % route.waypoints.length;
        }

        const lat = current.lat + (next.lat - current.lat) * state.progress;
        const lng = current.lng + (next.lng - current.lng) * state.progress;
        const stopsLeft = route.waypoints.length - 1 - state.waypointIndex;
        const eta = stopsLeft * 5; // 5 minutes per stop estimate

        io.to(`route:${routeId}`).emit('bus:position', {
          routeId,
          routeName: route.name,
          lat: parseFloat(lat.toFixed(6)),
          lng: parseFloat(lng.toFixed(6)),
          currentStop: current.stop,
          nextStop: next.stop,
          eta: eta,
          speed: Math.floor(Math.random() * 20 + 30), // 30-50 km/h
          isDelayed: Math.random() < 0.15,             // 15% chance of delay
          timestamp: new Date().toISOString(),
        });
      });
    }, 3000);

    socket.on('disconnect', () => {
      clearInterval(interval);
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupSocketIO };
