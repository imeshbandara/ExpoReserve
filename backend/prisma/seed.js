import { prisma } from '../src/config/db.js';

async function main() {
  console.log('Seeding database...');

  // 1. Create Users
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@expor.com' },
    update: {},
    create: {
      oidc_sub: 'org_12345',
      username: 'org_admin',
      email: 'organizer@expor.com',
      name: 'Expo Organizer Inc.',
      role: 'EXHIBITION_ORGANIZER',
      organization_name: 'Global Exhibitions Ltd'
    }
  });

  const vendor = await prisma.user.upsert({
    where: { email: 'vendor@startup.com' },
    update: {},
    create: {
      oidc_sub: 'ven_12345',
      username: 'tech_startup',
      email: 'vendor@startup.com',
      name: 'Tech Startup CEO',
      role: 'STALL_VENDOR',
      organization_name: 'Tech Startup Inc'
    }
  });

  // 2. Create Exhibitions
  const exhibitionsData = [
    {
      name: 'Tech Innovators Expo 2026',
      description: 'The largest gathering of tech startups.',
      venue: 'Silicon Valley Convention Center',
      start_date: new Date('2026-10-15T09:00:00Z'),
      end_date: new Date('2026-10-17T18:00:00Z'),
      organizer_id: organizer.id,
      max_stalls: 200
    },
    {
      name: 'Global Auto Show 2026',
      description: 'Showcasing the future of mobility.',
      venue: 'Detroit Mega Center',
      start_date: new Date('2026-11-05T09:00:00Z'),
      end_date: new Date('2026-11-10T18:00:00Z'),
      organizer_id: organizer.id,
      max_stalls: 500
    },
    {
      name: 'Artisan Food Festival',
      description: 'Local and international delicacies.',
      venue: 'Central Park Pavilion',
      start_date: new Date('2026-12-01T10:00:00Z'),
      end_date: new Date('2026-12-03T20:00:00Z'),
      organizer_id: organizer.id,
      max_stalls: 150
    }
  ];

  const createdExhibitions = [];
  for (const ex of exhibitionsData) {
    const exhibition = await prisma.exhibition.create({
      data: ex
    });
    createdExhibitions.push(exhibition);
    
    // 3. Create Stall Inventory for each exhibition
    await prisma.stallInventory.createMany({
      data: [
        {
          exhibition_id: exhibition.id,
          stall_type: 'STANDARD',
          stall_size: 'SMALL',
          total_count: Math.floor(exhibition.max_stalls * 0.5) // 50% Standard Small
        },
        {
          exhibition_id: exhibition.id,
          stall_type: 'PREMIUM',
          stall_size: 'MEDIUM',
          total_count: Math.floor(exhibition.max_stalls * 0.3) // 30% Premium Medium
        },
        {
          exhibition_id: exhibition.id,
          stall_type: 'CORNER',
          stall_size: 'LARGE',
          total_count: Math.floor(exhibition.max_stalls * 0.2) // 20% Corner Large
        }
      ]
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
