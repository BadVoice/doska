import { computed, type Ref } from 'vue';

export function getButtonList(visibleSearch: Ref<boolean>) {
  return computed(() => {
    if (visibleSearch.value) {
      return [
        {
          label: 'Объявления',
          link: '/search-history',
          active: false,
        },
        {
          label: 'Заявки',
          link: '/',
          active: false,
        },
      ];
    } else {
      return [
        {
          label: 'Мои заявки',
          link: '/',
          active: false,
        },
        {
          label: 'Не опубликованные',
          link: '/?',
          active: false,
        },
        {
          label: 'Заказано',
          link: '/?',
          active: false,
        },
        {
          label: 'Исполнено',
          link: '/?',
          active: false,
        },
        {
          label: 'Возврат',
          link: '/?',
          active: false,
        },
        {
          label: 'Возвращено',
          link: '/?',
          active: false,
        },
        {
          label: 'Архив',
          link: '/?',
          active: false,
        },
      ];
    }
  });
}
