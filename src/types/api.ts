export interface HealthStatus {
  status: string
  models_loaded: boolean
  device: string
  version: string
}

export interface ModelInfo {
  name: string
  type: string
  available: boolean
  performance?: {
    accuracy: number
    f1_score: number
    precision: number
    recall: number
  }
  description?: string
}

export interface ModelsListResponse {
  models: ModelInfo[]
  default_model: string
  total_models: number
}

export interface VulnerabilityInfo {
  type: string
  title: string
  description: string
  severity: string
}

export interface VulnerabilitiesListResponse {
  total_types: number
  vulnerabilities: VulnerabilityInfo[]
}

export interface VulnerabilityType {
  type: string
  severity: string
  description: string
  line_number?: number
  pattern_matched?: string
  recommendation?: string
}

export interface FunctionAnalysis {
  name: string
  code: string
  vulnerable: boolean
  risk_level: string
  confidence: number
  vulnerabilities: VulnerabilityType[]
  start_line: number
  code_length: number
}

export interface AnalyzeRequest {
  code: string
  contract_name?: string
  model?: string
}

export interface AnalyzeResponse {
  status: string
  contract_name: string
  timestamp?: string
  functions_analyzed: number
  vulnerabilities_found: number
  vulnerable_functions: number
  functions: FunctionAnalysis[]
  overall_risk: string
  average_confidence: number
  model_used: string
}

export interface AnalyzeFunctionRequest {
  code: string
  model?: string
}

export interface FunctionPredictionResponse {
  status: string
  function_code: string
  prediction: string
  confidence: number
  vulnerability_probability: number
  vulnerability_type?: string
  recommendations?: string
  model_used: string
  timestamp?: string
}

export interface ApiInfo {
  name: string
  version: string
  description: string
  model_loaded: boolean
  device: string
  current_model: string
  supported_vulnerabilities: string[]
  api_endpoints: Record<string, string>
}