import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, FileText, ShieldCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

function HeroSection() {
  const trustBadges = [
    'Policy clause lookup',
    'Claim eligibility checks',
    'Waiting period analysis',
    'Plain language answers',
  ];

  const docLines = [
    { label: 'Policy Holder', value: 'Pragya S.' },
    { label: 'Sum Insured', value: '₹10,00,000' },
    { label: 'Waiting Period', value: '2 years (specific illness)' },
    { label: 'Day-Care Cover', value: 'Included' },
  ];

  return (
    <section className="relative bg-primary-900 dark:bg-primary-950 overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Warm amber glow — top right */}
      <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-secondary-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pt-2 lg:pt-0"
          >
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.12] text-white mb-6 tracking-tight">
              Understand Your Policy —{' '}
              <span className="text-secondary-400 block sm:inline">In Plain Language</span>
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl">
              Upload your health, life, or motor insurance policy. Ask whether your
              claim is covered. Get a clear answer with the exact clause cited — no
              jargon, no guessing.
            </p>

            {/* Trust badges */}
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-10">
              {trustBadges.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                as={Link}
                to="/dashboard"
                size="lg"
                className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold shadow-lg hover:shadow-xl rounded-lg"
              >
                Check Your Coverage
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                as={Link}
                to="/about"
                size="lg"
                className="bg-white/10 text-white border border-white/20 hover:bg-white/15 rounded-lg font-medium"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Right — policy document mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-sm">
              {/* Document card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                {/* Document header strip */}
                <div className="bg-primary-800 px-5 py-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold">Health Insurance Policy</div>
                    <div className="text-primary-300 text-[11px]">Individual — Policy Year 2024–25</div>
                  </div>
                </div>

                {/* Policy fields */}
                <div className="px-5 pt-4 pb-2 space-y-3">
                  {docLines.map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2.5 last:border-0">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{value}</span>
                    </div>
                  ))}
                </div>

                {/* AI query strip */}
                <div className="mx-5 mb-4 mt-1 bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900 rounded-xl p-3.5">
                  <p className="text-[11px] font-medium text-primary-700 dark:text-primary-300 mb-1">Query</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    "Is knee replacement surgery covered after 3 months?"
                  </p>
                </div>

                {/* AI answer */}
                <div className="mx-5 mb-5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    <p className="text-[11px] font-semibold text-green-700 dark:text-green-400">Conditional Coverage</p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Covered after 2-year waiting period per{' '}
                    <span className="font-semibold text-primary-700 dark:text-primary-400">Section 4.1(b)</span>.
                    Current policy age: 3 months — waiting period not yet met.
                  </p>
                </div>

                {/* Footer: response time */}
                <div className="flex items-center gap-1.5 px-5 pb-4 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  Response in 2.4s
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
