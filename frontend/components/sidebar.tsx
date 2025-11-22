"use client"

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
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
            SM
          </div>
          <span className="text-xl font-semibold tracking-tight">StockMaster</span>
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
                isActive ? "bg-teal-600 text-white" : "text-slate-300 hover:bg-slate-800"
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
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
