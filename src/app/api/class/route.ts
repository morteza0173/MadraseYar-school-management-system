import { NextRequest, NextResponse } from "next/server";
import { getUserInfoProps } from "@/actions/dashboardAction";
import { getClassDetails } from "@/db/queries/getClassDetails";

export async function POST(req: NextRequest) {
  try {
    const user: getUserInfoProps = await req.json();

    if (!user?.id || !user?.role) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const classes = await getClassDetails(user);
    return NextResponse.json(classes);
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
