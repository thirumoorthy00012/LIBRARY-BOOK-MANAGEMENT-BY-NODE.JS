import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../features/bookings/bookingSlice';
import toast from 'react-hot-toast';
import { FiCreditCard, FiSmartphone, FiDollarSign } from 'react-icons/fi';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedSeats } = useSelector((state) => state.bookings);
  const { event } = useSelector((state) => state.events);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const bookingFee = totalAmount * 0.05;
  const tax = totalAmount * 0.1;
  const finalAmount = totalAmount + bookingFee + tax;

  const handlePayment = async () => {
    if (selectedSeats.length === 0) {
      toast.error('No seats selected');
      return;
    }

    setProcessing(true);
    try {
      const bookingData = {
        eventId: event._id,
        seats: selectedSeats,
        paymentMethod,
        paymentIntentId: 'mock_' + Date.now(), // Mock payment
      };

      console.log('Booking Data:', JSON.stringify(bookingData, null, 2));
      console.log('Selected Seats Type:', typeof selectedSeats);
      console.log('Selected Seats:', selectedSeats);

      await dispatch(createBooking(bookingData)).unwrap();
      toast.success('Booking successful!');
      navigate('/payment-success');
    } catch (error) {
      console.error('Booking Error:', error);
      toast.error(error || 'Booking failed');
    } finally {
      setProcessing(false);
    }
  };

  if (selectedSeats.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <p className="text-gray-500 mb-4">No seats selected</p>
        <button onClick={() => navigate('/events')} className="btn btn-primary">
          Browse Events
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <h1 className="section-title">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
              
              <div className="space-y-4 mb-6">
                {/* Credit/Debit Card */}
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-4 h-4 text-primary-600"
                  />
                  <div className="flex-1 flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <FiCreditCard className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <div className="font-semibold">Credit / Debit Card</div>
                      <div className="text-sm text-gray-500">Visa, Mastercard</div>
                    </div>
                  </div>
                </label>

                {/* UPI Payment */}
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-4 h-4 text-primary-600"
                  />
                  <div className="flex-1 flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <FiSmartphone className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <div className="font-semibold">UPI Payment</div>
                      <div className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</div>
                    </div>
                  </div>
                </label>

                {/* Digital Wallet */}
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'wallet' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-4 h-4 text-primary-600"
                  />
                  <div className="flex-1 flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <FiDollarSign className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <div className="font-semibold">Digital Wallet</div>
                      <div className="text-sm text-gray-500">PayPal, Apple Pay</div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="1234 5678 9012 3456" 
                      className="input"
                      maxLength="19"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className="input" maxLength="5" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input type="text" placeholder="123" className="input" maxLength="4" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input type="text" placeholder="Kiru Thick" className="input" />
                  </div>
                </div>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                    <input 
                      type="text" 
                      placeholder="yourname@upi" 
                      className="input"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter your UPI ID (e.g., username@paytm, 9876543210@ybl)</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <FiSmartphone className="text-purple-600 mt-1 mr-3" />
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold mb-1">Pay using UPI Apps:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          <li>Google Pay (GPay)</li>
                          <li>PhonePe</li>
                          <li>Paytm</li>
                          <li>BHIM UPI</li>
                          <li>Amazon Pay</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="text-center py-4">
                    <div className="inline-block p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-gray-400 mb-2">QR Code</div>
                      <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">Scan to Pay</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Scan with any UPI app to complete payment</p>
                  </div>
                </div>
              )}

              {/* Wallet Payment Form */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                      <div className="font-semibold">PayPal</div>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                      <div className="font-semibold">Apple Pay</div>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                      <div className="font-semibold">Google Pay</div>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                      <div className="font-semibold">Samsung Pay</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-2 mb-4">
                {selectedSeats.map((seat) => (
                  <div key={seat.seatId} className="flex justify-between text-sm">
                    <span>Seat {seat.seatNumber}</span>
                    <span>₹{seat.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Booking Fee (5%)</span>
                  <span>₹{bookingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (10%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary-600">₹{finalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 pt-2 border-t">
                  <span>Payment Method:</span>
                  <span className="font-semibold capitalize text-primary-600">
                    {paymentMethod === 'card' ? '💳 Card' : paymentMethod === 'upi' ? '📱 UPI' : '💰 Wallet'}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="btn btn-primary w-full mt-6"
              >
                {processing ? <div className="spinner" /> : 'Complete Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
