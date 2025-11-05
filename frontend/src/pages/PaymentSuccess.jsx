import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiCheckCircle, FiDownload } from 'react-icons/fi';
import QRCode from 'react-qr-code';

const PaymentSuccess = () => {
  const { booking } = useSelector((state) => state.bookings);

  if (!booking) {
    return (
      <div className="container-custom py-16 text-center">
        <p className="text-gray-500 mb-4">No booking found</p>
        <Link to="/events" className="btn btn-primary">Browse Events</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container-custom max-w-2xl">
        <div className="card p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-green-600 text-5xl" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">Your booking has been confirmed</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Booking Reference</p>
            <p className="text-2xl font-bold text-primary-600 mb-6">{booking.bookingReference}</p>

            {booking.qrCode && (
              <div className="flex justify-center mb-4">
                <QRCode value={booking.qrCode} size={200} />
              </div>
            )}
            
            <p className="text-sm text-gray-600">Show this QR code at the venue</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/bookings/${booking._id}`} className="btn btn-primary">
              View Booking Details
            </Link>
            <Link to="/bookings" className="btn btn-outline">
              My Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
