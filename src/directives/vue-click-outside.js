const isClient = () => !(typeof window === 'undefined');

export default {
  bind(el, { value }) {
    if (isClient) {
      el.addEventListener('click', (e) => e.stopPropagation());
      document.addEventListener('click', value);
    }
  },
  unbind(el, { value }) {
    if (isClient) {
      el.removeEventListener('click', (e) => e.stopPropagation());
      document.removeEventListener('click', value);
    }
  },
};
