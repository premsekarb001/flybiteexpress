export type UserRole = 'customer' | 'restaurant' | 'drone_pilot' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    pincode: string;
    coordinates: { lat: number; lng: number };
    landingPadCode?: string;
  };
}

export type DietaryType = 'veg' | 'non-veg' | 'jain';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in INR (₹)
  dietary: DietaryType;
  category: string;
  spicyLevel?: 1 | 2 | 3;
  image: string;
  weightGrams: number;
  isAvailable: boolean;
  bestseller?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  locality: string;
  cuisine: string[];
  rating: number;
  deliveryTimeMin: number;
  droneDeliveryTimeMin: number;
  costForTwo: number;
  image: string;
  fssaiLicense: string;
  hygieneRating: 'A+' | 'A' | 'B';
  dronePadAvailable: boolean;
  maxDronePayloadKg: number;
  coordinates: { lat: number; lng: number };
  menu: MenuItem[];
}

export type DeliveryMode = 'walking' | 'cycling' | 'bike' | 'car' | 'drone_express';

export interface DeliveryModeConfig {
  mode: DeliveryMode;
  title: string;
  icon: string;
  etaMinutes: number;
  fee: number;
  maxWeightKg: number;
  badge: string;
  carbonFootprint: 'Zero Emissions' | 'Eco Green' | 'Standard' | 'Heavy Vehicle' | 'Air Corridor';
  description: string;
}

export interface GroundRider {
  id: string;
  name: string;
  phone: string;
  mode: DeliveryMode;
  vehicleName: string;
  vehiclePlate?: string;
  rating: number;
  avatar: string;
  currentLat: number;
  currentLng: number;
  completedOrdersCount: number;
}

export type UPIApp = 'gpay' | 'phonepe' | 'paytm' | 'bhim';

export interface PaymentDetails {
  method: 'upi' | 'card' | 'netbanking' | 'cod';
  upiApp?: UPIApp;
  vpaHandle?: string;
  transactionId?: string;
  paidAmount: number;
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
}

export interface DroneTelemetry {
  droneId: string;
  codeName: string;
  model: string;
  batteryPercent: number;
  altitudeMeters: number;
  speedKmh: number;
  windSpeedKnots: number;
  maxPayloadKg: number;
  currentPayloadKg: number;
  latitude: number;
  longitude: number;
  dgcaClearance: boolean;
  status: 'idle' | 'in_transit' | 'hovering' | 'returning' | 'maintenance';
}

export type OrderStatus = 
  | 'placed' 
  | 'kitchen_accepted' 
  | 'drone_vectoring' 
  | 'airborne' 
  | 'hovering_landing' 
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  gstTax: number;
  deliveryFee: number;
  droneSurgeFee: number;
  totalAmount: number;
  deliveryMode: DeliveryMode;
  deliveryAddress: string;
  deliveryCoordinates: { lat: number; lng: number };
  landingOtp: string;
  status: OrderStatus;
  payment: PaymentDetails;
  assignedDrone?: DroneTelemetry;
  assignedRider?: GroundRider;
  createdAt: string;
  estimatedArrivalMinutes: number;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  ipAddress: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
}
