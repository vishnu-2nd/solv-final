import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Scale, Building, Shield, Users, Award, ChevronRight, Star, Quote } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const practiceAreas = [
    { icon: Building, title: 'Corporate Law', description: 'Strategic counsel for business transactions and governance' },
    { icon: Shield, title: 'Intellectual Property', description: 'Comprehensive IP protection and enforcement strategies' },
    { icon: Users, title: 'Dispute Resolution', description: 'Expert litigation and alternative dispute resolution' },
    { icon: Award, title: 'Technology & Privacy', description: 'Cutting-edge legal solutions for digital transformation' },
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      position: 'CEO, TechVision Inc.',
      content: 'SOLV provided exceptional guidance during our IPO process. Their expertise in corporate law and attention to detail was remarkable.',
      rating: 5
    },
    {
      name: 'David Chen',
      position: 'General Counsel, InnovateX',
      content: 'The IP protection strategy developed by SOLV has been instrumental in securing our competitive advantage in the market.',
      rating: 5
    },
    {
      name: 'Maria Rodriguez',
      position: 'Founder, GreenTech Solutions',
      content: 'Professional, knowledgeable, and always available. SOLV has been our trusted legal partner for over three years.',
      rating: 5
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold font-serif mb-6 leading-tight">
                Legal Excellence
                <span className="block text-slate-300">Redefined</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Navigate complex legal challenges with confidence. SOLV delivers innovative solutions 
                backed by decades of expertise, precision, and unwavering commitment to your success.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/contact"
                  className="bg-white text-slate-900 px-8 py-4 rounded-md font-semibold hover:bg-slate-100 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Speak With Our Experts</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/services"
                  className="border-2 border-white text-white px-8 py-4 rounded-md font-semibold hover:bg-white hover:text-slate-900 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Our Services</span>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <Scale className="h-48 w-48 lg:h-64 lg:w-64 text-slate-300 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/30 to-slate-500/30 rounded-full blur-3xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Practice Areas Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-4">
              Areas of Practice
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our comprehensive legal services span across multiple practice areas, 
              ensuring expert guidance for every aspect of your business needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {practiceAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                <area.icon className="h-12 w-12 text-slate-700 mb-4 group-hover:text-slate-900 transition-colors" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{area.title}</h3>
                <p className="text-slate-600 mb-4">{area.description}</p>
                <Link
                  to="/services"
                  className="text-slate-700 font-medium hover:text-slate-900 flex items-center space-x-1 transition-colors"
                >
                  <span>Learn more</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-8 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>View All Services</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-4xl font-bold font-serif mb-2">500+</div>
              <div className="text-slate-300">Cases Successfully Resolved</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-4xl font-bold font-serif mb-2">25+</div>
              <div className="text-slate-300">Years of Combined Experience</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-4xl font-bold font-serif mb-2">98%</div>
              <div className="text-slate-300">Client Satisfaction Rate</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-4xl font-bold font-serif mb-2">15</div>
              <div className="text-slate-300">Countries Served</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-4">
              Client Testimonials
            </h2>
            <p className="text-lg text-slate-600">
              What our clients say about working with SOLV
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Quote className="h-8 w-8 text-slate-300 mb-4" />
                <p className="text-slate-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-slate-600 text-sm">{testimonial.position}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};