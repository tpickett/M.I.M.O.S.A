<template>
    <v-col class="five-item-column">
        <v-card class="mx-auto" max-width="344">
            <v-img :src=matchedPartImage() class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px" cover>
            </v-img>
            <v-card-item>
                <div>
                    <div class="text-overline mb-1">
                        slot
                    </div>
                    <div class="text-h6 mb-1">
                        {{ $props.slot ? $props.slot : 0 }}
                    </div>
                    <div class="text-caption">{{ matchedPartName() }}</div>
                </div>
            </v-card-item>

            <v-card-actions>
                <v-btn
                    @click="organizerStore.test($props.slot ? $props.slot : 0, `${organizerId}` ? `${organizerId}` : `${0}`)">
                    Illuminate
                </v-btn>
                <v-col v-if="partExists() === undefined">
                    <v-btn @click="assignPartToSlot()">
                        Assign
                    </v-btn>
                </v-col>
                <v-col v-else>
                    <v-btn>
                        Move
                    </v-btn>
                </v-col>
            </v-card-actions>
        </v-card>
    </v-col>
    <v-dialog v-model="assigning" width="1024">
        <v-card>
            <template v-slot:title>
                Assign part to slot
            </template>
            <v-card-text>
                <v-text-field v-model="$props.slot" label="Slot" readonly></v-text-field>
                <v-autocomplete v-model="partId" label="Part" :item-title="'name'" :item-value="'id'"
                    :items="partStore.itemList" variant="solo-filled"></v-autocomplete>
            </v-card-text>
            <v-card-actions>
                <v-col cols="2" offset="8" align-self="start">
                    <v-btn color="primary" @click="assigning = false">Close Dialog</v-btn>
                </v-col>
                <v-col cols="2" align-self="end">
                    <v-btn prepend-icon="mdi-check-circle" @click="savePartToSlot()">
                        <template v-slot:prepend><v-icon color="success"></v-icon></template>Save
                    </v-btn>
                </v-col>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useOrganizersStore from '@/store/organizer'
import usePartStore, { SinglePart } from '@/store/part'


export default defineComponent({
    setup() {
        const organizerStore = useOrganizersStore()
        const partStore = usePartStore()
        return { organizerStore, partStore }
    },
    emits: ['addedPartToSlot'],
    props: {
        parts: {
            type: Array as PropType<SinglePart[]>,
            default: []
        },
        slot: Number,
        organizerId: Number
    },
    data() {
        return {
            assigning: false,
            partId: -1,
            rerender: 0
        }
    },
    methods: {
        partExists() {
            if (this.$props.parts) {
                return this.$props.parts.find((item: SinglePart) => parseInt(item.position) === this.$props.slot ? this.$props.slot : 0)
            } else {

            }
        },
        matchedPartName() {
            let found = this.partExists()
            return found ? found.name : "Nothing Currently Assigned"
        },
        matchedPartImage() {
            let found = this.partExists()
            return found ? found.image : ""
        },
        assignPartToSlot() {
            this.assigning = true
        },
        savePartToSlot() {
            this.organizerStore.assign(this.organizerId ? `${this.organizerId}` : `${0}`, this.$props.slot ? this.$props.slot : 0, this.partId)
                .then(() => {
                    let foundPart = this.partStore.findItem(this.partId)
                    if (foundPart) {
                        this.organizerStore.selectedSlots[this.$props.slot ? this.$props.slot : 0] = foundPart
                        foundPart.position = `${this.$props.slot}`
                    }
                    this.partId = -1
                    this.assigning = false
                    this.$emit("addedPartToSlot", foundPart)
                }).catch((e: any) => {
                    console.log(e.message)
                    this.partId = -1
                    this.assigning = false
                })
        }
    }
})
</script>