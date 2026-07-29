import { DeliveryMode, DeliveryModeConfig } from '../types';

export const DELIVERY_MODE_CONFIGS: Record<DeliveryMode, DeliveryModeConfig> = {
  walking: {
    mode: 'walking',
    title: 'Hyper-Local Walking Eco-Rider',
    icon: '🚶',
    etaMinutes: 20,
    fee: 15,
    maxWeightKg: 2.5,
    badge: 'ECO ZERO CARBON',
    carbonFootprint: 'Zero Emissions',
    description: 'Foot courier inside housing societies, tech parks & narrow Indian bazaars.'
  },
  cycling: {
    mode: 'cycling',
    title: 'Bicycle / Cycling Green Rider',
    icon: '🚲',
    etaMinutes: 25,
    fee: 20,
    maxWeightKg: 5.0,
    badge: 'GREEN RIDER',
    carbonFootprint: 'Eco Green',
    description: 'Pedal-power eco courier for neighborhood deliveries up to 3 km.'
  },
  bike: {
    mode: 'bike',
    title: 'Motorbike / EV Scooter Rider',
    icon: '🛵',
    etaMinutes: 30,
    fee: 30,
    maxWeightKg: 10.0,
    badge: 'STANDARD FAST',
    carbonFootprint: 'Standard',
    description: 'Classic electric bike rider navigating city main roads.'
  },
  car: {
    mode: 'car',
    title: 'Car / Sedan Express Courier',
    icon: '🚗',
    etaMinutes: 35,
    fee: 60,
    maxWeightKg: 30.0,
    badge: 'HEAVY CATERING',
    carbonFootprint: 'Heavy Vehicle',
    description: 'Weatherproof enclosed sedan for large family feasts & corporate catering.'
  },
  drone_express: {
    mode: 'drone_express',
    title: 'Autonomous Drone Air Express',
    icon: '🚁',
    etaMinutes: 12,
    fee: 35, // + ₹49 surge
    maxWeightKg: 4.0,
    badge: 'DGCA AIR CORRIDOR',
    carbonFootprint: 'Air Corridor',
    description: 'Bypasses ground traffic with precision VTOL rooftop landing pad drop.'
  }
};

class DeliveryLogisticsService {
  public getModeConfig(mode: DeliveryMode): DeliveryModeConfig {
    return DELIVERY_MODE_CONFIGS[mode];
  }

  public checkCapacity(totalWeightGrams: number, mode: DeliveryMode): {
    eligible: boolean;
    reason?: string;
  } {
    const weightKg = totalWeightGrams / 1000;
    const config = this.getModeConfig(mode);

    if (weightKg > config.maxWeightKg) {
      return {
        eligible: false,
        reason: `Cart weight (${weightKg.toFixed(2)} kg) exceeds ${config.title} max limit (${config.maxWeightKg} kg).`
      };
    }
    return { eligible: true };
  }

  public calculateETA(distanceKm: number, mode: DeliveryMode): number {
    switch (mode) {
      case 'drone_express': return 12;
      case 'walking': return Math.ceil(distanceKm * 12 + 10); // ~3 km/h
      case 'cycling': return Math.ceil(distanceKm * 5 + 12);  // ~12 km/h
      case 'bike': return Math.ceil(distanceKm * 3.5 + 15);   // ~20 km/h
      case 'car': return Math.ceil(distanceKm * 4 + 18);      // ~15 km/h in city traffic
      default: return 30;
    }
  }
}

export const deliveryLogisticsService = new DeliveryLogisticsService();
