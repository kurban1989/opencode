<template>
  <table
    class="table__body"
    cellspacing="0"
    cellpadding="0"
    border="0"
  >
    <thead>
      <tr>
        <template v-for="header in headDataTable" >
          <th
            class="table__cell"
            :key="header.field"
            v-if="header.visible"
            @click="$emit('sort', header.field)"
          >
            <span>{{ header.title }}</span>
          </th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template v-for="(cell, index) in bodyDataTable">
        <row :columns="headDataTable" :data-obj="cell" :key="`table${index}`" />
      </template>
    </tbody>
    <tr>
      <td :colspan="headDataTable.length" align="right" class="table__cell">
        Всего элементов&nbsp;{{ total }}
      </td>
    </tr>
  </table>
</template>

<script>
import Row from './Row';

export default {
  name: 'TableInspection',
  props: {
    headDataTable: {
      type: Array,
      required: true,
    },
    bodyDataTable: {
      type: Array,
      required: true,
    },
  },
  components: {
    Row,
  },
  computed: {
    total() {
      return this.bodyDataTable.length;
    },
  },
};
</script>
