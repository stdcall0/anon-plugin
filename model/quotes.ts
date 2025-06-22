export interface Quote {
    id: number; // Date.now()

    groupId: number;
    uploaderId: number;
    filename: string;
    tags: string[];
}
