import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Shield, Zap } from 'lucide-react';
import { STATS } from '../../utils/constants';

function StatsSection() {
  const iconMap = {
    'Documents Processed': TrendingUp,
    'Accuracy Rate': Zap,
    'Average Response': Clock,
    'Secure Processing': Shield
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Professionals Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Numbers that speak for our commitment to excellence and reliability
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, index) => {
            const Icon = iconMap[stat.label] || TrendingUp;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold text-primary-600 mb-2"
                >
                  {stat.number}
                </motion.div>
                
                <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
