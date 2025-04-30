import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default vehicle types
  await prisma.vehicleType.createMany({
    data: [
      { name: 'SUV' },
      { name: 'Sedan' },
      { name: 'Coupe' },
      { name: 'Truck' },
      { name: 'Motorcycle' },
    ],
    skipDuplicates: true,
  });

  // Fetch created vehicle types
  const suvType = await prisma.vehicleType.findUnique({ where: { name: 'SUV' } });
  const sedanType = await prisma.vehicleType.findUnique({ where: { name: 'Sedan' } });
  const coupeType = await prisma.vehicleType.findUnique({ where: { name: 'Coupe' } });
  const truckType = await prisma.vehicleType.findUnique({ where: { name: 'Truck' } });
  const motorcycleType = await prisma.vehicleType.findUnique({ where: { name: 'Motorcycle' } });

  if (!suvType || !sedanType || !coupeType || !truckType || !motorcycleType) {
    throw new Error('One or more vehicle types could not be found.');
  }

  // Upsert makes and associate them with multiple vehicle types
  const toyota = await prisma.make.upsert({
    where: { name: 'Toyota' },
    update: {
      vehicleTypes: {
        connect: [{ id: suvType.id }, { id: sedanType.id }, { id: truckType.id }],
      },
    },
    create: {
      name: 'Toyota',
      vehicleTypes: {
        connect: [{ id: suvType.id }, { id: sedanType.id }, { id: truckType.id }],
      },
    },
  });

  const honda = await prisma.make.upsert({
    where: { name: 'Honda' },
    update: {
      vehicleTypes: {
        connect: [{ id: sedanType.id }, { id: suvType.id }],
      },
    },
    create: {
      name: 'Honda',
      vehicleTypes: {
        connect: [{ id: sedanType.id }, { id: suvType.id }],
      },
    },
  });

  const bmw = await prisma.make.upsert({
    where: { name: 'BMW' },
    update: {
      vehicleTypes: {
        connect: [{ id: coupeType.id }, { id: suvType.id }, { id: sedanType.id }],
      },
    },
    create: {
      name: 'BMW',
      vehicleTypes: {
        connect: [{ id: coupeType.id }, { id: suvType.id }, { id: sedanType.id }],
      },
    },
  });

  const ford = await prisma.make.upsert({
    where: { name: 'Ford' },
    update: {
      vehicleTypes: {
        connect: [{ id: truckType.id }, { id: suvType.id }, { id: coupeType.id }],
      },
    },
    create: {
      name: 'Ford',
      vehicleTypes: {
        connect: [{ id: truckType.id }, { id: suvType.id }, { id: coupeType.id }],
      },
    },
  });

  const chevrolet = await prisma.make.upsert({
    where: { name: 'Chevrolet' },
    update: {
      vehicleTypes: {
        connect: [{ id: truckType.id }, { id: motorcycleType.id }, { id: suvType.id }],
      },
    },
    create: {
      name: 'Chevrolet',
      vehicleTypes: {
        connect: [{ id: truckType.id }, { id: motorcycleType.id }, { id: suvType.id }],
      },
    },
  });

  // Create default models and associate them with makes and vehicle types
  await prisma.model.createMany({
    data: [
      // Toyota Models
      { name: 'Camry', makeId: toyota.id, vehicleTypeId: sedanType.id },
      { name: 'Corolla', makeId: toyota.id, vehicleTypeId: sedanType.id },
      { name: 'RAV4', makeId: toyota.id, vehicleTypeId: suvType.id },
      { name: 'Tacoma', makeId: toyota.id, vehicleTypeId: truckType.id },

      // Honda Models
      { name: 'Civic', makeId: honda.id, vehicleTypeId: sedanType.id },
      { name: 'Accord', makeId: honda.id, vehicleTypeId: sedanType.id },
      { name: 'CR-V', makeId: honda.id, vehicleTypeId: suvType.id },

      // BMW Models
      { name: 'X5', makeId: bmw.id, vehicleTypeId: suvType.id },
      { name: '3 Series', makeId: bmw.id, vehicleTypeId: coupeType.id },
      { name: '5 Series', makeId: bmw.id, vehicleTypeId: sedanType.id },

      // Ford Models
      { name: 'F-150', makeId: ford.id, vehicleTypeId: truckType.id },
      { name: 'Explorer', makeId: ford.id, vehicleTypeId: suvType.id },
      { name: 'Mustang', makeId: ford.id, vehicleTypeId: coupeType.id },

      // Chevrolet Models
      { name: 'Silverado', makeId: chevrolet.id, vehicleTypeId: truckType.id },
      { name: 'Colorado', makeId: chevrolet.id, vehicleTypeId: truckType.id },
      { name: 'Trailblazer', makeId: chevrolet.id, vehicleTypeId: suvType.id },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });