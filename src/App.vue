<template>
  <router-view/>
</template>



<script setup>
import { onMounted } from 'vue'
import { useGlobalScripts } from '@/composables/useGlobalScripts'

const { loadCommonScripts } = useGlobalScripts()

onMounted(() => {
  loadCommonScripts()
})
</script>