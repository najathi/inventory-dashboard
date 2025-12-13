import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  // Seed products
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Home'];
  const products = [];

  for (let i = 1; i <= 50; i++) {
    products.push(
      prisma.product.create({
        data: {
          name: `Product ${i}`,
          description: `This is a detailed description for Product ${i}. It has great features and excellent quality.`,
          category: categories[Math.floor(Math.random() * categories.length)],
          price: Math.floor(Math.random() * 500) + 10,
          stock: Math.floor(Math.random() * 100),
          rating: parseFloat((Math.random() * 5).toFixed(1)),
          active: Math.random() > 0.3,
          image: `https://picsum.photos/seed/${i}/400/400`,
        },
      })
    );
  }

  await Promise.all(products);

  // Seed orders
  const allProducts = await prisma.product.findMany();
  const statuses = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

  for (let i = 1; i <= 30; i++) {
    const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const price = randomProduct.price;

    await prisma.order.create({
      data: {
        orderId: `ORD-${1000 + i}`,
        customerName: `Customer ${i}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        total: price * quantity,
        items: {
          create: {
            productId: randomProduct.id,
            quantity,
            price,
          },
        },
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
