const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    // Clear existing data
    await prisma.link.deleteMany();
    
    // Create sample links
    const sampleLinks = [
      {
        code: 'example1',
        url: 'https://www.example.com',
        clicks: 42,
        lastClicked: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        code: 'example2',
        url: 'https://github.com/microsoft/vscode',
        clicks: 128,
        lastClicked: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        code: 'example3',
        url: 'https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript',
        clicks: 15,
        lastClicked: new Date(Date.now() - 1800000) // 30 minutes ago
      }
    ];
    
    for (const linkData of sampleLinks) {
      await prisma.link.create({
        data: linkData
      });
    }
    
    console.log('Database seeded successfully!');
    console.log(`Created ${sampleLinks.length} sample links`);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
