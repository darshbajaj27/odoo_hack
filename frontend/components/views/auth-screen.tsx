"use client"

import type React from "react"

import { useState } from "react"
import { Package } from "lucide-react"

interface AuthScreenProps {
  onLogin: (email: string) => void
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [tab, setTab] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      onLogin(email)
      setEmail("")
      setPassword("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-teal-700 rounded-xl flex items-center justify-center">
            <Package size={32} className="text-white" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <h1 className="text-3xl font-bold text-center text-slate-900 mb-8 tracking-tight">StockMaster</h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-200">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-3 font-semibold transition-colors border-b-2 ${
                tab === "login"
                  ? "text-teal-700 border-teal-700"
                  : "text-slate-500 border-transparent hover:text-slate-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`flex-1 py-3 font-semibold transition-colors border-b-2 ${
                tab === "signup"
                  ? "text-teal-700 border-teal-700"
                  : "text-slate-500 border-transparent hover:text-slate-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {tab === "login" && (
              <div className="text-right">
                <button type="button" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-11 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition-colors"
            >
              {tab === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Demo Login */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center mb-3">Demo credentials:</p>
            <button
              onClick={() => {
                setEmail("manager@stockmaster.com")
                setPassword("demo123")
              }}
              className="w-full text-sm py-2 text-teal-600 hover:bg-teal-50 rounded transition-colors"
            >
              Use Demo Email
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
