import { Restaurant, DroneTelemetry, User, GroundRider, UserAddress } from '../types';

export interface PredefinedLocation {
  id: string;
  label: string;
  locality: string;
  city: string;
  pincode: string;
  landingPadCode: string;
  coordinates: { lat: number; lng: number };
}

export const PREDEFINED_LOCATIONS: PredefinedLocation[] = [
  {
    id: 'loc-blr-1',
    label: 'Koramangala 5th Block',
    locality: 'Koramangala',
    city: 'Bangalore',
    pincode: '560095',
    landingPadCode: 'BLR-PAD-8842',
    coordinates: { lat: 12.9352, lng: 77.6245 }
  },
  {
    id: 'loc-blr-2',
    label: 'Indiranagar 100ft Road',
    locality: 'Indiranagar',
    city: 'Bangalore',
    pincode: '560038',
    landingPadCode: 'BLR-PAD-9921',
    coordinates: { lat: 12.9784, lng: 77.6408 }
  },
  {
    id: 'loc-blr-3',
    label: 'Bellandur Green Glen Layout',
    locality: 'Bellandur',
    city: 'Bangalore',
    pincode: '560103',
    landingPadCode: 'BLR-PAD-7733',
    coordinates: { lat: 12.9279, lng: 77.6751 }
  },
  {
    id: 'loc-bom-1',
    label: 'Bandra West (Pali Hill)',
    locality: 'Bandra',
    city: 'Mumbai',
    pincode: '400050',
    landingPadCode: 'BOM-PAD-1044',
    coordinates: { lat: 19.0600, lng: 72.8339 }
  },
  {
    id: 'loc-del-1',
    label: 'DLF Cyber City Phase 2',
    locality: 'Cyber City',
    city: 'Gurugram / Delhi NCR',
    pincode: '122002',
    landingPadCode: 'DEL-PAD-3321',
    coordinates: { lat: 28.4950, lng: 77.0895 }
  }
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
      street: 'Flat 402, Green Glen Layout',
      locality: 'Bellandur',
      city: 'Bangalore',
      pincode: '560103',
      coordinates: { lat: 12.9279, lng: 77.6751 },
      landingPadCode: 'BLR-PAD-8842'
    }
  },
  restaurant: {
    id: 'usr-rest-202',
    name: 'Chef Mohammad (Paradise Dum Biryani)',
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
    city: 'Bangalore',
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
        bestseller: true,
        customizationGroups: [
          {
            id: 'g-portion',
            name: 'Select Portion Size',
            minSelect: 1,
            maxSelect: 1,
            options: [
              { id: 'o-reg', name: 'Regular Handi (750g)', price: 0 },
              { id: 'o-jumbo', name: 'Jumbo Family Box (1.2kg)', price: 220 }
            ]
          },
          {
            id: 'g-addons',
            name: 'Add-ons & Extras',
            minSelect: 0,
            maxSelect: 3,
            options: [
              { id: 'o-salan', name: 'Extra Mirchi Ka Salan (200ml)', price: 40 },
              { id: 'o-raita', name: 'Boondi Anardana Raita', price: 50 },
              { id: 'o-egg', name: 'Extra Boiled Eggs (2 pcs)', price: 40 }
            ]
          }
        ]
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
        bestseller: true,
        customizationGroups: [
          {
            id: 'g-paneer-add',
            name: 'Extra Paneer',
            minSelect: 0,
            maxSelect: 1,
            options: [
              { id: 'o-paneer-50', name: 'Extra Grilled Paneer Cubes (100g)', price: 60 }
            ]
          }
        ]
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
        isAvailable: true,
        customizationGroups: [
          {
            id: 'g-dip',
            name: 'Choice of Dip',
            minSelect: 1,
            maxSelect: 2,
            options: [
              { id: 'o-mint', name: 'Mint Coriander Chutney', price: 0 },
              { id: 'o-garlic-mayo', name: 'Smoky Garlic Dip', price: 30 }
            ]
          }
        ]
      },
      {
        id: 'm-10',
        name: 'Shahi Royal Gulab Jamun (2 Pcs)',
        description: 'Warm, soft khoya dumplings soaked in saffron cardamon sugar syrup.',
        price: 120,
        dietary: 'veg',
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&q=80',
        weightGrams: 200,
        isAvailable: true,
        bestseller: true
      },
      {
        id: 'm-11',
        name: 'Classic Hyderabadi Double Ka Meetha',
        description: 'Golden fried bread slices soaked in saffron-infused rabri topped with pistachios and almonds.',
        price: 150,
        dietary: 'veg',
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80',
        weightGrams: 250,
        isAvailable: true
      },
      {
        id: 'm-12',
        name: 'Spiced Mint Masala Cooler',
        description: 'Refreshing sparkling cooler infused with crushed mint, roasted cumin, and black salt.',
        price: 90,
        dietary: 'vegan',
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80',
        weightGrams: 350,
        isAvailable: true
      }
    ]
  },
  {
    id: 'rest-2',
    name: 'MTR 1924 (Mavalli Tiffin Room)',
    city: 'Bangalore',
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
        bestseller: true,
        customizationGroups: [
          {
            id: 'g-ghee',
            name: 'Customization',
            minSelect: 0,
            maxSelect: 2,
            options: [
              { id: 'o-extra-ghee', name: 'Extra Pure Desi Ghee Dollop', price: 35 },
              { id: 'o-podi', name: 'Gunpowder Podi Dusting', price: 25 }
            ]
          }
        ]
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
      },
      {
        id: 'm-13',
        name: 'Crispy Medu Vada (2 Pcs)',
        description: 'Golden crispy lentil fritters spiced with peppercorns and ginger served with coconut sambar.',
        price: 110,
        dietary: 'vegan',
        category: 'Starters',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
        weightGrams: 250,
        isAvailable: true,
        bestseller: true
      },
      {
        id: 'm-14',
        name: 'Authentic Filter Kaapi',
        description: 'Frothy South Indian chicory-infused strong coffee brewed in brass decoction filter.',
        price: 60,
        dietary: 'veg',
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80',
        weightGrams: 200,
        isAvailable: true,
        bestseller: true
      }
    ]
  },
  {
    id: 'rest-3',
    name: 'Punjab Grill Shahi Rasoi',
    city: 'Bangalore',
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
        bestseller: true,
        customizationGroups: [
          {
            id: 'g-bread',
            name: 'Pair with Indian Breads',
            minSelect: 0,
            maxSelect: 3,
            options: [
              { id: 'o-butter-naan', name: 'Butter Naan (2 Pcs)', price: 90 },
              { id: 'o-garlic-naan', name: 'Garlic Butter Naan (2 Pcs)', price: 110 },
              { id: 'o-lacha', name: 'Lacha Paratha (2 Pcs)', price: 80 }
            ]
          }
        ]
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
      },
      {
        id: 'm-15',
        name: 'Tandoori Paneer Tikka (8 Pcs)',
        description: 'Cubes of cottage cheese marinated in hung curd and tandoori masala roasted on skewers.',
        price: 340,
        dietary: 'gluten-free',
        category: 'Starters',
        spicyLevel: 2,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80',
        weightGrams: 400,
        isAvailable: true,
        bestseller: true
      },
      {
        id: 'm-16',
        name: 'Punjabi Sweet Kesar Lassi',
        description: 'Thick chilled sweet yogurt blended with saffron threads and malai layer.',
        price: 110,
        dietary: 'veg',
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1571006682858-a458b8a69288?w=500&q=80',
        weightGrams: 350,
        isAvailable: true,
        bestseller: true
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
