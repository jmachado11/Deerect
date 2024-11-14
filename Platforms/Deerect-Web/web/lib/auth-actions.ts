"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from "@/utils/supabase/server";
import errorMap from "zod/lib/locales/en";


type SignUpFormData = {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;

}

type LoginFormData = {
  email: string;
  password: string;
  

}

export async function login(formData: LoginFormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const formata = {
    email: formData.email,
    password: formData.password,
  };

  const { data, error } = await supabase.auth.signInWithPassword(formata);

  if (error) {
    console.log(error)
  }else{
    console.log(data)
    console.log(Request.toString())
    revalidatePath("/", "layout");
    redirect("/");
  }
  
}

export async function signup(data: SignUpFormData) {
  const supabase = createClient();

  const { email, password, fullName, phoneNumber } = data;

  const { error, data: signUpData } = await supabase.auth.signUp({
    email,
    password,
    phone:phoneNumber,
    options: {
      data: {
        full_name: fullName,
        email,
        phone_number: phoneNumber,
      },
      
    },
  });

  if (error) {
    console.error("Signup Error:", error);
    throw new Error(error.message);
  }

  // Extract the token if signup is successful
  const accessToken = signUpData?.session?.access_token;
  //if (!accessToken) {
   // console.error("No token received during signup.");
    //throw new Error("No token received during signup.");
  //}

  console.log(accessToken)
  console.log(signUpData)

  revalidatePath("/", "layout");
  // Optionally, you can return a success message or data
}


export async function signout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/login");
}


export async function updatePassword(newPassword: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({password: newPassword,});
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/");
}



export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/404");
  }

  redirect(data.url);
}
