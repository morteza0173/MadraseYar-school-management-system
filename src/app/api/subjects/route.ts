import { NextRequest, NextResponse } from "next/server";
import { getSubjectsData } from "@/db/queries/getSubject";

export async function POST(req: NextRequest) {
  try {
    const userId: string = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const subjects = await getSubjectsData(userId);
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
