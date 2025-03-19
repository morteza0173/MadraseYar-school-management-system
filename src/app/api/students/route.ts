import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(){
  const data = await prisma.student.findMany();
  return NextResponse.json(data)
}
