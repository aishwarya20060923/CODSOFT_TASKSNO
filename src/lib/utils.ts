import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function generateOrderNumber(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${randomNum}`;
}

export function generateReservationNumber(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `RES-${randomNum}`;
}

export function generateTransactionId(): string {
  const randomHex = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `TXN-${randomHex}`;
}
