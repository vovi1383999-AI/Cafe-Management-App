import { z } from 'zod';
import { OrderType, PaymentMethod, StockTransactionType, UserRole } from '@prisma/client';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const tableSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  capacity: z.coerce.number().int().min(1).max(20)
});

export const menuCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0)
});

export const menuItemSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1),
  sku: z.string().min(1),
  price: z.coerce.number().positive(),
  description: z.string().optional()
});

export const inventoryItemSchema = z.object({
  name: z.string().min(1),
  unit: z.string().min(1),
  currentStock: z.coerce.number().min(0),
  minStock: z.coerce.number().min(0)
});

export const createOrderSchema = z.object({
  tableId: z.string().optional(),
  orderType: z.nativeEnum(OrderType),
  note: z.string().optional()
});

export const addOrderItemSchema = z.object({
  orderId: z.string(),
  menuItemId: z.string(),
  quantity: z.coerce.number().int().min(1),
  note: z.string().optional()
});

export const paymentSchema = z.object({
  orderId: z.string(),
  method: z.nativeEnum(PaymentMethod)
});

export const stockTxnSchema = z.object({
  inventoryItemId: z.string(),
  type: z.nativeEnum(StockTransactionType),
  quantity: z.coerce.number().positive(),
  note: z.string().optional(),
  shiftId: z.string().optional()
});

export const userSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
  password: z.string().min(6).optional()
});
