import { NextRequest, NextResponse } from "next/server";
import { getStudentData } from "@/db/queries/getStudents";

export async function POST(req: NextRequest) {
  try {
    const userId: string = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const result = await getStudentData(userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
