
import { createQuery } from '@farfetched/core';
import {getBids} from "@/shared/api/requests";

export const myRequestsQuery = createQuery({
  handler: async () => {
    const response = await getBids();
    return response;
  },
});
