import { OrderStatus, OrderType, PaymentMethod, TableStatus } from '@prisma/client';
import { prisma } from '@/lib/db';

export async function createOrder(params: {
  userId: string;
  tableId?: string;
  orderType: OrderType;
  note?: string;
}) {
  return prisma.$transaction(async (tx) => {
    if (params.tableId) {
      const existingOpenOrder = await tx.order.findFirst({
        where: { tableId: params.tableId, status: OrderStatus.OPEN }
      });

      if (existingOpenOrder) {
        throw new Error('Bàn đang có order OPEN.');
      }
    }

    const order = await tx.order.create({
      data: {
        userId: params.userId,
        tableId: params.tableId,
        orderType: params.orderType,
        note: params.note
      }
    });

    if (params.tableId) {
      await tx.cafeTable.update({
        where: { id: params.tableId },
        data: { status: TableStatus.OCCUPIED }
      });
    }

    return order;
  });
}

export async function addItemToOrder(params: {
  orderId: string;
  menuItemId: string;
  quantity: number;
  note?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: params.orderId } });
    if (!order) throw new Error('Order không tồn tại.');
    if (order.status === OrderStatus.PAID) throw new Error('Order đã thanh toán, không thể chỉnh sửa.');

    const menuItem = await tx.menuItem.findUnique({ where: { id: params.menuItemId } });
    if (!menuItem || !menuItem.isAvailable) throw new Error('Món không khả dụng.');

    return tx.orderItem.create({
      data: {
        orderId: params.orderId,
        menuItemId: params.menuItemId,
        quantity: params.quantity,
        unitPrice: menuItem.price,
        note: params.note
      }
    });
  });
}

export async function payOrder(params: { orderId: string; userId: string; method: PaymentMethod }) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: params.orderId },
      include: { items: true, payment: true }
    });

    if (!order) throw new Error('Order không tồn tại.');
    if (order.payment || order.status === OrderStatus.PAID) {
      throw new Error('Order đã thanh toán trước đó.');
    }
    if (order.items.length === 0) throw new Error('Order phải có ít nhất 1 món trước khi thanh toán.');

    const amount = order.items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);

    const payment = await tx.payment.create({
      data: {
        orderId: order.id,
        userId: params.userId,
        method: params.method,
        amount
      }
    });

    await tx.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.PAID, closedAt: new Date() }
    });

    if (order.tableId) {
      await tx.cafeTable.update({
        where: { id: order.tableId },
        data: { status: TableStatus.AVAILABLE }
      });
    }

    return payment;
  });
}
