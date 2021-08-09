<template>
  <footer class="footer" style="background-color: #f6f8fd">
    <div class="container-fluid">
      
      <div class="copyright">
        <!-- © {{year}} made with <i class="tim-icons icon-heart-2"></i> by Mumbi dev team. -->
      </div>
    </div>
  </footer>
</template>
<script>
  export default {
    data() {
      return {
        year: new Date().getFullYear()
      }
    }
  };
</script>
<style>
</style>
