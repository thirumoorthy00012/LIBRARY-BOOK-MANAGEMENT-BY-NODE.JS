import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const Events = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h1 className="section-title mb-0">Manage Events</h1>
          <Link to="/admin/events/create" className="btn btn-primary flex items-center">
            <FiPlus className="mr-2" /> Create Event
          </Link>
        </div>

        <div className="card p-6">
          <p className="text-gray-600">Event management interface</p>
        </div>
      </div>
    </div>
  );
};

export default Events;
