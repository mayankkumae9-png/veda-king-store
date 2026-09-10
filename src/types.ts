export interface Product {
  id: string;
  name: string;
  price: number;
  mrp: number;
  category: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  ingredients: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  paymentTimestamp: string;
  customerName: string;
  phone: string;
  address: string;
  pinCode: string;
  paymentMethod: string;
  paymentApp?: string;
  razorpayPaymentId: string;
  items: CartItem[];
  totalPrice: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export interface StoreSettings {
  bannerUrl: string;
  announcementText: string;
  supportPhone: string;
  brandName: string;
  checkoutSliderImages?: string[];
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  emailOrPhone: string;
  rating: number;
  comment: string;
  date: string;
  isHidden?: boolean;
}
