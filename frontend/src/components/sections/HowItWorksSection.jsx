import React from 'react';
import { Upload, Cpu, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { HOW_IT_WORKS_STEPS } from '../../utils/constants';

function HowItWorksSection() {
  const iconMap = { Upload, Cpu, MessageSquare };

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-slate-950 transition-colors">
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
            How It Works
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-slate-900 dark:text-white mb-4">
            From Policy to Answer in Three Steps
          </h2>
          <div className="section-divider mb-5" />
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            No setup, no training required. Just upload your document and start asking questions.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-px bg-slate-200 dark:bg-slate-800 z-0" />

          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = iconMap[step.icon] || Upload;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                {/* Step circle */}
                <div className="relative z-10 flex justify-center mb-6">
                  <div className="w-20 h-20 bg-primary-900 dark:bg-primary-800 rounded-full flex flex-col items-center justify-center shadow-lg">
                    <span className="text-secondary-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">
                      Step {index + 1}
                    </span>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {step.description}
                </p>

                <ul className="text-left bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 bg-secondary-500 rounded-full flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-primary-900 dark:bg-primary-950 rounded-2xl px-8 py-12 text-center shadow-xl relative overflow-hidden"
        >
          {/* Amber glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500/15 rounded-full blur-[80px] pointer-events-none" />
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-3 relative z-10">
            Ready to Know Your Policy Inside Out?
          </h3>
          <p className="text-slate-300 mb-7 max-w-lg mx-auto text-sm leading-relaxed relative z-10">
            Upload your policy now and get answers to questions you've been afraid to ask your insurer.
          </p>
          <div className="relative z-10">
            <Button
              as={Link}
              to="/dashboard"
              size="lg"
              className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl"
            >
              Check Your Coverage
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default HowItWorksSection;
