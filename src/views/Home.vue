<template>
  <div class="container">
    <div class="control">
      <div class="control--header">
        <h1>
          Инспекция по ресторанам
        </h1>
      </div>
      <div
        class="edit edit--select"
        :class="{active: opened}"
        role="button"
        v-click-outside="closeSelector"
        @click="opened = !opened"
      >
        <span>Редактировать таблицу</span>

        <ul v-show="opened" class="edit--options">
          <li
            role="button"
            v-for="(option, index) in selectOptionsJson"
            :key="index"
            @click="toggleVisibleColumns(option.field)"
          >
            <component :is="`${option.visible ? 'Check' : 'Cross'}`" />
            <span>{{ option.title }}</span>
          </li>
        </ul>
      </div>
      <input
        type="text"
        class="edit"
        v-model="searchText"
        placeholder="Поиск по полям таблицы"
      />
    </div>
    <table-inspection
      :head-data-table="selectOptionsJson"
      :body-data-table="dataTable"
      @sort="sort"
    />
  </div>
</template>

<script>
import Check from '@/components/Check.vue';
import Cross from '@/components/Cross.vue';
import TableInspection from '@/components/Table.vue';
// eslint-disable-next-line import/extensions
import ClickOutside from '@/directives/vue-click-outside.js';
import selectOptionsJson from '@/resourse/selectOptions.json';

export default {
  name: 'Home',
  data() {
    return {
      selectOptionsJson,
      originDataTable: [],
      dataTable: [],
      searchText: '',
      debounce: null,
      opened: false,
    };
  },
  components: {
    TableInspection,
    Check,
    Cross,
  },
  directives: {
    ClickOutside,
  },
  beforeMount() {
    this.axios.get('/data.json').then((response) => {
      // eslint-disable-next-line no-multi-assign
      this.originDataTable = this.dataTable = response.data;
    });
  },
  watch: {
    searchText: {
      handler() {
        this.search();
      },
      immediate: false,
      deep: false,
    },
  },
  methods: {
    search() {
      if (!this.searchText.length) {
        this.dataTable = this.originDataTable;
        return;
      }

      if (this.debounce) {
        clearTimeout(this.debounce);
      }

      const regex = new RegExp(`(${this.searchText})`, 'gi');

      this.debounce = setTimeout(() => {
        this.dataTable = this.dataTable.filter((item) => {
          let exist = false;

          Object.entries(item).forEach(([key, value]) => {
            const some = this.selectOptionsJson.find((v) => v.field === key);

            if (some && some.visible && value.toString().search(regex) !== -1) {
              // eslint-disable-next-line max-len
              exist = true;
            }
          });

          return exist ? item : null;
        });
      }, 500);
    },
    sort(field) {
      this.dataTable.sort((a, b) => {
        if (a[field] > b[field]) {
          return 1;
        }
        if (a[field] < b[field]) {
          return -1;
        }
        return 0;
      });

      this.selectOptionsJson.forEach((item, index) => {
        if (item.field === field) {
          if (this.selectOptionsJson[index].sortDesc) {
            this.dataTable.reverse();
          }
          this.selectOptionsJson[index].sortDesc = !this.selectOptionsJson[index].sortDesc;
        }
      });
    },
    closeSelector() {
      this.opened = false;
    },
    toggleVisibleColumns(column) {
      this.selectOptionsJson.forEach((item, index) => {
        if (item.field === column) {
          this.selectOptionsJson[index].visible = !item.visible;
        }
      });
    },
  },
};
</script>
