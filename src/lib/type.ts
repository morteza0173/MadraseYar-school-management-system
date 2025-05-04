export type Role = "admin" | "teacher" | "student" | "parent";

export type RelatedResult = "امتحان" | "تکلیف";

export type RankedStudent = {
  id: string;
  fullName: string;
  score: number | null;
  rank: number | null;
};
