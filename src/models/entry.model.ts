export interface EntryCreateModel {
    amount: number;
    entryDate: Date;
    category: string;
    description: string;
    user: string;
    family: string;
    type: "income" | "expense";
}