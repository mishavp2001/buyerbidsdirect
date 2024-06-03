import { TileLayer, useMap  } from "react-leaflet";
type Coordinates = {
    latitude: number;
    longitude: number;
  } | null
  
type props = {
    cords: Coordinates;
}
export function ReactMarker({cords}: props){
    const map = useMap()
    cords && map.setView([cords?.latitude, cords?.longitude])
    return(
        <section>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </section>
    )
}