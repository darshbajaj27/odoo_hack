"use client"

import { ChevronLeft, Edit2 } from "lucide-react"

interface ProductDetailViewProps {
  productId: string
  onNavigate: (view: string) => void
}

export function ProductDetailView({ productId, onNavigate }: ProductDetailViewProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-white dark:bg-slate-950 text-gray-900 dark:text-white min-h-screen">
      {/* Breadcrumb & Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate("products")}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <p className="text-sm text-slate-600 dark:text-gray-400">Products</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Steel Rods 12mm</h1>
        </div>
        <button className="h-11 px-6 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
          <Edit2 size={18} />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Image */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 flex items-center justify-center">
          <div className="w-32 h-32 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 dark:text-gray-400 text-center">
            Product Image
          </div>
        </div>

        {/* Right - Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">General Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1">Product Type</label>
                <p className="text-slate-900 dark:text-white font-medium">Storable</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1">Sales Price</label>
                <p className="text-slate-900 dark:text-white font-medium">$45.00</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1">Cost</label>
                <p className="text-slate-900 dark:text-white font-medium">$28.50</p>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Inventory</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1">Weight (kg)</label>
                <p className="text-slate-900 dark:text-white font-medium">12.5</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1">Volume (m³)</label>
                <p className="text-slate-900 dark:text-white font-medium">0.015</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1">HS Code</label>
                <p className="text-slate-900 dark:text-white font-medium">7214910000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className="h-12 bg-blue-100 dark:bg-blue-950 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold rounded-lg transition-colors">
          On Hand: 450
        </button>
        <button className="h-12 bg-teal-100 dark:bg-teal-950 hover:bg-teal-200 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 font-semibold rounded-lg transition-colors">
          In/Out: 12
        </button>
        <button className="h-12 bg-emerald-100 dark:bg-emerald-950 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold rounded-lg transition-colors">
          Sold: 5
        </button>
      </div>
    </div>
  )
}
