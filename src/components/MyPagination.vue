<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    total: number
    page?: number
    pageSize?: number
  }>(),
  {
    total: 0,
    page: 1,
    pageSize: 10,
  },
)

const emit = defineEmits<{
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'change', payload: { page: number; pageSize: number }): void
}>()

const currentPage = computed({
  get: () => props.page,
  set: (value: number) => emit('update:page', value),
})

const currentPageSize = computed({
  get: () => props.pageSize,
  set: (value: number) => emit('update:pageSize', value),
})

function handleCurrentChange(value: number) {
  emit('update:page', value)
  emit('change', { page: value, pageSize: props.pageSize })
}

function handleSizeChange(value: number) {
  emit('update:pageSize', value)
  emit('change', { page: props.page, pageSize: value })
}
</script>

<template>
  <div class="my-pagination" data-testid="my-pagination">
    <el-pagination
      :total="props.total"
      :current-page="currentPage"
      :page-size="currentPageSize"
      layout="total, prev, pager, next, sizes"
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>