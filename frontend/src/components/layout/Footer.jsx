import React from 'react';
import { ShieldCheck, Github, Linkedin, Mail, Globe } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Dashboard',  href: '/dashboard' },
      { label: 'Documents',  href: '/documents' },
      { label: 'Profile',    href: '/profile' },
    ],
    company: [
      { label: 'About',   href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
    ],
  };

  const socialLinks = [
    { icon: Github,   href: 'https://github.com/pragy10',           label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/pragya-sekar', label: 'LinkedIn' },
    { icon: Globe,    href: 'https://pragyasekar.vercel.app',        label: 'Website' },
    { icon: Mail,     href: 'mailto:pragya.skr10@gmail.com',         label: 'Email' },
  ];

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img 
                src="/notepad3d.png" 
                alt="finesse Logo" 
                className="w-7 h-7 object-contain drop-shadow-sm" 
              />
              <span className="font-serif text-lg text-white">finesse</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Understand your insurance policy in plain language.
              Powered by AI, built for policyholders.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:bg-primary-700 hover:text-white transition-all duration-200"
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white text-sm font-semibold mb-4 capitalize">{category}</h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-slate-400 hover:text-secondary-400 transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            © {currentYear} finesse. Built with care for every policyholder.
          </p>
          <p className="text-xs text-slate-600">
            Powered by OpenRouter AI · Qdrant · Supabase · Firebase
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
