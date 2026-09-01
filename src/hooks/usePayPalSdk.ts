import {useEffect, useState} from 'react';

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

interface PayPalCardFieldsActions {
  submit: () => Promise<void>;
}

interface PayPalCardFieldsOptions {
  createOrder: () => Promise<string>;
  onApprove: (data: {orderID: string}) => void | Promise<void>;
  onError?: (error: unknown) => void;
  style?: Record<string, unknown>;
}

export interface PayPalCardFieldsInstance {
  isEligible: () => boolean;
  NumberField: (options: {style?: Record<string, unknown>}) => {render: (selector: string) => void};
  ExpiryField: (options: {style?: Record<string, unknown>}) => {render: (selector: string) => void};
  CVVField: (options: {style?: Record<string, unknown>}) => {render: (selector: string) => void};
  submit: PayPalCardFieldsActions['submit'];
}

interface PayPalNamespace {
  CardFields: (options: PayPalCardFieldsOptions) => PayPalCardFieldsInstance;
}

const SCRIPT_ID = 'paypal-sdk';

let loadPromise: Promise<PayPalNamespace> | null = null;

function loadScript(clientId: string): Promise<PayPalNamespace> {
  if (window.paypal) return Promise.resolve(window.paypal);

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

      const handleLoad = () => {
        if (window.paypal) resolve(window.paypal);
        else reject(new Error('PayPal SDK failed to load.'));
      };

      if (existing) {
        existing.addEventListener('load', handleLoad);
        existing.addEventListener('error', () => reject(new Error('PayPal SDK failed to load.')));
        return;
      }

      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&components=card-fields&currency=USD`;
      script.async = true;
      script.addEventListener('load', handleLoad);
      script.addEventListener('error', () => reject(new Error('PayPal SDK failed to load.')));
      document.body.appendChild(script);
    });
  }

  return loadPromise;
}

export function usePayPalSdk(clientId: string) {
  const [paypal, setPaypal] = useState<PayPalNamespace | null>(window.paypal ?? null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadScript(clientId)
      .then((sdk) => {
        if (!cancelled) setPaypal(sdk);
      })
      .catch((loadError: Error) => {
        if (!cancelled) setError(loadError);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  return {paypal, isLoading: !paypal && !error, error};
}
