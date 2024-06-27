import { createEvent, createStore } from "effector";

export const offersPageVisibilityChanged = createEvent<void | boolean>()

export const $visibleOffersPage = createStore(false).on(offersPageVisibilityChanged, (src, clk) => clk ?? !src)