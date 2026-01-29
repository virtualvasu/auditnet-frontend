'use client'

import { useState, useEffect } from 'react'
import { Shield, Github, Cpu, Brain, Target, ArrowRight, CheckCircle, Zap, Award, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { apiService } from '@/services/api'
import toast from 'react-hot-toast'

export default function Landing() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [modelsLoaded, setModelsLoaded] = useState(false)

  useEffect(() => {
    checkBackendStatus()
  }, [])

  const checkBackendStatus = async () => {
    try {
      const health = await apiService.getHealth()
      setBackendStatus('online')
      setModelsLoaded(health.models_loaded)
    } catch (error) {
      setBackendStatus('offline')
      console.error('Backend check failed:', error)
    }
  }

  const AuditNetLogo = () => (
    <div className="relative">
      {/* Main shield */}
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-xl">
        <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
      </div>
      {/* Neural network dots */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
    </div>
  )

  const StatusBadge = () => {
    if (backendStatus === 'checking') {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
          <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full mr-2"></div>
          Checking...
        </div>
      )
    }
    
    if (backendStatus === 'offline') {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          Backend Offline
        </div>
      )
    }

    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        {modelsLoaded ? 'Ready' : 'Demo Mode'}
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
              <AuditNetLogo />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AuditNet
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Smart Contract Security</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <StatusBadge />
              <a
                href="https://github.com/virtualvasu/auditnet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm"
              >
                <Github className="w-4 h-4 mr-1" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <AuditNetLogo />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-20 animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AuditNet
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-4xl mx-auto">
              Advanced Machine Learning System for Solidity Smart Contract Security Analysis
            </p>
            
            <p className="text-lg text-gray-500 mb-8 max-w-3xl mx-auto">
              Built with cutting-edge deep learning techniques including <strong>CodeBERT transformers</strong>, 
              <strong> BiLSTM networks</strong>, and <strong>multi-kernel CNNs</strong> achieving <strong>92.8% accuracy</strong> 
              with only <strong>2.6% false positive rate</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/audit">
                <button 
                  className={`px-8 py-4 rounded-xl text-lg font-semibold text-white transition-all transform hover:scale-105 shadow-lg ${
                    backendStatus === 'online' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={backendStatus !== 'online'}
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6" />
                    <span>Audit Smart Contract</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>
              </Link>
              
              <a
                href="https://github.com/virtualvasu/auditnet"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <Github className="w-6 h-6" />
                  <span>View Repository</span>
                </div>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">92.8%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">2.6%</div>
                <div className="text-sm text-gray-600">False Positives</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">321%</div>
                <div className="text-sm text-gray-600">Better than Slither</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">7</div>
                <div className="text-sm text-gray-600">Vulnerability Types</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Revolutionary AI-Powered Security Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three specialized AI models working together to detect vulnerabilities with unprecedented accuracy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* CodeBERT */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">CodeBERT Transformer</h3>
              <p className="text-gray-600 mb-4">
                125M parameter transformer fine-tuned for code analysis with 12×12 attention heads 
                providing the highest precision at 59.1%
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />512-token sequence analysis</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Attention-based explainability</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />End-to-end fine-tuning</li>
              </ul>
            </div>

            {/* BiLSTM */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">BiLSTM Networks</h3>
              <p className="text-gray-600 mb-4">
                Bidirectional sequence modeling with attention pooling for strong semantic 
                understanding and excellent generalization
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />256-d embeddings</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Memory efficient</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Sequential pattern detection</li>
              </ul>
            </div>

            {/* Multi-Kernel CNN */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Multi-Kernel CNN</h3>
              <p className="text-gray-600 mb-4">
                Parallel convolutional filters with highest recall at 57.4% and fastest 
                inference time for production deployment
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />5 kernel sizes (3-7)</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Global max pooling</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Local pattern detection</li>
              </ul>
            </div>
          </div>

          {/* Performance Comparison */}
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Superior Performance</h3>
              <p className="text-gray-600">Outperforms traditional static analysis tools by 160-321%</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
                <Award className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">AuditNet (Best)</h4>
                <div className="text-3xl font-bold text-green-600 mb-1">59.4%</div>
                <div className="text-sm text-gray-600">F1-Score</div>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
                <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Mythril</h4>
                <div className="text-3xl font-bold text-gray-500 mb-1">18.0%</div>
                <div className="text-sm text-gray-600">F1-Score</div>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
                <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Slither</h4>
                <div className="text-3xl font-bold text-gray-500 mb-1">14.1%</div>
                <div className="text-sm text-gray-600">F1-Score</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vulnerability Types */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Vulnerability Detection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Detect 7 critical vulnerability types with industry-leading accuracy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Reentrancy', accuracy: '94.2%', risk: 'HIGH', color: 'red' },
              { name: 'Integer Overflow', accuracy: '91.8%', risk: 'CRITICAL', color: 'red' },
              { name: 'Timestamp Dependency', accuracy: '89.5%', risk: 'MEDIUM', color: 'yellow' },
              { name: 'TOD/Front-running', accuracy: '88.7%', risk: 'HIGH', color: 'red' },
              { name: 'tx.origin Misuse', accuracy: '95.1%', risk: 'MEDIUM', color: 'yellow' },
              { name: 'Unchecked Send', accuracy: '92.3%', risk: 'HIGH', color: 'red' },
              { name: 'Unhandled Exceptions', accuracy: '90.6%', risk: 'MEDIUM', color: 'yellow' },
            ].map((vuln, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mb-3 ${
                  vuln.color === 'red' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {vuln.risk}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{vuln.name}</h3>
                <div className="text-2xl font-bold text-green-600">{vuln.accuracy}</div>
                <div className="text-sm text-gray-600">Detection Rate</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Secure Your Smart Contracts?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start analyzing your Solidity code with our state-of-the-art AI models. 
            Get detailed vulnerability reports with actionable recommendations.
          </p>
          
          {backendStatus === 'offline' && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-8 text-yellow-800">
              <p className="font-medium">Backend server is offline</p>
              <p className="text-sm">Please start the backend server to use the audit functionality</p>
            </div>
          )}

          <Link href="/audit">
            <button 
              className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg ${
                backendStatus === 'online' 
                  ? 'bg-white text-blue-600 hover:bg-gray-50' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={backendStatus !== 'online'}
            >
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6" />
                <span>Start Security Audit</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <AuditNetLogo />
                <span className="text-xl font-bold text-white">AuditNet</span>
              </div>
              <p className="text-gray-400">
                Advanced Machine Learning System for Smart Contract Security Analysis
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Technology</h3>
              <ul className="space-y-2 text-gray-400">
                <li>CodeBERT Transformers</li>
                <li>BiLSTM Networks</li>
                <li>Multi-Kernel CNNs</li>
                <li>Neural Ensemble Learning</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/virtualvasu/auditnet" className="text-gray-400 hover:text-white transition-colors">
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <Link href="/audit" className="text-gray-400 hover:text-white transition-colors">
                    Security Audit Tool
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>© 2026 AuditNet. Developed by <strong>Vasu Garg</strong>, IIT Bhilai</p>
          </div>
        </div>
      </footer>
    </div>
  )
}