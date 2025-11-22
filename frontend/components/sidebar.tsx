"use client"

import Image from "next/image"
import { LogOut, LayoutDashboard, Boxes, TrendingUp, Package, Settings } from "lucide-react"

interface SidebarProps {
  currentView: string
  onNavigate: (view: string) => void
  onLogout: () => void
}

export function Sidebar({ currentView, onNavigate, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "operations", label: "Operations", icon: Boxes },
    { id: "products", label: "Products", icon: Package },
    { id: "move-history", label: "Move History", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-indigo-900 dark:from-slate-900 to-purple-900 dark:to-slate-950 text-white">
      {/* Logo */}
      <div className="p-6 border-b border-purple-700 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg overflow-hidden">
            <Image
              src="/icon.jpg"
              alt="Stock-Master Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-semibold tracking-tight">Stock-Master</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-[#714B67] text-white shadow-md" : "text-purple-100 hover:bg-purple-800 dark:hover:bg-slate-800"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-purple-700 dark:border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-purple-100 hover:bg-purple-800 dark:hover:bg-slate-800 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
