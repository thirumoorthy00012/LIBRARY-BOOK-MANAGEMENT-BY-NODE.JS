import { Link } from 'react-router-dom';
import { FiCalendar, FiFacebook, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <FiCalendar className="text-white text-2xl" />
              </div>
              <span className="text-2xl font-bold text-white">EventBooking</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your one-stop platform for discovering and booking amazing events.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="hover:text-primary-400 transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-primary-400 transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events?category=Concert" className="hover:text-primary-400 transition-colors">
                  Concerts
                </Link>
              </li>
              <li>
                <Link to="/events?category=Sports" className="hover:text-primary-400 transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/events?category=Theater" className="hover:text-primary-400 transition-colors">
                  Theater
                </Link>
              </li>
              <li>
                <Link to="/events?category=Conference" className="hover:text-primary-400 transition-colors">
                  Conferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="hover:text-primary-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-primary-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} EventBooking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
