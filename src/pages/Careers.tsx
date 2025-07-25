import { motion } from 'framer-motion';
import { ArrowRight, Award, Briefcase, Clock, Heart, Lightbulb, MapPin, Plus, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness programs'
    },
    {
      icon: Lightbulb,
      title: 'Professional Development',
      description: 'Continuing education, conference attendance, and skill development opportunities'
    },
    {
      icon: Users,
      title: 'Collaborative Environment',
      description: 'Work with brilliant minds in a supportive, inclusive, and innovative atmosphere'
    },
    {
      icon: Award,
      title: 'Recognition & Growth',
      description: 'Merit-based advancement, performance bonuses, and leadership opportunities'
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
            <h1 className="text-4xl lg:text-5xl font-bold font-serif mb-6">Join Our Team</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Build your legal career with a firm that values excellence, innovation, and professional growth. 
              Discover opportunities to make a meaningful impact while advancing your expertise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Open Positions - MOVED TO TOP */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-4">Current Opportunities</h2>
            <p className="text-lg text-slate-600">
              Explore our open positions and find the perfect role to advance your legal career.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
          ) : jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <Briefcase className="h-24 w-24 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">No Open Positions</h3>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                We don't have any open positions at the moment, but we're always looking for talented individuals. 
                Feel free to send us your resume for future opportunities.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href="mailto:careers@solv.legal"
                  className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-8 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 inline-flex items-center space-x-2"
                >
                  <span>Send Resume</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/contact"
                  className="border-2 border-slate-300 text-slate-700 px-8 py-3 rounded-md font-semibold hover:bg-slate-50 transition-all duration-200 inline-flex items-center space-x-2"
                >
                  <span>Contact Us</span>
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {jobs.map((position, index) => (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-2xl font-semibold text-slate-900 mb-2">{position.title}</h3>
                      <div className="flex flex-wrap items-center space-x-6 text-slate-600">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4" />
                          <span>{position.department}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{position.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{position.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{position.experience}</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 inline-flex items-center space-x-2">
                      <span>Apply Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <p className="text-slate-700 mb-6">{position.description}</p>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Requirements:</h4>
                    <ul className="space-y-2">
                      {position.requirements.map((req: string, reqIndex: number) => (
                        <li key={reqIndex} className="flex items-start space-x-2 text-slate-600">
                          <Plus className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Work at SOLV */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-4">Why Choose SOLV?</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              We offer more than just a job – we provide a platform for professional excellence and personal fulfillment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-slate-50 rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                <benefit.icon className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-6">Our Culture</h2>
              <p className="text-lg text-slate-700 mb-6">
                At SOLV, we believe that exceptional legal work comes from exceptional people working together. 
                Our culture emphasizes collaboration, continuous learning, and maintaining the highest ethical standards 
                while fostering an inclusive environment where everyone can thrive.
              </p>
              <p className="text-lg text-slate-700 mb-6">
                We encourage innovation, support work-life balance, and invest in our people's professional development. 
                Every team member contributes to our mission of delivering outstanding legal services while building 
                a sustainable and fulfilling career.
              </p>
              {/* <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-slate-900">95%</div>
                  <div className="text-slate-600">Employee Satisfaction</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-slate-900">87%</div>
                  <div className="text-slate-600">Internal Promotion Rate</div>
                </div>
              </div> */}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Team collaboration"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      {/* Application Process */}
      {/* <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 mb-8">Application Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Submit Application</h3>
                <p className="text-slate-600">Send your resume, cover letter, and relevant documents</p>
              </div>
              <div className="text-center">
                <div className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Interview Process</h3>
                <p className="text-slate-600">Participate in multiple rounds of interviews with our team</p>
              </div>
              <div className="text-center">
                <div className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Join the Team</h3>
                <p className="text-slate-600">Complete onboarding and begin your career at SOLV</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* Final CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-serif mb-6">Ready to Join Our Team?</h2>
            <p className="text-xl text-slate-300 mb-8">
              Take the next step in your legal career with SOLV. We're excited to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="mailto:careers@solv.legal"
                className="bg-white text-slate-900 px-8 py-4 rounded-md font-semibold hover:bg-slate-100 transition-all duration-200 hover:scale-105 inline-flex items-center space-x-2"
              >
                <span>Send Your Resume</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-md font-semibold hover:bg-white hover:text-slate-900 transition-all duration-200 inline-flex items-center space-x-2"
              >
                <span>Contact Us</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};