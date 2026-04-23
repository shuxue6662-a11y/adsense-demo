<template>
  <div class="ai-protection-alert animate-slide-up">
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-2xl p-4 backdrop-blur-sm bg-opacity-95">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl animate-pulse">
            🛡️
          </div>
        </div>
        
        <div class="flex-1">
          <h4 class="font-bold text-lg mb-1">AI保护模式已启动</h4>
          <p class="text-sm text-purple-100 mb-3">
            检测到剧情高潮，已自动延迟广告插入以保护您的观看体验
          </p>
          
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="bg-white bg-opacity-20 rounded px-3 py-2">
              <div class="text-purple-200 text-xs mb-1">情绪强度</div>
              <div class="font-bold">{{ analysis.emotion }}分</div>
            </div>
            <div class="bg-white bg-opacity-20 rounded px-3 py-2">
              <div class="text-purple-200 text-xs mb-1">预计等待</div>
              <div class="font-bold">{{ formatTiming(analysis.decision.timing) }}</div>
            </div>
          </div>
        </div>
        
        <button 
          class="flex-shrink-0 text-white opacity-70 hover:opacity-100 transition-opacity"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import aiEngine from '../services/aiEngine';

const props = defineProps({
  analysis: {
    type: Object,
    required: true
  }
});

defineEmits(['close']);

const formatTiming = (seconds) => {
  return aiEngine.formatTiming(seconds);
};
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.4s ease-out;
}
</style>