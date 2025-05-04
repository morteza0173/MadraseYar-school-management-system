import { NextRequest, NextResponse } from "next/server";
import { getExamOrAssignmentDetails } from "@/db/queries/getResultDetailsPage";
import { RelatedResult, Role } from "@/lib/type";



interface UseGetStudentResultDataProps {
  id: number;
  decodedRelatedResult: RelatedResult;
  role: Role;
}

export async function POST(req: NextRequest) {
  try {
    const data: UseGetStudentResultDataProps = await req.json();

    if (!data?.id || !data?.decodedRelatedResult || !data?.role) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const result = await getExamOrAssignmentDetails(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
