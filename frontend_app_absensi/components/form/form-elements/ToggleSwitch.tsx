"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";
import Switch from "../switch/Switch";

export default function ToggleSwitch() {
  const handleSwitchChange = (checked: boolean) => {
  };
  return (
    <ComponentCard title="Toggle switch input">
      <div className="flex gap-4">
        <Switch
          label="Default"
          checked={false}
          onChange={handleSwitchChange}
        />
        <Switch
          label="Checked"
          checked={false}
          onChange={handleSwitchChange}
        />
        <Switch
          checked={false}
          label="Disabled"
          disabled={true} />
      </div>{" "}
      <div className="flex gap-4">
        <Switch
          label="Default"
          checked={false}
          onChange={handleSwitchChange}
          color="gray"
        />
        <Switch
          label="Checked"
          checked={false}
          onChange={handleSwitchChange}
          color="gray"
        />
        <Switch
          checked={false}
          label="Disabled"
          disabled={true}
          color="gray" />
      </div>
    </ComponentCard>
  );
}
