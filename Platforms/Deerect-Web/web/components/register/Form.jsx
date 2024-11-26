"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { login, signInWithGoogle, signup } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";

// Zod schema for form validation
export const SignupFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  phoneNumber: z
    .string()
    .nullable()
    .optional()
    .refine(
      (phoneNumber) => !phoneNumber || isValidPhoneNumber(phoneNumber),
      { message: "Please enter a valid phone number." }
    ),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .trim(),
  terms: z.boolean().refine(val => val === true, { message: "You must accept the terms." })
});

// React Hook Form with Zod integration
const Form = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignupFormSchema),
  });

  const router = useRouter();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log("Form Data:", data);
    try {
      await signup(data);
      // Redirect to another page or show success message
      router.push("/");
    } catch (error) {
      // Handle signup errors here
      console.error("Signup Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="heading text-center">
        <h3>Register to your account</h3>
        <p className="text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-thm">
            Login
          </Link>
        </p>
      </div>

      {/* Full Name */}
      <div className="form-group input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Full Name"
          {...register("fullName")}
          disabled={isSubmitting}
        />
      </div>
      {errors.fullName && (
        <p className="text-red-500 text-sm">{errors.fullName.message}</p>
      )}

      {/* Email */}
      <div className="form-group input-group">
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          {...register("email")}
          disabled={isSubmitting}
        />
      </div>
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}

      {/* Phone Number */}
      <div className="form-group input-group">
        <Controller
          name="phoneNumber"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <PhoneInput
              {...field}
              className="form-control"
              placeholder="Enter phone number"
              defaultCountry="US"
              country="US"
              withCountryCallingCode
              required
              disabled={isSubmitting}
            />
          )}
        />
      </div>
      {errors.phoneNumber && (
        <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
      )}

      {/* Password */}
      <div className="form-group input-group">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          {...register("password")}
          disabled={isSubmitting}
        />
      </div>
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}

      {/* Terms and Privacy */}
      <div className="form-group form-check custom-checkbox mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          {...register("terms")}
          id="terms"
          disabled={isSubmitting}
        />
        <label className="form-check-label" htmlFor="terms">
          I have read and accept the Terms and Privacy Policy.
        </label>
      </div>
      {errors.terms && (
        <p className="text-red-500 text-sm">{errors.terms.message}</p>
      )}

      {/* Submit Button */}
      <button 
        type="submit" 
        className="btn btn-log w-100 btn-thm"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Register"}
      </button>
    </form>
  );
};

export default Form;