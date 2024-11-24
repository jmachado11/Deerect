"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" })
    .trim(),
});

const Form = () => {
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(LoginFormSchema),
  });

  const router = useRouter();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await login(data);
      
      if (!response) {
        // If login is successful, the server action will redirect
        // No need to handle success case here
        return;
      }

      // If we reach here, there was an error since successful login redirects
      setServerError("Invalid email or password. Please try again.");
      
    } catch (error) {
      console.error("Login Error:", error);
      
      // Handle specific error messages from Supabase
      if (error?.message?.includes("Invalid login credentials")) {
        setServerError("Invalid email or password. Please try again.");
      } else if (error?.message?.includes("Too many requests")) {
        setServerError("Too many attempts. Please try again later.");
      } else if (error?.message?.includes("network")) {
        setServerError("Network error. Please check your connection and try again.");
      } else {
        setServerError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine all validation errors into a single message
  const getValidationError = () => {
    if (Object.keys(errors).length === 0) return "";
    
    // Only show a generic error message for any validation error
    return "Invalid email or password. Please try again.";
  };

  const validationError = getValidationError();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="heading text-center">
        <h3>Login to your account</h3>
        <p className="text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-thm">
            Sign Up!
          </Link>
        </p>
      </div>

      {/* Display both server and validation errors in the same style */}
      {(serverError || validationError) && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-4">
          {serverError || validationError}
        </div>
      )}

      <div className="space-y-2">
        <div className="input-group mb-2 mr-sm-2">
          <input
            type="text"
            className="form-control"
            placeholder="Email"
            {...register("email")}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="input-group form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            {...register("password")}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="btn btn-log w-100 btn-thm"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </button>

      
    </form>
  );
};

export default Form;