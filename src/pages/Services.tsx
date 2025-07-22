import React from 'react';
import { motion } from 'framer-motion';
import { Building, Shield, Users, Laptop, Calculator, FileText, CheckCircle, ArrowRight } from 'lucide-react';

export const Services: React.FC = () => {
  const services = [
    {
      icon: Building,
      title: 'Corporate Law',
      description: 'Comprehensive corporate legal services for businesses of all sizes',
      features: [
        'Mergers & Acquisitions',
        'Corporate Governance',
        'Securities Law',
        'Contract Negotiation',
        'Regulatory Compliance',
        'Business Formation'
      ],
      image: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: Shield,
      title: 'Intellectual Property',
      description: 'Protect and maximize the value of your intellectual assets',
      features: [
        'Patent Applications',
        'Trademark Registration',
        'Copyright Protection',
        'IP Litigation',
        'Licensing Agreements',
        'Trade Secret Protection'
      ],
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: Users,
      title: 'Dispute Resolution',
      description: 'Expert litigation and alternative dispute resolution services',
      features: [
        'Commercial Litigation',
        'Arbitration',
        'Mediation',
        'Contract Disputes',
        'Employment Disputes',
        'Regulatory Investigations'
      ],
      image: 'https://images.pexels.com/photos/5668869/pexels-photo-5668869.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: Laptop,
      title: 'Technology & Privacy',
      description: 'Navigate the complex landscape of technology and data privacy laws',
      features: [
        'Data Privacy Compliance',
        'Cybersecurity Law',
        'Software Licensing',
        'E-commerce Law',
        'GDPR Compliance',
        'Technology Transactions'
      ],
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: Calculator,
      title: 'Taxation',
      description: 'Strategic tax planning and compliance services',
      features: [
        'Corporate Tax Planning',
        'International Tax',
        'Transfer Pricing',
        'Tax Disputes',
        'Restructuring',
        'Tax Due Diligence'
      ],
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600'
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
            <h1 className="text-4xl lg:text-5xl font-bold font-serif mb-6">Our Services</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Comprehensive legal solutions tailored to meet the evolving needs of modern businesses and organizations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center space-x-3 mb-6">
                    <service.icon className="h-12 w-12 text-slate-700" />
                    <h2 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900">
                      {service.title}
                    </h2>
                  </div>
                  <p className="text-lg text-slate-600 mb-8">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-8 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 inline-flex items-center space-x-2">
                    <span>Learn More</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="rounded-lg shadow-lg w-full h-96 object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose SOLV */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-4">
              Why Choose SOLV?
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our commitment to excellence, innovation, and client success sets us apart in the legal industry.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <FileText className="h-12 w-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Proven Expertise</h3>
              <p className="text-slate-600">
                Our team brings decades of specialized experience across multiple practice areas, 
                ensuring comprehensive and strategic legal counsel.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <Laptop className="h-12 w-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Technology-Forward</h3>
              <p className="text-slate-600">
                We leverage cutting-edge legal technology to enhance efficiency, accuracy, 
                and client communication throughout the legal process.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <Users className="h-12 w-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Client-Centric</h3>
              <p className="text-slate-600">
                Every strategy is tailored to our clients' unique needs and business objectives, 
                ensuring personalized service and optimal outcomes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-serif mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Contact our team today to discuss how we can help you navigate your legal challenges 
              and achieve your business objectives.
            </p>
            <button className="bg-white text-slate-900 px-8 py-4 rounded-md font-semibold hover:bg-slate-100 transition-all duration-200 hover:scale-105 inline-flex items-center space-x-2">
              <span>Schedule a Consultation</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};