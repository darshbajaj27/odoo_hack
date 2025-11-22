"use client"

import { Search, Plus, MoreVertical, AlertTriangle, Loader } from "lucide-react"
import { useState, useEffect } from "react"
import { productsAPI } from "@/lib/api"
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
  const [showAddProductDialog, setShowAddProductDialog] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deviationAlert, setDeviationAlert] = useState<{ productId: number; productName: string; quantity: number; avgVelocity: number; deviation: number } | null>(null)
  const [newProduct, setNewProduct] = useState({ name: "", sku: "", category: "Raw Materials", quantity: 0 })

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

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await productsAPI.getAll(1, 100, searchTerm)
      // Ensure data is always an array
      const productsData = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : mockProducts)
      setProducts(productsData)
    } catch (err: any) {
      setError(err.message || "Failed to load products")
      // Use mock data as fallback
      setProducts(mockProducts)
    } finally {
      setLoading(false)
    }
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

  const handleAddProduct = async () => {
    try {
      await productsAPI.create({
        name: newProduct.name,
        sku: newProduct.sku,
        category: newProduct.category,
        onHand: newProduct.quantity,
      })
      setShowAddProductDialog(false)
      setNewProduct({ name: "", sku: "", category: "Raw Materials", quantity: 0 })
      fetchProducts()
    } catch (err: any) {
      alert(err.message || "Failed to add product")
    }
  }

  const filtered = Array.isArray(products) ? products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
  ) : []

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-white dark:bg-slate-950 text-gray-900 dark:text-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Products</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {loading ? "Loading..." : `${filtered.length} products available`}
          </p>
        </div>
        <button 
          onClick={() => setShowAddProductDialog(true)}
          className="h-11 bg-[#714B67] hover:bg-[#5A3D57] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 px-6"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-2">
          <AlertTriangle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-300">Error</h3>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Search & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg focus:border-[#714B67] focus:ring-2 focus:[ring-color:#714B67] focus:ring-opacity-20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 border border-gray-300 dark:border-slate-700 rounded-lg p-1 bg-gray-50 dark:bg-slate-900">
          <button
            onClick={() => setSelectedView("grid")}
            className={`px-3 py-1 rounded transition-colors ${
              selectedView === "grid" ? "bg-[#714B67] text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}
            title="Grid view"
          >
            ⊞
          </button>
          <button
            onClick={() => setSelectedView("table")}
            className={`px-3 py-1 rounded transition-colors ${
              selectedView === "table" ? "bg-[#714B67] text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}
            title="Table view"
          >
            ≡
          </button>
        </div>
      </div>

      {/* Grid View */}
      {selectedView === "grid" && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-[#714B67]" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all p-4 cursor-pointer hover:border-[#714B67]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 dark:from-indigo-900 to-purple-100 dark:to-purple-900 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
                  PKG
                </div>
                <button onClick={() => setShowQuantityInput(product.id)} className="p-1 hover:bg-purple-50 dark:hover:bg-slate-800 rounded transition-colors">
                  <MoreVertical size={18} className="text-gray-400 dark:text-gray-600" />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{product.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{product.sku}</p>
              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">On Hand</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{product.onHand}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Free to Use</span>
                  <span className="font-semibold text-[#714B67]">{product.freeToUse}</span>
                </div>
                {showQuantityInput === product.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">Move Quantity</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        value={inputQuantity}
                        onChange={(e) => setInputQuantity(e.target.value)}
                        placeholder="Enter quantity"
                        className="flex-1 h-9 px-3 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md text-sm focus:border-[#714B67] focus:ring-2 focus:[ring-color:#714B67] focus:ring-opacity-20 outline-none"
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
        </>
      )}

      {/* Table View */}
      {selectedView === "table" && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">SKU</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Category</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">On Hand</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Free to Use</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{product.category}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">{product.onHand}</td>
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
          <AlertDialogContent className="border-[#E8DDE6] dark:border-slate-700 bg-[#F5F1F4] dark:bg-slate-900">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-[#714B67]" />
                <AlertDialogTitle className="text-[#4A3055] dark:text-white">Quantity Deviation Alert</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-[#6B4E6A] dark:text-gray-400 mt-2">
                You are attempting to move a quantity significantly outside the product's historical average.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 my-4 border border-[#E8DDE6] dark:border-slate-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Product:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{deviationAlert.productName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Your Quantity:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{deviationAlert.quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Avg Daily Velocity:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{deviationAlert.avgVelocity.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Deviation:</span>
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

      {/* Add Product Dialog */}
      {showAddProductDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-md w-full space-y-4 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67] focus:ring-opacity-20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">SKU</label>
                <input
                  type="text"
                  placeholder="Enter SKU"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67] focus:ring-opacity-20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select 
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67] focus:ring-opacity-20 outline-none"
                >
                  <option>Raw Materials</option>
                  <option>Components</option>
                  <option>Finished Goods</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Initial Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full h-10 px-3 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67] focus:ring-opacity-20 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={() => setShowAddProductDialog(false)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-[#714B67] hover:bg-[#5A3D57] text-white rounded-lg transition-colors"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
