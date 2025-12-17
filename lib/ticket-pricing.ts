// Ticket pricing configuration
export const TICKET_TYPES = {
  regular: {
    name: "Regular",
    price: 500,
    description: "Standard entry to the event",
    features: ["Event access", "Standard seating"]
  },
  vip: {
    name: "VIP",
    price: 1500,
    description: "Premium experience with exclusive benefits",
    features: ["Priority entry", "VIP seating", "Complimentary snacks", "Meet & Greet access"]
  },
  premium: {
    name: "Premium",
    price: 3000,
    description: "Ultimate luxury experience",
    features: ["Exclusive entry", "Front row seating", "Gourmet meals", "Backstage access", "Event merchandise"]
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
