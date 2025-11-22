"use client"

import { Search, Plus, MoreVertical, AlertTriangle } from "lucide-react"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface HistoricalData {
  id: number
  sku: string
  name: string
  avgMonthlyVelocity: number
  category: string
}

interface ProductManagementProps {
  onNavigate: (view: string) => void
  historicalData?: HistoricalData[]
}

const mockProducts = [
  { id: 1, sku: "SKU-001", name: "Steel Rods 12mm", category: "Raw Materials", onHand: 450, freeToUse: 420 },
  { id: 2, sku: "SKU-002", name: "Concrete Mix 40kg", category: "Raw Materials", onHand: 320, freeToUse: 280 },
  { id: 3, sku: "SKU-003", name: "Rebar 16mm", category: "Raw Materials", onHand: 180, freeToUse: 150 },
  { id: 4, sku: "SKU-004", name: "Azure Interior Panels", category: "Components", onHand: 95, freeToUse: 85 },
  { id: 5, sku: "SKU-005", name: "Fasteners Box", category: "Components", onHand: 520, freeToUse: 480 },
]

export function ProductManagement({ onNavigate, historicalData = [] }: ProductManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedView, setSelectedView] = useState<"grid" | "table">("grid")
  const [showQuantityInput, setShowQuantityInput] = useState<number | null>(null)
  const [inputQuantity, setInputQuantity] = useState("")
  const [deviationAlert, setDeviationAlert] = useState<{ productId: number; productName: string; quantity: number; avgVelocity: number; deviation: number } | null>(null)

  // Velocity Threshold Monitoring: Check if quantity significantly deviates from historical average
  const checkVelocityDeviation = (productId: number, quantity: number) => {
    const historical = historicalData.find((h) => h.id === productId)
    if (!historical) return null

    const avgMonthly = historical.avgMonthlyVelocity
    const dailyAverage = avgMonthly / 30
    // Flag deviation if quantity is more than 150% of daily average or less than 50% of daily average
    const deviationThreshold = dailyAverage * 1.5
    const deviationPercentage = ((quantity - dailyAverage) / dailyAverage) * 100

    if (quantity > deviationThreshold || quantity < dailyAverage * 0.5) {
      return {
        productId,
        productName: historical.name,
        quantity,
        avgVelocity: dailyAverage,
        deviation: deviationPercentage,
      }
    }
    return null
  }

  const handleQuantitySubmit = (productId: number, quantity: number) => {
    const deviation = checkVelocityDeviation(productId, quantity)
    if (deviation) {
      setDeviationAlert(deviation)
    } else {
      // Proceed with the operation
      setShowQuantityInput(null)
      setInputQuantity("")
      alert(`Quantity ${quantity} successfully recorded for product ${productId}`)
    }
  }

  const filtered = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-600 mt-1">{filtered.length} products available</p>
        </div>
        <button className="h-11 bg-[#714B67] hover:bg-[#5A3D57] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 px-6">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 border border-gray-300 rounded-lg p-1 bg-gray-50">
          <button
            onClick={() => setSelectedView("grid")}
            className={`px-3 py-1 rounded transition-colors ${
              selectedView === "grid" ? "bg-[#714B67] text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
            }`}
            title="Grid view"
          >
            ⊞
          </button>
          <button
            onClick={() => setSelectedView("table")}
            className={`px-3 py-1 rounded transition-colors ${
              selectedView === "table" ? "bg-[#714B67] text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
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
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all p-4 cursor-pointer hover:border-[#714B67]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-indigo-600 font-semibold text-sm">
                  PKG
                </div>
                <button onClick={() => setShowQuantityInput(product.id)} className="p-1 hover:bg-purple-50 rounded transition-colors">
                  <MoreVertical size={18} className="text-gray-400" />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{product.sku}</p>
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">On Hand</span>
                  <span className="font-semibold text-gray-900">{product.onHand}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Free to Use</span>
                  <span className="font-semibold text-[#714B67]">{product.freeToUse}</span>
                </div>
                {showQuantityInput === product.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Move Quantity</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        value={inputQuantity}
                        onChange={(e) => setInputQuantity(e.target.value)}
                        placeholder="Enter quantity"
                        className="flex-1 h-9 px-3 border border-gray-300 rounded-md text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 outline-none"
                      />
                      <button
                        onClick={() => {
                          if (inputQuantity) {
                            handleQuantitySubmit(product.id, parseInt(inputQuantity))
                          }
                        }}
                        className="h-9 px-3 bg-[#714B67] hover:bg-[#5A3D57] text-white text-sm rounded-md transition-all"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {selectedView === "table" && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SKU</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">On Hand</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Free to Use</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-purple-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">{product.onHand}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-[#714B67]">{product.freeToUse}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setShowQuantityInput(product.id)}
                        className="text-[#714B67] hover:text-[#5A3D57] text-sm font-medium hover:underline"
                      >
                        Move
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quantity Deviation Alert Dialog */}
      {deviationAlert && (
        <AlertDialog open={!!deviationAlert} onOpenChange={() => setDeviationAlert(null)}>
          <AlertDialogContent className="border-[#E8DDE6] bg-[#F5F1F4]">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-[#714B67]" />
                <AlertDialogTitle className="text-[#4A3055]">Quantity Deviation Alert</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-[#6B4E6A] mt-2">
                You are attempting to move a quantity significantly outside the product's historical average.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="bg-white rounded-lg p-4 my-4 border border-[#E8DDE6] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Product:</span>
                <span className="font-semibold text-gray-900">{deviationAlert.productName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Your Quantity:</span>
                <span className="font-semibold text-gray-900">{deviationAlert.quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Daily Velocity:</span>
                <span className="font-semibold text-gray-900">{deviationAlert.avgVelocity.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Deviation:</span>
                <span className={`font-semibold ${deviationAlert.deviation > 0 ? "text-red-600" : "text-orange-600"}`}>
                  {deviationAlert.deviation > 0 ? "+" : ""}{deviationAlert.deviation.toFixed(1)}%
                </span>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => { setDeviationAlert(null); setShowQuantityInput(null); setInputQuantity(""); }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  // User confirmed despite the deviation
                  alert(`Quantity ${deviationAlert.quantity} recorded with deviation warning acknowledged.`)
                  setDeviationAlert(null)
                  setShowQuantityInput(null)
                  setInputQuantity("")
                }}
                className="bg-[#714B67] hover:bg-[#5A3D57] text-white"
              >
                Proceed Anyway
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
