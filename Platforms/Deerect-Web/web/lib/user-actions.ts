"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from "@/utils/supabase/server";
import errorMap from "zod/lib/locales/en";

export async function getUser() {
    const supabase = createClient();
    const { data,error } = await supabase.auth.getUser();
    if (error) {
      console.log(error);
      return error
    }
    return data
    
  }