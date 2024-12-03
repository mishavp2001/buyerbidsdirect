
  interface Property {
    id: any;
    address: string;
    position: string | number | boolean | object | any[];
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    lotSize: number;
    yearBuilt: number;
    propertyType: string;
    hoaFees?: string;
    mlsNumber?: string;
    zestimate?: string;
    neighborhood: string;
    amenities: string[];
  }
  
  type UserPosition = [number, number];

  
  // Haversine distance function with proper types
  function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // Distance in kilometers
  }
  
  // Utility function to filter properties within a given radius
  function filterPropertiesWithinRadius(
    properties: Property[]|any[],
    userPosition: UserPosition,
    radius: number,
    maxPrice?: number,
    minPrice?: number,
    propertyType?: string[]
  ): Property[] {
    return properties.filter(property => {
      const pos =  JSON.parse(property?.position);
      const distance = haversineDistance(
        userPosition[0],
        userPosition[1],
        pos?.latitude,
        pos?.longitude
      );
      
      return distance <= radius && 
              (!maxPrice || maxPrice > property?.price) && (!minPrice || minPrice < property?.price) && (propertyType?.length === 0 || propertyType?.includes(property?.propertyType));
    });
  }
  
  export { haversineDistance, filterPropertiesWithinRadius };
  