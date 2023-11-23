<template>
  <v-row>
    <v-col>
      <organizer :selected="selected" :parts="parts" @added-part-to-slot="addPart" />
    </v-col>
  </v-row>
</template>

<script lang="ts" >
import Organizer from '@/components/Organizer.vue'
import { defineComponent, PropType } from 'vue'
import useOrganizersStore, { SingleOrganizer } from '@/store/organizer'
import usePartStore, { SinglePart } from '@/store/part'


export default defineComponent({
  components: { Organizer },
  setup() {
    const organizerStore = useOrganizersStore()
    const partStore = usePartStore()

    return { organizerStore, partStore }
  },
  data() {
    return {
      selected: {} as SingleOrganizer,
      parts: [] as SinglePart[]
    }
  },
  mounted() {
    // if (this.organizerStore.selected.id !== this.$route.params.id) {
    this.organizerStore.select(`${this.$route.params.id}`)
      .then(() => this.selected = this.organizerStore.selected)
      .then(() => {
        if (!this.partStore.itemList.length) {
          this.partStore.find()
        }
      })
      .then(() => {
        if (!this.organizerStore.selectedSlots.length) {
          return this.partStore.findByOrganizer(`${this.$route.params.id}`)
        }
        else {
          return []
        }
      })
      .then((parts: any) => {
        return this.parts = parts
      })
      .then((parts: PropType<SinglePart[]>) => {
        if (!this.organizerStore.selectedSlots.length) {
          return this.organizerStore.findSelectedParts(parts)
        }
      })
      .catch((e: any) => {
        if (e?.response?.status === 404 && e?.config?.url === `organizers/${this.$route.params.id}/parts`) {
          this.parts = []
          if (!this.organizerStore.selectedSlots.length) {
            return this.organizerStore.findSelectedParts(this.parts)
          }
        }
      })
    // }
  },
  methods: {
    addPart(part: PropType<SinglePart>) {
      let rawObject = { ...part };
      if (Array.isArray(this.parts)) {
        this.parts.push(<SinglePart>rawObject)
      }
    }
  }
})
</script>
