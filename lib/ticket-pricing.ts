// Ticket pricing configuration - Poopoli 2026 Flower Show
export const TICKET_TYPES = {
  general: {
    name: "General Entry",
    price: 70,
    description: "Entry to Poopoli 2026 Flower Show",
    features: ["Full event access", "View all flower exhibits", "Photography allowed", "Event souvenir"]
  }
} as const;

export type TicketType = keyof typeof TICKET_TYPES;

export function getTicketPrice(type: TicketType): number {
  return TICKET_TYPES[type].price;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}
