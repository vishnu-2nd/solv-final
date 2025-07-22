import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDisclaimer } from './DisclaimerManager';

export const DisclaimerPopup: React.FC = () => {
  const { hasAccepted, acceptDisclaimer } = useDisclaimer();
  const showPopup = !hasAccepted;

  const handleAccept = () => {
    acceptDisclaimer();
  };

  const handleDecline = () => {
    // Redirect to a different page or show a message
    window.location.href = 'https://www.google.com';
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            style={{ pointerEvents: 'auto' }}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-8 w-8 text-yellow-400 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold font-serif">Legal Disclaimer</h2>
                    <p className="text-slate-300 text-sm mt-1">Important information regarding our legal services</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                      <p className="text-yellow-700 text-sm leading-relaxed">
                        <strong>We are not soliciting work through this website.</strong> By proceeding to use this website, 
                        you acknowledge and agree that the information provided is for educational and informational purposes 
                        only.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">No Attorney-Client Relationship</h4>
                      <p className="text-slate-700 text-sm">
                        The information on this website does not create an attorney-client relationship. 
                        Such a relationship is formed only through a signed engagement agreement.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Informational Purposes Only</h4>
                      <p className="text-slate-700 text-sm">
                        All content is provided for informational purposes only and should not be construed 
                        as legal advice. The law varies by jurisdiction and changes frequently.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">No Guarantee of Results</h4>
                      <p className="text-slate-700 text-sm">
                        Past results do not guarantee future outcomes. Every legal matter is unique and 
                        depends on numerous case-specific factors.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Consultation Required</h4>
                      <p className="text-slate-700 text-sm">
                        We strongly recommend consulting with a qualified attorney before making decisions 
                        based on information found on this website.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-600 text-sm">
                    By clicking "I Understand and Agree" below, you acknowledge that you have read and understood 
                    this disclaimer. For complete terms and conditions, please visit our{' '}
                    <Link to="/disclaimer" className="text-slate-800 underline hover:text-slate-600">
                      full disclaimer page
                    </Link>.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-slate-50 px-6 py-4 rounded-b-lg flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleDecline}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-md font-semibold hover:bg-slate-100 transition-all duration-200 inline-flex items-center justify-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>I Do Not Agree</span>
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 inline-flex items-center justify-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>I Understand and Agree</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};