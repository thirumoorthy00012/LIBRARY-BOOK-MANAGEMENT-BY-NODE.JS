import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEventById } from '../features/events/eventSlice';
import { format } from 'date-fns';
import { FiCalendar, FiMapPin, FiClock, FiUsers } from 'react-icons/fi';
import SeatSelection from '../components/seats/SeatSelection';
import toast from 'react-hot-toast';

const EventDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { event, isLoading } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const { selectedSeats } = useSelector((state) => state.bookings);
  const [showSeatSelection, setShowSeatSelection] = useState(false);

  useEffect(() => {
    dispatch(getEventById(id));
  }, [dispatch, id]);

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    setShowSeatSelection(true);
  };

  if (isLoading || !event) {
    return <div className="container-custom py-8"><div className="spinner mx-auto" /></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Image */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={event.coverImage?.url}
          alt={event.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-custom pb-8 text-white">
          <span className="badge badge-primary mb-4">{event.category}</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>

            {!showSeatSelection && (
              <div className="card p-6">
                <h2 className="text-2xl font-bold mb-4">Event Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <FiCalendar className="text-primary-500 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">Date</p>
                      <p className="text-gray-600">{format(new Date(event.date), 'EEEE, MMMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiClock className="text-primary-500 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">Time</p>
                      <p className="text-gray-600">{event.startTime} - {event.endTime || 'TBA'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiMapPin className="text-primary-500 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">Venue</p>
                      <p className="text-gray-600">{event.venue.name}</p>
                      <p className="text-gray-500 text-sm">{event.venue.address}, {event.venue.city}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiUsers className="text-primary-500 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">Available Seats</p>
                      <p className="text-gray-600">{event.availableSeats} / {event.capacity}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {!showSeatSelection ? (
              <div className="card p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Ticket Prices</h3>
                <div className="space-y-3 mb-6">
                  {Object.entries(event.pricing).map(([type, price]) => (
                    price > 0 && (
                      <div key={type} className="flex justify-between items-center pb-3 border-b">
                        <span className="font-medium">{type}</span>
                        <span className="text-primary-600 font-bold">₹{price}</span>
                      </div>
                    )
                  ))}
                </div>
                <button onClick={handleBookNow} className="btn btn-primary w-full">
                  Select Seats
                </button>
              </div>
            ) : (
              <SeatSelection event={event} onClose={() => setShowSeatSelection(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
