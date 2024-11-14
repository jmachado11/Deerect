import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {sendEmail} from '@/lib/email-actions'

const Form = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
  
    try {
      const emailResult1 = await sendEmail(
        'martino.volcy02@gmail.com', 
        `New message from ${data.name} on Deerect: ${data.subject}`, // Email subject
        `
        Name: ${data.name}
        Email: ${data.email}
        Phone: ${data.phone}
        Message: ${data.message}
        ` // Email text content
      );
  
      if (!emailResult.success) {
        throw new Error(emailResult1.error || 'Failed to send message.');
      }

      const emailResult2 = await sendEmail(
        'jm811machado@gmail.com', // Recipient email 
        `New message from ${data.name} on Deerect: ${data.subject}`, // Email subject
        `
        Name: ${data.name}
        Email: ${data.email}
        Phone: ${data.phone}
        Message: ${data.message}
        ` // Email text content
      );
  
      if (!emailResult.success) {
        throw new Error(emailResult2.error || 'Failed to send message.');
      }

  
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error:', error);
      setSubmitError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <form className="contact_form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <input
              {...register("name", { 
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters"
                }
              })}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              type="text"
              placeholder="Name"
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              type="email"
              placeholder="Email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Please enter a valid 10-digit phone number"
                }
              })}
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              type="tel"
              placeholder="Phone (10 digits)"
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone.message}</div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <input
              {...register("subject", {
                required: "Subject is required",
                minLength: {
                  value: 3,
                  message: "Subject must be at least 3 characters"
                }
              })}
              className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
              type="text"
              placeholder="Subject"
            />
            {errors.subject && (
              <div className="invalid-feedback">{errors.subject.message}</div>
            )}
          </div>
        </div>

        <div className="col-sm-12">
          <div className="form-group">
            <textarea
              {...register("message", {
                required: "Message is required",
                minLength: {
                  value: 10,
                  message: "Message must be at least 10 characters"
                }
              })}
              className={`form-control ${errors.message ? 'is-invalid' : ''}`}
              rows="8"
              placeholder="Your Message"
            ></textarea>
            {errors.message && (
              <div className="invalid-feedback">{errors.message.message}</div>
            )}
          </div>

          <div className="form-group mb0">
            {submitError && (
              <div className="alert alert-danger mb-3">{submitError}</div>
            )}
            {submitSuccess && (
              <div className="alert alert-success mb-3">
                Message sent successfully!
              </div>
            )}
            <button 
              type="submit" 
              className="btn btn-lg btn-thm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;