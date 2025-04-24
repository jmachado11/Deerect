'use client';

import { useState } from 'react';
import { addToWaitlist } from '@/lib/google-sheet-actions';
import '@/public/assets/scss/waitlist.css';
import { sendEmail } from "@/lib/email-actions";

function Hero() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear any existing status messages when the user starts typing
    setStatusMessage('');
    setError('');
  }

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const submitEmail = async () => {
    // Reset status
    setStatusMessage('');
    setError('');

    // Validate email format
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    const userEmail = email

    try {
      // Call the server action
      const result = await addToWaitlist(email);

      if (!result.success) {
        throw new Error(result.message || 'Something went wrong');
      }

      if (result.alreadyExists) {
        setStatusMessage('This email is already on our waitlist!');
      } else {
        setStatusMessage('Thanks for joining our waitlist!');
        setEmail(''); // Clear the email field on success
      }
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again later.');
    } finally {
      // setIsSubmitting(false);
    }



    try {
          const emails = [
            'martino.volcy02@gmail.com',
            'jm811machado@gmail.com'
          ];
    
          const emailPromises = emails.map(email => 
            sendEmail(
              email, 
              `New Waitlist Submission `,
              `
              
              <p><strong>Email:</strong> ${userEmail}</p>
              `,
              true // Set to true to send as HTML
            )
          );
    
          const results = await Promise.allSettled(emailPromises);
    
          
    
         
      
          
        } catch {
          console.error('Error in sending email');
          
        } finally {
          setIsSubmitting(false);
        }
      




  }

  return(
    <div className="hero-container">
      <div className='hero-image'></div>
      <div className='hero-text'>
        <h1>
        The Future of Tax Lien Investing <br className='hero-h1-break'></br>
        Starts with <span className='hero-name'>Deerect</span>
        </h1>
        <h2>Join the waitlist to access smarter tools, exclusive<br className='hero-h2-break'></br>listings,and a seamless investing experience.</h2>
      </div>
      <div className='hero-action'>
        <div className='hero-input-container'>
          <div className='hero-input'>
            <img src='/assets/images/waitlist/mail.png' alt="email icon"></img>
            <input 
              onChange={handleEmailChange} 
              value={email} 
              placeholder="Your email address" 
              style={email.length!==0?{backgroundColor:"#31313170"}:{}}
            ></input>
          </div>
          <button onClick={submitEmail} disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Join the waitlist'}
          </button>
        </div>
        <div className='hero-messages'>
          {statusMessage && <p className="status-message success">{statusMessage}</p>}
          {error && <p className="status-message error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Hero;