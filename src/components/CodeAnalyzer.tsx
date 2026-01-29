'use client'

import { useState } from 'react'
import { Play, FileText, Code, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { apiService } from '@/services/api'
import { AnalyzeRequest, AnalyzeResponse, AnalyzeFunctionRequest, FunctionPredictionResponse } from '@/types/api'
import toast from 'react-hot-toast'
import AnalysisResults from '@/components/AnalysisResults'
import { sampleContracts } from '@/utils/sampleContracts'

export default function CodeAnalyzer() {
  const [code, setCode] = useState('')
  const [contractName, setContractName] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalyzeResponse | FunctionPredictionResponse | null>(null)
  const [analysisType, setAnalysisType] = useState<'contract' | 'function'>('contract')
  const [selectedModel, setSelectedModel] = useState('auto')

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error('Please enter some Solidity code to analyze')
      return
    }

    setIsAnalyzing(true)
    setAnalysisResults(null)

    try {
      if (analysisType === 'contract') {
        const request: AnalyzeRequest = {
          code: code.trim(),
          contract_name: contractName || undefined,
          model: selectedModel === 'auto' ? undefined : selectedModel
        }
        
        const results = await apiService.analyzeContract(request)
        setAnalysisResults(results)
        toast.success(`Analysis complete! Found ${results.vulnerabilities_found} vulnerabilities`)
      } else {
        const request: AnalyzeFunctionRequest = {
          code: code.trim(),
          model: selectedModel === 'auto' ? undefined : selectedModel
        }
        
        const results = await apiService.analyzeFunction(request)
        setAnalysisResults(results)
        toast.success(`Function analysis complete! Result: ${results.prediction}`)
      }
    } catch (error: any) {
      console.error('Analysis failed:', error)
      
      if (error.response?.status === 503) {
        toast.error('Models not loaded. Please train models first using the notebooks.')
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.detail || 'Invalid code format')
      } else if (error.message?.includes('Backend server is not running')) {
        toast.error('Backend server is not running. Please start it first.')
      } else {
        toast.error('Analysis failed. Please try again.')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const loadSample = (sample: { name: string; code: string }) => {
    setCode(sample.code)
    setContractName(sample.name)
    setAnalysisResults(null)
    toast.success(`Loaded ${sample.name} sample`)
  }

  const clearCode = () => {
    setCode('')
    setContractName('')
    setAnalysisResults(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Code className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Code Analyzer</h2>
          </div>
          
          {/* Analysis Type Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setAnalysisType('contract')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                analysisType === 'contract'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-1" />
              Contract
            </button>
            <button
              onClick={() => setAnalysisType('function')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                analysisType === 'function'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code className="w-4 h-4 inline mr-1" />
              Function
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          {analysisType === 'contract' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Name (optional)
              </label>
              <input
                type="text"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                placeholder="e.g., VulnerableBank"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {analysisType === 'contract' ? 'Solidity Contract Code' : 'Solidity Function Code'}
              </label>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="auto">Auto (Best Model)</option>
                  <option value="ensemble_stacking">Ensemble</option>
                  <option value="codebert">CodeBERT</option>
                  <option value="lstm">LSTM</option>
                  <option value="cnn">CNN</option>
                </select>
              </div>
            </div>
            
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={analysisType === 'contract' 
                  ? 'pragma solidity ^0.8.0;\n\ncontract MyContract {\n    // Your contract code here...\n}'
                  : 'function withdraw(uint amount) public {\n    // Your function code here...\n}'
                }
                className="w-full h-64 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm resize-none"
              />
              
              {code && (
                <button
                  onClick={clearCode}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 bg-white rounded"
                  title="Clear code"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Sample Contracts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Load Sample {analysisType === 'contract' ? 'Contracts' : 'Functions'}
            </label>
            <div className="flex flex-wrap gap-2">
              {sampleContracts[analysisType].map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => loadSample(sample)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !code.trim()}
            className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Analyze {analysisType === 'contract' ? 'Contract' : 'Function'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {analysisResults && (
        <div className="border-t border-gray-200">
          <AnalysisResults 
            results={analysisResults}
            analysisType={analysisType}
          />
        </div>
      )}
    </div>
  )
}