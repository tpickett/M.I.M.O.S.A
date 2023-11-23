<template>
  <v-row>
    <v-col>
      <PartsList></PartsList>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import PartsList from '@/components/PartsList.vue'
import Dialog from "@/components/ReusableDialog.vue";
import usePartStore from '@/store/part'
const partStore = usePartStore()

</script>
