"use client";

import { useEffect, useState } from "react";
import {
  APIProvider,
  Circle,
  Map,
  Marker,
  useMap,
} from "@vis.gl/react-google-maps";

import Loading from "@/components/Loading";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/button/Button";
import { useBranchStore } from "@/stores/useBranchStore";
import { FocusIcon, Minus, Plus } from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

type Position = {
  lat: number;
  lng: number;
};

function MapController({
  center,
  zoom,
}: {
  center: Position | null;
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !center) return;

    map.panTo(center);
    map.setZoom(zoom);
  }, [map, center, zoom]);

  return null;
}

const VISGMap = () => {
  const [center, setCenter] = useState<Position | null>(null);
  const [zoom, setZoom] = useState(15);
  const [userLocation, setUserLocation] = useState<Position | null>(null);

  const { data: session } = useSession();
  const { branches } = useBranchStore();
  const router = useRouter();

  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [loadingCheckOut, setLoadingCheckOut] = useState(false);

  const {
    addAttendance,
    updateAttendance,
    attendanceToday,
  } = useAttendanceStore();

  const isCheckedIn = Boolean(attendanceToday?.checkIn);
  const isCheckedOut = Boolean(attendanceToday?.checkOut);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation tidak didukung");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const loc = {
          lat: coords.latitude,
          lng: coords.longitude,
        };

        setCenter(loc);
        setUserLocation(loc);
      },
      (error) => {
        toast.error(error.message);
      }
    );
  }, []);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 21));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 0));
  };

  const focusMyLocation = () => {
    if (!userLocation) return;

    setCenter(userLocation);
    setZoom(17);
  };

  async function handleCheckIn() {
    if (!session?.user?.id)
      return toast.error("Unauthorized");

    if (!userLocation)
      return toast.error("Unable to get current location");

    if (attendanceToday)
      return toast.error("Checked in today");

    setLoadingCheckIn(true);

    try {
      const tokenCheck = await fetch(
        "/api/auth/bio-metrics/verify/check",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!tokenCheck.ok)
        return toast.error(
          "Face verification token expired"
        );

      const { token } = await tokenCheck.json();

      const formData = new FormData();

      formData.append("userId", session.user.id);
      formData.append(
        "latitude_checkIn",
        String(userLocation.lat)
      );
      formData.append(
        "longitude_checkIn",
        String(userLocation.lng)
      );
      formData.append("status", "Present");

      const result = await addAttendance(
        formData,
        token
      );

      if (result?.success) {
        toast.success(result.message);

        router.push(
          `/successfuly-attendance?key=${encodeURIComponent(
            String(result.id)
          )}`
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Internal error");
    } finally {
      setLoadingCheckIn(false);
    }
  }

  async function handleCheckOut() {
    if (!session?.user?.id)
      return toast.error("Unauthorized");

    if (!userLocation)
      return toast.error("Unable to get current location");

    if (!attendanceToday || attendanceToday.checkOut)
      return toast.error("Unable to check out");

    setLoadingCheckOut(true);

    try {
      const tokenCheck = await fetch(
        "/api/auth/bio-metrics/verify/check",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!tokenCheck.ok)
        return toast.error(
          "Face verification token expired"
        );

      const { token } = await tokenCheck.json();

      const formData = new FormData();

      formData.append(
        "checkOut",
        new Date().toISOString()
      );

      formData.append(
        "latitude_checkOut",
        String(userLocation.lat)
      );

      formData.append(
        "longitude_checkOut",
        String(userLocation.lng)
      );

      const result = await updateAttendance(
        session.user.id,
        formData,
        token
      );

      if (result?.success) {
        toast.success(result.message);

        router.push(
          `/successfuly-attendance?key=${encodeURIComponent(
            String(result.id)
          )}`
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Internal error");
    } finally {
      setLoadingCheckOut(false);
    }
  }

  if (!center) return <Loading />;

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="relative h-screen w-screen">
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI
          className="h-full w-full"
        >
          <MapController
            center={center}
            zoom={zoom}
          />

          {userLocation && (
            <div className="text-blue-700">
              <Marker
                position={userLocation}
                title="Lokasi Saya"
                icon={{
                  url:
                    "data:image/svg+xml;charset=UTF-8," +
                    encodeURIComponent(`
                           <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                          
                          <circle cx="30" cy="30" r="18" fill="#3b82f6" opacity="0.5"/>

                          <circle cx="30" cy="30" r="14" fill="white"/>

                          <circle cx="30" cy="30" r="4" fill="#3b82f6"/>

                        </svg>
                                  `),
                }}
              />
            </div>
          )}

          {branches.map((branch) => (
            <Circle
              key={branch.id}
              center={{
                lat: branch.latitude,
                lng: branch.longitude,
              }}
              radius={branch.radius || 100}
              fillColor="#0088ff"
              fillOpacity={0.3}
              strokeColor="#0088ff"
              strokeWeight={2}
            />
          ))}
        </Map>

        {/* Controls */}
        <div className="absolute left-2 top-2 flex flex-col gap-1 rounded bg-white shadow-md">
          <button
            onClick={focusMyLocation}
            className="cursor-pointer rounded p-2 hover:bg-gray-100"
          >
            <FocusIcon size={18}/>
          </button>

          <button
            onClick={handleZoomIn}
            className="cursor-pointer rounded p-2 hover:bg-gray-100"
          >
            <Plus size={18}/>
          </button>

          <button
            onClick={handleZoomOut}
            className="cursor-pointer rounded p-2 hover:bg-gray-100"
          >
            <Minus size={18}/>
          </button>
        </div>

        {/* Actions */}
        <div className="absolute bottom-10 left-1/2 z-[1000] flex -translate-x-1/2 rounded-full bg-white/90 shadow-xl backdrop-blur-md">

          {/* CHECK IN */}
          <button
            onClick={handleCheckIn}
            disabled={isCheckedIn || loadingCheckIn}
            className={`
      px-4 py-2 rounded-full transition
      ${isCheckedIn || loadingCheckIn
                ? "cursor-not-allowed text-sm text-gray-900"
                : "bg-green-600 text-white hover:bg-green-700 cursor-pointer text-sm text-gray-900"
              }
    `}
          >
            {loadingCheckIn ? "Loading..." : "Check In"}
          </button>

          {/* CHECK OUT */}
          <button
            onClick={handleCheckOut}
            disabled={!isCheckedIn || isCheckedOut || loadingCheckOut}
            className={`
      px-4 py-2 rounded-full transition
      ${!isCheckedIn || isCheckedOut || loadingCheckOut
                ? "cursor-not-allowed text-sm text-gray-900"
                : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer text-sm text-gray-900"
              }
    `}
          >
            {loadingCheckOut ? "Loading..." : "Check Out"}
          </button>

        </div>
      </div>
    </APIProvider>
  );
};

export default VISGMap;