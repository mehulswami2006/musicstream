import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentForm.css';

const PaymentForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!stripe) return;

    try {
      // Create payment intent
      const response = await fetch('https://musicstream-92cd.onrender.com/api/payment/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, paymentMethod })
      });

      const { clientSecret } = await response.json();

      let result;
      if (paymentMethod === 'upi') {
        result = await stripe.confirmUpiPayment(clientSecret, {
          payment_method: {
            upi: {
              vpa: document.getElementById('upi-id').value
            }
          },
          return_url: window.location.origin + '/premium'
        });
      } else {
        result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)
          }
        });
      }

      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess(result.paymentIntent);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="payment-form">
      <h3>Premium Subscription - ₹{amount}</h3>
      
      <div className="payment-method-selector">
        <label>
          <input 
            type="radio" 
            value="card" 
            checked={paymentMethod === 'card'} 
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Credit/Debit Card
        </label>
        <label>
          <input 
            type="radio" 
            value="upi" 
            checked={paymentMethod === 'upi'} 
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          UPI
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        {paymentMethod === 'card' ? (
          <div className="card-element">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#fff',
                    '::placeholder': { color: '#aab7c4' }
                  }
                }
              }}
            />
          </div>
        ) : (
          <div className="upi-element">
            <input
              id="upi-id"
              type="text"
              placeholder="Enter UPI ID (e.g., user@paytm)"
              required
            />
          </div>
        )}
        
        {error && <div className="error">{error}</div>}
        <div className="payment-buttons">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit" disabled={!stripe || loading}>
            {loading ? 'Processing...' : `Pay ₹${amount}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;