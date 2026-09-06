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
    <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 mb-6 border border-primary-100 dark:border-primary-900">
            <span className="text-sm font-medium">🚀 How It Works</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get Started in Three Simple Steps
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 border-4 border-primary-100 dark:border-gray-700 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                    <Icon className="w-8 h-8 text-primary-500" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{step.description}</p>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-white shadow-xl"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Experience the Future of Document Analysis?
          </h3>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already transforming their document workflows with Finesse.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              as={Link} 
              to="/dashboard" 
              variant="secondary" 
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
