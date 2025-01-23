import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const expenseSchema = z.object({
  id: z.string(),
  label: z.object({name:z.string(), email : z.string() , img : z.string()}),
  note: z.string(),
  category: z.string(),
  type: z.string(),
  amount: z.number(),
  date: z.string(),
});

export type Expense = z.infer<typeof expenseSchema>;
