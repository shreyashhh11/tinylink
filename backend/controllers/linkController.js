const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper function to validate URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Helper function to validate code format
const isValidCode = (code) => {
  const codeRegex = /^[A-Za-z0-9]{6,8}$/;
  return codeRegex.test(code);
};

// Helper function to generate random code
const generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 3) + 6; // 6-8 characters
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Get all links
const getAllLinks = async (req, res) => {
  try {
    const links = await prisma.link.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create link
const createLink = async (req, res) => {
  try {
    const { url, code } = req.body;
    
    // Validate URL
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }
    
    let finalCode = code;
    
    // Generate random code if none provided
    if (!finalCode) {
      finalCode = generateRandomCode();
    } else {
      // Validate provided code
      if (!isValidCode(finalCode)) {
        return res.status(400).json({ error: 'Invalid code format. Code must be 6-8 alphanumeric characters.' });
      }
    }
    
    // Check if code already exists
    const existingLink = await prisma.link.findUnique({
      where: { code: finalCode }
    });
    
    if (existingLink) {
      return res.status(409).json({ error: 'Code already exists' });
    }
    
    // Create new link
    const newLink = await prisma.link.create({
      data: {
        code: finalCode,
        url: url
      }
    });
    
    res.status(201).json(newLink);
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get link by code
const getLinkByCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    // Validate code format
    if (!isValidCode(code)) {
      return res.status(400).json({ error: 'Invalid code format' });
    }
    
    const link = await prisma.link.findUnique({
      where: { code }
    });
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json(link);
  } catch (error) {
    console.error('Error fetching link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete link
const deleteLink = async (req, res) => {
  try {
    const { code } = req.params;
    
    // Validate code format
    if (!isValidCode(code)) {
      return res.status(400).json({ error: 'Invalid code format' });
    }
    
    // Check if link exists
    const link = await prisma.link.findUnique({
      where: { code }
    });
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    // Delete the link
    await prisma.link.delete({
      where: { code }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllLinks,
  createLink,
  getLinkByCode,
  deleteLink
};
