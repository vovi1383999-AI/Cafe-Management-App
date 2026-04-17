'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { OrderType, PaymentMethod, ShiftStatus, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { addOrderItemSchema, createOrderSchema, menuItemSchema, paymentSchema, stockTxnSchema, tableSchema, userSchema } from '@/lib/validators';
import { addItemToOrder, createOrder, payOrder } from '@/lib/services/orders';
import { applyStockTransaction } from '@/lib/services/inventory';
import { closeShift, openShift } from '@/lib/services/shifts';

export async function createTableAction(formData: FormData) {
  await requireAuth([UserRole.ADMIN, UserRole.MANAGER]);
  const parsed = tableSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.message);

  await prisma.cafeTable.create({ data: parsed.data });
  revalidatePath('/tables');
  redirect('/tables');
}

export async function createMenuItemAction(formData: FormData) {
  await requireAuth([UserRole.ADMIN, UserRole.MANAGER]);
  const parsed = menuItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.message);

  await prisma.menuItem.create({ data: parsed.data });
  revalidatePath('/menu/items');
  redirect('/menu/items');
}

export async function createOrderAction(formData: FormData) {
  const user = await requireAuth();
  const parsed = createOrderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.message);

  await createOrder({ ...parsed.data, userId: user.id });
  revalidatePath('/orders');
  redirect('/orders');
}

export async function addOrderItemAction(formData: FormData) {
  await requireAuth();
  const parsed = addOrderItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.message);

  await addItemToOrder(parsed.data);
  revalidatePath(`/orders/${parsed.data.orderId}`);
}

export async function payOrderAction(formData: FormData) {
  const user = await requireAuth([UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]);
  const parsed = paymentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.message);

  await payOrder({ ...parsed.data, userId: user.id });
  revalidatePath('/payments');
  revalidatePath(`/orders/${parsed.data.orderId}`);
  redirect('/payments');
}

export async function createStockTransactionAction(formData: FormData) {
  const user = await requireAuth([UserRole.ADMIN, UserRole.MANAGER, UserRole.BARISTA]);
  const parsed = stockTxnSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.message);

  await applyStockTransaction({ ...parsed.data, userId: user.id });
  revalidatePath('/inventory');
  revalidatePath('/inventory/transactions');
  redirect('/inventory/transactions');
}

export async function openShiftAction(formData: FormData) {
  const user = await requireAuth([UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]);
  const openingCash = Number(formData.get('openingCash') ?? 0);
  const note = String(formData.get('note') ?? '');

  await openShift({ openedById: user.id, openingCash, note });
  revalidatePath('/shifts');
  redirect('/shifts');
}

export async function closeCurrentShiftAction(formData: FormData) {
  const user = await requireAuth([UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]);
  const closingCash = Number(formData.get('closingCash') ?? 0);
  const note = String(formData.get('note') ?? '');

  const shift = await prisma.shift.findFirst({ where: { status: ShiftStatus.OPEN } });
  if (!shift) throw new Error('Không có ca mở để đóng.');

  await closeShift({ shiftId: shift.id, closedById: user.id, closingCash, note });
  revalidatePath('/shifts');
  redirect('/shifts');
}

export async function createUserAction(formData: FormData) {
  await requireAuth([UserRole.ADMIN]);
  const parsed = userSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.message);

  const hash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      role: parsed.data.role,
      passwordHash: hash
    }
  });

  revalidatePath('/users');
  redirect('/users');
}

export const orderTypes = Object.values(OrderType);
export const paymentMethods = Object.values(PaymentMethod);
