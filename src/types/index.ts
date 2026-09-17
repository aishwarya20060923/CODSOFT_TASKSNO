export type UserRole = "CUSTOMER" | "KITCHEN" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  avatar?: string | null;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
  active: boolean;
  items?: MenuItem[];
  _count?: {
    items: number;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  isAvailable: boolean;
  preparationTime: number;
  categoryId: string;
  category?: MenuCategory;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderType = "DINE_IN" | "TAKEAWAY";

export type OrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export type PaymentMethod = "CARD" | "UPI" | "CASH" | "SIMULATED";

export interface OrderItemRecord {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tableNumber?: string | null;
  notes?: string | null;
  userId?: string | null;
  createdAt: string;
  updatedAt?: string;
  items: OrderItemRecord[];
}

export interface RestaurantTable {
  id: string;
  tableNumber: number;
  capacity: number;
  location: "INDOOR" | "WINDOW" | "OUTDOOR" | "PRIVATE" | string;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reservation {
  id: string;
  reservationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  specialRequests?: string | null;
  status: "PENDING" | "CONFIRMED" | "SEATED" | "COMPLETED" | "CANCELLED";
  tableId?: string | null;
  table?: RestaurantTable | null;
  userId?: string | null;
  createdAt: string;
  updatedAt?: string;
}
