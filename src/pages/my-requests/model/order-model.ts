import { getOrders } from '@/entities/order';
import { $isAuthorized } from '@/entities/session';
import { $api } from '@/shared/api';
import type { Bid, Order, OrderReturn } from '@/shared/api/generated/Api';
import { appMounted } from '@/shared/model';
import { createMutation, createQuery, keepFresh } from '@farfetched/core';
import {
  createEffect,
  createEvent,
  createStore,
  sample,
  type EventCallable,
} from 'effector';
import { delay } from 'patronum';
import { historyQuery } from './history-model';
import { changeRequestStatus } from './my-requests-model';

export const deleteOrderClicked = createEvent<Order>();
export const returnOrderClicked = createEvent<Order>();
export const confirmReturnClicked = createEvent<OrderReturn & Order>();
export const cancelReturnClicked = createEvent<OrderReturn & Order>();
export const confirmOrderClicked = createEvent<Order>();
export const cancelOrderClicked = createEvent<Order>();

const $editedReturn = createStore<number | null>(null).on(
  cancelReturnClicked,
  (_, clk) => clk.bid,
);

const $currentOrder = createStore<Order | null>(null).on(
  [returnOrderClicked],
  (_, clk) => clk,
);

const deleteOrderMutation = createMutation({
  handler: (data: Order) => $api.orders.deleteOrder(data.id ?? 1),
});

const editOrderMutation = createQuery({
  handler: (data: Order) => $api.orders.updateOrder(data.id ?? 1, data),
});

function changeOrderStatus(event: EventCallable<Order>, status: 0 | 1) {
  sample({
    clock: event,
    fn: (clk) =>
      Object.assign(
        {
          id: clk.id,
          name: clk.name,
          amount: clk.amount,
          price: clk.price,
          offer: clk.offer,
          status: status,
        },
        clk?.delivery_time && {
          delivery_time: clk.delivery_time,
        },
        clk.description && {
          description: clk.description,
        },
        clk.company && {
          company: clk.company,
        },
        clk.bid && {
          bid: clk.bid,
        },
        clk.ad && {
          ad: clk.ad,
        },
      ) as Order,
    target: editOrderMutation.start,
  });
}

changeOrderStatus(confirmOrderClicked, 1);
changeOrderStatus(cancelOrderClicked, 0);

const archiveBidFx = createEffect((data: Bid) =>
  $api.bids.updateBid(data.id ?? 1, {
    ...data,
    status: 3,
  }),
);

const getBidCancel = createQuery({
  handler: (data: number) => $api.bids.getBid(data),
});

sample({
  clock: cancelOrderClicked,
  filter: (clk) => clk.status === 0,
  fn: (clk) => clk.bid ?? 1,
  target: getBidCancel.start,
});

sample({
  clock: getBidCancel.finished.success,
  filter: (clk) => [200].includes(clk.result.status),
  fn: (clk) => clk.result.data as Bid,
  target: archiveBidFx,
});

sample({
  clock: editOrderMutation.finished.success,
  filter: (clk) => [200].includes(clk.result.status),
  target: getOrders.start,
});

const deleteReturnMutation = createMutation({
  handler: (id: number) => $api.orderReturns.deleteOrderReturn(id),
});

const editReturnMutation = createMutation({
  handler: (data: OrderReturn) =>
    $api.orderReturns.updateOrderReturn(data.id ?? 1, data),
});

const getBid = createQuery({
  handler: (id: number) => $api.bids.getBid(id),
});

sample({
  clock: confirmReturnClicked,
  fn: (clk) =>
    ({
      id: clk?.id,
      description: clk?.description,
      amount: clk?.amount,
      order: clk?.order,
      status: 1,
    }) as OrderReturn,
  target: editReturnMutation.start,
});

sample({
  clock: cancelReturnClicked,
  filter: (clk) => clk.status === 1,
  fn: (clk) =>
    ({
      id: clk?.id,
      description: clk?.description,
      amount: clk?.amount,
      order: clk?.order,
      status: 0,
    }) as OrderReturn,
  target: editReturnMutation.start,
});

sample({
  clock: cancelReturnClicked,
  filter: (clk) => clk.status === 0,
  fn: (clk) => clk.id ?? 1,
  target: deleteReturnMutation.start,
});

sample({
  source: $editedReturn,
  clock: cancelReturnClicked,
  fn: (src) => src ?? 1,
  target: getBid.start,
});

const editBidCancelReturn = createEvent<Bid>();

sample({
  clock: getBid.finished.success,
  fn: (clk) => clk.result.data as Bid,
  target: editBidCancelReturn,
});

changeRequestStatus(editBidCancelReturn, 2);

export const getReturns = createQuery({
  handler: async () => {
    const orders = await $api.orders.getOrders();
    const returns = await $api.orderReturns.getOrderReturns();
    const bids = await $api.bids.getBids();
    const brands = await $api.brands.getBrands();

    return returns.data?.map((r) => {
      const order = JSON.parse(
        JSON.stringify(orders.data?.results?.find((o) => o.id === r.order)),
      );
      const bid = JSON.parse(
        JSON.stringify(bids.data.results?.find((b) => b.id === order.bid)),
      );

      delete order?.id;
      delete order?.status;

      delete bid?.status;
      delete bid?.id;

      return {
        ...r,
        ...order,
        ...bid,
        brand: brands.data.find((b) => b.id === bid.brand)?.name,
      };
    });
  },
});

sample({
  clock: delay(appMounted, 3000),
  filter: $isAuthorized,
  target: getReturns.start,
});

export const createReturnMutation = createMutation({
  handler: (data: OrderReturn) => $api.orderReturns.createOrderReturn(data),
});

sample({
  clock: returnOrderClicked,
  fn: (clk) =>
    ({
      amount: clk.amount,
      description: clk.description,
      order: clk.id,
    }) as OrderReturn,
  target: createReturnMutation.start,
});

sample({
  source: $currentOrder,
  clock: createReturnMutation.finished.success,
  filter: (_, clk) => [201].includes(clk.result.status),
  fn: (src) => src?.bid ?? 1,
  target: historyQuery.start,
});
sample({
  clock: deleteOrderClicked,
  target: deleteOrderMutation.start,
});

keepFresh(getOrders, {
  automatically: true,
  triggers: [deleteOrderMutation.finished.success],
});

keepFresh(getReturns, {
  automatically: true,
  triggers: [
    editReturnMutation.finished.success,
    getBid.finished.success,
    createReturnMutation.finished.success,
  ],
});
