import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addSeat, removeSeat, clearSeats } from '../../features/bookings/bookingSlice';
import axios from '../../services/axios';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

const SeatSelection = ({ event, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedSeats } = useSelector((state) => state.bookings);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeats();
    socket.emit('join-event', event._id);

    socket.on('seat-updated', ({ seatId, status }) => {
      setSeats((prev) =>
        prev.map((seat) => (seat._id === seatId ? { ...seat, status } : seat))
      );
    });

    return () => {
      socket.emit('leave-event', event._id);
      socket.off('seat-updated');
    };
  }, [event._id]);

  const fetchSeats = async () => {
    try {
      const { data } = await axios.get(`/events/${event._id}/seats`);
      setSeats(data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load seats');
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.status !== 'available') return;

    const isSelected = selectedSeats.find((s) => s.seatId === seat._id);
    
    if (isSelected) {
      dispatch(removeSeat(seat._id));
    } else {
      dispatch(addSeat({
        seatId: seat._id,
        seatNumber: seat.seatNumber,
        row: seat.row,
        section: seat.section,
        type: seat.type,
        price: seat.price,
      }));
    }
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    navigate('/checkout');
  };

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  if (loading) {
    return <div className="spinner mx-auto" />;
  }

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold mb-4">Select Your Seats</h3>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div className="flex items-center">
          <div className="seat seat-available mr-2" />
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="seat seat-selected mr-2" />
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="seat seat-booked mr-2" />
          <span>Booked</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="overflow-x-auto mb-6">
        <div className="min-w-max">
          <div className="text-center mb-4 py-2 bg-gray-200 rounded">STAGE</div>
          <div className="space-y-2">
            {Object.entries(seatsByRow).map(([row, rowSeats]) => (
              <div key={row} className="flex items-center gap-2">
                <span className="w-8 text-center font-bold">{row}</span>
                <div className="flex gap-1">
                  {rowSeats.map((seat) => (
                    <button
                      key={seat._id}
                      onClick={() => handleSeatClick(seat)}
                      className={`seat ${
                        selectedSeats.find((s) => s.seatId === seat._id)
                          ? 'seat-selected'
                          : seat.status === 'available'
                          ? 'seat-available'
                          : 'seat-booked'
                      }`}
                      disabled={seat.status !== 'available'}
                      title={`${seat.seatNumber} - ₹${seat.price}`}
                    >
                      {seat.seatNumber.slice(-2)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Selected Seats:</span>
          <span className="font-bold">{selectedSeats.length}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Total:</span>
          <span className="text-primary-600 font-bold text-xl">₹{totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => dispatch(clearSeats())} className="btn btn-secondary flex-1">
            Clear
          </button>
          <button onClick={handleProceed} className="btn btn-primary flex-1">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
