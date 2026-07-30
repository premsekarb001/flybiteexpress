import { MOCK_RESTAURANTS, PREDEFINED_LOCATIONS } from '../data/mockData';
import { Restaurant } from '../types';

export class RestaurantService {
  public getAllRestaurants(): Restaurant[] {
    return MOCK_RESTAURANTS;
  }

  public getRestaurantById(id: string): Restaurant | undefined {
    return MOCK_RESTAURANTS.find((r) => r.id === id);
  }

  public getFeaturedRestaurants(): Restaurant[] {
    return MOCK_RESTAURANTS.filter((r) => r.rating >= 4.7 || r.dronePadAvailable);
  }

  public filterRestaurants(searchQuery: string, activeTag: string): Restaurant[] {
    const cleanQuery = searchQuery.trim().toLowerCase();

    return MOCK_RESTAURANTS.filter((rest) => {
      const matchesSearch =
        cleanQuery === '' ||
        rest.name.toLowerCase().includes(cleanQuery) ||
        rest.locality.toLowerCase().includes(cleanQuery) ||
        rest.city.toLowerCase().includes(cleanQuery) ||
        rest.cuisine.some((c) => c.toLowerCase().includes(cleanQuery)) ||
        rest.menu.some((m) => m.name.toLowerCase().includes(cleanQuery) || m.category.toLowerCase().includes(cleanQuery));

      if (!matchesSearch) return false;

      if (activeTag === 'All') return true;
      if (activeTag === 'Pure Veg') return rest.cuisine.includes('Pure Veg') || rest.menu.every((m) => m.dietary === 'veg' || m.dietary === 'jain');
      if (activeTag === 'Drone Express') return rest.dronePadAvailable;
      if (activeTag === 'Top Rated 4.5+') return rest.rating >= 4.5;
      if (activeTag === 'Under 30 Mins') return rest.droneDeliveryTimeMin <= 25;
      if (activeTag === 'Biryani') return rest.cuisine.includes('Biryani');
      if (activeTag === 'South Indian') return rest.cuisine.includes('South Indian');
      if (activeTag === 'North Indian') return rest.cuisine.includes('North Indian');
      if (activeTag === 'Desserts') return rest.menu.some((m) => m.category === 'Desserts');
      if (activeTag === 'Beverages') return rest.menu.some((m) => m.category === 'Beverages');

      return true;
    });
  }
}

export const restaurantService = new RestaurantService();
