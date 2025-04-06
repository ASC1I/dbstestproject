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

  // Create default makes and associate them with vehicle types
  const toyota = await prisma.make.create({
    data: {
      name: 'Toyota',
      vehicleTypes: {
        connect: [{ id: suvType.id }, { id: sedanType.id }],
      },
    },
  });

  const honda = await prisma.make.create({
    data: {
      name: 'Honda',
      vehicleTypes: {
        connect: [{ id: sedanType.id }],
      },
    },
  });

  const bmw = await prisma.make.create({
    data: {
      name: 'BMW',
      vehicleTypes: {
        connect: [{ id: coupeType.id }, { id: suvType.id }],
      },
    },
  });

  const ford = await prisma.make.create({
    data: {
      name: 'Ford',
      vehicleTypes: {
        connect: [{ id: truckType.id }, { id: suvType.id }],
      },
    },
  });

  const chevrolet = await prisma.make.create({
    data: {
      name: 'Chevrolet',
      vehicleTypes: {
        connect: [{ id: truckType.id }, { id: motorcycleType.id }],
      },
    },
  });

  // Create default models and associate them with makes and vehicle types
  await prisma.model.createMany({
    data: [
      { name: 'Camry', makeId: toyota.id, vehicleTypeId: sedanType.id },
      { name: 'Corolla', makeId: toyota.id, vehicleTypeId: sedanType.id },
      { name: 'RAV4', makeId: toyota.id, vehicleTypeId: suvType.id },
      { name: 'Civic', makeId: honda.id, vehicleTypeId: sedanType.id },
      { name: 'Accord', makeId: honda.id, vehicleTypeId: sedanType.id },
      { name: 'X5', makeId: bmw.id, vehicleTypeId: suvType.id },
      { name: '3 Series', makeId: bmw.id, vehicleTypeId: coupeType.id },
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