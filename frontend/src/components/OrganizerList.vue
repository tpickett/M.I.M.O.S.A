<template>
  <v-container class="fill-height">
    <v-row class="d-flex align-center justify-center">
      <v-col cols="10">
        <v-text-field label="Search Organizers" v-model="search"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn @click="showNewDialog = true">Add Organizer</v-btn>
      </v-col>
      <v-row dense>
        <v-col v-for="card in filteredOrganizers" :key="card.name" :cols="2">
          <v-card class="organizer-card">

            <v-img @click="singleOrganizerNavigate(card)" src="https://img.uline.com/is/image/uline/H-5579BL?$Large$"
              class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px" cover>
              <v-card-title class="text-white" v-text="card.name"></v-card-title>
            </v-img>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#f25858" prepend-icon="mdi-delete-forever" title="Delete"
                @click="deleteOrganizer(card)">Delete</v-btn>
              <v-btn color="surface-variant" prepend-icon="mdi-file-edit" title="Edit"
                @click="editOrganizer(card)">Edit</v-btn>
              <v-btn prepend-icon="mdi-lighthouse-on" title="Locate" @click="locateOrganizer(card.id)">Locate</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-dialog v-model="showNewDialog" width="1024">
          <v-card>
            <template v-slot:title>
              {{ editing ? `Editing organizer: ${newOrganizer.id}` : "New Organizer" }}
            </template>
            <v-card-text>
              <v-text-field v-model="newOrganizer.name" label="Name"></v-text-field>
              <v-text-field v-model="newOrganizer.led_count" label="LED Count"></v-text-field>
              <v-text-field v-model="newOrganizer.ip" label="IP Address"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-col cols="2" offset="8" align-self="start">
                <v-btn color="primary" @click="closeDialogue">Close Dialog</v-btn>
              </v-col>
              <v-col cols="2" align-self="end">
                <v-btn prepend-icon="mdi-check-circle" @click="saveNewOrganizer()">
                  <template v-slot:prepend><v-icon color="success"></v-icon></template>Save
                </v-btn>
              </v-col>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-row>


  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useOrganizersStore, { SingleOrganizer } from '@/store/organizer'
import { AxiosResponse } from 'axios'


export default defineComponent({
  setup() {
    const organizerStore = useOrganizersStore()

    return { organizerStore }
  },
  data() {
    return {
      newOrganizer: {} as SingleOrganizer,
      showNewDialog: false,
      editing: false,
      search: ""
    }
  },
  mounted() {
    if (!this.organizerStore.organizers.length) {
      this.organizerStore.find()
    }
  },
  methods: {
    saveNewOrganizer() {
      let p: Promise<AxiosResponse<any, any>>
      if (!this.editing) {
        p = this.organizerStore.add(this.newOrganizer)
      } else {
        p = this.organizerStore.update(this.newOrganizer)
      }
      p.then(() => this.closeDialogue())
    },
    singleOrganizerNavigate(organizer: SingleOrganizer) {
      this.$router.push({ name: 'organizer', params: { id: organizer.id } })
    },
    locateOrganizer(id: string) {
      console.log(`should be locating the organizer: ${id}`)
      this.organizerStore.locate(id)
    },
    editOrganizer(organizer: SingleOrganizer) {
      this.newOrganizer = organizer
      this.editing = true
      this.showNewDialog = true
    },
    deleteOrganizer(organizer: SingleOrganizer) {
      this.organizerStore.remove(organizer)
    },
    closeDialogue() {
      this.newOrganizer = {} as SingleOrganizer
      this.showNewDialog = false
      this.editing = false
    }
  },
  computed: {
    filteredOrganizers() {
      return this.organizerStore.organizers.filter((item: SingleOrganizer) => {
        if (this.search) {
          return item.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())
        } else {
          return true
        }
      })
    }
  }
})
</script>

<style>
.organizer-card .v-img__gradient,
.organizer-card .v-card-title {
  cursor: pointer;
}
</style>