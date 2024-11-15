// jm811machado@gmail.com

import { Resend } from 'resend';
import 'next/navigation'

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, subject, message } = req.body;

    try {
      await resend.emails.send({
        from: 'no-reply@deerect.net',
        to: 'martino.volcy02@gmail.com',
        subject: `New message from ${name} on Deerect: ${subject}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
