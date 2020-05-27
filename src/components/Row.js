export default {
  name: 'Cell',
  props: {
    dataObj: {
      type: Object,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
  },
  render(h) {
    const data = this.dataObj;

    if (this.isEmpty(data) || this.columns.length === 0) {
      return false;
    }

    return h(
      'tr',
      {
        attrs: {
          class: `${data.inspection_description ? data.inspection_description.toLowerCase().trim().replace(/\s/g, '-') : ''}`,
        },
        domProps: {
          innerHTML: this.columns.map((item) => (item.visible ? `<td class="table__cell">${data[item.field]}</td>` : '')).join(''),
        },
      },
    );
  },
  methods: {
    isEmpty(target) {
      return (typeof target === 'object' && !Array.isArray(target) && Object.keys(target).length === 0);
    },
  },
};
