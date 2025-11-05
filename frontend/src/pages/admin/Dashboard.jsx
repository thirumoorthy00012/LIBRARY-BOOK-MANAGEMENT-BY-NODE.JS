import { useEffect, useState } from 'react';
import axios from '../../services/axios';
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('/admin/analytics');
      setAnalytics(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner mx-auto mt-8" />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <h1 className="section-title">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{analytics?.overview?.totalUsers || 0}</p>
              </div>
              <FiUsers className="text-primary-500 text-4xl" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Events</p>
                <p className="text-3xl font-bold">{analytics?.overview?.totalEvents || 0}</p>
              </div>
              <FiCalendar className="text-green-500 text-4xl" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold">{analytics?.overview?.totalBookings || 0}</p>
              </div>
              <FiTrendingUp className="text-yellow-500 text-4xl" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold">₹{analytics?.overview?.totalRevenue?.toFixed(2) || 0}</p>
              </div>
              <FiDollarSign className="text-purple-500 text-4xl" />
            </div>
          </div>
        </div>

        {/* Popular Events */}
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Popular Events</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Event</th>
                  <th className="text-left py-3">Bookings</th>
                  <th className="text-left py-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.popularEvents?.map((event) => (
                  <tr key={event._id} className="border-b">
                    <td className="py-3">{event.title}</td>
                    <td className="py-3">{event.totalBookings}</td>
                    <td className="py-3">₹{event.totalRevenue?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">Revenue by Category</h2>
          <div className="space-y-4">
            {analytics?.revenueByCategory?.map((cat) => (
              <div key={cat._id}>
                <div className="flex justify-between mb-1">
                  <span>{cat._id}</span>
                  <span className="font-bold">₹{cat.revenue?.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${(cat.revenue / analytics.overview.totalRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
