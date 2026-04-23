<template>
  <div class="emotion-bar-component">
    <div class="flex justify-between items-center text-sm mb-2">
      <span class="text-gray-600 font-medium">情绪强度</span>
      <div class="flex items-center gap-2">
        <span 
          class="font-bold text-lg"
          :style="{ color: color }"
        >
          {{ emotion }}/100
        </span>
        <span 
          class="font-semibold"
          :style="{ color: color }"
        >
          {{ label }}
        </span>
      </div>
    </div>
    
    <div class="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <!-- 渐变背景 -->
      <div class="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 opacity-20"></div>
      
      <!-- 填充条 -->
      <div 
        class="h-full transition-all duration-700 ease-out relative"
        :style="{ 
          width: emotion + '%',
          backgroundColor: color 
        }"
      >
        <!-- 动画光效 -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="h-full w-full animate-pulse-slow opacity-50 bg-white"></div>
        </div>
      </div>
      
      <!-- 刻度线 -->
      <div class="absolute inset-0 flex items-center">
        <div class="w-full flex justify-between px-1">
          <div class="w-px h-2 bg-white opacity-50"></div>
          <div class="w-px h-2 bg-white opacity-50"></div>
          <div class="w-px h-2 bg-white opacity-50"></div>
          <div class="w-px h-2 bg-white opacity-50"></div>
        </div>
      </div>
    </div>
    
    <!-- 刻度标签 -->
    <div class="flex justify-between text-xs text-gray-400 mt-1 px-1">
      <span>0</span>
      <span>30</span>
      <span>70</span>
      <span>100</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  emotion: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
});
</script>