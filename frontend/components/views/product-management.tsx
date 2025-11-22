"use client"

import { Search, Plus, MoreVertical } from "lucide-react"
import { useState } from "react"

interface ProductManagementProps {
  onNavigate: (view: string) => void
}

const mockProducts = [
  { id: 1, sku: "SKU-001", name: "Steel Rods 12mm", category: "Raw Materials", onHand: 450, freeToUse: 420 },
  { id: 2, sku: "SKU-002", name: "Concrete Mix 40kg", category: "Raw Materials", onHand: 320, freeToUse: 280 },
  { id: 3, sku: "SKU-003", name: "Rebar 16mm", category: "Raw Materials", onHand: 180, freeToUse: 150 },
  { id: 4, sku: "SKU-004", name: "Azure Interior Panels", category: "Components", onHand: 95, freeToUse: 85 },
  { id: 5, sku: "SKU-005", name: "Fasteners Box", category: "Components", onHand: 520, freeToUse: 480 },
]

export function ProductManagement({ onNavigate }: ProductManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedView, setSelectedView] = useState<"grid" | "table">("grid")

  const filtered = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Products</h1>
          <p className="text-slate-600 mt-1">{filtered.length} products available</p>
        </div>
        <button className="h-11 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 px-6">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-slate-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 border border-slate-300 rounded-lg p-1">
          <button
            onClick={() => setSelectedView("grid")}
            className={`px-3 py-1 rounded transition-colors ${
              selectedView === "grid" ? "bg-teal-700 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
            title="Grid view"
          >
            ⊞
          </button>
          <button
            onClick={() => setSelectedView("table")}
            className={`px-3 py-1 rounded transition-colors ${
              selectedView === "table" ? "bg-teal-700 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
            title="Table view"
          >
            ≡
          </button>
        </div>
      </div>

      {/* Grid View */}
      {selectedView === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 font-semibold">
                  IMG
                </div>
                <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                  <MoreVertical size={18} className="text-slate-400" />
                </button>
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">{product.name}</h3>
              <p className="text-xs text-slate-500 mb-4">{product.sku}</p>
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">On Hand</span>
                  <span className="font-semibold text-slate-900">{product.onHand}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Free to Use</span>
                  <span className="font-semibold text-emerald-600">{product.freeToUse}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {selectedView === "table" && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">SKU</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Category</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">On Hand</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Free to Use</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{product.category}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-900">{product.onHand}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-emerald-600">{product.freeToUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
