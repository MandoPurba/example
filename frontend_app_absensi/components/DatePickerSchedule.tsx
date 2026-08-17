"use client";

import { useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

import Label from "./form/Label";
import { Calendar } from "lucide-react";
import Select from "./form/Select";

type StatusType = "schedule" | "off" | "leave";

type WorkDateType = {
  date: string;
  status: StatusType;
};

type ScheduleMap = {
  [date: string]: StatusType;
};

type PropsType = {
  id: string;
  label?: string;
  placeholder?: string;

  value?: WorkDateType[];
  onChange?: (data: WorkDateType[]) => void;
};

export default function DatePickerSchedule({
  id,
  label,
  placeholder,
  value = [],
  onChange,
}: PropsType) {
  const fpRef = useRef<flatpickr.Instance | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<StatusType>("schedule");

  const selectedStatusRef =
    useRef<StatusType>("schedule");

  const schedulesRef = useRef<ScheduleMap>({});

  /* ================= STATUS REF ================= */
  useEffect(() => {
    selectedStatusRef.current = selectedStatus;
  }, [selectedStatus]);

  /* ================= INIT FLATPICKR ================= */
  useEffect(() => {
    if (fpRef.current) return;

    const fp = flatpickr(`#${id}`, {
      mode: "multiple",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      closeOnSelect: false,

      defaultDate: value.map((v) => v.date),

      onChange: (selectedDates, _dateStr, instance) => {
        const currentSchedules =
          schedulesRef.current;

        const updatedMap: ScheduleMap = {};

        selectedDates.forEach((date) => {
          const formatted = instance.formatDate(
            date,
            "Y-m-d"
          );

          updatedMap[formatted] =
            currentSchedules[formatted] ??
            selectedStatusRef.current;
        });

        const result: WorkDateType[] =
          Object.entries(updatedMap).map(
            ([date, status]) => ({
              date,
              status,
            })
          );

        onChange?.(result);
      },

      onDayCreate: (
        _dObj,
        _dStr,
        _fp,
        dayElem
      ) => {
        const date = dayElem.dateObj;

        if (!date) return;

        const formatted = flatpickr.formatDate(
          date,
          "Y-m-d"
        );

        const status =
          schedulesRef.current[formatted];

        dayElem.classList.remove(
          "schedule-day",
          "off-day",
          "leave-day"
        );

        if (status === "schedule") {
          dayElem.classList.add("schedule-day");
        }

        if (status === "off") {
          dayElem.classList.add("off-day");
        }

        if (status === "leave") {
          dayElem.classList.add("leave-day");
        }
      },
    });

    fpRef.current = Array.isArray(fp)
      ? fp[0]
      : fp;

    return () => {
      fpRef.current?.destroy();
      fpRef.current = null;
    };
  }, [id]);

  /* ================= SYNC VALUE ================= */
  useEffect(() => {
    if (!fpRef.current) return;

    const map: ScheduleMap = {};

    value.forEach((item) => {
      map[item.date] = item.status;
    });

    schedulesRef.current = map;

    fpRef.current.setDate(
      value.map((v) => v.date),
      false
    );

    fpRef.current.redraw();
  }, [value]);

  return (
    <div className="">
      {/* LABEL */}
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        <div>
          <Select
            options={[
              {
                value: "schedule",
                label: "Schedule",
              },
              {
                value: "off",
                label: "Off",
              },
              {
                value: "leave",
                label: "Leave",
              },
            ]}
            onChange={(e) =>
              setSelectedStatus(
                e.target.value as StatusType
              )
            }
            placeholder="Select status"
          />
        </div>

        {/* INPUT */}
        <div className="relative">
          <input
            id={id}
            placeholder={placeholder}
            className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent border-gray-300 dark:border-gray-700"
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <Calendar className="size-5" />
          </span>
        </div>
      </div>
      {/* SELECT STATUS */}

      {/* STYLE */}
      <style>
        {`
          .flatpickr-day.schedule-day {
            background: #3b82f6 !important;
            border-color: #3b82f6 !important;
            color: #fff !important;
          }

          .flatpickr-day.off-day {
            background: #f97316 !important;
            border-color: #f97316 !important;
            color: #fff !important;
          }

          .flatpickr-day.leave-day {
            background: #ef4444 !important;
            border-color: #ef4444 !important;
            color: #fff !important;
          }

          .flatpickr-day.selected {
            color: #fff !important;
          }

          .flatpickr-day:hover {
            color: #fff !important;
          }
        `}
      </style>
    </div>
  );
}