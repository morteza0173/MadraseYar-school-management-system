import { NextRequest, NextResponse } from "next/server";
import { getUserInfoProps } from "@/actions/dashboardAction";
import { getResults } from "@/db/queries/getResult";

export async function POST(req: NextRequest) {
  try {
    const user: getUserInfoProps = await req.json();

    if (!user?.id || !user?.role) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const result = await getResults(user);
    return NextResponse.json(result);
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
