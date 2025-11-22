"use client"

import { ChevronLeft, Edit2 } from "lucide-react"

interface ProductDetailViewProps {
  productId: string
  onNavigate: (view: string) => void
}

export function ProductDetailView({ productId, onNavigate }: ProductDetailViewProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate("products")}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <p className="text-sm text-slate-600">Products</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Steel Rods 12mm</h1>
        </div>
        <button className="h-11 px-6 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
          <Edit2 size={18} />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Image */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 flex items-center justify-center">
          <div className="w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 text-center">
            Product Image
          </div>
        </div>

        {/* Right - Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">General Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Product Type</label>
                <p className="text-slate-900 font-medium">Storable</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Sales Price</label>
                <p className="text-slate-900 font-medium">$45.00</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Cost</label>
                <p className="text-slate-900 font-medium">$28.50</p>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Inventory</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Weight (kg)</label>
                <p className="text-slate-900 font-medium">12.5</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Volume (m³)</label>
                <p className="text-slate-900 font-medium">0.015</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">HS Code</label>
                <p className="text-slate-900 font-medium">7214910000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className="h-12 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg transition-colors">
          On Hand: 450
        </button>
        <button className="h-12 bg-teal-100 hover:bg-teal-200 text-teal-700 font-semibold rounded-lg transition-colors">
          In/Out: 12
        </button>
        <button className="h-12 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold rounded-lg transition-colors">
          Sold: 5
        </button>
      </div>
    </div>
  )
}
