'use client'

import { useState, useEffect } from 'react'
import { Shield, Activity, FileCode, TrendingUp, AlertTriangle, CheckCircle, XCircle, Cpu, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import CodeAnalyzer from '@/components/CodeAnalyzer'
import ModelSelector from '@/components/ModelSelector'
import VulnerabilityDashboard from '@/components/VulnerabilityDashboard'
import { apiService } from '@/services/api'
import { HealthStatus, ModelInfo } from '@/types/api'
import toast from 'react-hot-toast'

export default function AuditPage() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [models, setModels] = useState<ModelInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      // Load health status and models in parallel
      const [health, modelsData] = await Promise.all([
        apiService.getHealth(),
        apiService.getModels()
      ])
      
      setHealthStatus(health)
      setModels(modelsData.models)
      
      if (!health.models_loaded) {
        toast.error('Models not loaded. Please train models first using the notebooks.')
      } else {
        toast.success('API connected successfully!')
      }
    } catch (error) {
      console.error('Failed to load initial data:', error)
      toast.error('Failed to connect to backend API')
    } finally {
      setLoading(false)
    }
  }

  const AuditNetLogo = () => (
    <div className="relative">
      {/* Main shield */}
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
        <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      {/* Neural network dots */}
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
        <div className="w-1 h-1 bg-white rounded-full m-0.5"></div>
      </div>
      <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
        <div className="w-1 h-1 bg-white rounded-full m-0.5"></div>
      </div>
    </div>
  )

  const StatusBadge = ({ status }: { status: string }) => {
    const isOperational = status === 'operational'
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        isOperational 
          ? 'bg-success-100 text-success-700' 
          : 'bg-warning-100 text-warning-700'
      }`}>
        {isOperational ? (
          <CheckCircle className="w-4 h-4 mr-1" />
        ) : (
          <AlertTriangle className="w-4 h-4 mr-1" />
        )}
        {status}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to API...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
                <AuditNetLogo />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    AuditNet
                  </h1>
                  <p className="text-sm text-gray-600">Security Audit Tool</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {healthStatus && <StatusBadge status={healthStatus.status} />}
              <div className="flex items-center text-sm text-gray-600">
                <Cpu className="w-4 h-4 mr-1" />
                {healthStatus?.device || 'Unknown'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-primary-50 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">API Status</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {healthStatus?.models_loaded ? 'Ready' : 'Demo Mode'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-success-50 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Models Available</p>
                <p className="text-2xl font-semibold text-gray-900">{models.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-warning-50 p-2 rounded-lg">
                <FileCode className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vulnerability Types</p>
                <p className="text-2xl font-semibold text-gray-900">7</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-danger-50 p-2 rounded-lg">
                <XCircle className="h-6 w-6 text-danger-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Device</p>
                <p className="text-2xl font-semibold text-gray-900 capitalize">
                  {healthStatus?.device || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analyzer */}
          <div className="lg:col-span-2">
            <CodeAnalyzer />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ModelSelector models={models} />
            <VulnerabilityDashboard />
          </div>
        </div>
      </main>
    </div>
  )
}