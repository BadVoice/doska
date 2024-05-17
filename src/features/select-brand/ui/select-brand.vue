<script setup lang="ts">
import { useUnit } from 'effector-vue/composition';
import {
  $brandsList, showBrandSelector
} from "@/features/select-brand/model/brand-model";
import { requestClicked } from "@/pages/my-requests/model/my-requests-model";


const brandsList = useUnit($brandsList);
</script>

<template>
    <div v-for="brand in brandsList" :key="brand.id">
      {{ brand }}
      dfsgdfhdfh
    </div>

</template>
