"use server";

import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function Adminlogin(
  _prevState: { message: string },
  formData: FormData
) {
  const usernameOrPhone = formData.get("user") as string;
  try {
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
      return { message: "کاربری با این مشخصات یافت نشد" };
    }

    const password = formData.get("password") as string;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: adminData?.email,
      password: password,
    });

    if (error?.code === "invalid_credentials") {
      return { message: "نام کاربری یا رمز عبور اشتباه است" };
    }
    if (error) {
      return { message: error.message };
    }
  } catch {
    return { message: "خطا در ورود" };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function Teacherlogin(
  _prevState: { message: string },
  formData: FormData
) {
  const usernameOrPhone = formData.get("user") as string;
  try {
    const teacherData = await prisma.teacher.findFirst({
      where: {
        OR: [{ username: usernameOrPhone }, { phone: usernameOrPhone }],
      },
    });

    if (!teacherData?.email) {
      return { message: "کاربری با این مشخصات یافت نشد" };
    }

    const password = formData.get("password") as string;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: teacherData?.email,
      password: password,
    });

    if (error?.code === "invalid_credentials") {
      return { message: "نام کاربری یا رمز عبور اشتباه است" };
    }
    if (error) {
      return { message: error.message };
    }
  } catch {
    return { message: "خطا در ورود" };
  }

  revalidatePath("/", "layout");
  redirect("/teacher");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

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


export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
 }
