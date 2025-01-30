import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const expenseSchema = z.object({
  name: z.string(),
  grade: z.number(),
  capacity: z.number(),
  studentCount: z.number(),
  supervisor: z.string(),
});

export type Expense = z.infer<typeof expenseSchema>;
