import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type CookieConsentType = 'accepted' | 'denied' | null;

interface CookieConsentContextType {
cookieConsent: CookieConsentType;
setCookieConsent: (value: CookieConsentType) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const [cookieConsent, setCookieConsent] = useState<CookieConsentType>(null);

useEffect(() => {
    // Initialize from localStorage
    const storedConsent = localStorage.getItem('cookieConsent') as CookieConsentType;
    if (storedConsent) {
    setCookieConsent(storedConsent);
    }
}, []);

return (
    <CookieConsentContext.Provider value={{ cookieConsent, setCookieConsent }}>
    {children}
    </CookieConsentContext.Provider>
);
};

export const useCookieConsent = () => {
const context = useContext(CookieConsentContext);
if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
}
return context;
};