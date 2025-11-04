import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send booking confirmation email
export const sendBookingConfirmation = async (booking, event, user) => {
  const mailOptions = {
    from: `"Event Booking" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Booking Confirmation - ${event.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .qr-code { text-align: center; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; }
          .btn { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your tickets are ready</p>
          </div>
          
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>Your booking for <strong>${event.title}</strong> has been confirmed!</p>
            
            <div class="booking-details">
              <h3>Booking Details</h3>
              <div class="detail-row">
                <span><strong>Booking Reference:</strong></span>
                <span>${booking.bookingReference}</span>
              </div>
              <div class="detail-row">
                <span><strong>Event:</strong></span>
                <span>${event.title}</span>
              </div>
              <div class="detail-row">
                <span><strong>Date:</strong></span>
                <span>${new Date(event.date).toLocaleDateString()} at ${event.startTime}</span>
              </div>
              <div class="detail-row">
                <span><strong>Venue:</strong></span>
                <span>${event.venue.name}, ${event.venue.city}</span>
              </div>
              <div class="detail-row">
                <span><strong>Number of Seats:</strong></span>
                <span>${booking.seats.length}</span>
              </div>
              <div class="detail-row">
                <span><strong>Seats:</strong></span>
                <span>${booking.seats.map(s => s.seatNumber).join(', ')}</span>
              </div>
              <div class="detail-row">
                <span><strong>Total Amount:</strong></span>
                <span>$${booking.finalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div class="qr-code">
              <h3>Your Ticket QR Code</h3>
              <img src="${booking.qrCode}" alt="Booking QR Code" style="max-width: 200px;" />
              <p><small>Show this QR code at the venue entrance</small></p>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL}/bookings/${booking._id}" class="btn">View Booking Details</a>
            </div>

            <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-left: 4px solid #ffc107;">
              <h4>📋 Important Information:</h4>
              <ul>
                <li>Please arrive at least 30 minutes before the event starts</li>
                <li>Bring a valid ID for verification</li>
                <li>Save this email or take a screenshot of the QR code</li>
                <li>Cancellations are allowed up to 48 hours before the event</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for booking with us!</p>
            <p>Need help? Contact us at ${process.env.EMAIL_USER}</p>
            <p style="font-size: 12px; color: #999;">
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send cancellation email
export const sendCancellationEmail = async (booking, event, user) => {
  const mailOptions = {
    from: `"Event Booking" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Booking Cancelled - ${event.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Cancelled</h2>
        <p>Hello ${user.name},</p>
        <p>Your booking (Reference: ${booking.bookingReference}) for ${event.title} has been cancelled.</p>
        ${booking.refundAmount ? `<p>Refund Amount: $${booking.refundAmount.toFixed(2)}</p>` : ''}
        <p>The refund will be processed within 5-7 business days.</p>
        <p>Thank you for using our service.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default transporter;
