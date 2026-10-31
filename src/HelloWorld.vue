<script setup>
defineProps({
  msg: { type: String, default: 'Hello' },
})
</script>

<template>
  <h1>{{ msg }}</h1>
</template>