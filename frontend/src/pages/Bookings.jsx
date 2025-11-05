import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBookings } from '../features/bookings/bookingSlice';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiCalendar, FiMapPin } from 'react-icons/fi';

const Bookings = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(getUserBookings({}));
  }, [dispatch]);

  if (isLoading) {
    return <div className="container-custom py-8"><div className="spinner mx-auto" /></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <h1 className="section-title">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-gray-500 mb-4">No bookings yet</p>
            <Link to="/events" className="btn btn-primary">Browse Events</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Link
                key={booking._id}
                to={`/bookings/${booking._id}`}
                className="card p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-shadow"
              >
                <img
                  src={booking.event?.coverImage?.url || 'https://via.placeholder.com/200x150'}
                  alt={booking.event?.title}
                  className="w-full md:w-48 h-32 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{booking.event?.title}</h3>
                    <span className={`badge ${
                      booking.status === 'confirmed' ? 'badge-success' :
                      booking.status === 'cancelled' ? 'badge-danger' :
                      'badge-warning'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2" />
                      <span>{booking.event?.date && format(new Date(booking.event.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                      <FiMapPin className="mr-2" />
                      <span>{booking.event?.venue?.city}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm">
                      <span className="font-medium">{booking.seats.length} seats</span> • 
                      <span className="text-gray-500"> {booking.bookingReference}</span>
                    </p>
                    <p className="text-lg font-bold text-primary-600">${booking.finalAmount}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
