<script setup lang="ts">
  import { useUnit } from 'effector-vue/composition';
  import { getBrands, mounted } from '../model/brand-model';
  import { onMounted } from 'vue';

  const handleMount = useUnit(mounted);
  const { data: brands } = useUnit(getBrands);

  onMounted(handleMount);
</script>

<template>
  <div v-if="brands?.data" v-for="brand in brands.data" :key="brand.id">
    {{ brand }}
    dfsgdfhdfh
  </div>
</template>
