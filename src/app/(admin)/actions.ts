'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { OrderType, PaymentMethod, ShiftStatus, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import {
  addOrderItemSchema,
  createOrderSchema,
  inventoryItemSchema,
  menuCategorySchema,
  menuItemSchema,
  paymentSchema,
  stockTxnSchema,
  tableSchema,
  userSchema
} from '@/lib/validators';
import { addItemToOrder, createOrder, payOrder } from '@/lib/services/orders';
import { applyStockTransaction } from '@/lib/services/inventory';
import { closeShift, openShift } from '@/lib/services/shifts';

function requireValid<T>(parsed: { success: boolean; data?: T; error?: { message: string } }): T {
  if (!parsed.success || !parsed.data) throw new Error(parsed.error?.message ?? 'Dữ liệu không hợp lệ');
  return parsed.data;
}

export async function createTableAction(formData: FormData) {
  await requireAuth([UserRole.ADMIN, UserRole.MANAGER]);
  const data = requireValid(tableSchema.safeParse(Object.fromEntries(formData)));

  await prisma.cafeTable.create({ data });
  revalidatePath('/tables');
  redirect('/tables');
}

export async function updateTableAction(tableId: string, formData: FormData) {
  await requireAuth([UserRole.ADMIN, UserRole.MANAGER]);
  const data = requireValid(tableSchema.safeParse(Object.fromEntries(formData)));

  await prisma.cafeTable.update({ where: { id: tableId }, data });
  revalidatePath('/tables');
  redirect('/tables');
}

export async function createCategoryAction(formData: FormData) {
  await requireAuth([UserRole.ADMIN, UserRole.MANAGER]);
  const data = requireValid(menuCategorySchema.safeParse(Object.fromEntries(formData)));

  await prisma.menuCategory.create({ data });
  revalidatePath('/menu/categories');
  redirect('/menu/categories');
}

export async function createMenuItemAction(formData: FormData) {
  await requireAuth([UserRole.ADMIN, UserRole.MANAGER]);
  const data = requireValid(menuItemSchema.safeParse(Object.fromEntries(formData)));

  await prisma.menuItem.create({ data });
  revalidatePath('/menu/items');
  redirect('/menu/items');
}

export async function updateMenuItemAction(itemId: string, formData: FormData) {
  await requireAuth([UserRole.ADMIN, UserRole.MANAGER]);
  const data = requireValid(menuItemSchema.safeParse(Object.fromEntries(formData)));

  await prisma.menuItem.update({ where: { id: itemId }, data });
  revalidatePath('/menu/items');
  redirect('/menu/items');
}

export async function createInventoryItemAction(formData: FormData) {
  await requireAuth([UserRole.ADMIN, UserRole.MANAGER]);
  const data = requireValid(inventoryItemSchema.safeParse(Object.fromEntries(formData)));

  await prisma.inventoryItem.create({ data });
  revalidatePath('/inventory');
  redirect('/inventory');
}

export async function updateInventoryItemAction(itemId: string, formData: FormData) {
  await requireAuth([UserRole.ADMIN, UserRole.MANAGER]);
  const data = requireValid(inventoryItemSchema.safeParse(Object.fromEntries(formData)));

  await prisma.inventoryItem.update({ where: { id: itemId }, data });
  revalidatePath('/inventory');
  redirect('/inventory');
}

export async function createOrderAction(formData: FormData) {
  const user = await requireAuth();
  const data = requireValid(createOrderSchema.safeParse(Object.fromEntries(formData)));

  await createOrder({ ...data, userId: user.id });
  revalidatePath('/orders');
  redirect('/orders');
}

export async function addOrderItemAction(formData: FormData) {
  await requireAuth();
  const data = requireValid(addOrderItemSchema.safeParse(Object.fromEntries(formData)));

  await addItemToOrder(data);
  revalidatePath(`/orders/${data.orderId}`);
}

export async function payOrderAction(formData: FormData) {
  const user = await requireAuth([UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]);
  const data = requireValid(paymentSchema.safeParse(Object.fromEntries(formData)));

  await payOrder({ ...data, userId: user.id });
  revalidatePath('/payments');
  revalidatePath(`/orders/${data.orderId}`);
  redirect('/payments');
}

export async function createStockTransactionAction(formData: FormData) {
  const user = await requireAuth([UserRole.ADMIN, UserRole.MANAGER, UserRole.BARISTA]);
  const data = requireValid(stockTxnSchema.safeParse(Object.fromEntries(formData)));

  await applyStockTransaction({ ...data, userId: user.id });
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
  const data = requireValid(userSchema.safeParse(Object.fromEntries(formData)));
  if (!data.password) throw new Error('Mật khẩu là bắt buộc khi tạo user mới.');

  const hash = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      isActive: true,
      passwordHash: hash
    }
  });

  revalidatePath('/users');
  redirect('/users');
}

export async function updateUserAction(userId: string, formData: FormData) {
  await requireAuth([UserRole.ADMIN]);
  const data = requireValid(userSchema.safeParse(Object.fromEntries(formData)));

  const updateData: {
    fullName: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    passwordHash?: string;
  } = {
    fullName: data.fullName,
    email: data.email,
    role: data.role,
    isActive: formData.has('isActive')
  };

  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  }

  await prisma.user.update({ where: { id: userId }, data: updateData });
  revalidatePath('/users');
  redirect('/users');
}

export const orderTypes = Object.values(OrderType);
export const paymentMethods = Object.values(PaymentMethod);
