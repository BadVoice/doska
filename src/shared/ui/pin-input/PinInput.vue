<script setup lang="ts">
  import { type HTMLAttributes, computed } from 'vue';
  import {
    PinInputRoot,
    type PinInputRootEmits,
    type PinInputRootProps,
    useForwardPropsEmits,
  } from 'radix-vue';
  import { cn } from '@/shared/lib/';

  const props = withDefaults(
    defineProps<PinInputRootProps & { class?: HTMLAttributes['class'] }>(),
    {
      modelValue: () => [],
    },
  );
  const emits = defineEmits<PinInputRootEmits>();

  const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
  });

  const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <PinInputRoot
    v-bind="forwarded"
    :class="cn('flex items-center gap-2', props.class)">
    <slot />
  </PinInputRoot>
</template>
