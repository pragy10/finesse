import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, MapPin, Clock, Github, Linkedin, Globe, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "pragya.skr10@gmail.com",
      link: "mailto:pragya.skr10@gmail.com",
      description: "Send an email anytime"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Chennai, Tamil Nadu, India",
      description: "VIT Chennai Campus"
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "Usually within 24 hours",
      description: "Fast and direct replies"
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      title: "GitHub",
      url: "https://github.com/pragy10",
      handle: "@pragy10",
      description: "Source code & projects"
    },
    {
      icon: Linkedin,
      title: "LinkedIn", 
      url: "https://linkedin.com/in/pragya-sekar",
      handle: "/in/pragya-sekar",
      description: "Professional updates"
    },
    {
      icon: Globe,
      title: "Website",
      url: "https://pragyasekar.vercel.app",
      handle: "pragyasekar.vercel.app",
      description: "Portfolio & articles"
    }
  ];

  const faqs = [
    {
      question: "How secure is my policy data?",
      answer: "All uploaded documents are processed securely in cloud storage with strict per-user access control. Your files remain confidential and are never shared."
    },
    {
      question: "What document formats are supported?",
      answer: "We support PDF, DOCX, JPG, PNG, and EML files. The system automatically extracts clauses, tables, and policy wording."
    },
    {
      question: "How does the AI verify claim eligibility?",
      answer: "Our engine indexes your policy into vector chunks, checks waiting periods, sub-limits, and exclusions, and provides direct clause citations."
    },
    {
      question: "Can I delete my uploaded documents anytime?",
      answer: "Yes! You have complete control. You can delete individual documents or clear all documents at any time from your Document Manager."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Page Header Banner */}
      <div className="bg-primary-900 dark:bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Mail className="w-7 h-7 text-secondary-400" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl text-white mb-1">
                Get in Touch
              </h1>
              <p className="text-primary-200 text-sm max-w-2xl">
                Have questions about finesse? Want to collaborate or share feedback? We'd love to hear from you.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10 pb-16">
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-950/60 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary-700 dark:text-primary-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Send a Message</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Fill out the form below and we'll reply promptly.</p>
                </div>
              </div>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-950/60 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Message Sent Successfully!</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Thanks for reaching out. We'll get back to you shortly.</p>
                  <Button 
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What is this regarding?"
                      className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us more about your question or feedback..."
                      className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition resize-none"
                    />
                  </div>

                  <Button 
                    type="submit"
                    loading={isSubmitting}
                    size="lg"
                    className="w-full bg-primary-700 hover:bg-primary-800 text-white font-medium"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className="w-4 h-4 ml-1" />
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-6"
          >
            {/* Contact Details */}
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-5">Contact Details</h3>
              
              <div className="space-y-5">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3.5">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-950/60 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary-700 dark:text-primary-300" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">{info.title}</div>
                      {info.link ? (
                        <a href={info.link} className="text-sm text-primary-700 dark:text-primary-400 hover:underline font-medium block">
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-sm text-slate-800 dark:text-slate-200 font-medium">{info.value}</div>
                      )}
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{info.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Connect</h3>
              <div className="space-y-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-primary-700 group-hover:text-white transition-colors text-slate-600 dark:text-slate-300">
                      <social.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                        {social.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{social.handle}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm space-y-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Explore finesse</h3>
              <Button 
                as={Link} 
                to="/dashboard"
                size="md"
                className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-medium"
              >
                Go to Dashboard
              </Button>
              
              <Button
                as="a"
                href="https://github.com/pragy10/finesse"
                target="_blank"
                variant="outline"
                size="md"
                className="w-full"
              >
                <Github className="w-4 h-4 mr-1.5" />
                View on GitHub
              </Button>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl text-slate-900 dark:text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Common questions about finesse and document intelligence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
              >
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{faq.question}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default ContactPage;
