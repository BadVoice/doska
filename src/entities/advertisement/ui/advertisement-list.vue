<script setup lang="ts">
  import type {
    PreSearchResponse,
    PreSearchResponses,
  } from '@/shared/api/generated/data-contracts';
  import { defineProps, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { cn } from '@/shared/lib';

  const props = defineProps<{
    searchResult: PreSearchResponses;
  }>();
  const cardFocused = ref(false);
  const emit = defineEmits(['advertisementClicked']);

  const route = useRoute();
  const handleCardClick = (item: PreSearchResponse) => {
    if (!item) {
      return;
    }
    cardFocused.value = true;
    const { article, brand, id } = item;
    emit('advertisementClicked', { id, article, brand });
  };
</script>

<template>
  <div v-if="searchResult" class="w-full">
    <div class="mx-auto flex flex-col items-center justify-center gap-y-6 p-4">
      <ul class="flex w-full max-w-[324px] flex-col gap-y-4">
        <li
          v-for="item in props.searchResult"
          @click="handleCardClick(item)"
          :key="item.id"
          :class="
            cn(
              'flex flex-col items-start justify-between rounded-lg border-2 bg-white p-4 pr-5 duration-200 hover:border-[#0017FC] hover:bg-[#1778EA] hover:bg-opacity-10',
              route.query['active-pre-search'] === item.brand &&
                'border-[#0017FC] bg-[#1778EA] bg-opacity-10',
            )
          ">
          <p class="text-[14px]">{{ item?.article }}</p>
          <div class="flex flex-row gap-x-2">
            <p class="text-[12px] text-[#858FA3]">{{ item?.part_name }},</p>
            <p class="text-[12px] text-[#858FA3]">{{ item?.brand }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
