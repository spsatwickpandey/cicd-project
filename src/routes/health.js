const express = require('express');
const os = require('os');

const router = express.Router();

// Basic health check
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Detailed health check
router.get('/detailed', (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      used: process.memoryUsage().heapUsed,
      total: process.memoryUsage().heapTotal,
      external: process.memoryUsage().external,
      rss: process.memoryUsage().rss,
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      loadAverage: os.loadavg(),
      freeMemory: os.freemem(),
      totalMemory: os.totalmem(),
    },
    process: {
      pid: process.pid,
      nodeVersion: process.version,
      title: process.title,
    },
  };

  res.status(200).json(healthData);
});

// Readiness check
router.get('/ready', (req, res) => {
  // Add your readiness logic here
  // For example, check database connection, external services, etc.
  const isReady = true; // Replace with actual readiness check

  if (isReady) {
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
    });
  }
});

// Liveness check
router.get('/live', (req, res) => {
  // Add your liveness logic here
  // For example, check if the application is responsive
  const isAlive = true; // Replace with actual liveness check

  if (isAlive) {
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(503).json({
      status: 'not alive',
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router; 