import React from 'react';
import { FileText, Brain, Search, Shield, Zap, Globe, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { FEATURES } from '../../utils/constants';

function FeaturesSection() {
  const iconMap = { FileText, Brain, Search, Shield, Zap, Globe };

  return (
    <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-secondary-600 dark:text-secondary-400 text-sm font-semibold uppercase tracking-widest mb-3">
            What finesse Does
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-slate-900 dark:text-white mb-4">
            Everything You Need to<br className="hidden sm:block" /> Decode Your Policy
          </h2>
          <div className="section-divider mb-5" />
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop struggling with policy documents written for lawyers.
            finesse gives you the answers you actually need.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon] || FileText;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="card-document p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-primary-700 dark:bg-primary-800 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-1.5">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-secondary-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default FeaturesSection;
