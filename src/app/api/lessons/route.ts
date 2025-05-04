import { NextRequest, NextResponse } from "next/server";
import { getUserInfoProps } from "@/actions/dashboardAction";
import { getLessons } from "@/db/queries/getLessons";

export async function POST(req: NextRequest) {
  try {
    const user: getUserInfoProps = await req.json();

    if (!user?.id || !user?.role) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const lessons = await getLessons(user);
    return NextResponse.json(lessons);
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
