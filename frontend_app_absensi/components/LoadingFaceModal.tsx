"use client";

import { useEffect } from "react";

interface ResultFace {
  success: boolean;
  message?: string | null;
  name?: string;
  score?: number;
  image?: string | null;
}

interface LoadingFaceModalProps {
  isOpen: boolean;
  result?: ResultFace | null;
}

export default function LoadingFaceModal({
  isOpen,
  result,
}: LoadingFaceModalProps) {
  // prevent scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderStatus = (status: boolean) => {
    if (!status) {
      return (
        <div className="flex flex-col items-center">
          {/* FAILED ICON */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-28 h-28 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5"
            />
            <circle cx="12" cy="12" r="9" />
          </svg>

          <h2 className="mt-4 text-lg font-semibold">
            Verification Failed
          </h2>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        {/* SUCCESS ICON */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-28 h-28 text-green-500"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-2.53a.75.75 0 1 0-1.22-.88l-3.236 4.485-1.69-1.69a.75.75 0 1 0-1.06 1.06l2.313 2.314a.75.75 0 0 0 1.14-.08l3.75-5.209Z"
            clipRule="evenodd"
          />
        </svg>

        <h2 className="mt-4 text-lg font-semibold">
          Verification Success
        </h2>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LOADING STATE */}
        {!result && (
          <>
            <div className="flex space-x-2 mb-6">
              <span className="w-2 h-2 bg-brand-700 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-brand-700 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-brand-700 rounded-full animate-bounce" />
            </div>

            <h2 className="text-lg font-semibold text-gray-800 text-center">
              Face Verification in Progress
            </h2>

            <p className="text-sm text-gray-500 text-center mt-2">
              Please ensure your face is clearly visible and remain still for accurate verification.
            </p>
          </>
        )}

        {result && (
          <>
            {renderStatus(result.success)}

            {result.message && (
              <p className="mt-3 text-center text-gray-600 text-sm">
                {result.message}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}