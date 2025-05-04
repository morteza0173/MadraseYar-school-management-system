import { NextResponse } from "next/server";
import { getParentData } from "@/db/queries/getParent";

export async function GET() {
  try {
    const parent = await getParentData();
    return NextResponse.json(parent);
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
