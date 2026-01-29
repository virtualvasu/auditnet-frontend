'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { AnalyzeResponse, FunctionPredictionResponse, VulnerabilityType } from '@/types/api'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface AnalysisResultsProps {
  results: AnalyzeResponse | FunctionPredictionResponse
  analysisType: 'contract' | 'function'
}

function isContractAnalysis(results: any): results is AnalyzeResponse {
  return 'functions' in results
}

export default function AnalysisResults({ results, analysisType }: AnalysisResultsProps) {
  const [expandedFunctions, setExpandedFunctions] = useState<Record<string, boolean>>({})

  const toggleFunction = (functionName: string) => {
    setExpandedFunctions(prev => ({
      ...prev,
      [functionName]: !prev[functionName]
    }))
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'text-danger-700 bg-danger-50 border-danger-200'
      case 'medium': return 'text-warning-700 bg-warning-50 border-warning-200'
      case 'low': return 'text-success-700 bg-success-50 border-success-200'
      default: return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return <XCircle className="w-4 h-4 text-danger-600" />
      case 'medium': return <AlertTriangle className="w-4 h-4 text-warning-600" />
      case 'low': return <Info className="w-4 h-4 text-blue-600" />
      default: return <CheckCircle className="w-4 h-4 text-success-600" />
    }
  }

  if (analysisType === 'function' && !isContractAnalysis(results)) {
    // Single function analysis
    return (
      <div className="p-6">
        <div className="space-y-4">
          {/* Function Result Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Function Analysis Result</h3>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              results.prediction === 'Vulnerable' ? 'bg-danger-100 text-danger-700' : 'bg-success-100 text-success-700'
            }`}>
              {results.prediction === 'Vulnerable' ? (
                <XCircle className="w-4 h-4 mr-1" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-1" />
              )}
              {results.prediction}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Confidence Score</div>
              <div className="text-2xl font-bold text-gray-900">
                {(results.confidence * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Vulnerability Probability</div>
              <div className="text-2xl font-bold text-gray-900">
                {(results.vulnerability_probability * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Vulnerability Details */}
          {results.vulnerability_type && (
            <div className="border border-danger-200 rounded-lg p-4 bg-danger-50">
              <h4 className="font-medium text-danger-900 mb-2">Detected Vulnerability</h4>
              <div className="text-danger-700">
                <strong>Type:</strong> {results.vulnerability_type}
              </div>
              {results.recommendations && (
                <div className="mt-3">
                  <strong className="text-danger-900">Recommendations:</strong>
                  <p className="text-danger-700 mt-1">{results.recommendations}</p>
                </div>
              )}
            </div>
          )}

          {/* Model Info */}
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <strong>Model Used:</strong> {results.model_used} • 
            <strong> Analyzed at:</strong> {results.timestamp ? new Date(results.timestamp).toLocaleString() : 'Just now'}
          </div>
        </div>
      </div>
    )
  }

  if (isContractAnalysis(results)) {
    // Contract analysis
    return (
      <div className="p-6">
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600">Functions Analyzed</div>
              <div className="text-2xl font-bold text-gray-900">{results.functions_analyzed}</div>
            </div>
            <div className="bg-danger-50 rounded-lg p-4 text-center">
              <div className="text-sm text-danger-600">Vulnerabilities Found</div>
              <div className="text-2xl font-bold text-danger-700">{results.vulnerabilities_found}</div>
            </div>
            <div className="bg-warning-50 rounded-lg p-4 text-center">
              <div className="text-sm text-warning-600">Vulnerable Functions</div>
              <div className="text-2xl font-bold text-warning-700">{results.vulnerable_functions}</div>
            </div>
            <div className={`rounded-lg p-4 text-center ${getRiskColor(results.overall_risk)}`}>
              <div className="text-sm opacity-80">Overall Risk</div>
              <div className="text-2xl font-bold">{results.overall_risk}</div>
            </div>
          </div>

          {/* Contract Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Contract:</strong> {results.contract_name}</div>
              <div><strong>Model Used:</strong> {results.model_used}</div>
              <div><strong>Average Confidence:</strong> {(results.average_confidence * 100).toFixed(1)}%</div>
              <div><strong>Analyzed:</strong> {results.timestamp ? new Date(results.timestamp).toLocaleString() : 'Just now'}</div>
            </div>
          </div>

          {/* Functions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Function Analysis Details</h3>
            {results.functions.map((func, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                {/* Function Header */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleFunction(func.name)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      func.vulnerable ? 'bg-danger-500' : 'bg-success-500'
                    }`}></div>
                    <h4 className="font-medium text-gray-900">{func.name}</h4>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(func.risk_level)}`}>
                      {func.risk_level}
                    </div>
                    {func.vulnerable && func.vulnerabilities.length > 0 && (
                      <div className="text-xs text-danger-600 bg-danger-50 px-2 py-1 rounded">
                        {func.vulnerabilities.length} issue{func.vulnerabilities.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {(func.confidence * 100).toFixed(1)}% confident
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transform transition-transform ${
                      expandedFunctions[func.name] ? 'rotate-180' : ''
                    }`} />
                  </div>
                </div>

                {/* Function Details */}
                {expandedFunctions[func.name] && (
                  <div className="border-t border-gray-200 p-4 space-y-4">
                    {/* Vulnerabilities */}
                    {func.vulnerabilities.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-900">Detected Vulnerabilities</h5>
                        {func.vulnerabilities.map((vuln, vIndex) => (
                          <div key={vIndex} className="bg-danger-50 border border-danger-200 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                              {getSeverityIcon(vuln.severity)}
                              <div className="flex-1">
                                <div className="font-medium text-danger-900">{vuln.type}</div>
                                <div className="text-sm text-danger-700 mt-1">{vuln.description}</div>
                                {vuln.line_number && (
                                  <div className="text-xs text-danger-600 mt-1">Line {vuln.line_number}</div>
                                )}
                                {vuln.recommendation && (
                                  <div className="mt-2 p-2 bg-danger-100 rounded text-sm text-danger-800">
                                    <strong>Recommendation:</strong> {vuln.recommendation}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Code */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Function Code</h5>
                      <div className="relative">
                        <SyntaxHighlighter
                          language="solidity"
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem'
                          }}
                          showLineNumbers
                          startingLineNumber={func.start_line}
                          className="dark-scrollbar"
                        >
                          {func.code}
                        </SyntaxHighlighter>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                      <strong>Function Details:</strong> {func.code_length} characters • 
                      Starts at line {func.start_line} • 
                      Risk Level: {func.risk_level} • 
                      Confidence: {(func.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}