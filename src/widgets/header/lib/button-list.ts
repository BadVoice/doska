import { computed, type Ref } from 'vue';

export function getButtonList(visibleSearch: Ref<boolean>) {
  return computed(() => {
    if (visibleSearch.value) {
      return [
        {
          label: 'Объявления',
          link: '/advertisements',
          active: false,
          status: -1,
        },
        {
          label: 'Мои Заявки',
          link: '/',
          active: false,
          status: -2,
        },
      ];
    } else {
      return [
        {
          label: 'Мои заявки',
          link: '/',
          active: false,
          status: -1,
        },
        {
          label: 'Создано',
          link: '/',
          active: false,
          status: 0,
        },
        {
          label: 'Опубликовано',
          link: '/',
          active: false,
          status: 1,
        },
        {
          label: 'Заказано',
          link: '/',
          active: false,
          status: -3,
        },

        {
          label: 'Исполнено',
          link: '/',
          active: false,
          status: -4,
        },
        {
          label: 'Возврат',
          link: '/',
          active: false,
          status: -5,
        },
        {
          label: 'Возвращено',
          link: '/',
          active: false,
          status: -6,
        },
        {
          label: 'Архив',
          link: '/',
          active: false,
          status: 3,
        },
      ];
    }
  });
}
