import { getParentDataApi } from "@/actions/parentAction";

import { NextResponse } from "next/server";

export async function GET() {
  const data = await getParentDataApi();
  return NextResponse.json(data);
}
