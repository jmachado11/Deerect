import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendEmail } from "@/lib/email-actions";
import "../../public/assets/scss/waitlist.css";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

function Contact({ toggleContact }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
  
    try {
      const emails = [
        'martino.volcy02@gmail.com',
        'jm811machado@gmail.com'
      ];

      const emailPromises = emails.map(email => 
        sendEmail(
          email, 
          `New Contact Form Submission - ${data.firstName} ${data.lastName}`,
          `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
          `,
          true // Set to true to send as HTML
        )
      );

      const results = await Promise.allSettled(emailPromises);

      const failedEmails = results.filter(
        result => result.status === 'rejected' || 
        (result.status === 'fulfilled' && !result.value.success)
      );

      if (failedEmails.length > 0) {
        console.error('Failed emails:', failedEmails);
        throw new Error('Failed to send one or more emails');
      }
  
      setSubmitSuccess(true);
      reset();
      setTimeout(() => {
        toggleContact();
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setSubmitError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="waitlist-contact-page">
      <div className="waitlist-contact-container">
        <div className="waitlist-contact-title">
          <h2>Send us a message</h2>
          <h3>
            Feel free to send us a message, and we'll get back to you as soon as
            possible.
          </h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="waitlist-contact-inputs">
          <div className="waitlist-contact-name">
            <div className="waitlist-contact-input">
              <p>First name</p>
              <input
                {...register("firstName")}
                required
                className={`waitlist-contact-name-input ${errors.firstName ? 'error' : ''}`}
                placeholder="Jane"
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName.message}</span>
              )}
            </div>
            <div className="waitlist-contact-input">
              <p>Last name</p>
              <input
                required
                {...register("lastName")}
                className={`waitlist-contact-name-input ${errors.lastName ? 'error' : ''}`}
                placeholder="Doe"
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName.message}</span>
              )}
            </div>
          </div>
          <div className="waitlist-contact-input">
            <p>Email address</p>
            <input
              {...register("email")}
              required
              className={errors.email ? 'error' : ''}
              placeholder="example123@gmail.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>
          <div className="waitlist-contact-input">
            <p>Phone number</p>
            <input
              {...register("phone")}
              required
              className={errors.phone ? 'error' : ''}
              placeholder="+1 (555)-555-5555"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone.message}</span>
            )}
          </div>
          <div className="waitlist-contact-input">
            <p>Message</p>
            <textarea
              {...register("message")}
              required
              className={errors.message ? 'error' : ''}
              placeholder="Write your message..."
              disabled={isSubmitting}
            />
            {errors.message && (
              <span className="error-message">{errors.message.message}</span>
            )}
          </div>
          {submitError && (
            <div className="error-message">{submitError}</div>
          )}
          {submitSuccess && (
            <div className="success-message">Message sent successfully!</div>
          )}
          <div className="waitlist-contact-action">
            <button 
              type="submit" 
              className="waitlist-contact-send-message"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send message'}
            </button>
            <button 
              type="button" 
              onClick={toggleContact} 
              className="waitlist-contact-cancel"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;
