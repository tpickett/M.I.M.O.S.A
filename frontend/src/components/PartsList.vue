<template>
  <v-container class="fill-height">
    <v-row class="d-flex align-center justify-center">
      <v-col cols="10">
        <v-text-field label="Search Parts" v-model="search"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn @click="showNewDialog = true">Add Item</v-btn>
      </v-col>
      <v-row dense>
        <part v-for="{ name, link, image, quantity, id }, k in filteredParts" :quantity="quantity" :id="id" :name="name"
          :key="k" :link="link" :image="image">
        </part>
      </v-row>
    </v-row>
    <v-dialog v-model="showNewDialog" width="1024">
      <v-card>
        <template v-slot:title>
          Add Part
        </template>
        <v-card-text>
          <v-text-field v-model="newPart.name" label="Name"></v-text-field>
          <v-text-field v-model="newPart.link" label="Link"></v-text-field>
          <v-text-field v-model="newPart.image" label="Image"></v-text-field>
          <v-text-field v-model="newPart.quantity" label="Quantity"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-col cols="2" offset="8" align-self="start">
            <v-btn color="primary" @click="showNewDialog = false">Close Dialog</v-btn>
          </v-col>
          <v-col cols="2" align-self="end">
            <v-btn prepend-icon="mdi-check-circle" @click="savePart(newPart)">
              <template v-slot:prepend><v-icon color="success"></v-icon></template>Save
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import usePartStore, { SinglePart } from '@/store/part'
import Part from '@/components/Part.vue'

export default defineComponent({
  setup() {
    const partStore = usePartStore()
    return { partStore }
  },
  components: {
    Part
  },
  data() {
    return {
      newPart: {} as SinglePart,
      showNewDialog: false,
      search: ''
    }
  },
  mounted() {
    if (!this.partStore.itemList.length) {
      this.partStore.find()
    }
  },
  methods: {
    savePart(part: SinglePart) {
      this.partStore.createPart(part)
      this.newPart = {} as SinglePart
      this.showNewDialog = false
    }
  },
  computed: {
    filteredParts() {
      return this.partStore.itemList.filter((item: SinglePart) => {
        if (this.search) {
          return item.name.toLocaleLowerCase().includes(this.search)
        } else {
          return true
        }
      })
    }
  }
})
</script>
    