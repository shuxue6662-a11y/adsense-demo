<template>
  <div class="space-y-4">
    
    <!-- 情绪分析 -->
    <div class="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
      <h4 class="font-bold mb-3 flex items-center gap-2 text-gray-800">
        <span>🧠</span>
        <span>AI实时分析</span>
      </h4>
      
      <!-- 情绪强度条 -->
      <EmotionBar 
        :emotion="analysis.emotion"
        :label="analysis.emotionLabel"
        :color="analysis.emotionColor"
        class="mb-4"
      />
      
      <!-- 分析因素 -->
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div 
          v-for="(value, key) in analysis.factors" 
          :key="key"
          class="bg-white rounded-lg p-2 border border-purple-100"
        >
          <div class="text-gray-500 text-xs mb-1">{{ getFactorLabel(key) }}</div>
          <div class="font-semibold text-gray-800">{{ value }}</div>
        </div>
      </div>
    </div>
    
    <!-- AI决策 -->
    <div 
      :class="[
        'rounded-lg p-4 border-2',
        analysis.decision.action === 'delay' 
          ? 'bg-yellow-50 border-yellow-400' 
          : 'bg-green-50 border-green-400'
      ]"
    >
      <h4 class="font-bold mb-2 flex items-center gap-2">
        <span class="text-xl">{{ analysis.decision.actionLabel }}</span>
      </h4>
      <p class="text-sm text-gray-700 mb-3 leading-relaxed">
        {{ analysis.decision.reason }}
      </p>
      
      <!-- 时机信息 -->
      <div class="flex items-center justify-between text-sm bg-white rounded-lg p-3 border border-gray-200">
        <div>
          <span class="text-gray-600">
            {{ analysis.decision.action === 'delay' ? '预计延迟' : '插入时间' }}：
          </span>
          <span class="font-bold text-gray-800 ml-1">
            {{ formatTiming(analysis.decision.timing) }}
          </span>
        </div>
        
        <div v-if="analysis.decision.nextCheck" class="text-gray-500">
          {{ formatTiming(analysis.decision.nextCheck) }}后再检测
        </div>
      </div>
    </div>
    
    <!-- 广告推荐 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 class="font-bold mb-3 flex items-center gap-2 text-gray-800">
        <span>💡</span>
        <span>AI推荐广告</span>
      </h4>
      
      <div class="bg-white rounded-lg p-4 border border-blue-100">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <div class="font-bold text-lg text-gray-800 mb-1">
              {{ analysis.adRecommendation.selectedTitle }}
            </div>
            <div class="flex items-center gap-2">
              <div class="text-sm text-gray-600">匹配度:</div>
              <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                <div 
                  class="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                  :style="{ width: (analysis.adRecommendation.matchingScore * 100) + '%' }"
                ></div>
              </div>
              <div class="font-bold text-green-600 text-sm">
                {{ (analysis.adRecommendation.matchingScore * 100).toFixed(0) }}%
              </div>
            </div>
          </div>
        </div>
        
        <p class="text-sm text-gray-700 leading-relaxed">
          {{ analysis.adRecommendation.matchingReason }}
        </p>
      </div>
    </div>
    
    <!-- 推理过程 -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <details class="cursor-pointer">
        <summary class="font-semibold text-gray-700 hover:text-ai-primary transition-colors">
          📋 查看完整推理过程
        </summary>
        <div class="mt-3 text-sm text-gray-600 space-y-2 leading-relaxed">
          <p>{{ analysis.reasoning }}</p>
          <div class="pt-2 border-t border-gray-300">
            <div class="font-semibold mb-1">分析模型：</div>
            <div class="text-xs text-gray-500">Ollama qwen3:14b</div>
          </div>
        </div>
      </details>
    </div>
    
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import EmotionBar from './EmotionBar.vue';
import aiEngine from '../services/aiEngine';

const props = defineProps({
  analysis: {
    type: Object,
    required: true
  }
});

// 因素标签映射
const getFactorLabel = (key) => {
  const labels = {
    sceneType: '场景类型',
    visualTone: '画面色调',
    pace: '节奏',
    relationship: '角色关系'
  };
  return labels[key] || key;
};

// 格式化时间
const formatTiming = (seconds) => {
  return aiEngine.formatTiming(seconds);
};
</script>