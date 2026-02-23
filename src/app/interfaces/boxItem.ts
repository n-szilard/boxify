import { Item } from './item';

export interface BoxItem {
  id: string;
  boxId: string;
  itemId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  item: Item;
}

export interface FillData {
  boxId: string;
  boxCode: string;
  maxWeightKg: number;
  boxVolumeCm3: number;
  usedWeightKg: number;
  usedVolumeCm3: number;
  weightPercent: number;
  volumePercent: number;
}