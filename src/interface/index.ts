export interface StoreJson {
  ownerUsername: string;
  name: string;
  location: string;
  category: string;
  OwnerId: number;
}

export interface TempStore extends Omit<StoreJson, 'ownerUsername'> {
    code: string;
    createdAt: Date;
    updatedAt: Date;
}
