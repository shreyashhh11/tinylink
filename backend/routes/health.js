const express = require('express');
const router = express.Router();

// GET /healthz - Health check
router.get('/healthz', (req, res) => {
  res.status(200).json({ 
    ok: true, 
    version: "1.0" 
  });
});

module.exports = router;
