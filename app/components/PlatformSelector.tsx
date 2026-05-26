"use client";

import { Platform } from "../data/Platform";
import Creatable from "react-select/creatable";
import { MultiValue } from "react-select";

type PlatformSelectorProps = {
  platforms: Platform[];
  selectedPlatforms: Platform[];
  onChange: (selectedPlatforms: Platform[]) => void;
  onCreatePlatform: (title: string) => Promise<Platform | null>;
};

export default function PlatformSelector({
  platforms,
  selectedPlatforms,
  onChange,
  onCreatePlatform,
}: PlatformSelectorProps) {
  const options = platforms.map((p) => ({ value: p.id ?? 0, label: p.title }));
  const values = selectedPlatforms.map((p) => ({
    value: p.id ?? 0,
    label: p.title,
  }));
  const handleChange = (
    newValue: MultiValue<{ value: number; label: string }>
  ) => {
    const selected = newValue
      ? newValue.map((v: { value: number; label: string }) => ({
          id: v.value,
          title: v.label,
        }))
      : [];
    onChange(selected);
  };
  const handleCreate = (inputValue: string) => {
    onCreatePlatform(inputValue);
  };

  return (
    <Creatable
      isMulti
      options={options}
      value={values}
      onChange={handleChange}
      onCreateOption={onCreatePlatform}
      unstyled
      classNames={{
        control: () => "border border-gray-300 rounded bg-gray-900 p-2",
        menu: () => "bg-gray-900 border border-gray-700 p-2",
        option: () => "text-gray-200 hover:bg-gray-700 p-2",
        multiValue: () => "bg-blue-900 text-blue-200 rounded-full px-2 py-0.5 text-sm",
        multiValueLabel: () => "text-blue-200",
        multiValueRemove: () => "hover:bg-blue-700 rounded-full px-1"
      }}
      classNamePrefix="select"
      placeholder="Select platforms..."
    />
  );
}
