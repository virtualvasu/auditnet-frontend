import axios from 'axios'
import {
  HealthStatus,
  ModelsListResponse,
  VulnerabilitiesListResponse,
  AnalyzeRequest,
  AnalyzeResponse,
  AnalyzeFunctionRequest,
  FunctionPredictionResponse,
  ApiInfo
} from '@/types/api'

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Response Error:', error)
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Backend server is not running. Please start the backend first.')
    }
    throw error
  }
)

export const apiService = {
  // Health check
  async getHealth(): Promise<HealthStatus> {
    const response = await api.get<HealthStatus>('/health')
    return response.data
  },

  // Get available models
  async getModels(): Promise<ModelsListResponse> {
    const response = await api.get<ModelsListResponse>('/models')
    return response.data
  },

  // Get vulnerability types
  async getVulnerabilities(): Promise<VulnerabilitiesListResponse> {
    const response = await api.get<VulnerabilitiesListResponse>('/vulnerabilities')
    return response.data
  },

  // Analyze contract
  async analyzeContract(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    const response = await api.post<AnalyzeResponse>('/analyze', request)
    return response.data
  },

  // Analyze single function
  async analyzeFunction(request: AnalyzeFunctionRequest): Promise<FunctionPredictionResponse> {
    const response = await api.post<FunctionPredictionResponse>('/analyze-function', request)
    return response.data
  },

  // Get API info
  async getInfo(): Promise<ApiInfo> {
    const response = await api.get<ApiInfo>('/info')
    return response.data
  },

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.getHealth()
      return true
    } catch {
      return false
    }
  },
}

export default apiService