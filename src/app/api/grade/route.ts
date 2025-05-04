import { NextResponse } from "next/server";
import { GetGradeData } from "@/db/queries/getGrade";

export async function GET() {
  try {
    const grade = await GetGradeData();
    return NextResponse.json(grade);
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
