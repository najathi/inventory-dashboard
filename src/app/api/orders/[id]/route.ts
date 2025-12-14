import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@/generated/prisma';

function normalizeId(idParam: string | string[] | undefined) {
  if (!idParam) return '';
  const raw = Array.isArray(idParam) ? idParam[0] : idParam;
  return raw.trim();
}

async function findOrderByAnyIdentifier(identifier: string) {
  const ors = [];
  const numericId = Number(identifier);
  if (!Number.isNaN(numericId)) {
    ors.push({ id: numericId });
  }
  if (identifier) {
    ors.push({ orderId: identifier });
  }

  if (ors.length === 0) return null;

  return prisma.order.findFirst({
    where: { OR: ors },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
            },
          },
        },
      },
    },
  });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string | string[] }> }
) {
  const { id } = await params;
  const identifier = normalizeId(id);
  console.log('Fetching order with identifier:', identifier);
  if (!identifier) {
    return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
  }

  try {
    const order = await findOrderByAnyIdentifier(identifier);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string | string[] }> }
) {
  const { id } = await params;
  const identifier = normalizeId(id);
  if (!identifier) {
    return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
  }

  const body = await req.json();
  const { status } = body as { status?: OrderStatus };

  if (!status || !Object.values(OrderStatus).includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const existing = await findOrderByAnyIdentifier(identifier);
    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updated = await prisma.order.update({
      where: { id: existing.id },
      data: { status },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
