import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Award, Target, Eye, Heart, Lightbulb } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      name: 'Sarah J. Mitchell',
      position: 'Managing Partner',
      specialization: 'Corporate Law & M&A',
      experience: '15+ years',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Dr. Michael Chen',
      position: 'Senior Partner',
      specialization: 'Intellectual Property',
      experience: '12+ years',
      image: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Emily Rodriguez',
      position: 'Partner',
      specialization: 'Technology & Privacy Law',
      experience: '10+ years',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'James Thompson',
      position: 'Partner',
      specialization: 'Dispute Resolution',
      experience: '14+ years',
      image: 'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Precision',
      description: 'Every legal strategy is crafted with meticulous attention to detail and strategic foresight.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace cutting-edge legal technologies and methodologies to deliver superior outcomes.'
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'Our commitment to ethical practice and transparency forms the foundation of every client relationship.'
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-serif mb-6">About SOLV</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              A distinguished legal practice founded on the principles of excellence, innovation, and unwavering commitment to client success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-6">Our Story</h2>
              <p className="text-lg text-slate-700 mb-6">
                Founded in 2010, SOLV emerged from a vision to revolutionize legal practice through innovative thinking, 
                technological advancement, and an unwavering commitment to client success. Our founding partners recognized 
                the need for a law firm that could navigate the complexities of modern business while maintaining the highest 
                standards of legal excellence.
              </p>
              <p className="text-lg text-slate-700 mb-6">
                Over the past decade, we have grown from a boutique practice to a recognized leader in corporate law, 
                intellectual property, and technology law. Our success is measured not just by the cases we win, 
                but by the lasting relationships we build and the innovative solutions we create.
              </p>
              <p className="text-lg text-slate-700">
                Today, SOLV serves clients across multiple industries, from emerging startups to Fortune 500 companies, 
                providing strategic legal counsel that drives business success and protects valuable assets.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="SOLV Office"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-6 rounded-lg shadow-xl">
                <div className="text-2xl font-bold">14+</div>
                <div className="text-slate-300">Years of Excellence</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              These fundamental principles guide every decision we make and every service we provide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
              >
                <value.icon className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Outlook */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Globe className="h-16 w-16 text-slate-700 mb-6" />
              <h2 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-6">Global Outlook</h2>
              <p className="text-lg text-slate-700 mb-6">
                In today's interconnected world, legal challenges transcend borders. SOLV maintains a global perspective, 
                working closely with international partners and understanding cross-border regulations to serve clients 
                operating in multiple jurisdictions.
              </p>
              <p className="text-lg text-slate-700 mb-6">
                Our team stays current with international legal developments, ensuring our clients receive comprehensive 
                counsel that considers global implications and opportunities.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">15+</div>
                  <div className="text-slate-600">Countries Served</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">50+</div>
                  <div className="text-slate-600">International Partners</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Global Network"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-4">Leadership Team</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our partners bring decades of experience and specialized expertise to serve our clients' diverse needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{member.name}</h3>
                  <p className="text-slate-700 font-medium mb-1">{member.position}</p>
                  <p className="text-slate-600 mb-2">{member.specialization}</p>
                  <p className="text-slate-500 text-sm">{member.experience}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};