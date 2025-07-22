import React, { createContext, useContext, useState, useEffect } from 'react';

interface DisclaimerContextType {
  hasAccepted: boolean;
  acceptDisclaimer: () => void;
  resetDisclaimer: () => void;
}

const DisclaimerContext = createContext<DisclaimerContextType | undefined>(undefined);

export const useDisclaimer = () => {
  const context = useContext(DisclaimerContext);
  if (!context) {
    throw new Error('useDisclaimer must be used within a DisclaimerProvider');
  }
  return context;
};

interface DisclaimerProviderProps {
  children: React.ReactNode;
}

export const DisclaimerProvider: React.FC<DisclaimerProviderProps> = ({ children }) => {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkDisclaimerStatus();
  }, []);

  const checkDisclaimerStatus = () => {
    try {
      const accepted = localStorage.getItem('solv-disclaimer-accepted');
      const acceptedDate = localStorage.getItem('solv-disclaimer-date');
      
      if (accepted === 'true' && acceptedDate) {
        // Check if acceptance is still valid (e.g., within 30 days)
        const acceptDate = new Date(acceptedDate);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - acceptDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 30) {
          setHasAccepted(true);
        } else {
          // Reset if older than 30 days
          localStorage.removeItem('solv-disclaimer-accepted');
          localStorage.removeItem('solv-disclaimer-date');
          setHasAccepted(false);
        }
      } else {
        setHasAccepted(false);
      }
    } catch (error) {
      console.error('Error checking disclaimer status:', error);
      setHasAccepted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptDisclaimer = () => {
    try {
      localStorage.setItem('solv-disclaimer-accepted', 'true');
      localStorage.setItem('solv-disclaimer-date', new Date().toISOString());
      setHasAccepted(true);
    } catch (error) {
      console.error('Error saving disclaimer acceptance:', error);
    }
  };

  const resetDisclaimer = () => {
    try {
      localStorage.removeItem('solv-disclaimer-accepted');
      localStorage.removeItem('solv-disclaimer-date');
      setHasAccepted(false);
    } catch (error) {
      console.error('Error resetting disclaimer:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <DisclaimerContext.Provider value={{ hasAccepted, acceptDisclaimer, resetDisclaimer }}>
      {children}
    </DisclaimerContext.Provider>
  );
};