"use client";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";


export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid Credentials" }).trim(),
  
  password: z
    .string()
    .min(8, { message: "Invalid Credentials" })
    .regex(/[a-zA-Z]/, { message: "Invalid Credentials" })
    .regex(/[0-9]/, { message: "Invalid Credentials" })
    .regex(/[^a-zA-Z0-9]/, { message: "Invalid Credentials" })
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
      const loginData = await login(data);
      // Redirect to another page or show success message
      console.log("success")
      console.log(loginData)
      //router.push("/");
    } catch (error) {
      // Handle signup errors here
      console.error("Login Error:", error);
    }
  };


  return (
    <form action="#" onSubmit={handleSubmit(onSubmit)}>
      <div className="heading text-center">
        <h3>Login to your account</h3>
        <p className="text-center">
          Dont have an account?{" "}
          <Link href="/register" className="text-thm">
            Sign Up!
          </Link>
        </p>
      </div>
      {/* End .heading */}

      <div className="input-group mb-2 mr-sm-2">
        <input
          type="text"
          className="form-control"
          required
          placeholder="Email"
          {...register("email")}
        />
      </div>
      {errors.email || errors.password && (
        <p className="text-red-500 text-sm">Invalid Credentials</p>
      )}
      {/* End .input-group */}

      <div className="input-group form-group">
        <input
          type="password"
          className="form-control"
          required
          placeholder="Password"
          {...register("password")}
        />
      </div>
      {errors.email || errors.password && (
        <p className="text-red-500 text-sm">Invalid Credentials</p>
      )}
      {/* End .input-group */}

      {/* <div className="form-group form-check custom-checkbox mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="remeberMe"
        />
        <label
          className="form-check-label form-check-label"
          htmlFor="remeberMe"
        >
          Remember me
        </label>

        <a className="btn-fpswd float-end" href="#">
          Forgot password?
        </a>
      </div> */}
      {/* End .form-group */}

      <button type="submit" className="btn btn-log w-100 btn-thm">
        Log In
      </button>
      {/* login button */}

      
    </form>
  );
};

export default Form;
