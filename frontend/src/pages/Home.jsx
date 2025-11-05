import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers, FiTrendingUp, FiSearch } from 'react-icons/fi';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from '../features/events/eventSlice';
import EventCard from '../components/events/EventCard';

const Home = () => {
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getEvents({ limit: 6, featured: true }));
  }, [dispatch]);

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Discover Amazing Events
            </h1>
            <p className="text-xl mb-8 text-gray-100 animate-slide-up">
              Book tickets for concerts, sports, theater, and more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Link to="/events" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Browse Events
              </Link>
              <Link to="/register" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Book tickets in just a few clicks</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Seat Selection</h3>
              <p className="text-gray-600">Choose your perfect seat in real-time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-yellow-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Multiple payment options available</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Tickets</h3>
              <p className="text-gray-600">Instant QR code tickets via email</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title mb-0">Featured Events</h2>
            <Link to="/events" className="btn btn-outline">
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-4">
                  <div className="skeleton h-48 mb-4" />
                  <div className="skeleton h-6 w-3/4 mb-2" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.slice(0, 6).map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-bg text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Something Amazing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of event-goers and never miss out on incredible experiences
          </p>
          <Link to="/events" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg inline-flex items-center">
            <FiSearch className="mr-2" />
            Explore Events
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
