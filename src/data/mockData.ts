import { Restaurant, DroneTelemetry, User, GroundRider } from '../types';

export const INDIAN_CITIES = [
  'Bangalore (Koramangala/Indiranagar)',
  'Mumbai (Bandra/Powai)',
  'Delhi NCR (Cyber City/South Del)',
  'Hyderabad (HITEC City/Gachibowli)',
  'Chennai (T.Nagar/Adyar)'
];

export const MOCK_USERS: Record<string, User> = {
  customer: {
    id: 'usr-cust-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@flybite.in',
    phone: '9876543210',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
    address: {
      street: 'Flat 402, Green Glen Layout, Bellandur',
      city: 'Bangalore',
      pincode: '560103',
      coordinates: { lat: 12.9279, lng: 77.6751 },
      landingPadCode: 'BLR-PAD-8842'
    }
  },
  restaurant: {
    id: 'usr-rest-202',
    name: 'Chef Chef Mohammad (Paradise Biryani)',
    email: 'kitchen@paradisebiryani.in',
    phone: '9811223344',
    role: 'restaurant'
  },
  drone_pilot: {
    id: 'usr-pilot-303',
    name: 'Captain Vikram Singh (Air Operator)',
    email: 'skycommand@flybite.in',
    phone: '9822334455',
    role: 'drone_pilot'
  },
  admin: {
    id: 'usr-admin-001',
    name: 'SuperAdmin Control Console',
    email: 'admin@flybite.in',
    phone: '9900011122',
    role: 'admin'
  }
};

export const MOCK_GROUND_RIDERS: GroundRider[] = [
  {
    id: 'rider-w1',
    name: 'Ramesh Kumar (Foot Courier)',
    phone: '+91 98111 22233',
    mode: 'walking',
    vehicleName: 'Walking Eco Runner',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    currentLat: 12.9340,
    currentLng: 77.6250,
    completedOrdersCount: 412
  },
  {
    id: 'rider-c1',
    name: 'Suresh Patel (Green Pedal)',
    phone: '+91 98222 33344',
    mode: 'cycling',
    vehicleName: 'Firefox Tremor MTB Cycle',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    currentLat: 12.9360,
    currentLng: 77.6270,
    completedOrdersCount: 850
  },
  {
    id: 'rider-b1',
    name: 'Vikram Singh (EV Express)',
    phone: '+91 98333 44455',
    mode: 'bike',
    vehicleName: 'Ather 450X Electric Scooter (KA-01-EQ-9942)',
    vehiclePlate: 'KA-01-EQ-9942',
    rating: 4.95,
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80',
    currentLat: 12.9380,
    currentLng: 77.6290,
    completedOrdersCount: 1420
  },
  {
    id: 'rider-car1',
    name: 'Anil Deshmukh (Catering Sedan)',
    phone: '+91 98444 55566',
    mode: 'car',
    vehicleName: 'Tata Tiago EV Sedan (KA-03-MK-4081)',
    vehiclePlate: 'KA-03-MK-4081',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
    currentLat: 12.9400,
    currentLng: 77.6310,
    completedOrdersCount: 610
  }
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Paradise Dum Biryani & Kebabs',
    city: 'Bangalore (Koramangala/Indiranagar)',
    locality: 'Koramangala 5th Block',
    cuisine: ['Hyderabadi', 'Biryani', 'North Indian', 'Mughlai'],
    rating: 4.8,
    deliveryTimeMin: 35,
    droneDeliveryTimeMin: 12,
    costForTwo: 600,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    fssaiLicense: '11223344556677',
    hygieneRating: 'A+',
    dronePadAvailable: true,
    maxDronePayloadKg: 4.0,
    coordinates: { lat: 12.9352, lng: 77.6245 },
    menu: [
      {
        id: 'm-1',
        name: 'Hyderabadi Royal Mutton Biryani',
        description: 'Slow-cooked fragrant basmati rice with tender succulent mutton, saffron, and shahi spices served with Mirchi ka Salan.',
        price: 450,
        dietary: 'non-veg',
        category: 'Biryani Special',
        spicyLevel: 3,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80',
        weightGrams: 750,
        isAvailable: true,
        bestseller: true
      },
      {
        id: 'm-2',
        name: 'Special Veg Paneer Dum Biryani',
        description: 'Fresh malai paneer marinated in aromatic herbs layered with long-grain basmati and fried onions.',
        price: 340,
        dietary: 'veg',
        category: 'Biryani Special',
        spicyLevel: 2,
        image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=500&q=80',
        weightGrams: 650,
        isAvailable: true,
        bestseller: true
      },
      {
        id: 'm-3',
        name: 'Chicken Tandoori Tikka Kebabs',
        description: 'Juicy boneless chicken thighs grilled in clay oven with Kashmiri chilli and melted butter.',
        price: 380,
        dietary: 'non-veg',
        category: 'Starters',
        spicyLevel: 2,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80',
        weightGrams: 400,
        isAvailable: true
      }
    ]
  },
  {
    id: 'rest-2',
    name: 'MTR 1924 (Mavalli Tiffin Room)',
    city: 'Bangalore (Koramangala/Indiranagar)',
    locality: 'Indiranagar 100ft Road',
    cuisine: ['South Indian', 'Pure Veg', 'Breakfast', 'Dosa'],
    rating: 4.9,
    deliveryTimeMin: 25,
    droneDeliveryTimeMin: 10,
    costForTwo: 350,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&q=80',
    fssaiLicense: '11223344558899',
    hygieneRating: 'A+',
    dronePadAvailable: true,
    maxDronePayloadKg: 3.5,
    coordinates: { lat: 12.9784, lng: 77.6408 },
    menu: [
      {
        id: 'm-4',
        name: 'Special Ghee Roast Masala Dosa',
        description: 'Golden crispy rice crepe smeared with pure desi ghee and spiced potato palya served with coconut chutney.',
        price: 190,
        dietary: 'veg',
        category: 'Dosa & Idli',
        spicyLevel: 1,
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80',
        weightGrams: 400,
        isAvailable: true,
        bestseller: true
      },
      {
        id: 'm-5',
        name: 'Rava Idli with Potato Sagoo',
        description: 'MTR signature steamed semolina cake loaded with cashews, mustard seeds, ghee, and vegetable sagoo.',
        price: 140,
        dietary: 'jain',
        category: 'Dosa & Idli',
        spicyLevel: 1,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80',
        weightGrams: 350,
        isAvailable: true
      }
    ]
  },
  {
    id: 'rest-3',
    name: 'Punjab Grill Shahi Rasoi',
    city: 'Bangalore (Koramangala/Indiranagar)',
    locality: 'HSR Layout Sector 1',
    cuisine: ['North Indian', 'Butter Chicken', 'Tandoori'],
    rating: 4.7,
    deliveryTimeMin: 40,
    droneDeliveryTimeMin: 14,
    costForTwo: 800,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
    fssaiLicense: '11223344559900',
    hygieneRating: 'A+',
    dronePadAvailable: true,
    maxDronePayloadKg: 4.0,
    coordinates: { lat: 12.9116, lng: 77.6389 },
    menu: [
      {
        id: 'm-6',
        name: 'Amritsari Murgh Makhani (Butter Chicken)',
        description: 'Tender tandoori chicken simmered in rich creamy tomato gravy with kasuri methi and extra butter.',
        price: 420,
        dietary: 'non-veg',
        category: 'Main Course',
        spicyLevel: 2,
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&q=80',
        weightGrams: 700,
        isAvailable: true,
        bestseller: true
      },
      {
        id: 'm-7',
        name: 'Dal Makhani Shahi Recipe',
        description: 'Black lentils slow cooked overnight over charcoal fire finished with fresh cream and butter.',
        price: 320,
        dietary: 'veg',
        category: 'Main Course',
        spicyLevel: 1,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80',
        weightGrams: 650,
        isAvailable: true
      }
    ]
  }
];

export const MOCK_DRONES: DroneTelemetry[] = [
  {
    droneId: 'DRONE-BLR-01',
    codeName: 'SkyFalcon Alpha 4',
    model: 'FlyBite VTOL Cargo-V4',
    batteryPercent: 94,
    altitudeMeters: 120,
    speedKmh: 48,
    windSpeedKnots: 8,
    maxPayloadKg: 4.0,
    currentPayloadKg: 1.4,
    latitude: 12.9340,
    longitude: 77.6250,
    dgcaClearance: true,
    status: 'in_transit'
  },
  {
    droneId: 'DRONE-BLR-02',
    codeName: 'AirRider Eagle X',
    model: 'FlyBite VTOL Cargo-V4',
    batteryPercent: 88,
    altitudeMeters: 0,
    speedKmh: 0,
    windSpeedKnots: 6,
    maxPayloadKg: 4.0,
    currentPayloadKg: 0,
    latitude: 12.9352,
    longitude: 77.6245,
    dgcaClearance: true,
    status: 'idle'
  }
];
