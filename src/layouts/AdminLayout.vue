<template>
  <div class="container body">
    <div class="main_container">
      <Sidebar />

      <!-- page content -->
      <div class="right_col" role="main">
        <router-view />
      </div>
      <!-- /page content -->
      <Footer />

    </div>
  </div>
</template>


<script setup>
import Sidebar from './SidebarLayout.vue'
import Footer from './FooterLayout.vue'
</script>
