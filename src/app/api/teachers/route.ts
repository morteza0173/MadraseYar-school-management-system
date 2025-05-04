import { NextRequest, NextResponse } from "next/server";
import { getTeacherData } from "@/db/queries/getTeacher";

export async function POST(req: NextRequest) {
  try {
    const userId: string = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const teachers = await getTeacherData(userId);
    return NextResponse.json(teachers);
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
