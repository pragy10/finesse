import React from 'react';
import { FileText, Brain, Search, Shield, Zap, Globe, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { FEATURES } from '../../utils/constants';

function FeaturesSection() {
  const iconMap = {
    FileText, Brain, Search, Shield, Zap, Globe
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-primary-50 text-primary-600 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium">✨ Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Document Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive AI-powered document analysis with enterprise-grade security and performance
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon] || FileText;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Finesse?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built with cutting-edge AI technology and designed for professionals who demand excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: 'Lightning Fast', value: '< 3s', desc: 'Average response time' },
              { icon: Shield, title: 'Enterprise Security', value: '100%', desc: 'Secure processing' },
              { icon: CheckCircle, title: 'High Accuracy', value: '99.9%', desc: 'Analysis precision' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{item.value}</div>
                <div className="font-semibold text-gray-800 mb-1">{item.title}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesSection;
