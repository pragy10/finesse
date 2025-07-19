import React from 'react';
import { Brain, Github, Linkedin, Mail, Globe } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Features', href: '#features' },
      { label: 'API Access', href: '#api' },
      { label: 'Integrations', href: '#integrations' }
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '#careers' },
      { label: 'Press Kit', href: '#press' }
    ],
    resources: [
      { label: 'Help Center', href: '#help' },
      { label: 'Documentation', href: '#docs' },
      { label: 'Tutorials', href: '#tutorials' },
      { label: 'Community', href: '#community' }
    ]
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/pragy10', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/pragya-sekar', label: 'LinkedIn' },
    { icon: Globe, href: 'https://pragyasekar.vercel.app', label: 'Website' },
    { icon: Mail, href: 'mailto:pragya.skr10@gmail.com', label: 'Email' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-primary-400" />
              <span className="text-white font-bold text-xl">{APP_NAME}</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              AI-powered document analysis and reasoning platform. Transform your documents 
              into intelligent insights with cutting-edge technology.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-200"
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4 capitalize">{category}</h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a 
                      href={href} 
                      className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} {APP_NAME}. All rights reserved. Built with ❤️ for intelligent document processing.
            </p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
