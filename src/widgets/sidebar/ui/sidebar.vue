<script setup lang="ts">

import {Button} from "@/shared/ui";

const emit = defineEmits(['close-sidebar']);
</script>

<template>
  <Button @click="emit('close-sidebar' )" size="icon" variant="ghost">
    <img src="../assets/exit.svg" alt="exit" />
  </Button>
</template>

<style scoped lang="postcss">

</style>