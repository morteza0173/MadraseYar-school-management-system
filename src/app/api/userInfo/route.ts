import { getUserInfoApi } from "@/actions/dashboardAction";

import { NextResponse } from "next/server";

export async function GET() {
  const data = await getUserInfoApi();
  return NextResponse.json(data);
}
