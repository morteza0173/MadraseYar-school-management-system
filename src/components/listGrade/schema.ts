import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const expenseSchema = z.object({
  id: z.number(),
  level: z.number(),
  students: z.number(),
  classes: z.number(),
});

export type Expense = z.infer<typeof expenseSchema>;
