import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDisclaimer } from './DisclaimerManager';

export const DisclaimerPopup: React.FC = () => {
  const { hasAccepted, acceptDisclaimer } = useDisclaimer();
  const showPopup = !hasAccepted;

  const handleAccept = () => {
    acceptDisclaimer();
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <>
          {/* Dark Overlay Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
            style={{ 
              pointerEvents: 'auto',
              backgroundImage: 'url("https://images.pexels.com/photos/159832/justice-law-case-hearing-159832.jpeg?auto=compress&cs=tinysrgb&w=1920")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          {/* Dark overlay on top of background image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[9999]"
            style={{ pointerEvents: 'auto' }}
          />
          
          {/* Disclaimer Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="bg-black/60 backdrop-blur-md border border-gray-600/30 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="text-center py-8 px-8">
                <h1 className="text-4xl font-bold text-yellow-400 mb-8 tracking-wider">DISCLAIMER</h1>
                
                {/* Content */}
                <div className="text-white text-left space-y-6 leading-relaxed">
                  <p className="text-lg">
                    The rules of the Bar Council of India do not permit advocates to solicit work or advertise in any manner. This 
                    website has been created only for informational purposes and is not intended to constitute solicitation, invitation, 
                    advertisement or inducement of any sort whatsoever from us or any of our members to solicit any work in any 
                    manner. By clicking on 'Agree' below, you acknowledge and confirm the following:
                  </p>
                  
                  <div className="space-y-4 text-base">
                    <p>
                      <strong>a)</strong> there has been no solicitation, invitation, advertisement or inducement of any sort whatsoever from us or any 
                      of our members to solicit any work through this website;
                    </p>
                    
                    <p>
                      <strong>b)</strong> you are desirous of obtaining further information about us on your own accord and for your use;
                    </p>
                    
                    <p>
                      <strong>c)</strong> no information or material provided on this website is to be construed as a legal opinion and use of this 
                      website will not create any lawyer-client relationship;
                    </p>
                    
                    <p>
                      <strong>d)</strong> while reasonable care has been taken in ensuring the accuracy of the contents of the website, Argus Partners 
                      shall not be responsible for the results of any actions taken on the basis of information provided in this website 
                      or for any error or omission in the website; and
                    </p>
                    
                    <p>
                      <strong>e)</strong> in cases where the user has any legal issues, the user must seek independent legal advice.
                    </p>
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="flex justify-center space-x-6 mt-12">
                  <button
                    onClick={handleAccept}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded transition-colors duration-200 text-lg"
                  >
                    AGREE
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};