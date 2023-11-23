<template>
  <v-col :cols="2">
    <v-card>
      <v-img :src=$props.image class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px"
        cover>
        <v-card-title class="text-white" v-text="$props.name"></v-card-title>
      </v-img>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn size="small" color="surface-variant" variant="text" icon="mdi-delete-forever" title="Delete"
          @click="deleteCard()"></v-btn>

        <v-btn size="small" color="surface-variant" variant="text" icon="mdi-file-edit" title="Edit"
          @click="editCard()"></v-btn>

        <v-btn size="small" color="surface-variant" variant="text" icon="mdi-lighthouse-on" title="Locate"
          @click="locate()"></v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
  <v-dialog v-model="showEditingDialog" width="1024">
    <v-card>
      <template v-slot:title>
        Editing ID: {{ editing.id }}
      </template>
      <v-card-text>
        <v-text-field v-model="editing.name" label="Name"></v-text-field>
        <v-text-field v-model="editing.link" label="Link"></v-text-field>
        <v-text-field v-model="editing.image" label="Image"></v-text-field>
        <v-text-field v-model="editing.quantity" label="Quantity"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-col cols="2" offset="8" align-self="start">
          <v-btn color="primary" @click="showEditingDialog = false">Close Dialog</v-btn>
        </v-col>
        <v-col cols="2" align-self="end">
          <v-btn prepend-icon="mdi-check-circle" @click="saveCard(editing)">
            <template v-slot:prepend><v-icon color="success"></v-icon></template>Save
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import usePartStore, { SinglePart } from '@/store/part'

export default defineComponent({
  setup() {
    const partStore = usePartStore()

    return { partStore }
  },
  props: {
    id: Number,
    image: String,
    name: String,
    link: String,
    quantity: Number
  },
  data() {
    return {
      editing: {} as SinglePart,
      showEditingDialog: false
    }
  },
  methods: {
    editCard() {
      this.editing = <SinglePart>{ id: this.$props.id, name: this.$props.name, image: this.$props.image, link: this.$props.link, quantity: this.$props.quantity }
      this.showEditingDialog = true
    },
    deleteCard() {
      this.partStore.delete(<SinglePart>{ id: this.$props.id })
    },
    saveCard(card: SinglePart) {
      this.partStore.edit(card)
      this.editing = {} as SinglePart
      this.showEditingDialog = false
    },
    locate() {
      this.partStore.locate(<SinglePart>{ name: this.$props.name, image: this.$props.image, link: this.$props.link, id: this.$props.id })
    }
  }
})
</script>
    