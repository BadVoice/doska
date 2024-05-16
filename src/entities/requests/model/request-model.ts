import { createMutation, createQuery } from '@farfetched/core';
import { $api } from '@/shared/api';

export const myRequestsQuery = createQuery({
  handler: () => $api.bids.getBids(),
});

export const deleteRequestMutation = createMutation({
  // @ts-expect-error the backend expects a number, but returns a string as the id
  handler: (id: string) => $api.bids.deleteBid(id),
});
