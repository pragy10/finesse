import React from 'react';
import { Upload, Cpu, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { HOW_IT_WORKS_STEPS } from '../../utils/constants';

function HowItWorksSection() {
  const iconMap = {
    Upload, Cpu, MessageSquare
  };

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-primary-50 text-primary-600 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium">🚀 How It Works</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Started in Three Simple Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From upload to insights in minutes, not hours. Our streamlined process makes document analysis effortless.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = iconMap[step.icon] || Upload;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-lg">
                    {index + 1}
                  </div>
                  <div className="w-16 h-16 bg-white border-4 border-primary-100 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                    <Icon className="w-8 h-8 text-primary-500" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{step.description}</p>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <ul className="text-sm text-gray-600 space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {index < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-primary-300 mx-auto" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200"
        >
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Experience Document Intelligence?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who trust Finesse for accurate, fast, and secure document analysis. 
              Start your journey to intelligent document processing today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                as={Link}
                to="/dashboard"
                variant="primary"
                size="lg"
              >
                Start Analyzing Documents
                <ArrowRight className="w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
              >
                Schedule Demo Call
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { number: "2.5M+", label: "Documents Analyzed" },
                { number: "45K+", label: "Happy Users" },
                { number: "150+", label: "Countries Served" },
                { number: "99.9%", label: "Uptime" }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-xl md:text-2xl font-bold text-primary-600 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
