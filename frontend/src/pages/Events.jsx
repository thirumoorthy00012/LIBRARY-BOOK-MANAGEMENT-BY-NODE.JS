import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents, setFilters } from '../features/events/eventSlice';
import EventCard from '../components/events/EventCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

const Events = () => {
  const dispatch = useDispatch();
  const { events, isLoading, filters, page, pages } = useSelector((state) => state.events);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    dispatch(getEvents({ ...filters, page, search, category }));
  }, [dispatch, page, search, category]);

  const categories = ['all', 'Concert', 'Sports', 'Theater', 'Conference', 'Workshop', 'Festival', 'Comedy'];

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <h1 className="section-title">Browse Events</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="input pl-10 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input md:w-48"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-4">
                <div className="skeleton h-48 mb-4" />
                <div className="skeleton h-6 w-3/4 mb-2" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No events found</p>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => dispatch(setFilters({ page: i + 1 }))}
                className={`px-4 py-2 rounded-lg ${
                  page === i + 1 ? 'bg-primary-500 text-white' : 'bg-white text-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
