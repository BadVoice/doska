<script setup lang="ts">
  import { $selectedRequestId } from '@/entities/advertisement';
  import type { Item } from '@/shared/api/generated/Api';
  import { Button } from '@/shared/ui/button';
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
  } from '@/shared/ui/carousel';
  import { watchOnce } from '@vueuse/core';
  import { useUnit } from 'effector-vue/composition';
  import { X } from 'lucide-vue-next';
  import { ref } from 'vue';
  import { itemBuyed } from '../model/home-model';

  const api = ref<CarouselApi>();
  const totalCount = ref(0);
  const current = ref(0);
  const buyOffer = useUnit(itemBuyed);
  const selectedRequestId = useUnit($selectedRequestId);

  defineProps<{
    productItem: Item;
    isProductCardOpen: boolean;
  }>();

  const emits = defineEmits(['close-product-card']);

  function closeProduct() {
    emits('close-product-card', false);
  }

  function setApi(val: CarouselApi) {
    api.value = val;
  }

  watchOnce(api, (api) => {
    if (!api) return;

    totalCount.value = api.scrollSnapList().length;
    current.value = api.selectedScrollSnap() + 1;

    api.on('select', () => {
      current.value = api.selectedScrollSnap() + 1;
    });
  });

  function handleOfferBuyed(item: Item) {
    emits('close-product-card');
    buyOffer(item);
  }
</script>

<template>
  <div
    v-if="isProductCardOpen"
    class="flex w-full min-w-[360px] flex-col justify-between border-l border-[#D0D4DB] bg-white lg:w-[360px]">
    <div class="flex flex-col gap-y-6">
      <div>
        <div
          class="group flex cursor-pointer items-center gap-x-2 border-b border-[#D0D4DB] px-2 py-4"
          @click="closeProduct">
          <Button variant="ghost" size="icon">
            <X class="h-7 w-7 text-primary group-hover:text-primary/70" />
          </Button>
          <p
            class="text-center text-[17px] text-primary group-hover:text-primary/70">
            Закрыть
          </p>
        </div>
        <Carousel
          @init-api="setApi"
          class="relative ml-[1px]"
          v-if="!!productItem.photo">
          <CarouselContent>
            <CarouselItem class="pl-2">
              <img :src="productItem.photo" alt="product_avatar" />
            </CarouselItem>
          </CarouselContent>
          <div
            class="absolute bottom-1 left-1/2 right-1/2 z-[5000] w-fit -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#101828] px-2 py-0 text-center text-sm text-muted-foreground text-white opacity-80">
            {{ current }} / {{ totalCount }}
          </div>
        </Carousel>
      </div>

      <div v-if="productItem" class="px-4">
        <p class="text-[21px] font-semibold">
          {{
            productItem.price && productItem.price.formatted
              ? productItem.price.formatted
              : 'Не указано'
          }}
        </p>
        <p class="mb-4 text-[18px] font-normal">
          {{ productItem.title }}
        </p>

        <div class="flex w-full flex-col gap-y-2 font-normal text-[#858FA3]">
          <div v-if="productItem.brand" class="flex flex-row justify-between">
            <p>Бренд</p>
            <p class="font-normal text-[#101828] [&>p]:text-end">
              {{ productItem.brand }}
            </p>
          </div>
          <div v-if="productItem.article" class="flex flex-row justify-between">
            <p>Артикул</p>
            <p class="font-normal text-[#101828] [&>p]:text-end">
              {{ productItem.article }}
            </p>
          </div>
          <div
            v-if="productItem.quantity"
            class="flex flex-row justify-between">
            <p>Количество</p>
            <p class="font-normal text-[#101828] [&>p]:text-end">
              {{ productItem.quantity.formatted }}
            </p>
          </div>
          <div
            v-if="productItem.vendorTitle"
            class="flex flex-row justify-between">
            <p>Поставщик</p>
            <p class="font-normal text-[#101828] [&>p]:text-end">
              {{ productItem.vendorTitle }}
            </p>
          </div>
          <div
            v-if="productItem.warehouse"
            class="flex flex-row justify-between">
            <p>Местоположение</p>
            <p class="font-normal text-[#101828] [&>p]:text-end">
              {{ productItem.warehouse }}
            </p>
          </div>
          <div
            v-if="productItem.parsedDelivery"
            class="flex flex-row justify-between">
            <p>Срок поставки</p>
            <p class="font-normal text-[#101828] [&>p]:text-end">
              {{ productItem.parsedDelivery }} дн.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="inset-x-0 bottom-0 flex flex-col gap-y-3 border-t border-[#CCD0D9] bg-[#F9FAFB] p-4">
      <Button class="w-full text-[17px] font-semibold"
        >Показать номер телефона</Button
      >
      <Button
        v-if="selectedRequestId"
        variant="outline"
        @click="handleOfferBuyed(productItem)"
        class="w-full border-2 border-[#0015FA] text-[17px] font-semibold text-[#0015FA] hover:text-[#0015FA]"
        >Сделать запись о покупке</Button
      >
    </div>
  </div>
</template>
