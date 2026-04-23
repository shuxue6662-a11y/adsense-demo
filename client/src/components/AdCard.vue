<template>
  <div class="ad-card-overlay bg-black bg-opacity-90 flex items-center justify-center p-6">
    <div class="max-w-2xl w-full">
      
      <!-- 广告头部 -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 text-white">
          <span class="text-xl">📢</span>
          <span class="font-semibold">
            {{ mode === 'ai' ? 'AI为你精选' : '广告' }}
          </span>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-white text-sm">
            剩余 <span class="font-bold text-lg">{{ timer }}</span>s
          </div>
          <button 
            v-if="timer <= 0"
            @click="$emit('close')"
            class="bg-white text-gray-800 px-4 py-1 rounded hover:bg-gray-200 transition-colors text-sm font-semibold"
          >
            关闭广告
          </button>
        </div>
      </div>
      
      <!-- 广告内容 -->
      <div class="bg-white rounded-lg overflow-hidden shadow-2xl">
        <!-- 广告图片 -->
        <div class="relative bg-gradient-to-br from-blue-400 to-purple-500 aspect-video flex items-center justify-center">
          <div class="text-white text-center">
            <div class="text-6xl mb-4">🎮</div>
            <div class="text-3xl font-bold mb-2">{{ ad.title }}</div>
            <div class="text-lg">{{ ad.desc }}</div>
          </div>
        </div>
        
        <!-- 广告信息 -->
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ ad.title }}</h3>
              <p class="text-gray-600 mb-3">{{ ad.desc }}</p>
              
              <!-- 标签 -->
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in ad.tags" 
                  :key="tag"
                  class="badge bg-gray-100 text-gray-700 border border-gray-300"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- AI模式：匹配理由 -->
          <div v-if="mode === 'ai' && ad.matchReason" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <span>💡</span>
              <span>为什么推荐这个广告？</span>
            </h4>
            <p class="text-sm text-blue-800 leading-relaxed">
              {{ ad.matchReason }}
            </p>
          </div>
          
          <!-- 传统模式：提示 -->
          <div v-if="mode === 'traditional'" class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p class="text-sm text-gray-600">
              ⚠️ 传统广告系统随机推送，未考虑用户画像和观看场景
            </p>
          </div>
          
          <!-- 互动区域 -->
          <div class="flex gap-3">
            <button 
              class="flex-1 bg-gradient-to-r from-ai-primary to-ai-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              了解详情
            </button>
            
            <button 
              v-if="interactive && timer > 30"
              @click="$emit('interact')"
              class="flex-1 bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              🎮 答题减少30s
            </button>
          </div>
        </div>
      </div>
      
      <!-- 底部提示 -->
      <div class="text-center mt-4 text-sm text-gray-400">
        {{ mode === 'ai' ? '✨ AI智能匹配，提升观看体验' : '❌ 强制观看，无法跳过' }}
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  ad: {
    type: Object,
    required: true
  },
  mode: {
    type: String,
    required: true
  },
  timer: {
    type: Number,
    required: true
  },
  interactive: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close', 'interact']);
</script>