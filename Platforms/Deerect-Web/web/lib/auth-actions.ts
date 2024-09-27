"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

type SignUpFormData = {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;

}

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/404");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(data: SignUpFormData) {
  const supabase = createClient();

  const { email, password, fullName, phoneNumber } = data;

  const { error } = await supabase.auth.signUp({
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

  redirect("/logout");
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
