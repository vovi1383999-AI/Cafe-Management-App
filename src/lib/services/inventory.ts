import { Prisma, StockTransactionType } from '@prisma/client';
import { prisma } from '@/lib/db';

function computeStock(current: Prisma.Decimal, quantity: number, type: StockTransactionType) {
  const currentValue = Number(current);
  if (type === StockTransactionType.IN) return currentValue + quantity;
  if (type === StockTransactionType.OUT) return currentValue - quantity;
  return quantity;
}

export async function applyStockTransaction(params: {
  inventoryItemId: string;
  userId: string;
  shiftId?: string;
  type: StockTransactionType;
  quantity: number;
  note?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const item = await tx.inventoryItem.findUnique({ where: { id: params.inventoryItemId } });
    if (!item) throw new Error('Nguyên liệu không tồn tại.');

    const nextStock = computeStock(item.currentStock, params.quantity, params.type);
    if (nextStock < 0) throw new Error('Tồn kho không thể âm.');

    const transaction = await tx.stockTransaction.create({
      data: {
        inventoryItemId: params.inventoryItemId,
        userId: params.userId,
        shiftId: params.shiftId,
        type: params.type,
        quantity: params.quantity,
        note: params.note
      }
    });

    await tx.inventoryItem.update({
      where: { id: params.inventoryItemId },
      data: { currentStock: nextStock }
    });

    return transaction;
  });
}
