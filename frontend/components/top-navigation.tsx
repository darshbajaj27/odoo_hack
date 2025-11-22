"use client"

import { useState } from "react"
import { Menu, X, ChevronDown, LogOut } from "lucide-react"

interface TopNavigationProps {
  currentView: string
  userName: string
  onNavigate: (view: string) => void
  onLogout: () => void
}

export function TopNavigation({ currentView, userName, onNavigate, onLogout }: TopNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [operationsDropdownOpen, setOperationsDropdownOpen] = useState(false)
  const [desktopOperationsHover, setDesktopOperationsHover] = useState(false)

  const handleNavigate = (view: string) => {
    onNavigate(view)
    setMobileMenuOpen(false)
    setOperationsDropdownOpen(false)
  }

  const isActive = (view: string) => currentView === view

  const navItems = [
    { id: "dashboard", label: "Dashboard", view: "dashboard" },
    { id: "stock", label: "Stock", view: "products" },
    { id: "move-history", label: "Move History", view: "move-history" },
    { id: "settings", label: "Settings", view: "settings" },
  ]

  const operationsItems = [
    { label: "Receipts", view: "operations" },
    { label: "Delivery Orders", view: "operations-list" },
    { label: "Inventory Adjustments", view: "operation-detail" },
  ]

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-16 shadow-sm">
        <div className="flex items-center justify-between h-full px-6">
          {/* Left Section - Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-700 to-purple-900 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
              SM
            </div>
            <span className="text-lg font-semibold text-gray-900 hidden sm:inline">StockMaster</span>
          </div>

          {/* Center Section - Main Menu (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 flex-1 mx-8">
            {/* Dashboard */}
            <button
              onClick={() => handleNavigate("dashboard")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive("dashboard")
                  ? "text-[#714B67] bg-purple-50 border-b-2 border-[#714B67]"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-current={isActive("dashboard") ? "page" : undefined}
            >
              Dashboard
            </button>

            {/* Operations Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDesktopOperationsHover(true)}
              onMouseLeave={() => setDesktopOperationsHover(false)}
            >
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  desktopOperationsHover
                    ? "text-[#714B67] bg-purple-50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Operations
                <ChevronDown size={16} className={desktopOperationsHover ? "rotate-180" : ""} />
              </button>
              {/* Dropdown Menu */}
              {desktopOperationsHover && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-2">
                  {operationsItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavigate(item.view)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#714B67] transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stock */}
            <button
              onClick={() => handleNavigate("products")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive("products")
                  ? "text-[#714B67] bg-purple-50 border-b-2 border-[#714B67]"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-current={isActive("products") ? "page" : undefined}
            >
              Stock
            </button>

            {/* Move History */}
            <button
              onClick={() => handleNavigate("move-history")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive("move-history")
                  ? "text-[#714B67] bg-purple-50 border-b-2 border-[#714B67]"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-current={isActive("move-history") ? "page" : undefined}
            >
              Move History
            </button>

            {/* Settings */}
            <button
              onClick={() => handleNavigate("settings")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive("settings")
                  ? "text-[#714B67] bg-purple-50 border-b-2 border-[#714B67]"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-current={isActive("settings") ? "page" : undefined}
            >
              Settings
            </button>
          </nav>

          {/* Right Section - Profile & Mobile Menu */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Desktop Profile */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-medium cursor-pointer hover:from-indigo-700 hover:to-purple-800 transition-all">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Profile */}
            <div className="md:hidden w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-medium cursor-pointer hover:from-indigo-700 hover:to-purple-800 transition-all">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 md:hidden shadow-lg">
            <div className="p-4 space-y-2">
              {/* Dashboard */}
              <button
                onClick={() => handleNavigate("dashboard")}
                className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("dashboard") ? "text-[#714B67] bg-purple-50" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </button>

              {/* Operations */}
              <div>
                <button
                  onClick={() => setOperationsDropdownOpen(!operationsDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Operations
                  <ChevronDown size={16} className={operationsDropdownOpen ? "rotate-180" : ""} />
                </button>
                {operationsDropdownOpen && (
                  <div className="pl-4 mt-1 space-y-1">
                    {operationsItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleNavigate(item.view)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Stock */}
              <button
                onClick={() => handleNavigate("products")}
                className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("products") ? "text-[#714B67] bg-purple-50" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Stock
              </button>

              {/* Move History */}
              <button
                onClick={() => handleNavigate("move-history")}
                className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("move-history") ? "text-[#714B67] bg-purple-50" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Move History
              </button>

              {/* Settings */}
              <button
                onClick={() => handleNavigate("settings")}
                className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("settings") ? "text-[#714B67] bg-purple-50" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Settings
              </button>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
