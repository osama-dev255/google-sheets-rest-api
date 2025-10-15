import React, { createContext, useContext, useState, useEffect } from 'react';

interface ReceiptSettings {
  header: string;
  addressLine1: string;
  addressLine2: string;
  paymentMethod: string;
  showTax: boolean;
  showDiscounts: boolean;
  footer: string;
}

interface ReceiptSettingsContextType {
  settings: ReceiptSettings;
  updateSettings: (newSettings: Partial<ReceiptSettings>) => void;
}

const ReceiptSettingsContext = createContext<ReceiptSettingsContextType | undefined>(undefined);

const DEFAULT_RECEIPT_SETTINGS: ReceiptSettings = {
  header: 'POS Store',
  addressLine1: '123 Main Street',
  addressLine2: 'City, State 12345',
  paymentMethod: 'Credit Card',
  showTax: true,
  showDiscounts: true,
  footer: 'Thank you for your purchase!'
};

export function ReceiptSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ReceiptSettings>(DEFAULT_RECEIPT_SETTINGS);

  useEffect(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('receiptSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_RECEIPT_SETTINGS, ...parsedSettings });
      } catch (e) {
        console.error('Failed to parse receipt settings', e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<ReceiptSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    // Save to localStorage
    localStorage.setItem('receiptSettings', JSON.stringify(updatedSettings));
  };

  return (
    <ReceiptSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ReceiptSettingsContext.Provider>
  );
}

export function useReceiptSettings() {
  const context = useContext(ReceiptSettingsContext);
  if (context === undefined) {
    throw new Error('useReceiptSettings must be used within a ReceiptSettingsProvider');
  }
  return context;
}