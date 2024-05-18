<script setup lang="ts">
  import { useUnit } from 'effector-vue/composition';
  import { $visible, getBrands, mounted } from '../model/brand-model';
  import { onMounted } from 'vue';

  const isVisible = useUnit($visible);
  const handleMount = useUnit(mounted);
  const { data: brands } = useUnit(getBrands);

  onMounted(handleMount);
</script>

<template>
  <div
    v-if="isVisible && brands?.data"
    v-for="brand in brands.data"
    :key="brand.id">
    {{ brand.name }}
  </div>
</template>
