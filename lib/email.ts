// Email service for sending order confirmations
// This uses Nodemailer - update with your email service credentials

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload) {
  try {
    // For development, log the email instead of sending
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent:', {
        to: payload.to,
        subject: payload.subject,
      });
      return { success: true, message: 'Email logged (development mode)' };
    }

    // In production, integrate with real email service
    // Example with Resend, SendGrid, or Nodemailer:
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'orders@artisancoffee.com',
    //     to: payload.to,
    //     subject: payload.subject,
    //     html: payload.html,
    //   }),
    // });

    return { success: true, message: 'Email sent' };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, message: 'Failed to send email' };
  }
}

export function generateOrderConfirmationEmail(data: {
  orderId: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: string }>;
  totalPrice: number;
  deliveryAddress: string;
  estimatedDelivery: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; }
          .header { background: linear-gradient(135deg, #2D1810 0%, #1A0F0A 100%); color: #F5E6D3; padding: 20px; text-align: center; border-radius: 8px; }
          .order-id { font-size: 24px; font-weight: bold; margin: 20px 0; }
          .item { padding: 10px 0; border-bottom: 1px solid #ddd; }
          .total { font-size: 20px; font-weight: bold; color: #4F9C8F; margin: 20px 0; }
          .button { background: #4F9C8F; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 20px; }
          .footer { color: #999; font-size: 12px; margin-top: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>☕ Artisan Coffee</h1>
            <p>Order Confirmation</p>
          </div>
          
          <p>Hi ${data.customerName},</p>
          <p>Thank you for your order! We're thrilled to prepare your premium coffee.</p>
          
          <div class="order-id">Order #${data.orderId}</div>
          
          <h2>Order Details:</h2>
          ${data.items
      .map(
        item =>
          `<div class="item">
                  <strong>${item.name}</strong> x ${item.quantity} = ${item.price}
                </div>`
      )
      .join('')}
          
          <div class="total">Total: $${data.totalPrice.toFixed(2)}</div>
          
          <h3>Delivery Information:</h3>
          <p>
            <strong>Address:</strong> ${data.deliveryAddress}<br>
            <strong>Estimated Delivery:</strong> ${data.estimatedDelivery}
          </p>
          
          <p>You can track your order status anytime by visiting our website.</p>
          
          <a href="${getBaseUrl()}/orders/${data.orderId}" class="button">Track Order</a>
          
          <div class="footer">
            <p>Artisan Coffee Co. | Premium Coffee Delivered Fresh</p>
            <p>Questions? Reply to this email or visit our support page.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getBaseUrl() {
  // Priority 1: Vercel Production URL (Auto-generated)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // Priority 2: Manual Base URL override (only if explicitly set)
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Priority 3: Localhost Fallback (Strictly 3000)
  return 'http://localhost:3000';
}
