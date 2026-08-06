export interface ICreateReviewInput {
  rentelid: string;
  rating: number; // 1 to 5
  comment?: string;
}