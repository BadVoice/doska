import { getOrders } from '@/entities/order';
import { $api } from '@/shared/api';
import type { Order } from '@/shared/api/generated/Api';
import { createMutation, keepFresh } from '@farfetched/core';
import { createEvent, sample } from 'effector';

export const deleteOrderClicked = createEvent<Order>();

const deleteOrderMutation = createMutation({
  handler: (data: Order) => $api.orders.deleteOrder(data.id ?? 1),
});

sample({
  clock: deleteOrderClicked,
  target: deleteOrderMutation.start,
});

keepFresh(getOrders, {
    automatically: true,
    triggers: [deleteOrderMutation.finished.success],
})