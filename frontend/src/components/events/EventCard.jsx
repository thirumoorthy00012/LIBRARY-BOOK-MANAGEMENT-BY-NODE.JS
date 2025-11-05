import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiCalendar, FiMapPin, FiDollarSign, FiArrowRight } from 'react-icons/fi';

const EventCard = ({ event }) => {
  return (
    <Link to={`/events/${event._id}`} className="card overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.coverImage?.url || 'https://via.placeholder.com/400x300?text=Event'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {event.featured && (
          <span className="absolute top-2 right-2 badge badge-warning">Featured</span>
        )}
        <span className="absolute top-2 left-2 badge badge-primary">{event.category}</span>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <FiCalendar className="mr-2 text-primary-500" />
            <span>{format(new Date(event.date), 'MMM dd, yyyy')} • {event.startTime}</span>
          </div>
          <div className="flex items-center">
            <FiMapPin className="mr-2 text-primary-500" />
            <span>{event.venue.city}, {event.venue.country}</span>
          </div>
          <div className="flex items-center">
            <FiDollarSign className="mr-2 text-primary-500" />
            <span>From ₹{event.pricing.Standard || 0}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{event.availableSeats} seats left</span>
          <span className="text-primary-600 font-medium flex items-center group-hover:gap-2 transition-all">
            View Details
            <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
