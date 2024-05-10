import { $api } from '@/shared/api';
import { createQuery } from '@farfetched/core';

export const myRequestsQuery = createQuery({
  handler: async () => {
    const response = await $api.bids.getBids();
    return response.data;
  },
});
