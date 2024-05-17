import type { Bid } from '@/shared/api/generated/Api';

export interface BidWithName extends Bid {
  brandName?: string;
  categoryName?: string;
}
