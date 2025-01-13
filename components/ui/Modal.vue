<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
        @click="$emit('update:open', false)"
      >
        <div
          class="mx-4 w-full max-w-[535px] rounded-2xl bg-white sm:mx-0"
          :class="[fullHeight ? 'h-full sm:h-[349px]' : 'h-[349px]']"
          @click.stop
        >
          <div>
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean;
  fullHeight?: boolean;
}>();

defineEmits<{
  "update:open": [value: boolean];
}>();
</script>
