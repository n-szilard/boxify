export interface Item {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  category?: string;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  weightKg?: number;
  imagePath?: string;
  createdAt?: string;
  updatedAt?: string;
}