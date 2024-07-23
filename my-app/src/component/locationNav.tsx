import React from "react";
import locationType from "../type/location";
import { useLocationStore } from "../lib/store";
import '../styles/style.css'

export default function LocationNav() {
    // const locations = useLocationStore((state) => state.locations)
    const { locations, setLocation } = useLocationStore()

    function handleOnNavClick(e: any) {
        const newNavIndex: number = parseInt(e.currentTarget.id.split('-')[3]) + 1;
        setLocation(newNavIndex)
    }

    console.log('locations', locations)

    return (
        <div className="locationContainer d-flex">
            {locations && locations.map((location: locationType, index: number) => {
                if (index === 0) {
                    return (
                        <div key={`location-${index}`} className="locationNavContent" id={`locationID-${location.locationID}-index-${index}`} onClick={handleOnNavClick}>
                            {location.label}
                        </div>
                    )
                } else {
                    return (
                        <div key={`location-${index}`} className="d-flex" >
                            <div  >
                                {`>`}
                            </div>
                            <div className="locationNavContent" id={`locationID-${location.locationID}-index-${index}`} onClick={handleOnNavClick}>
                                {location.label}
                            </div>
                        </div>
                    )
                }
            })}
        </div>
    )
}