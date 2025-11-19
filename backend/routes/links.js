const express = require('express');
const router = express.Router();
const LinkController = require('../controllers/linkController');

// GET /api/links - List all links
router.get('/', LinkController.getAllLinks);

// POST /api/links - Create link
router.post('/', LinkController.createLink);

// GET /api/links/:code - Get stats for one code
router.get('/:code', LinkController.getLinkByCode);

// DELETE /api/links/:code - Delete link
router.delete('/:code', LinkController.deleteLink);

module.exports = router;
