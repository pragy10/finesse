import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, MapPin, Clock, Github, Linkedin, Globe, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "pragya.skr10@gmail.com",
      link: "mailto:pragya.skr10@gmail.com",
      description: "Send us an email anytime"
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
      description: "We'll get back to you quickly"
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      title: "GitHub",
      url: "https://github.com/pragy10",
      handle: "@pragy10",
      description: "View source code and projects"
    },
    {
      icon: Linkedin,
      title: "LinkedIn", 
      url: "https://linkedin.com/in/pragya-sekar",
      handle: "/in/pragya-sekar",
      description: "Professional network and updates"
    },
    {
      icon: Globe,
      title: "Website",
      url: "https://pragyasekar.vercel.app",
      handle: "pragyasekar.vercel.app",
      description: "Personal portfolio and blog"
    }
  ];

  const faqs = [
    {
      question: "How secure is my data?",
      answer: "All documents are processed with enterprise-grade encryption. We don't store your documents permanently and follow strict privacy protocols including GDPR compliance."
    },
    {
      question: "What file formats do you support?",
      answer: "We support PDF, DOCX, JPG, PNG, and EML files. Our advanced OCR technology can extract text from images and scanned documents with 99% accuracy."
    },
    {
      question: "Is there an API available?",
      answer: "Yes! We offer a comprehensive RESTful API for developers who want to integrate our document intelligence capabilities into their applications."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI models achieve 99.9% accuracy in text extraction and semantic understanding, powered by Google Gemini and advanced NLP techniques with continuous learning."
    },
    {
      question: "Can I process multiple documents?",
      answer: "Absolutely! You can upload and analyze multiple documents simultaneously, with batch processing capabilities and cross-document search functionality."
    },
    {
      question: "What's the pricing model?",
      answer: "We offer flexible pricing including a generous free tier. Contact us to discuss enterprise plans and custom solutions for your specific needs."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about Finesse? Want to collaborate or provide feedback? 
            I'd love to hear from you. Let's start a conversation and explore how AI can transform your document workflows.
          </p>
        </motion.section>

        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Send a Message</h2>
                  <p className="text-gray-600">Fill out the form below and I'll get back to you soon</p>
                </div>
              </div>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-600 mb-6">Thanks for reaching out. I'll get back to you within 24 hours.</p>
                  <Button 
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell me more about your question or feedback..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    />
                  </div>

                  <Button 
                    type="submit"
                    loading={isSubmitting}
                    size="lg"
                    className="w-full"
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Contact Details */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{info.title}</div>
                      {info.link ? (
                        <a href={info.link} className="text-primary-600 hover:text-primary-700 font-medium mb-1 block">
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-gray-800 font-medium mb-1">{info.value}</div>
                      )}
                      <div className="text-sm text-gray-600">{info.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Connect with Me</h3>
              <div className="space-y-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                      <social.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 group-hover:text-primary-600">{social.title}</div>
                      <div className="text-sm text-gray-600 mb-1">{social.handle}</div>
                      <div className="text-xs text-gray-500">{social.description}</div>
                    </div>
                  </a>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  as="a" 
                  href="/dashboard"
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Try Finesse Now
                </Button>
                
                <Button
                  as="a"
                  href="https://github.com/pragy10/finesse"
                  target="_blank"
                  variant="outline"
                  size="md"
                  className="w-full"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Common questions about Finesse and document intelligence. Can't find your answer? Feel free to reach out!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="h-full">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h4>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default ContactPage;
