"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "./Loading";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import Badge from "@/components/ui/badge/Badge";
import { formatDateTime } from "@/utils/util";
import Card from "./ui/card/Card";

const DetailAbsensi = () => {
  const { getAttendanceById, selectedAttendance } = useAttendanceStore();
  const searchParams = useSearchParams();
  const key = searchParams.get("key");

  useEffect(() => {
    if (key) {
      getAttendanceById(key);
    }
  }, [key, getAttendanceById]);

  if (!key) {
    return (
      <div className="p-6 rounded-lg shadow-md bg-white max-w-lg mx-auto mt-10">
        <p className="text-red-500 font-semibold">Invalid attendance key.</p>
      </div>
    );
  }

  if (!selectedAttendance) {
    return <Loading />;
  }

  const {
    checkIn,
    checkOut,
    status,
    latitude_checkIn,
    longitude_checkIn,
    latitude_checkOut,
    longitude_checkOut,
    faceCheckIns = [],
    faceCheckOuts = [],
    note,
    createdAt,
    updatedAt,
  } = selectedAttendance;

  return (
    <div className="max-w-7xl mx-auto space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CARD LEFT: DETAIL ABSENSI (RATA KANAN-KIRI) */}
        <div className="p-5 border bg-white border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h1 className="text-md font-bold text-gray-700 dark:text-gray-200">Detail Absensi</h1>
            <Badge
              size="sm"
              color={
                status === "Present"
                  ? "success"
                  : status === "Late"
                    ? "warning"
                    : status === "Leave"
                      ? "info"
                      : "light"
              }
            >
              {status}
            </Badge>
          </div>

          {/* List Detail dengan format Rata Kiri & Rata Kanan */}
          <div className="text-sm space-y-3 text-gray-700 dark:text-gray-300">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="font-semibold">Check In</span>
              <span className="text-right text-gray-500 dark:text-gray-400">{formatDateTime(checkIn)}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="font-semibold">Check Out</span>
              <span className="text-right text-gray-500 dark:text-gray-400">{formatDateTime(checkOut)}</span>
            </div>

            <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="font-semibold">Check-In Lat</span>
              <span className="text-right text-gray-500 dark:text-gray-400 font-mono">{latitude_checkIn || "-"}</span>
            </div>

            <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="font-semibold">Check-In Lng</span>
              <span className="text-right text-gray-500 dark:text-gray-400 font-mono">{longitude_checkIn || "-"}</span>
            </div>

            <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="font-semibold">Check-Out Lat</span>
              <span className="text-right text-gray-500 dark:text-gray-400 font-mono">{latitude_checkOut || "-"}</span>
            </div>

            <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="font-semibold">Check-Out Lng</span>
              <span className="text-right text-gray-500 dark:text-gray-400 font-mono">{longitude_checkOut || "-"}</span>
            </div>

            {note && (
              <div className="flex justify-between items-start pt-1">
                <span className="font-semibold shrink-0 mr-4">Note</span>
                <span className="text-right text-gray-500 dark:text-gray-400 italic break-words max-w-[70%]">{note}</span>
              </div>
            )}
          </div>
        </div>

        {/* CARD RIGHT: FACE RECOGNITION */}
        <div className="p-5 border bg-white border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <h2 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-4">Face Recognition</h2>
          
          <div className="space-y-4">
            {/* Check-In Face */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Check-In-Face</h3>
              {faceCheckIns.length > 0 ? (
                faceCheckIns.map((face: any) => (
                  <div
                    key={face.id}
                    className="border border-gray-100 dark:border-gray-700 rounded-xl p-3 mb-2 flex items-center gap-4 hover:shadow-sm transition"
                  >
                    <img
                      src={`/api${face.imageUrl}`}
                      alt="Face Check-In"
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Type</span>
                        <span className="text-gray-800 dark:text-gray-200 font-semibold">{face.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Score</span>
                        <span className="text-gray-800 dark:text-gray-200 font-mono">{face.score.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Time</span>
                        <span className="text-xs text-gray-700 dark:text-gray-300">{formatDateTime(face.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No face check-ins recorded.</p>
              )}
            </div>

            {/* Face Check-Out */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Check-Out-Face</h3>
              {faceCheckOuts.length > 0 ? (
                faceCheckOuts.map((face: any) => (
                  <div
                    key={face.id}
                    className="border border-gray-100 dark:border-gray-700 rounded-xl p-3 mb-2 flex items-center gap-4 hover:shadow-sm transition"
                  >
                    <img
                      src={`/api${face.imageUrl}`}
                      alt="Face Check-Out"
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Type</span>
                        <span className="text-gray-800 dark:text-gray-200 font-semibold">{face.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Score</span>
                        <span className="text-gray-800 dark:text-gray-200 font-mono">{face.score.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Time</span>
                        <span className="text-xs text-gray-700 dark:text-gray-300">{formatDateTime(face.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No face check-outs recorded.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailAbsensi;