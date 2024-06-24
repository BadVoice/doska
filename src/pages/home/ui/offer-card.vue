<script setup lang="ts">
  import { Button } from '@/shared/ui/button';
  import { useUnit } from 'effector-vue/composition';
  import { X } from 'lucide-vue-next';
  import { type Offer } from '../../../shared/api/generated/Api';
  import { offerBuyed } from '../model/home-model';

  const handleOfferBuyed = useUnit(offerBuyed);

  defineProps<{
    productItem: Offer;
    isProductCardOpen: boolean;
  }>();

  const emits = defineEmits(['close-product-card']);

  function handleBuy(item: Offer) {
    handleOfferBuyed(item);
    emits('close-product-card');
  }
</script>

<template>
  <div
    v-if="isProductCardOpen"
    class="flex h-screen w-full min-w-[360px] flex-col justify-between border-l border-[#D0D4DB] bg-white lg:w-[360px]">
    <div class="flex flex-col gap-y-6">
      <div>
        <div
          class="group flex cursor-pointer items-center gap-x-2 border-b border-[#D0D4DB] px-2 py-4"
          @click="$emit('close-product-card', false)">
          <Button variant="ghost" size="icon">
            <X class="h-7 w-7 text-primary group-hover:text-primary/70" />
          </Button>
          <p
            class="text-center text-[17px] text-primary group-hover:text-primary/70">
            Закрыть
          </p>
        </div>
      </div>

      <div v-if="productItem" class="px-4">
        <p class="text-[21px] font-semibold">
          {{ productItem.price ? productItem.price + '₽' : 'Не указано' }}
        </p>
        <p class="mb-4 text-[18px] font-normal">{{ productItem.name }}</p>

        <div class="flex w-full flex-col gap-y-2 font-normal text-[#858FA3]">
          <div v-if="productItem.price" class="flex flex-row justify-between">
            <p>Цена</p>
            <p class="font-normal text-[#101828] [&>p]:text-end">
              {{ productItem.price }}
            </p>
          </div>
          <div v-if="productItem.amount" class="flex flex-row justify-between">
            <p>Количество</p>
            <p class="font-normal text-[#101828] [&>p]:text-end">
              {{ productItem.amount }}
            </p>
          </div>
          <div
            v-if="productItem.delivery_time"
            class="flex flex-row justify-between">
            <p>Срок поставки</p>
            <p class="font-normal text-[#101828] [&>p]:text-end">
              {{ productItem.delivery_time }} дн.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="inset-x-0 bottom-0 border-t border-[#CCD0D9] bg-[#F9FAFB] p-4">
      <Button
        @click="handleBuy(productItem)"
        class="w-full text-[17px] font-semibold"
        >Купить</Button
      >
    </div>
  </div>
</template>
