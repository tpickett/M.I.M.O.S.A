<template>
    <v-container class="fill-height">
        <v-row>
            <h2>Organizer: {{ $props?.selected?.name }}</h2>
        </v-row>
        <v-row class="organizer-background" align="center" justify="center">
            <organizer-slot v-if="$props?.selected?.id" :key="parseInt(k) + 1"
                v-for="k in Object.keys(organizerStore.selectedSlots)" :parts="$props.parts" :slot="parseInt(k) + 1"
                :organizerId="parseInt($props.selected.id)" @added-part-to-slot="redrawPartList">
            </organizer-slot>
        </v-row>
    </v-container>
</template>
  
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useOrganizersStore, { SingleOrganizer } from '@/store/organizer'
import usePartStore, { SinglePart } from '@/store/part'
import OrganizerSlot from '@/components/OrganizerSlot.vue'


export default defineComponent({
    setup() {
        const organizerStore = useOrganizersStore()
        const partStore = usePartStore()

        return { organizerStore, partStore }
    },
    components: {
        OrganizerSlot
    },
    props: {
        selected: {} as PropType<SingleOrganizer>,
        parts: Array as PropType<SinglePart[]>
    },
    methods: {
        redrawPartList(part: PropType<SinglePart>) {
            this.$emit("addedPartToSlot", part)
        }
    }
})
</script>

<style>
.organizer-background {
    background-color: #8e8e8e
}

.five-item-column {
    flex: 0 0 17% !important;
    max-width: 17% !important;
}
</style>