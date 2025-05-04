import { NextRequest, NextResponse } from "next/server";
import { getUserInfoProps } from "@/actions/dashboardAction";
import { getAssignments } from "@/db/queries/getAssignments";

export async function POST(req: NextRequest) {
  try {
    const user: getUserInfoProps = await req.json();

    if (!user?.id || !user?.role) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const assignments = await getAssignments(user);
    return NextResponse.json(assignments);
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
