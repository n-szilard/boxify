export interface Box {
    id?: string,
    userId?: string,
    code?: string,
    labelType: 'QR' | 'BARCODE',
    lengthCm: number,
    widthCm: number,
    heightCm: number,
    maxWeightKg: number,
    location: string,
    note: string,
    status: 'ACTIVE' | 'ARCHIVED' | 'DAMAGED',
    weightPercent?: number,
    volumePercent?: number,
    createdAt?: Date,
    updatedAt?: Date
}