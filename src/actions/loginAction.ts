"use server";

import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function Adminlogin(formData: FormData) {
  const usernameOrPhone = formData.get("user") as string;

  const adminData = await prisma.admin.findFirst({
    where: {
      OR: [
        { username: usernameOrPhone },
        { phone: usernameOrPhone },
        { nationalCode: usernameOrPhone },
      ],
    },
  });

  if (!adminData?.email) {
    return;
  }

  const password = formData.get("password") as string;

  const supabase = await createClient();

  // // type-casting here for convenience
  // // in practice, you should validate your inputs
  // const data = {
  //   email: formData.get("email") as string,
  //   password: formData.get("password") as string,
  // };

  const { error } = await supabase.auth.signInWithPassword({
    email: adminData?.email,
    password: password,
  });

  if (error) {
    redirect(`/login?error=${error}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function Teacherlogin(formData: FormData) {
  const usernameOrPhone = formData.get("user") as string;

  const teacherData = await prisma.teacher.findFirst({
    where: {
      OR: [{ username: usernameOrPhone }, { phone: usernameOrPhone }],
    },
  });

  if (!teacherData?.email) {
    return;
  }

  const password = formData.get("password") as string;

  const supabase = await createClient();

  // // type-casting here for convenience
  // // in practice, you should validate your inputs
  // const data = {
  //   email: formData.get("email") as string,
  //   password: formData.get("password") as string,
  // };

  const { error } = await supabase.auth.signInWithPassword({
    email: teacherData?.email,
    password: password,
  });

  if (error) {
    redirect(`/login?error=${error}`);
  }

  revalidatePath("/", "layout");
  redirect("/teacher");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect(`/login?error=${error}`);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
