const request = require('supertest');
const app = require('../server');

describe('TinyLink API Tests', () => {
  
  beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:password@localhost:5432/tinylink_test';
  });

  afterAll(async () => {
    // Clean up test database
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.link.deleteMany({});
    await prisma.$disconnect();
  });

  // Test health endpoint
  describe('GET /healthz', () => {
    it('should return 200 and correct response', async () => {
      const response = await request(app).get('/healthz');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true, version: '1.0' });
    });
  });

  // Test creating links
  describe('POST /api/links', () => {
    it('should create a link successfully', async () => {
      const linkData = {
        url: 'https://example.com'
      };
      
      const response = await request(app)
        .post('/api/links')
        .send(linkData);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('url', 'https://example.com');
      expect(response.body).toHaveProperty('clicks', 0);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should create a link with custom code', async () => {
      const linkData = {
        url: 'https://example.com',
        code: 'custom123'
      };
      
      const response = await request(app)
        .post('/api/links')
        .send(linkData);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('code', 'custom123');
      expect(response.body).toHaveProperty('url', 'https://example.com');
    });

    it('should return 409 for duplicate code', async () => {
      // First, create a link
      const linkData = {
        url: 'https://example.com',
        code: 'duplicate'
      };
      
      await request(app).post('/api/links').send(linkData);
      
      // Try to create another with same code
      const response = await request(app)
        .post('/api/links')
        .send({
          url: 'https://example2.com',
          code: 'duplicate'
        });
      
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Code already exists');
    });

    it('should return 400 for invalid URL', async () => {
      const response = await request(app)
        .post('/api/links')
        .send({
          url: 'not-a-valid-url'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid URL');
    });

    it('should return 400 for invalid code format', async () => {
      const response = await request(app)
        .post('/api/links')
        .send({
          url: 'https://example.com',
          code: 'short' // Too short (less than 6 characters)
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test getting links
  describe('GET /api/links', () => {
    beforeEach(async () => {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.link.deleteMany({});
      
      // Create test links
      await prisma.link.create({
        data: {
          code: 'test123',
          url: 'https://example.com'
        }
      });
    });

    it('should return all links', async () => {
      const response = await request(app).get('/api/links');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  // Test getting single link
  describe('GET /api/links/:code', () => {
    beforeEach(async () => {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.link.deleteMany({});
      
      await prisma.link.create({
        data: {
          code: 'test123',
          url: 'https://example.com'
        }
      });
    });

    it('should return link stats for existing code', async () => {
      const response = await request(app).get('/api/links/test123');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('code', 'test123');
      expect(response.body).toHaveProperty('url', 'https://example.com');
      expect(response.body).toHaveProperty('clicks');
    });

    it('should return 404 for non-existent code', async () => {
      const response = await request(app).get('/api/links/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Link not found');
    });
  });

  // Test redirect functionality
  describe('GET /:code (redirect)', () => {
    beforeEach(async () => {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.link.deleteMany({});
      
      await prisma.link.create({
        data: {
          code: 'redirect1',
          url: 'https://example.com'
        }
      });
    });

    it('should redirect with 302 and increment click count', async () => {
      const response = await request(app).get('/redirect1');
      
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('https://example.com');
      
      // Check if click count was incremented
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const link = await prisma.link.findUnique({
        where: { code: 'redirect1' }
      });
      expect(link.clicks).toBe(1);
      expect(link.lastClicked).toBeTruthy();
    });

    it('should return 404 for non-existent code', async () => {
      const response = await request(app).get('/nonexistent');
      
      expect(response.status).toBe(404);
    });
  });

  // Test deleting links
  describe('DELETE /api/links/:code', () => {
    beforeEach(async () => {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.link.deleteMany({});
      
      await prisma.link.create({
        data: {
          code: 'delete1',
          url: 'https://example.com'
        }
      });
    });

    it('should delete link successfully', async () => {
      const response = await request(app).delete('/api/links/delete1');
      
      expect(response.status).toBe(204);
      
      // Verify link was deleted
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const link = await prisma.link.findUnique({
        where: { code: 'delete1' }
      });
      expect(link).toBeNull();
    });

    it('should return 404 for non-existent code', async () => {
      const response = await request(app).delete('/api/links/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Link not found');
    });

    it('should return 404 after deletion (no redirect)', async () => {
      // First delete the link
      await request(app).delete('/api/links/delete1');
      
      // Then try to redirect - should return 404
      const response = await request(app).get('/delete1');
      
      expect(response.status).toBe(404);
    });
  });
});
