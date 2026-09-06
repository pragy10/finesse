import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, FileText, Shield } from 'lucide-react';
import { STATS } from '../../utils/constants';

const icons = [TrendingUp, Clock, FileText, Shield];

function StatsSection() {
  return (
    <section className="py-14 bg-primary-900 dark:bg-primary-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10"
        >
          {STATS.map((stat, index) => {
            const Icon = icons[index] || TrendingUp;
            return (
              <div key={index} className="text-center px-6 py-6 md:py-4">
                <Icon className="w-5 h-5 text-secondary-400 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">
                  {stat.number}
                </div>
                <div className="text-xs font-semibold text-slate-300 mb-0.5">{stat.label}</div>
                <div className="text-[11px] text-slate-500">{stat.description}</div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default StatsSection;
