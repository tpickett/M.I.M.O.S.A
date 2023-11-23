<template>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = true">
        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" title="Username" nav>
            <template v-slot:append>
                <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
            </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item :to="{ name: 'OrganizerList' }" prepend-icon="mdi-apps-box" title="Organizers"
                value="organizers"></v-list-item>
            <v-list-item :to="{ name: 'PartsList' }" prepend-icon="mdi-archive-outline" title="Parts"
                value="parts"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            drawer: true,
            rail: true,
        }
    }
})
</script>
  