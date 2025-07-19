import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload, Brain, Zap, Play, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { STATS } from '../../utils/constants';

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
            >
              <span className="text-sm font-medium">🚀 Now powered by Google Gemini AI</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transform Documents into
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent block lg:inline">
                {' '}Intelligent Insights
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              Upload any document and get AI-powered analysis, semantic search, and intelligent reasoning. 
              Perfect for policy analysis, claim processing, and document understanding with enterprise-grade security.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              {[
                { icon: Upload, text: 'Multi-format Support' },
                { icon: Brain, text: 'AI-Powered Analysis' },
                { icon: Zap, text: 'Instant Results' }
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button
                as={Link}
                to="/dashboard"
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100 shadow-xl"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
              
              <Button
                size="lg"
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
              {STATS.slice(0, 3).map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/20">
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">🤖 AI Document Assistant</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm">👤</div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex-1">
                    <div className="text-sm">"Am I eligible for knee surgery coverage as a 46M in Pune with 3-month policy?"</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center text-sm">🤖</div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex-1">
                    <div className="text-sm mb-2">
                      "Yes, you are covered for knee surgery under your current policy. 
                      Based on Section 4.2, orthopedic procedures are covered with 
                      80% reimbursement after your $500 deductible..."
                    </div>
                    <div className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded">
                      <CheckCircle className="w-3 h-3" />
                      High Confidence (89%)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/70">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span>AI is analyzing more documents...</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
