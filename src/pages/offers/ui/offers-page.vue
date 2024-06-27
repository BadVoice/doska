<script setup lang="ts">
  import { OfferList, offersQuery } from '@/entities/offer';
  import type { Offer } from '@/shared/api/generated/Api';
  import { ScrollArea } from '@/shared/ui/scroll-area';
  import { useUnit } from 'effector-vue/composition';
  import { onMounted } from 'vue';

  const { data: offers, start } = useUnit(offersQuery);

  onMounted(start);
</script>

<template>
  <div
    class="absolute bottom-0 left-0 top-[74px] h-[calc(100vh-124px)] bg-white max-sm:w-full sm:w-[355px]">
    <div
      class="-mt-2 w-full border-b border-t border-[#D0D4DB] bg-white px-4 py-3 text-[18px] font-semibold">
      Мои предложения
    </div>
    <ScrollArea class="h-[calc(100vh-120px)] bg-white">
      <div class="mb-4 h-full w-full px-4">
        <OfferList :offersItems="offers?.data as Offer[]" />
      </div>
    </ScrollArea>
  </div>
</template>
