"use server";
import { prisma } from "@/lib/db";
import { createClientWithServiceRole } from "@/lib/supabaseClient";

export async function getParentData() {
  const parentData = await prisma.parent.findMany({
    include: {
      students: {
        include: {
          class: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return parentData;
}

type ParentDataType = Awaited<ReturnType<typeof getParentData>>;
export type ParentSingleType = ParentDataType[0];

export async function AddParentData(formData: FormData) {
  const supabase = await createClientWithServiceRole();

  const address = formData.get("address") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  const surname = formData.get("surname") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      throw new Error(`خطا در ساخت حساب کاربری: ${authError.message}`);
    }

    const userId = user?.id;

    await prisma.$transaction(async (prisma) => {
      await prisma.users.create({
        data: {
          id: userId!,
          role: "parent",
        },
      });

      await prisma.parent.create({
        data: {
          id: userId!,
          username,
          name,
          surname,
          email,
          phone,
          address,
        },
      });
    });

    return { message: "والد با موفقیت ثبت شد" };
  } catch {
    throw new Error(`خطا در ثبت والد جدید`);
  }
}

export async function EditParentData(formData: FormData) {
  const address = formData.get("address") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const surname = formData.get("surname") as string;
  const username = formData.get("username") as string;
  const id = formData.get("id") as string;
  try {
    await prisma.parent.update({
      where: {
        id,
      },
      data: {
        username,
        name,
        surname,
        phone,
        address,
      },
    });

    return { message: "والد با موفقیت ویرایش شد" };
  } catch {
    throw new Error(`خطا در ویرایش والد`);
  }
}

export async function DeleteParentData(formData: FormData) {
  const supabase = await createClientWithServiceRole();

  const id = formData.get("id") as string;

  try {
    if (!id) {
      throw new Error("شناسه والد (id) ارائه نشده است");
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) {
      throw new Error(`خطا در حذف حساب کاربری: ${authError.message}`);
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.parent.delete({
        where: { id: String(id) },
      });

      await prisma.users.delete({
        where: { id: String(id) },
      });
    });

    return { message: "والد با موفقیت حذف شد" };
  } catch {
    throw new Error(`خطا در حذف والد`);
  }
}
