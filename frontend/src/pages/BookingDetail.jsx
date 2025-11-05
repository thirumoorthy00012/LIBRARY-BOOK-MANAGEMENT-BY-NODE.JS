import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBookingById, cancelBooking } from '../features/bookings/bookingSlice';
import { format } from 'date-fns';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';
import { FiDownload, FiX } from 'react-icons/fi';

const BookingDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { booking, isLoading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(getBookingById(id));
  }, [dispatch, id]);

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await dispatch(cancelBooking({ id, reason: 'User cancelled' })).unwrap();
        toast.success('Booking cancelled successfully');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  if (isLoading || !booking) {
    return <div className="container-custom py-8"><div className="spinner mx-auto" /></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom max-w-4xl">
        <div className="card p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{booking.event?.title}</h1>
              <p className="text-gray-600">Booking Reference: {booking.bookingReference}</p>
            </div>
            <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Event Details</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Date:</strong> {format(new Date(booking.event?.date), 'MMMM dd, yyyy')}</p>
                <p><strong>Time:</strong> {booking.event?.startTime}</p>
                <p><strong>Venue:</strong> {booking.event?.venue?.name}</p>
                <p><strong>Location:</strong> {booking.event?.venue?.city}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Seats:</strong> {booking.seats.map(s => s.seatNumber).join(', ')}</p>
                <p><strong>Total Amount:</strong> ${booking.finalAmount}</p>
                <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
                <p><strong>Booked On:</strong> {format(new Date(booking.createdAt), 'MMM dd, yyyy')}</p>
              </div>
            </div>
          </div>

          {booking.qrCode && (
            <div className="text-center mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-4">Your Ticket QR Code</h3>
              <div className="inline-block p-4 bg-white rounded-lg">
                <QRCode value={booking.qrCode} size={256} />
              </div>
              <p className="text-sm text-gray-600 mt-4">Present this at the venue entrance</p>
            </div>
          )}

          <div className="flex gap-4">
            {booking.status === 'confirmed' && (
              <button onClick={handleCancel} className="btn btn-danger flex items-center">
                <FiX className="mr-2" /> Cancel Booking
              </button>
            )}
            <button className="btn btn-outline flex items-center">
              <FiDownload className="mr-2" /> Download Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
