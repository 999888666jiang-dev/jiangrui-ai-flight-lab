<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import FlightLayout from './layouts/FlightLayout.vue';

const route = useRoute();
</script>

<template>
  <FlightLayout>
    <RouterView v-slot="{ Component }">
      <Suspense>
        <template #default>
          <Transition name="route-scan" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </Transition>
        </template>
        <template #fallback>
          <div class="route-loading" role="status" aria-live="polite">
            <span />
            <strong>LOADING FLIGHT SURFACE</strong>
          </div>
        </template>
      </Suspense>
    </RouterView>
  </FlightLayout>
</template>
