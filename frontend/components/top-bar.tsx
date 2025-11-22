"use client"

import { Menu, Search, Bell } from "lucide-react"

interface TopBarProps {
  userName: string
  onMenuClick: () => void
  menuOpen: boolean
}

export function TopBar({ userName, onMenuClick, menuOpen }: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Global Search */}
        <div className="hidden sm:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search SKU, Product..."
              className="w-full h-11 pl-10 pr-4 border border-slate-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
              aria-label="Search products by SKU"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div
            className="h-10 w-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-medium cursor-pointer hover:bg-teal-700 transition-colors"
            title={`User: ${userName}`}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  )
}

function X({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6l-12 12M6 6l12 12" />
    </svg>
  )
}
