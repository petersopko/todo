<template>
  <div
    class="h-full px-4 pt-12 lg:h-[calc(100vh-48px)] lg:overflow-hidden lg:px-10"
  >
    <h1 class="heading-uikit mb-8 break-words">UI Components</h1>

    <div class="flex max-w-[1440px] flex-wrap justify-between gap-y-20">
      <section class="w-full xl:w-[calc(33.33%-2rem)]">
        <h2 class="heading-uikit mb-6 break-words">Buttons</h2>
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="label w-24">Default</span>
            <Button icon="Plus">New task</Button>
          </div>
        </div>
      </section>

      <section class="w-full xl:w-[calc(33.33%-2rem)]">
        <h2 class="heading-uikit mb-6 break-words">Checkbox&Radio</h2>
        <div class="space-y-4">
          <div
            v-for="{ state, label } in states"
            :key="state"
            class="flex items-center gap-2"
          >
            <span class="label w-24">{{ label }}</span>
            <div
              class="flex items-center gap-4"
              :class="{ hover: state === 'hover' }"
            >
              <div :class="{ hover: state === 'hover' }">
                <Checkbox v-model="checkboxValues[state]" />
              </div>
              <div
                class="flex h-6 items-center"
                :class="{ hover: state === 'hover' }"
              >
                <Radio v-model="radioValues[state]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="w-full xl:w-[calc(33.33%-2rem)]">
        <h2 class="heading-uikit mb-6 break-words">Badges</h2>
        <div class="space-y-4">
          <div
            v-for="badge in badges"
            :key="badge.color"
            class="flex items-center gap-2"
          >
            <span class="label w-24">{{ badge.label }}</span>
            <Badge :color="badge.color">{{ badge.text }}</Badge>
          </div>
        </div>
      </section>

      <section class="w-full xl:w-[calc(33.33%-2rem)]">
        <h2 class="heading-uikit mb-6 break-words">Input Fields</h2>
        <div class="space-y-12">
          <div
            v-for="{ state, label } in textFieldStates"
            :key="state"
            class="flex flex-col gap-2"
          >
            <span class="label">{{ label }}</span>
            <div :class="{ hover: state === 'hover' }">
              <TextField v-model="textFieldValues[state]" />
            </div>
          </div>
        </div>
      </section>

      <section class="w-full xl:w-[calc(33.33%-2rem)]">
        <h2 class="heading-uikit mb-6 break-words">Colors</h2>
        <div
          class="grid grid-cols-2 gap-x-0.5 gap-y-4 md:grid-cols-3 lg:gap-x-4"
        >
          <div v-for="color in colors" :key="color.name">
            <ColorBox
              :color="color.name"
              :class="{
                'border border-[#D9D9D9]':
                  color.name === 'white' || color.name === 'light-gray-1',
              }"
            />
            <div class="mt-0.5 flex flex-col lg:mt-2">
              <span
                class="font-inter text-sm font-semibold leading-5 text-black"
              >
                {{ color.label }}
              </span>
              <div class="flex items-center">
                <span
                  class="font-inter text-sm font-semibold leading-4"
                  style="color: #787878"
                >
                  #
                </span>
                <span
                  class="font-archia text-sm font-normal leading-4"
                  style="color: #1a1a1a"
                >
                  {{ color.hex.slice(1) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="w-full xl:w-[calc(33.33%-2rem)]">
        <h2 class="heading-uikit mb-6 break-words">Typography</h2>
        <div class="space-y-6">
          <div v-for="item in typographyItems" :key="item.label">
            <p :class="item.class">{{ item.label }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  badges,
  colors,
  checkboxValues,
  radioValues,
  textFieldValues,
  states,
  textFieldStates,
  typographyItems,
} from "~/data/ui";
</script>
