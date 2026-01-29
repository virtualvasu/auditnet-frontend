'use client'

import { useState } from 'react'
import { Cpu, TrendingUp, Award, Info } from 'lucide-react'
import { ModelInfo } from '@/types/api'

interface ModelSelectorProps {
  models: ModelInfo[]
}

export default function ModelSelector({ models }: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<string>('auto')
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({})

  const toggleDetails = (modelName: string) => {
    setShowDetails(prev => ({
      ...prev,
      [modelName]: !prev[modelName]
    }))
  }

  const getModelTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ensemble': return 'bg-purple-100 text-purple-700'
      case 'transformer': return 'bg-blue-100 text-blue-700'
      case 'cnn': return 'bg-green-100 text-green-700'
      case 'lstm': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatPerformanceScore = (score: number): string => {
    return (score * 100).toFixed(1) + '%'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <Cpu className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Available Models</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {models.length} model{models.length !== 1 ? 's' : ''} trained and ready for analysis
        </p>
      </div>

      <div className="p-6 space-y-4">
        {/* Auto Selection */}
        <div className="border-2 border-primary-200 bg-primary-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-primary-600" />
              <div>
                <h3 className="font-medium text-primary-900">Auto (Recommended)</h3>
                <p className="text-sm text-primary-700">Automatically selects the best available model</p>
              </div>
            </div>
            <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              DEFAULT
            </div>
          </div>
        </div>

        {/* Model List */}
        {models.length > 0 ? (
          <div className="space-y-3">
            {models
              .sort((a, b) => {
                // Sort by availability first, then by accuracy if available
                if (a.available !== b.available) return a.available ? -1 : 1
                if (a.performance?.accuracy && b.performance?.accuracy) {
                  return b.performance.accuracy - a.performance.accuracy
                }
                return 0
              })
              .map((model) => (
                <div 
                  key={model.name} 
                  className={`border rounded-lg transition-colors ${
                    model.available ? 'border-gray-200 hover:border-gray-300' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`w-3 h-3 rounded-full ${
                          model.available ? 'bg-success-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-medium ${
                              model.available ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {model.name}
                            </h3>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${getModelTypeColor(model.type)}`}>
                              {model.type.replace('_', ' ').toUpperCase()}
                            </div>
                            {model.description?.includes('Best') && (
                              <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                                BEST
                              </div>
                            )}
                          </div>
                          {model.description && (
                            <p className={`text-sm mt-1 ${
                              model.available ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {model.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Performance Preview */}
                      {model.performance && model.available && (
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-right">
                            <div className="text-gray-900 font-medium">
                              {formatPerformanceScore(model.performance.accuracy)}
                            </div>
                            <div className="text-gray-500">Accuracy</div>
                          </div>
                          <button
                            onClick={() => toggleDetails(model.name)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Info className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {/* Unavailable indicator */}
                      {!model.available && (
                        <div className="text-sm text-gray-500">
                          Not Available
                        </div>
                      )}
                    </div>

                    {/* Detailed Performance Metrics */}
                    {showDetails[model.name] && model.performance && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Accuracy</span>
                              <span className="text-sm font-medium">{formatPerformanceScore(model.performance.accuracy)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Precision</span>
                              <span className="text-sm font-medium">{formatPerformanceScore(model.performance.precision)}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">F1 Score</span>
                              <span className="text-sm font-medium">{formatPerformanceScore(model.performance.f1_score)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Recall</span>
                              <span className="text-sm font-medium">{formatPerformanceScore(model.performance.recall)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Visual Performance Bar */}
                        <div className="mt-3">
                          <div className="text-xs text-gray-600 mb-1">Overall Performance Score</div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full transition-all"
                              style={{ 
                                width: `${(model.performance.accuracy + model.performance.f1_score) / 2 * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No trained models available</p>
            <p className="text-sm mt-1">Train models using the provided notebooks</p>
          </div>
        )}

        {/* Model Status Summary */}
        {models.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {models.filter(m => m.available).length} Available
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-600">
                    {models.filter(m => !m.available).length} Unavailable
                  </span>
                </div>
              </div>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}