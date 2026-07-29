import { Restaurant, DroneTelemetry, User, GroundRider } from '../types';

export const INDIAN_CITIES = [
  'Bangalore (Koramangala/Indiranagar)',
  'Mumbai (Bandra/Powai)',
  'Delhi NCR (Cyber City/South Del)',
  'Hyderabad (HITEC City/Gachibowli)',
  'Chennai (T.Nagar/Adyar)'
];

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
        image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=500&q=80',
        weightGrams: 650,
        isAvailable: true,
        bestseller: true
      },
      {
        id: 'm-3',
        name: 'Galouti Mutton Kebab (4 Pcs)',
        description: 'Mouth-melting minced lamb kebabs infused with 24 secret Awadhi spices.',
        price: 390,
        dietary: 'non-veg',
        category: 'Starters',
        spicyLevel: 2,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80',
        weightGrams: 350,
        isAvailable: true
      },
      {
        id: 'm-4',
        name: 'Double Ka Meetha',
        description: 'Traditional Hyderabadi bread pudding soaked in saffron rabri and topped with slivered almonds.',
        price: 180,
        dietary: 'veg',
        category: 'Desserts',
        spicyLevel: 1,
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80',
        weightGrams: 250,
        isAvailable: true
      }
    ]
  },
  {
    id: 'rest-2',
    name: 'Saravana Bhavan South Tiffins',
    city: 'Bangalore (Koramangala/Indiranagar)',
    locality: 'Indiranagar 100ft Road',
    cuisine: ['South Indian', 'Chettinad', 'Pure Veg', 'Breakfast'],
    rating: 4.9,
    deliveryTimeMin: 28,
    droneDeliveryTimeMin: 10,
    costForTwo: 350,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
    fssaiLicense: '22334455667788',
    hygieneRating: 'A+',
    dronePadAvailable: true,
    maxDronePayloadKg: 4.0,
    coordinates: { lat: 12.9784, lng: 77.6408 },
    menu: [
      {
        id: 'm-5',
        name: 'Special Ghee Roast Masala Dosa',
        description: 'Golden crispy fermented rice crepe smeared with pure Desi Ghee and spiced potato masala, served with 3 coconut chutneys and Sambar.',
        price: 190,
        dietary: 'veg',
        category: 'Dosa Specials',
        spicyLevel: 2,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80',
        weightGrams: 400,
        isAvailable: true,
        bestseller: true
      },
      {
        id: 'm-6',
        name: 'Steamed Button Idli & Vada Combo',
        description: '4 melt-in-mouth steamed rice cakes and 2 crispy Medu Vadas drenched in hot Madras Sambar.',
        price: 160,
        dietary: 'veg',
        category: 'Tiffin Hits',
        spicyLevel: 1,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&q=80',
        weightGrams: 480,
        isAvailable: true,
        bestseller: true
      },
      {
        id: 'm-7',
        name: 'Filter Kaapi (Authentic Brass Tumbler)',
        description: 'Traditional South Indian chicory-blended frothy degree coffee brewed live.',
        price: 70,
        dietary: 'veg',
        category: 'Beverages',
        spicyLevel: 1,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80',
        weightGrams: 200,
        isAvailable: true
      }
    ]
  },
  {
    id: 'rest-3',
    name: 'Punjab Grill & Butter Chicken Factory',
    city: 'Mumbai (Bandra/Powai)',
    locality: 'Powai Hiranandani',
    cuisine: ['North Indian', 'Tandoori', 'Punjabi', 'Mughlai'],
    rating: 4.7,
    deliveryTimeMin: 40,
    droneDeliveryTimeMin: 14,
    costForTwo: 850,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80',
    fssaiLicense: '33445566778899',
    hygieneRating: 'A+',
    dronePadAvailable: true,
    maxDronePayloadKg: 5.0,
    coordinates: { lat: 19.1176, lng: 72.9060 },
    menu: [
      {
        id: 'm-8',
        name: 'Murgh Makhani (Butter Chicken)',
        description: 'Tandoor-charred chicken simmered in rich creamy tomato and white butter gravy enriched with Kasuri Methi.',
        price: 490,
        dietary: 'non-veg',
        category: 'Curry Delights',
        spicyLevel: 2,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80',
        weightGrams: 700,
        isAvailable: true,
        bestseller: true
      },
      {
        id: 'm-9',
        name: 'Amritsari Kulcha with Chole',
        description: 'Crispy flaky potato stuffed naan baked in clay tandoor served with spicy Punjabi chickpeas.',
        price: 280,
        dietary: 'veg',
        category: 'Breads & Combos',
        spicyLevel: 2,
        image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&q=80',
        weightGrams: 550,
        isAvailable: true
      },
      {
        id: 'm-10',
        name: 'Garlic Butter Garlic Naan (2 Pcs)',
        description: 'Leavened flatbread brushed with garlic butter.',
        price: 110,
        dietary: 'veg',
        category: 'Breads & Combos',
        spicyLevel: 1,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
        weightGrams: 200,
        isAvailable: true
      }
    ]
  },
  {
    id: 'rest-4',
    name: 'Chaat Chawk Delhi Street Food',
    city: 'Delhi NCR (Cyber City/South Del)',
    locality: 'DLF Cyber City Gurgaon',
    cuisine: ['Chaat', 'Street Food', 'Snacks', 'Pure Veg'],
    rating: 4.6,
    deliveryTimeMin: 25,
    droneDeliveryTimeMin: 8,
    costForTwo: 300,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
    fssaiLicense: '44556677889900',
    hygieneRating: 'A',
    dronePadAvailable: true,
    maxDronePayloadKg: 2.5,
    coordinates: { lat: 28.4950, lng: 77.0895 },
    menu: [
      {
        id: 'm-11',
        name: 'Chandni Chowk Golgappe (8 Pcs)',
        description: 'Crispy hollow puris filled with spiced potato, sprouts, tangy mint water and sweet tamarind chutney.',
        price: 120,
        dietary: 'veg',
        category: 'Chaat Special',
        spicyLevel: 3,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
        weightGrams: 300,
        isAvailable: true,
        bestseller: true
      },
      {
        id: 'm-12',
        name: 'Dahi Bhalla Papdi Chaat',
        description: 'Soft lentil dumplings and crisp wafers topped with sweetened yogurt, pomegranates and chutneys.',
        price: 160,
        dietary: 'veg',
        category: 'Chaat Special',
        spicyLevel: 1,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80',
        weightGrams: 420,
        isAvailable: true
      }
    ]
  }
];

export const MOCK_DRONES: DroneTelemetry[] = [
  {
    droneId: 'DRN-IND-01',
    codeName: 'FlyBite Garuda-X1',
    model: 'SkyLark VTOL AirExpress Pro',
    batteryPercent: 94,
    altitudeMeters: 120,
    speedKmh: 68,
    windSpeedKnots: 8,
    maxPayloadKg: 4.5,
    currentPayloadKg: 1.4,
    latitude: 12.9380,
    longitude: 77.6260,
    dgcaClearance: true,
    status: 'in_transit'
  },
  {
    droneId: 'DRN-IND-02',
    codeName: 'FlyBite Pushpak-V2',
    model: 'DGI Autonomous Heavy Lift',
    batteryPercent: 88,
    altitudeMeters: 95,
    speedKmh: 54,
    windSpeedKnots: 11,
    maxPayloadKg: 5.0,
    currentPayloadKg: 0,
    latitude: 12.9750,
    longitude: 77.6390,
    dgcaClearance: true,
    status: 'idle'
  },
  {
    droneId: 'DRN-IND-03',
    codeName: 'FlyBite Vayu-Racer-09',
    model: 'AeroVect Quick Dispatch',
    batteryPercent: 72,
    altitudeMeters: 150,
    speedKmh: 82,
    windSpeedKnots: 6,
    maxPayloadKg: 3.0,
    currentPayloadKg: 2.1,
    latitude: 19.1200,
    longitude: 72.9090,
    dgcaClearance: true,
    status: 'in_transit'
  }
];

export const MOCK_USERS: Record<string, User> = {
  customer: {
    id: 'user-c1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.in',
    phone: '+91 98765 43210',
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
    id: 'user-r1',
    name: 'Chef Rajesh Kumar (Paradise)',
    email: 'kitchen@paradisebiryani.in',
    phone: '+91 91234 56789',
    role: 'restaurant'
  },
  drone_pilot: {
    id: 'user-d1',
    name: 'Cmdr. Vikram Malhotra (Fleet Operations Lead)',
    email: 'ops@flybite.in',
    phone: '+91 99887 76655',
    role: 'drone_pilot'
  },
  admin: {
    id: 'user-a1',
    name: 'Priya Sundaram (Head of Compliance & Ops)',
    email: 'admin@flybite.in',
    phone: '+91 90000 11111',
    role: 'admin'
  }
};
