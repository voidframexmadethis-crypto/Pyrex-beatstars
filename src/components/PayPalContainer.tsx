import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalContainerProps {
  onSuccess: (details: any) => void;
  onError: (err: any) => void;
}

export const PayPalContainer: React.FC<PayPalContainerProps> = ({ onSuccess, onError }) => {
  return (
    <PayPalScriptProvider options={{ clientId: "test", currency: "USD" }}>
        <PayPalButtons 
            createOrder={(data, actions) => {
                return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [{
                        amount: {
                            value: '69.55',
                            currency_code: 'USD'
                        },
                        description: "Additional Custom Beat Request Token Reload"
                    }]
                });
            }}
            onApprove={async (data, actions) => {
                if (actions.order) {
                    const details = await actions.order.capture();
                    onSuccess(details);
                }
            }}
            onError={onError}
            style={{ layout: 'vertical', color: 'gold', shape: 'pill', label: 'checkout' }}
        />
    </PayPalScriptProvider>
  );
};
