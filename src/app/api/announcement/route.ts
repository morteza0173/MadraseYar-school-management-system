import { NextRequest, NextResponse } from "next/server";
import { getAnnouncements } from "@/db/queries/getAnnouncements";
import { getUserInfoProps } from "@/actions/dashboardAction";

export async function POST(req: NextRequest) {
  try {
    const user: getUserInfoProps = await req.json();

    if (!user?.id || !user?.role) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const announcements = await getAnnouncements(user);
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
