interface Geolocation {
  latitude: number;
  longitude: number;
}

export async function getGeoLocation(address: string): Promise<Geolocation | null> {  
  const apiKey = 'AIzaSyC1m92_wrOPapYEQu2JYP919wNartB3kDA'; // Replace with your Google Maps API key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: any = await response.json();
    if (data.status !== 'OK') {
      throw new Error(`Geocoding API error: ${data.status}`);
    }

    const location = data.results[0].geometry.location;
    return {
      latitude: location.lat,
      longitude: location.lng,
    };
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    return null;
  }
}
