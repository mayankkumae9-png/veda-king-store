import { Product, Order, Review } from './types';

export const initialProducts: Product[] = [
  {
    id: 'p-veda-main',
    name: 'VEDA KING Natural Herbal Hair Oil (Pure Organic Care)',
    price: 249,
    mrp: 299,
    category: 'Hair Care',
    imageUrl: 'https://i.ibb.co/sp7dDgpD/photo-2026-09-09-21-39-49.jpg',
    rating: 4.9,
    reviews: 842,
    ingredients: '100% Organic, Ayurvedic Hair Fall & Dandruff Control, Mineral Oil & Paraben Free'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-1001',
    date: new Date(Date.now() - 3600000).toISOString(),
    paymentTimestamp: new Date(Date.now() - 3600000).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    customerName: 'Aarav Sharma',
    phone: '9876543210',
    address: '123 Palm Grove, Mumbai',
    pinCode: '400001',
    paymentMethod: 'Online/UPI',
    razorpayPaymentId: 'pay_ABC123XYZ',
    items: [
      { product: initialProducts[0], quantity: 2 }
    ],
    totalPrice: 498,
    status: 'Processing'
  }
];

export const initialReviews: Review[] = [
  {
    id: 'r1',
    productId: 'p-veda-main',
    customerName: 'Priya Sharma',
    emailOrPhone: 'priya@example.com',
    rating: 5,
    comment: 'बालों का झड़ना सच में कम हो गया है। बहुत अच्छा तेल है!',
    date: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'r2',
    productId: 'p-veda-main',
    customerName: 'Rahul Verma',
    emailOrPhone: '9876543210',
    rating: 4,
    comment: 'यह तेल बहुत अच्छा है। डैंड्रफ बिल्कुल खत्म हो गया और बाल भी मुलायम हो गए हैं।',
    date: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'r3',
    productId: 'p-veda-main',
    customerName: 'Sneha',
    emailOrPhone: 'sneha@example.com',
    rating: 5,
    comment: '100% केमिकल फ्री! मैंने कई प्रोडक्ट इस्तेमाल किए लेकिन यह सबसे बेस्ट हेयर ऑयल है।',
    date: new Date(Date.now() - 259200000).toISOString()
  }
];
