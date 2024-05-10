<script setup lang="ts">
  import type { PreSearchResponses } from '@/shared/api/generated/Api';

  const props = defineProps<{
    searchResult: PreSearchResponses;
  }>();
</script>

<template>
  <div>
    <h3>Результат поиска:</h3>
    <ul>
      <li v-if="props.searchResult.length === 0">Нет данных для отображения</li>
      <li v-else v-for="item in props.searchResult" :key="item.id">
        <p>Название: {{ item.part_name }}</p>
        <p>Бренд: {{ item.brand }}</p>
        <p>Артикул: {{ item.article }}</p>
      </li>
    </ul>
  </div>
</template>
