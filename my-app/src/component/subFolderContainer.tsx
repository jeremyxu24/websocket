import React from "react";
import { useSubLocationStore } from "../lib/store";
import locationType from "../type/location";
import DocumentIcon from "../assets/img/Document";

export default function SubFolderContainer() {
    const { subLocations } = useSubLocationStore();

    function subFolderOrSheet(locationType: string) {
        if (locationType === 'folder') return <DocumentIcon />
        else if (locationType === 'sheet') return <DocumentIcon />
    }

    return (
        <div className="subFolderContainer d-flex flex-wrap-wrap">
            {subLocations && subLocations.map((subLocation: locationType, index: number) => {
                return (
                    <div key={`subLocation-${index}`} className="subFolderContentDiv d-flex" id={`subLocationID-${subLocation.locationID}`}>
                        {subFolderOrSheet(subLocation.type)}
                        <div className="subFolderTextContent">
                            {subLocation.label}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}