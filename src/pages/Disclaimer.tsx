import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, FileText, Info } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  const disclaimerSections = [
    {
      icon: AlertTriangle,
      title: 'No Attorney-Client Relationship',
      content: 'The information contained on this website does not create an attorney-client relationship between you and SOLV Legal. An attorney-client relationship is formed only when you and SOLV Legal have signed a formal engagement agreement.'
    },
    {
      icon: FileText,
      title: 'Informational Purposes Only',
      content: 'All content on this website, including articles, case studies, and legal insights, is provided for informational purposes only and should not be construed as legal advice. The law varies by jurisdiction and changes frequently.'
    },
    {
      icon: Shield,
      title: 'No Guarantee of Results',
      content: 'Past results do not guarantee future outcomes. Every legal matter is unique, and the success of any particular case depends on numerous factors specific to that situation.'
    },
    {
      icon: Info,
      title: 'Consultation Required',
      content: 'We strongly recommend consulting with a qualified attorney before making any decisions based on information found on this website. Only through direct consultation can we provide advice tailored to your specific circumstances.'
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
            <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-yellow-400" />
            <h1 className="text-4xl lg:text-5xl font-bold font-serif mb-6">Legal Disclaimer</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Important information regarding the use of this website and the nature of our legal services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Disclaimer */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded-lg mb-12"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Important Notice</h2>
            <p className="text-lg text-slate-800 leading-relaxed">
              <strong>We are not soliciting work through this website.</strong> By proceeding to use this website, 
              you acknowledge and agree that the information provided is for educational and informational purposes 
              only. The content on this website does not constitute legal advice and should not be relied upon 
              as such. Any reliance you place on the information is strictly at your own risk.
            </p>
          </motion.div>

          {/* Disclaimer Sections */}
          <div className="space-y-8">
            {disclaimerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-slate-50 p-8 rounded-lg border border-slate-200"
              >
                <div className="flex items-start space-x-4">
                  <section.icon className="h-8 w-8 text-slate-700 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{section.title}</h3>
                    <p className="text-slate-700 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Terms */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-8">Additional Terms and Conditions</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Confidentiality</h3>
                <p className="text-slate-700 leading-relaxed">
                  Until an attorney-client relationship is established through a signed engagement agreement, 
                  any information you submit through this website or communicate to us may not be treated as 
                  confidential or privileged. Do not send confidential or sensitive information through this 
                  website until you have received confirmation that we can represent you.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Jurisdiction and Applicable Law</h3>
                <p className="text-slate-700 leading-relaxed">
                  The laws that govern legal matters vary significantly by jurisdiction. The information on this 
                  website may not be applicable to your situation if you are located outside our primary practice 
                  jurisdictions. Always consult with a local attorney familiar with the laws of your jurisdiction.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Website Content and Updates</h3>
                <p className="text-slate-700 leading-relaxed">
                  The legal information on this website is current as of the date of publication. Laws change 
                  frequently, and we cannot guarantee that all information remains current or accurate. 
                  This website may contain links to third-party websites that are not under our control, 
                  and we are not responsible for their content.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Limitation of Liability</h3>
                <p className="text-slate-700 leading-relaxed">
                  SOLV Legal and its attorneys disclaim all liability for any loss or damage that may result 
                  from reliance on information contained in this website. We make no warranties, express or 
                  implied, regarding the accuracy, completeness, or reliability of the information provided.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Privacy Policy</h3>
                <p className="text-slate-700 leading-relaxed">
                  We respect your privacy and are committed to protecting any personal information you may 
                  provide to us. Our privacy practices are governed by applicable law and professional 
                  ethics rules. By using this website, you consent to our collection and use of information 
                  as described in our Privacy Policy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold font-serif mb-4">Questions About Our Services?</h2>
            <p className="text-xl text-slate-300 mb-8">
              If you have questions about our legal services or would like to schedule a consultation, 
              please contact us directly. We're here to help you understand how we can assist with your legal needs.
            </p>
            <a
              href="/contact"
              className="bg-white text-slate-900 px-8 py-4 rounded-md font-semibold hover:bg-slate-100 transition-all duration-200 hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>Contact Us</span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};