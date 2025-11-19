const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const linksRouter = require('./routes/links');
const healthRouter = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.use('/api/links', linksRouter);
app.use('/', healthRouter);

// Redirect route (must be last)
app.get('/:code', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const { code } = req.params;
    
    // Validate code format
    const codeRegex = /^[A-Za-z0-9]{6,8}$/;
    if (!codeRegex.test(code)) {
      return res.status(404).json({ error: 'Invalid code format' });
    }
    
    const link = await prisma.link.findUnique({
      where: { code }
    });
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    // Increment click count and update lastClicked
    await prisma.link.update({
      where: { code },
      data: {
        clicks: { increment: 1 },
        lastClicked: new Date()
      }
    });
    
    // Redirect to the original URL
    res.redirect(302, link.url);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
