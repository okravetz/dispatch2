"use client";
import { X } from "lucide-react";

type MenuProps = {
  onClose: () => void;
  onSelect: (view: string) => void;
};

export default function Menu({ onClose, onSelect }: MenuProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col p-6 gap-y-8">
          {/* Back Button / Close */}
          <button
            onClick={onClose}
            className="flex items-center cursor-pointer justify-end"
          >
            <X size={24} color="#9ca3af" />
          </button>

          {/* Menu Items */}
          <button
            onClick={() => {
              onSelect("focus");
              onClose();
            }}
            className="text-left text-gray-200 cursor-pointer"
          >
            Focus Mode
          </button>
          <hr />
          <button
            onClick={() => {
              onSelect("active");
              onClose();
            }}
            className="text-left text-gray-200 cursor-pointer"
          >
            Active Tasks
          </button>
          <button
            onClick={() => {
              onSelect("responded");
              onClose();
            }}
            className="text-left text-gray-200 cursor-pointer"
          >
            Responded
          </button>
          <button
            onClick={() => {
              onSelect("waiting");
              onClose();
            }}
            className="text-left text-gray-200 cursor-pointer"
          >
            Waiting
          </button>
          <button
            onClick={() => {
              onSelect("done");
              onClose();
            }}
            className="text-left text-gray-200 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
