"use server";
import { prisma } from "@/lib/db";

export async function getParentData() {
  const parentData = await prisma.parent.findMany({
    include: {
      students: {
        include: {
          class: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });


  return parentData;
}

type ParentDataType = Awaited<ReturnType<typeof getParentData>>;
export type ParentSingleType = ParentDataType[0];
