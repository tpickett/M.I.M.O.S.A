<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <v-icon icon="mdi-beer" />

      M.I.M.O.S.A
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="toggleTheme()">
      <v-icon>mdi-brightness-6</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>
