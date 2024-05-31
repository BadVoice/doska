<script lang="ts" setup generic="T">
  import { ref } from 'vue';
  import { Button } from '@/shared/ui';

  const value = defineModel<T | undefined>({
    required: true,
  });

  const props = defineProps<{
    list: T;
  }>();

  const selectedAll = ref(false);

  function selectAll() {
    if (selectedAll.value) {
      value.value = [] as T;
      selectedAll.value = false;
    } else {
      value.value = props.list;
      selectedAll.value = true;
    }
  }
</script>

<template>
  <Button
    type="button"
    variant="ghost"
    class="text-center text-[13px] font-normal text-primary group-hover:text-primary/70"
    @click="selectAll">
    {{ selectedAll ? 'Отменить всё' : 'Выбрать всё' }}
  </Button>
</template>
