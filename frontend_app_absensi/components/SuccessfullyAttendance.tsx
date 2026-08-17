"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useAttendanceStore } from "@/stores/useAttendanceStore";
import Loading from "./Loading";
import Link from "next/link";

const SuccessfullyAttendance = () => {
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
      <div className="p-10 rounded-sm shadow-sm bg-white">
        <p>Invalid attendance key.</p>
      </div>
    );
  }

  if (!selectedAttendance) {
    return (
      <Loading />
    );
  }

  const {
    checkIn,
    checkOut,
    status,
  } = selectedAttendance;


  const renderStatus = (status: string) => {
    switch (status) {
      case "Present":
        return (
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-36 h-36 text-green-500"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-2.53a.75.75 0 1 0-1.22-.88l-3.236 4.485-1.69-1.69a.75.75 0 1 0-1.06 1.06l2.313 2.314a.75.75 0 0 0 1.14-.08l3.75-5.209Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );

      case "Absent":
        return (
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-36 h-36 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5"
              />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
        );

      case "Leave":
        return (
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-36 h-36 text-yellow-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2"
              />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
        );

      case "Late":
        return (
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-36 h-36 text-orange-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5"
              />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-36 h-36 text-gray-400"
            >
              <circle cx="12" cy="12" r="9" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8h.01M11 12h1v4h1"
              />
            </svg>

            <p className="text-gray-500 font-semibold text-lg mt-2">
              Unknown
            </p>
          </div>
        );
    }
  };
  const formatDate = (date?: string | Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-10 rounded-lg shadow-md bg-white w-full max-w-md">
        <div className="flex flex-col items-center gap-4 mb-6">
          {renderStatus(status)}
          <p className="text-sm text-gray-500">
            Your attendance has been recorded.
          </p>
        </div>
        <div className="space-y-3 border text-sm p-4 rounded-md bg-gray-50">
          <p>
            <strong>Status:</strong> {status || "-"}
          </p>

          <p>
            <strong>Check In:</strong> {formatDate(checkIn)}
          </p>

          <p>
            <strong>Check Out:</strong> {formatDate(checkOut)}
          </p>

          {/* <p>
            <strong>Check In Location:</strong>{" "}
            {latitude_checkIn && longitude_checkIn
              ? `${latitude_checkIn}, ${longitude_checkIn}`
              : "-"}
          </p>

          <p>
            <strong>Check Out Location:</strong>{" "}
            {latitude_checkOut && longitude_checkOut
              ? `${latitude_checkOut}, ${longitude_checkOut}`
              : "-"}
          </p> */}
        </div>
        <Link
          href={`/`}
          className="w-full mt-4 inline-block text-center font-semibold py-3 px-6 rounded-lg border transition-colors duration-200"
        >
          Back
        </Link>
      </div>
    </div>
  );
};

export default SuccessfullyAttendance;