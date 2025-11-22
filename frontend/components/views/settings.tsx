"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, X } from "lucide-react"

interface SettingsProps {
  onNavigate: (view: string) => void
}

interface Warehouse {
  id: string
  name: string
  shortCode: string
  address: string
}

interface Location {
  id: string
  name: string
  type: "Internal" | "Vendor" | "Customer" | "Inventory Loss"
  parentWarehouse: string
}

export function Settings({ onNavigate }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<"warehouses" | "locations">("warehouses")
  const [showWarehouseDialog, setShowWarehouseDialog] = useState(false)
  const [showLocationDialog, setShowLocationDialog] = useState(false)
  const [newWarehouse, setNewWarehouse] = useState({ name: "", shortCode: "", address: "" })
  const [newLocation, setNewLocation] = useState({ name: "", type: "Internal", parentWarehouse: "" })

  // Mock data
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    { id: "1", name: "San Francisco HQ", shortCode: "SF", address: "123 Market St, San Francisco, CA 94102" },
    { id: "2", name: "Los Angeles DC", shortCode: "LA", address: "456 Venice Blvd, Los Angeles, CA 90015" },
    { id: "3", name: "Seattle Hub", shortCode: "SEA", address: "789 Pike St, Seattle, WA 98101" },
  ])

  const [locations, setLocations] = useState<Location[]>([
    { id: "1", name: "WH/Stock", type: "Internal", parentWarehouse: "San Francisco HQ" },
    { id: "2", name: "WH/Receiving", type: "Internal", parentWarehouse: "San Francisco HQ" },
    { id: "3", name: "Vendor/Azure Interior", type: "Vendor", parentWarehouse: "Los Angeles DC" },
    { id: "4", name: "Customer/RetailCo", type: "Customer", parentWarehouse: "Seattle Hub" },
    { id: "5", name: "Loss/Damaged", type: "Inventory Loss", parentWarehouse: "San Francisco HQ" },
  ])

  const handleAddWarehouse = () => {
    if (newWarehouse.name && newWarehouse.shortCode && newWarehouse.address) {
      const warehouse: Warehouse = {
        id: String(warehouses.length + 1),
        ...newWarehouse,
      }
      setWarehouses([...warehouses, warehouse])
      setNewWarehouse({ name: "", shortCode: "", address: "" })
      setShowWarehouseDialog(false)
    }
  }

  const handleDeleteWarehouse = (id: string) => {
    setWarehouses(warehouses.filter((w) => w.id !== id))
  }

  const handleAddLocation = () => {
    if (newLocation.name && newLocation.type && newLocation.parentWarehouse) {
      const location: Location = {
        id: String(locations.length + 1),
        ...newLocation,
      }
      setLocations([...locations, location])
      setNewLocation({ name: "", type: "Internal", parentWarehouse: "" })
      setShowLocationDialog(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Internal":
        return "bg-blue-100 text-blue-800"
      case "Vendor":
        return "bg-purple-100 text-purple-800"
      case "Customer":
        return "bg-orange-100 text-orange-800"
      case "Inventory Loss":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-white dark:bg-slate-950 text-gray-900 dark:text-white min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Settings & Warehouse</h1>
        <p className="text-slate-600 dark:text-gray-400 mt-2">Manage warehouses and storage locations</p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          {(["warehouses", "locations"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 sm:px-6 py-4 text-sm sm:text-base font-semibold transition-colors ${
                activeTab === tab
                  ? "text-teal-700 dark:text-teal-300 border-b-2 border-teal-700 bg-teal-50 dark:bg-teal-950"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {/* Warehouses Tab */}
          {activeTab === "warehouses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Warehouse Locations</h2>
                <button
                  onClick={() => setShowWarehouseDialog(true)}
                  className="h-10 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Warehouse
                </button>
              </div>

              {/* Warehouse Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {warehouses.map((warehouse) => (
                  <div
                    key={warehouse.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{warehouse.name}</h3>
                    </div>
                    <div className="p-4 space-y-3 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 text-sm font-semibold rounded">
                          {warehouse.shortCode}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-gray-400">{warehouse.address}</p>
                    </div>
                    <div className="p-4 flex items-center justify-end gap-2">
                      <button className="h-8 px-3 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium flex items-center gap-1">
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteWarehouse(warehouse.id)}
                        className="h-8 px-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Warehouse Dialog */}
              {showWarehouseDialog && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-md w-full max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add New Warehouse</h3>
                      <button
                        onClick={() => setShowWarehouseDialog(false)}
                        className="text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Warehouse Name</label>
                        <input
                          type="text"
                          value={newWarehouse.name}
                          onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="e.g., New York DC"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Short Code</label>
                        <input
                          type="text"
                          value={newWarehouse.shortCode}
                          onChange={(e) => setNewWarehouse({ ...newWarehouse, shortCode: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="e.g., NY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Address</label>
                        <textarea
                          value={newWarehouse.address}
                          onChange={(e) => setNewWarehouse({ ...newWarehouse, address: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder="Enter full address"
                        />
                      </div>
                      <button
                        onClick={handleAddWarehouse}
                        className="w-full h-10 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors"
                      >
                        Add Warehouse
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Locations Tab */}
          {activeTab === "locations" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Storage Locations</h2>
                <button
                  onClick={() => setShowLocationDialog(true)}
                  className="h-10 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Location
                </button>
              </div>

              {/* Locations Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-gray-300">Location Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-gray-300">Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-gray-300">Parent Warehouse</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locations.map((location) => (
                      <tr key={location.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">{location.name}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(location.type)}`}
                          >
                            {location.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-gray-400">{location.parentWarehouse}</td>
                        <td className="px-4 py-3">
                          <button className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Location Dialog */}
              {showLocationDialog && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-md w-full max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add New Location</h3>
                      <button
                        onClick={() => setShowLocationDialog(false)}
                        className="text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Location Name</label>
                        <input
                          type="text"
                          value={newLocation.name}
                          onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="e.g., WH/Stock"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Location Type</label>
                        <select
                          value={newLocation.type}
                          onChange={(e) =>
                            setNewLocation({
                              ...newLocation,
                              type: e.target.value as "Internal" | "Vendor" | "Customer" | "Inventory Loss",
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="Internal">Internal</option>
                          <option value="Vendor">Vendor</option>
                          <option value="Customer">Customer</option>
                          <option value="Inventory Loss">Inventory Loss</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Parent Warehouse</label>
                        <select
                          value={newLocation.parentWarehouse}
                          onChange={(e) => setNewLocation({ ...newLocation, parentWarehouse: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Select a warehouse</option>
                          {warehouses.map((w) => (
                            <option key={w.id} value={w.name}>
                              {w.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={handleAddLocation}
                        className="w-full h-10 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors"
                      >
                        Add Location
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}