'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const ChangePassword = () => {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInviteFlow, setIsInviteFlow] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Extract query parameters
    const type = searchParams.get('type');
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    const isInviteUrl = type === 'invite' || accessToken || refreshToken;

    setIsInviteFlow(isInviteUrl);

    if (isInviteUrl) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = "You need to set a new password before leaving. Are you sure you want to leave?";
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [searchParams]);

  const validateForm = () => {
    if (!isInviteFlow && !formData.oldPassword) {
      setError('Old password is required');
      return false;
    }

    if (!formData.newPassword) {
      setError('New password is required');
      return false;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'formGroupExampleOldPass' ? 'oldPassword' :
        id === 'formGroupExampleNewPass' ? 'newPassword' :
          'confirmPassword']: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isInviteFlow) {
        // Handle password setup for invited user
        const { data, error: updateError } = await supabase.auth.updateUser({
          password: formData.newPassword
        });

        if (updateError) throw updateError;

        setSuccess('Password set successfully');
        // Remove navigation warning
        window.onbeforeunload = null;
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/'); // Or your desired redirect path
        }, 2000);
      } else {
        // Handle password change for existing user
        const { data, error: updateError } = await supabase.auth.updateUser({
          password: formData.newPassword,
          // Include `old_password` if Supabase supports it
          old_password: formData.oldPassword
        });

        if (updateError) throw updateError;

        setSuccess('Password updated successfully');
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      setError(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isInviteFlow && (
        <div className="row">
          <div className="col-xl-6">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="formGroupExampleOldPass">Old Password</label>
              <input
                type="password"
                className="form-control"
                id="formGroupExampleOldPass"
                value={formData.oldPassword}
                onChange={handleInputChange}
                required={!isInviteFlow}
              />
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="formGroupExampleNewPass">New Password</label>
            <input
              type="password"
              className="form-control"
              id="formGroupExampleNewPass"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="formGroupExampleConfPass">
              Confirm New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="formGroupExampleConfPass"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-xl-12">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <div className="my_profile_setting_input float-end fn-520">
            <button
              className="btn btn2"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Updating...'
                : isInviteFlow
                  ? 'Set Password'
                  : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChangePassword;
