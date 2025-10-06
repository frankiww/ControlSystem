<template>
  <tr
    class="cursor-pointer hover:bg-light transition"
    @click="$emit('click')"
  >
    <td class="py-3 px-4 border-b border-dark/20">
      {{ object.name }}
    </td>
    <td class="py-3 px-4 border-b border-dark/20">
      {{ object.client_name || '—' }}
    </td>
    <td class="py-3 px-4 border-b border-dark/20 text-center">
      {{ object.active_defects ?? 0 }}
    </td>
    <td class="py-3 px-4 border-b border-dark/20 text-center">
      {{ object.total_defects ?? 0 }}
    </td>
  </tr>
</template>

<script setup>
defineProps({
  object: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
tr:hover td {
  background-color: #EDF2F4;
}
</style>
