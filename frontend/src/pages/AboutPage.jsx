import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Target, Users, Award, Github, Linkedin, Mail, Globe } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { STATS, APP_NAME } from '../utils/constants';

function AboutPage() {
  const values = [
    {
      icon: Brain,
      title: "Innovation First",
      description: "We leverage cutting-edge AI technology to solve real-world document analysis challenges with breakthrough solutions."
    },
    {
      icon: Target,
      title: "Precision Focused", 
      description: "Every feature is designed with accuracy and reliability at its core, ensuring trustworthy results every time."
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "We build intuitive interfaces that make complex AI technology accessible to everyone, regardless of technical expertise."
    },
    {
      icon: Award,
      title: "Excellence Driven",
      description: "Committed to delivering the highest quality document intelligence solutions that exceed expectations."
    }
  ];

  const teamMember = {
    name: "Pragya Sekar",
    role: "Founder & Developer", 
    bio: "Computer Science student at VIT Chennai, passionate about AI and document intelligence. Currently building the future of document analysis through innovative AI solutions.",
    avatar: "👩‍💻",
    skills: ["AI/ML", "Full-Stack Development", "Document Processing", "Vector Databases"],
    links: {
      github: "https://github.com/pragy10",
      linkedin: "https://linkedin.com/in/pragya-sekar",
      email: "mailto:pragya.skr10@gmail.com",
      website: "https://pragyasekar.vercel.app"
    }
  };

  const techStack = [
    { category: "AI & ML", items: ["Google Gemini", "Hugging Face", "Vector Embeddings", "Semantic Search"] },
    { category: "Backend", items: ["Node.js", "Express", "Qdrant Vector DB", "Document Parsing"] },
    { category: "Frontend", items: ["React", "Tailwind CSS", "Framer Motion", "Modern UI/UX"] },
    { category: "Infrastructure", items: ["Cloud Processing", "Real-time API", "Auto-scaling", "Security"] }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Revolutionizing Document Intelligence with AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {APP_NAME} transforms the way you interact with documents, making complex information 
            accessible through intelligent AI-powered analysis and natural language understanding. 
            Built for professionals who demand precision and efficiency.
          </p>
        </motion.section>

        {/* Mission Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-primary-900 dark:bg-primary-950 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden border border-primary-800/60">
            {/* Amber glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-secondary-500/15 rounded-full blur-[90px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">Our Mission</h2>
              <div className="w-12 h-1 bg-secondary-500 rounded-full mx-auto mb-6" />
              <p className="text-base md:text-lg text-slate-200 leading-relaxed max-w-4xl mx-auto mb-8">
                We believe that information should be instantly accessible and understandable. 
                Our mission is to eliminate the friction between policyholders and their documents by 
                providing intelligent, AI-powered analysis that delivers precise answers in seconds.
                We're democratizing access to advanced document intelligence for everyone.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Instant Information Access', 'Privacy-First Approach', 'Cutting-Edge AI Technology', 'Clear Policy Insights'].map((highlight, i) => (
                  <div key={i} className="bg-white/10 hover:bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white border border-white/20 transition-colors">
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we build and every decision we make
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="h-full text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet the Creator</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">The visionary behind Finesse's innovative document intelligence platform</p>
          </div>
          
          <div className="flex justify-center">
            <Card hover className="max-w-lg w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="text-center p-8">
                <div className="text-6xl mb-6">{teamMember.avatar}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{teamMember.name}</h3>
                <div className="text-primary-600 dark:text-primary-400 font-semibold mb-4">{teamMember.role}</div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{teamMember.bio}</p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {teamMember.skills.map((skill, i) => (
                    <span key={i} className="bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-center gap-4">
                  {[
                    { icon: Github, href: teamMember.links.github, label: 'GitHub' },
                    { icon: Linkedin, href: teamMember.links.linkedin, label: 'LinkedIn' },
                    { icon: Globe, href: teamMember.links.website, label: 'Website' },
                    { icon: Mail, href: teamMember.links.email, label: 'Email' }
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary-500 hover:text-white transition-all duration-200"
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </motion.section>

        {/* Technology Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="p-8 md:p-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Powered by Cutting-Edge Technology</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {APP_NAME} leverages the latest advances in artificial intelligence and natural language processing
                to deliver unprecedented document understanding capabilities.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {techStack.map((category, index) => (
                <div key={index} className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{category.category}</h4>
                  <div className="space-y-2">
                    {category.items.map((item, i) => (
                      <div key={i} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg text-sm font-medium">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.section>

        {/* Achievements Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">By the Numbers</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Real metrics that demonstrate our impact and reliability</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">{stat.number}</div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-primary-900 dark:bg-primary-950 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden border border-primary-800/60">
            {/* Amber glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Ready to Transform Your Documents?</h2>
              <p className="text-base text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of professionals who trust {APP_NAME} for intelligent document analysis.
                Start your journey today and experience the future of document intelligence.
              </p>
              <div className="flex justify-center">
                <Button 
                  as={Link} 
                  to="/dashboard" 
                  size="lg"
                  className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold shadow-lg hover:shadow-xl rounded-lg"
                >
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default AboutPage;
