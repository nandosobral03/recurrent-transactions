export interface EntryMessageModel{
    id: string;
    type: "spending"|"income";
    amount: number;
    entryDate: Date;
    category: string;
    description: string;
    user: string;
    creationDate: Date;
    family: string;
    action: "CREATE"|"UPDATE"|"DELETE";
}

export interface CategoryMessageModel{
    id: string;
    family: string;
    action: "CREATE"|"UPDATE"|"DELETE";
}

export const isInstanceOfCategoryMessageModel = (object: any): object is CategoryMessageModel => {
    return 'id' in object && 'action' in object;
}