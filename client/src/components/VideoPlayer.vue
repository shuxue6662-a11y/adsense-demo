<template>
  <div class="video-player-container">
    
    <!-- 视频区域 -->
    <div class="relative bg-black rounded-lg overflow-hidden" style="aspect-ratio: 16/9;">
      
      <!-- 模拟视频播放器 -->
      <div 
        v-if="!videoError"
        class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900"
      >
        <!-- 视频缩略图/占位符 -->
        <div class="text-center text-white">
          <div class="text-6xl mb-4">{{ getSceneIcon() }}</div>
          <h3 class="text-2xl font-bold mb-2">{{ sceneName }}</h3>
          <p class="text-gray-300 mb-6">{{ sceneDescription }}</p>
          
          <!-- 播放按钮 -->
          <button 
            v-if="!isPlaying"
            @click="startPlaying"
            class="bg-ai-primary hover:bg-ai-secondary text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto transition-all hover:scale-110 shadow-lg"
          >
            <span class="text-3xl ml-1">▶</span>
          </button>
          
          <!-- 播放进度 -->
          <div v-else class="w-full max-w-md mx-auto">
            <div class="flex justify-between text-sm mb-2">
              <span>{{ formatTime(currentTime) }}</span>
              <span>{{ formatTime(duration) }}</span>
            </div>
            <div class="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full bg-ai-primary transition-all duration-300"
                :style="{ width: (currentTime / duration * 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 视频加载失败提示 -->
      <div v-else class="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
        <div class="text-center">
          <div class="text-4xl mb-4">⚠️</div>
          <p>视频加载失败</p>
        </div>
      </div>
      
      <!-- AI保护提示（仅AI模式） -->
      <transition name="slide-down">
        <AIProtection 
          v-if="mode === 'ai' && showProtection"
          :analysis="currentAnalysis"
          class="absolute top-4 left-4 right-4"
        />
      </transition>
      
      <!-- 广告卡片 -->
      <transition name="fade">
        <AdCard
          v-if="showAd"
          :ad="currentAd"
          :mode="mode"
          :timer="adTimer"
          :interactive="mode === 'ai' && currentAnalysis?.decision?.action === 'insert'"
          @interact="handleAdInteraction"
          @close="handleAdClose"
          class="absolute inset-0"
        />
      </transition>
      
    </div>
    
    <!-- 控制栏 -->
    <div class="mt-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button 
          @click="togglePlay"
          class="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
          :disabled="showAd"
        >
          <span v-if="!isPlaying">▶</span>
          <span v-else>⏸</span>
        </button>
        
        <div class="text-sm text-gray-600">
          <span v-if="!isPlaying && !showAd">点击播放</span>
          <span v-else-if="showAd">广告播放中...</span>
          <span v-else>正在播放</span>
        </div>
      </div>
      
      <button 
        @click="resetPlayer"
        class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        🔄 重新播放
      </button>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import AdCard from './AdCard.vue';
import AIProtection from './AIProtection.vue';
import aiEngine from '../services/aiEngine';

const props = defineProps({
  sceneId: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    required: true,
    validator: (value) => ['traditional', 'ai'].includes(value)
  },
  currentAnalysis: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['ad-show', 'ad-complete']);

// 状态
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(15); // 假设每个视频15秒
const videoError = ref(false);
const showAd = ref(false);
const showProtection = ref(false);
const adTimer = ref(60);
const currentAd = ref(null);
let playInterval = null;
let adInterval = null;

// 计算属性
const sceneName = computed(() => props.currentAnalysis?.metadata?.name || '');
const sceneDescription = computed(() => props.currentAnalysis?.metadata?.description || '');

// 获取场景图标
const getSceneIcon = () => {
  const emotion = props.currentAnalysis?.emotion || 50;
  if (emotion > 70) return '⚡';
  if (emotion > 30) return '😊';
  return '😌';
};

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 开始播放
const startPlaying = () => {
  isPlaying.value = true;
  startPlayback();
};

// 切换播放/暂停
const togglePlay = () => {
  if (isPlaying.value) {
    pausePlayback();
  } else {
    startPlayback();
  }
};

// 开始播放计时
const startPlayback = () => {
  isPlaying.value = true;
  
  playInterval = setInterval(() => {
    currentTime.value += 0.1;
    
    // 检查是否到达广告插入点
    checkAdTiming();
    
    // 视频播放结束
    if (currentTime.value >= duration.value) {
      pausePlayback();
      currentTime.value = duration.value;
    }
  }, 100);
};

// 暂停播放
const pausePlayback = () => {
  isPlaying.value = false;
  if (playInterval) {
    clearInterval(playInterval);
    playInterval = null;
  }
};

// 重置播放器
const resetPlayer = () => {
  pausePlayback();
  currentTime.value = 0;
  showAd.value = false;
  showProtection.value = false;
  adTimer.value = 60;
};

// 检查广告插入时机
const checkAdTiming = () => {
  if (showAd.value) return;
  if (!props.currentAnalysis) return;
  
  const currentSec = Math.floor(currentTime.value);
  
  if (props.mode === 'traditional') {
    // 传统模式：固定时间插入
    const timing = props.currentAnalysis.traditional?.timing || 5;
    if (currentSec === timing) {
      showTraditionalAd();
    }
  } else {
    // AI模式：智能决策
    const decision = props.currentAnalysis.decision;
    
    if (decision.action === 'delay') {
      // 延迟插入：显示保护提示
      if (currentSec === 2 && !showProtection.value) {
        showProtection.value = true;
        setTimeout(() => {
          showProtection.value = false;
        }, 3000);
      }
    } else if (decision.action === 'insert') {
      // 立即插入
      const timing = decision.timing || 6;
      if (currentSec === timing) {
        showAIAd();
      }
    }
  }
};

// 显示传统广告
const showTraditionalAd = () => {
  pausePlayback();
  
  // 随机选择一个广告
  const ads = aiEngine.getAllAds();
  const randomAd = ads[Math.floor(Math.random() * ads.length)];
  
  currentAd.value = {
    ...randomAd,
    matchReason: '随机推送，无个性化匹配'
  };
  
  showAd.value = true;
  adTimer.value = 60;
  
  emit('ad-show', { mode: 'traditional', ad: currentAd.value });
  
  startAdTimer();
};

// 显示AI广告
const showAIAd = () => {
  pausePlayback();
  
  // 获取推荐的广告
  const adId = props.currentAnalysis.adRecommendation?.selectedId;
  const adInfo = aiEngine.getAdInfo(adId);
  
  currentAd.value = {
    ...adInfo,
    matchReason: props.currentAnalysis.adRecommendation?.matchingReason
  };
  
  showAd.value = true;
  adTimer.value = 60;
  
  emit('ad-show', { mode: 'ai', ad: currentAd.value });
  
  startAdTimer();
};

// 广告倒计时
const startAdTimer = () => {
  adInterval = setInterval(() => {
    adTimer.value -= 1;
    
    if (adTimer.value <= 0) {
      handleAdClose();
    }
  }, 1000);
};

// 广告互动（AI模式可减少时长）
const handleAdInteraction = () => {
  if (props.mode === 'ai') {
    adTimer.value = Math.max(0, adTimer.value - 30);
  }
};

// 关闭广告
const handleAdClose = () => {
  showAd.value = false;
  
  if (adInterval) {
    clearInterval(adInterval);
    adInterval = null;
  }
  
  emit('ad-complete', { mode: props.mode, ad: currentAd.value });
  
  // 继续播放
  startPlayback();
};

// 监听场景变化
watch(() => props.sceneId, () => {
  resetPlayer();
});

// 清理
onUnmounted(() => {
  pausePlayback();
  if (adInterval) {
    clearInterval(adInterval);
  }
});
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>