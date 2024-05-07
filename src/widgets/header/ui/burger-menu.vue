<script setup lang="ts">
  import { cn } from '@/shared/lib';

  const isBurgerMenuOpen = defineModel<boolean>({
    required: true,
  });
</script>

<template>
  <div
    :class="
      cn(
        'transition- relative mx-auto h-[28px] w-[22px] rotate-0 transform cursor-pointer ease-in-out',
        isBurgerMenuOpen && 'open',
      )
    "
    @click="isBurgerMenuOpen = !isBurgerMenuOpen">
    <span class="first"></span>
    <span class="second"></span>
    <span class="third"></span>
  </div>
</template>

<style scoped lang="postcss">
  span {
    @apply absolute left-0 block h-[3px] w-full rotate-0 transform rounded-full bg-[#354052] opacity-100 transition-transform ease-in-out;
  }

  .first {
    @apply top-[5px];
  }

  .second {
    @apply top-[12px];
  }

  .third {
    @apply top-[20px];
  }

  .open .first {
    @apply top-[14px] rotate-45 transform;
  }

  .open .second {
    @apply w-0 opacity-0;
  }

  .open .third {
    @apply top-[14px] rotate-[-45deg] transform;
  }
</style>
