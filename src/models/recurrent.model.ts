export interface RecurrentTransaction {
  amount: number;
  category: string;
  description: string;
  user: string;
  recurrence:  "weekly" | "monthly";
  next_date: Date;
  type: "income" | "spending";
}

export const instanceOfRecurrentTransaction = (
  object: any
): object is RecurrentTransaction => {
  return (
    "amount" in object &&
    "category" in object &&
    "description" in object &&
    "user" in object &&
    ["weekly", "monthly"].includes(object.recurrence) &&
    "next_date" in object && 
    "type" in object  && 
    ["income", "spending"].includes(object.type)
  );
};
