'use client'
import { useState, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

const ProfileInfo = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const supabase = createClient();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (user) {
          // Pre-fill form with existing data
          reset({
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            phone: user.user_metadata?.phone_number || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage({ type: 'error', text: 'Error loading user data' });
      }
    };

    fetchUserData();
  }, [reset]);

  const onSubmit = async (formData) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update user metadata and email if changed
      const { data, error } = await supabase.auth.updateUser({
        email: formData.email,
        data: {
          full_name: formData.full_name,
          phone_number: formData.phone
        }
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // If email was changed, inform user to verify new email
      if (formData.email !== user.email) {
        setMessage({ 
          type: 'success', 
          text: 'Profile updated successfully! Please check your new email for verification.' 
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Error updating profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <form onSubmit={handleSubmit(onSubmit)} className="w-100">
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-danger">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="full_name"
              {...register("full_name")}
            />
            {errors.full_name && (
              <span className="text-danger">{errors.full_name.message}</span>
            )}
          </div>
        </div>

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              {...register("phone")}
            />
            {errors.phone && (
              <span className="text-danger">{errors.phone.message}</span>
            )}
          </div>
        </div>

        {message.text && (
          <div className={`col-12 alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>
            {message.text}
          </div>
        )}

        <div className="col-xl-12 text-right">
          <div className="my_profile_setting_input">
            <button 
              className="btn btn2" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;