import { ShiftStatus } from '@prisma/client';
import { prisma } from '@/lib/db';

function buildShiftCode() {
  return `SHIFT-${Date.now()}`;
}

export async function openShift(params: { openedById: string; openingCash: number; note?: string }) {
  const openShift = await prisma.shift.findFirst({ where: { status: ShiftStatus.OPEN } });
  if (openShift) throw new Error('Đã có ca OPEN. MVP chỉ cho phép một ca mở tại một thời điểm.');

  return prisma.shift.create({
    data: {
      code: buildShiftCode(),
      openedById: params.openedById,
      openingCash: params.openingCash,
      note: params.note
    }
  });
}

export async function closeShift(params: { shiftId: string; closedById: string; closingCash: number; note?: string }) {
  const shift = await prisma.shift.findUnique({ where: { id: params.shiftId } });
  if (!shift || shift.status === ShiftStatus.CLOSED) {
    throw new Error('Ca làm không hợp lệ hoặc đã đóng.');
  }

  return prisma.shift.update({
    where: { id: params.shiftId },
    data: {
      status: ShiftStatus.CLOSED,
      closedById: params.closedById,
      closingCash: params.closingCash,
      closedAt: new Date(),
      note: params.note
    }
  });
}
