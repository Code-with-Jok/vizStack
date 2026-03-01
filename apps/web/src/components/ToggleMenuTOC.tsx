"use client";

import React, { useState, useEffect } from "react";
import { FiChevronRight, FiList, FiX } from "react-icons/fi";

interface TOCItem {
  id: string;
  title: string;
}

interface ToggleMenuTOCProps {
  items: TOCItem[];
  activeIndex: number;
  onItemClick: (index: number) => void;
  label?: string;
}

export function ToggleMenuTOC({
  items,
  activeIndex,
  onItemClick,
  label = "Table of Contents",
}: ToggleMenuTOCProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent background scroll when open
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

  return (
    <>
      {/* Drawer Toggle Button (Mobile Only) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-1000 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:scale-110 active:scale-95 transition-all"
        title={label}
      >
        <FiList size={22} />
      </button>

      {/* Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-1100 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-1200 shadow-2xl transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full bg-bg-primary">
          {/* Drawer Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {label}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onItemClick(index);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl text-sm font-medium transition-all text-left ${
                    index === activeIndex
                      ? "bg-white border border-accent-cyan shadow-sm text-gray-900 translate-x-1"
                      : "text-gray-500 hover:bg-black/5 hover:translate-x-1"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] w-5 h-5 flex items-center justify-center rounded-md ${
                      index === activeIndex
                        ? "bg-accent-cyan/10 text-accent-cyan"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="flex-1 truncate">{item.title}</span>
                  {index === activeIndex && (
                    <FiChevronRight className="text-accent-cyan" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
