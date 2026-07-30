export type UserRole = 'customer' | 'restaurant' | 'drone_pilot' | 'admin';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface UserAddress {
  street: string;
  city: string;
  pincode: string;
  locality: string;
  coordinates: LocationCoordinates;
  landingPadCode?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: UserAddress;
}

export type DietaryType = 'veg' | 'non-veg' | 'jain' | 'vegan' | 'gluten-free';

export interface CustomizationOption {
  id: string;
  name: string;
  price: number; // in INR
}

export interface CustomizationGroup {
  id: string;
  name: string;
  minSelect: number; // 0 for optional, 1 for required single choice
  maxSelect: number;
  options: CustomizationOption[];
}

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
  customizationGroups?: CustomizationGroup[];
}

export interface SelectedCustomization {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // unique identifier for specific item + customization combination
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  selectedCustomizations: SelectedCustomization[];
  specialInstructions?: string;
  unitPrice: number; // base price + sum of customization prices
  totalPrice: number; // unitPrice * quantity
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
  coordinates: LocationCoordinates;
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
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface PaymentDetails {
  method: PaymentMethod;
  upiApp?: UPIApp;
  vpaHandle?: string;
  cardLast4?: string;
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

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  gstTax: number;
  deliveryFee: number;
  droneSurgeFee: number;
  totalAmount: number;
  deliveryMode: DeliveryMode;
  deliveryAddress: string;
  deliveryCoordinates?: LocationCoordinates;
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
