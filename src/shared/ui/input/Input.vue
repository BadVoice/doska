<script setup lang="ts">
  import { type HTMLAttributes, onMounted, ref } from 'vue';
  import { useVModel } from '@vueuse/core';
  import { cn } from '@/shared/lib/';

  const props = defineProps<{
    defaultValue?: string | number;
    modelValue?: string | number;
    class?: HTMLAttributes['class'];
    autofocus?: boolean;
  }>();

  const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void;
  }>();

  const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
  });

  const inputRef = ref<HTMLInputElement>();

  onMounted(() => {
    if (props.autofocus) {
      inputRef.value?.focus();
    }
  });
</script>

<template>
  <input
    ref="inputRef"
    v-model="modelValue"
    :class="
      cn(
        'disabled:opacity-50\', props.class) flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed',
        props.class,
      )
    " />
</template>
