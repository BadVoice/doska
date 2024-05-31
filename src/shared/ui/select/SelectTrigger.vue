<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue';
  import {
    SelectIcon,
    SelectTrigger,
    type SelectTriggerProps,
    useForwardProps,
  } from 'radix-vue';
  import { ChevronDown } from 'lucide-vue-next';
  import { cn } from '@/shared/lib/';

  const props = defineProps<
    SelectTriggerProps & { class?: HTMLAttributes['class'] }
  >();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
  });

  const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'flex h-10 w-full items-center justify-between rounded-[8px] border border-[#D0D4DB] bg-background px-4 py-2 text-[16px] text-sm placeholder:text-[#858FA3] placeholder:text-[#858FA3] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        props.class,
      )
    ">
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="h-4 w-4 opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>
