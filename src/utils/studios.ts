export interface StudioLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  amenities: string[];
}

export function filterNearbyStudios(studios: StudioLocation[], targetLat: number, targetLng: number, maxRadiusKm: number): StudioLocation[] {
  return studios.filter(studio => {
    const distance = Math.hypot(studio.latitude - targetLat, studio.longitude - targetLng) * 111; // rough km conversion
    return distance <= maxRadiusKm;
  });
}
