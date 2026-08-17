"use client";

import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  useMap,
} from "@vis.gl/react-google-maps";

import { useBranchStore } from "@/stores/useBranchStore";
import { Minus, Plus } from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

type Position = {
  lat: number;
  lng: number;
};

const DEFAULT_CENTER: Position = {
  lat: -2.5,
  lng: 118,
};

function MapController({
  center,
  zoom,
}: {
  center: Position;
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    map.panTo(center);
    map.setZoom(zoom);
  }, [map, center, zoom]);

  return null;
}

const BranchMap = () => {
  const { branches } = useBranchStore();

  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState<Position>(DEFAULT_CENTER);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 21));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 0));
  };

  const handleFocus = (lat: number, lng: number) => {
    setCenter({ lat, lng });
    setZoom(14);
  };

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Location All Branch
          </h3>
        </div>
        <div className="h-[500px] w-full rounded-xl overflow-hidden">
          <APIProvider apiKey={API_KEY}>
            <div className="relative h-full w-full">
              <Map
                defaultCenter={DEFAULT_CENTER}
                defaultZoom={5}
                gestureHandling="greedy"
                disableDefaultUI
                className="h-full w-full"
              >
                <MapController center={center} zoom={zoom} />

                {branches.map((branch) => (
                  <Marker
                    key={branch.id}
                    position={{
                      lat: branch.latitude,
                      lng: branch.longitude,
                    }}
                    onClick={() =>
                      handleFocus(
                        branch.latitude,
                        branch.longitude
                      )
                    }
                  />
                ))}
              </Map>

              <div className="absolute left-2 top-2 flex flex-col gap-1 rounded bg-white p-1 shadow">
                <button
                  onClick={handleZoomIn}
                  className="rounded p-2 hover:bg-gray-100"
                >
                  <Plus size={18} />
                </button>

                <button
                  onClick={handleZoomOut}
                  className="rounded p-2 hover:bg-gray-100"
                >
                  <Minus size={18} />
                </button>
              </div>
            </div>
          </APIProvider>
        </div>
      </div>
    </div>
  );
};

export default BranchMap;