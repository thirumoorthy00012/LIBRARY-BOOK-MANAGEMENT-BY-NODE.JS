import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/axios';

const initialState = {
  bookings: [],
  booking: null,
  selectedSeats: [],
  total: 0,
  page: 1,
  pages: 1,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Create booking
export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, thunkAPI) => {
    try {
      const response = await axios.post('/bookings', bookingData);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user bookings
export const getUserBookings = createAsyncThunk(
  'bookings/getUserBookings',
  async (params, thunkAPI) => {
    try {
      const response = await axios.get('/bookings', { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get booking by ID
export const getBookingById = createAsyncThunk(
  'bookings/getById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`/bookings/${id}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Cancel booking
export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async ({ id, reason }, thunkAPI) => {
    try {
      const response = await axios.put(`/bookings/${id}/cancel`, { reason });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Confirm payment
export const confirmPayment = createAsyncThunk(
  'bookings/confirmPayment',
  async ({ id, transactionId }, thunkAPI) => {
    try {
      const response = await axios.put(`/bookings/${id}/confirm-payment`, {
        transactionId,
      });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    addSeat: (state, action) => {
      const seat = action.payload;
      const exists = state.selectedSeats.find((s) => s.seatId === seat.seatId);
      if (!exists) {
        state.selectedSeats.push(seat);
      }
    },
    removeSeat: (state, action) => {
      state.selectedSeats = state.selectedSeats.filter(
        (s) => s.seatId !== action.payload
      );
    },
    clearSeats: (state) => {
      state.selectedSeats = [];
    },
    setBooking: (state, action) => {
      state.booking = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.booking = action.payload;
        state.selectedSeats = [];
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get user bookings
      .addCase(getUserBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get booking by ID
      .addCase(getBookingById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.booking = action.payload;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Cancel booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.booking = action.payload;
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload._id ? action.payload : booking
        );
      })
      // Confirm payment
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.booking = action.payload;
      });
  },
});

export const { reset, addSeat, removeSeat, clearSeats, setBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
