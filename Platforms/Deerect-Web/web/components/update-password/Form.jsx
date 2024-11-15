"use client";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, updatePassword } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";


export const LoginFormSchema = z.object({  
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .trim(),
});


const Form = () => {

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginFormSchema),
  });

  const router = useRouter();

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    try {
      await updatePassword(data);
      // Redirect to another page or show success message
      router.push("/");
    } catch (error) {
      // Handle signup errors here
      console.error("Update password Error:", error);
    }
  };


  return (
    <form action="#" onSubmit={handleSubmit(onSubmit)}>

      <div className="input-group form-group">
        <input
          type="password"
          className="form-control"
          required
          placeholder="Password"
          {...register("password")}
        />
      </div>
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}
      

      <button type="submit" className="btn btn-log w-100 btn-thm">
        Update Password
      </button>
      {/* login button */}

      
    </form>
  );
};

export default Form;
