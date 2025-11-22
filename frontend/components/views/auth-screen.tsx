"use client"

import type React from "react"

import { useState } from "react"
import { Package, AlertCircle } from "lucide-react"
import { authAPI } from "@/lib/api"

interface AuthScreenProps {
  onLogin: (email: string) => void
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [tab, setTab] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await authAPI.login(email, password)
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token)
        if (response.user?.name) {
          localStorage.setItem('userName', response.user.name)
        }
      }

      setSuccess("Login successful! Redirecting...")
      setEmail("")
      setPassword("")
      
      // Call the onLogin callback with user info
      onLogin(response.user?.email || email)
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await authAPI.signup(email, password, name)
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token)
        if (response.user?.name) {
          localStorage.setItem('userName', response.user.name)
        }
      }

      setSuccess("Account created successfully! Redirecting...")
      setEmail("")
      setPassword("")
      setName("")
      
      // Call the onLogin callback
      onLogin(response.user?.email || email)
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tab === "login") {
      handleLogin(e)
    } else {
      handleSignup(e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-[#714B67] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#714B67] to-[#5A3D57] rounded-xl flex items-center justify-center shadow-lg">
            <Package size={32} className="text-white" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-slate-800">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 tracking-tight">StockMaster</h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-slate-800">
            <button
              onClick={() => {
                setTab("login")
                setError("")
                setSuccess("")
              }}
              className={`flex-1 py-3 font-semibold transition-colors border-b-2 ${
                tab === "login"
                  ? "text-[#714B67] border-[#714B67]"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setTab("signup")
                setError("")
                setSuccess("")
              }}
              className={`flex-1 py-3 font-semibold transition-colors border-b-2 ${
                tab === "signup"
                  ? "text-[#714B67] border-[#714B67]"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-2">
              <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {tab === "signup" && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-11 px-4 border border-gray-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67] focus:ring-opacity-20 outline-none transition-all"
                  required={tab === "signup"}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-4 border border-gray-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:[border-color:#714B67] focus:ring-2 focus:[ring-color:#714B67] focus:ring-opacity-20 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-11 px-4 border border-gray-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:[border-color:#714B67] focus:ring-2 focus:[ring-color:#714B67] focus:ring-opacity-20 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {tab === "login" && (
              <div className="text-right">
                <button type="button" className="text-sm text-[#714B67] hover:text-[#5A3D57] font-medium">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#714B67] hover:bg-[#5A3D57] disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? "Processing..." : (tab === "login" ? "Sign In" : "Create Account")}
            </button>
          </form>

          {/* Demo Login */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">Demo credentials:</p>
            <button
              onClick={() => {
                setEmail("manager@stockmaster.com")
                setPassword("demo123")
              }}
              className="w-full text-sm py-2 text-[#714B67] hover:bg-purple-50 dark:hover:bg-slate-800 rounded transition-colors"
            >
              Use Demo Email
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
