<template>
  <div class="min-h-screen bg-gray-100">
    
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
      <div class="container mx-auto flex items-center justify-between">
        <button 
          @click="goHome" 
          class="flex items-center gap-2 text-gray-600 hover:text-ai-primary transition-colors"
        >
          <span class="text-xl">←</span>
          <span class="font-semibold">返回首页</span>
        </button>
        
        <h2 class="text-2xl md:text-3xl font-bold text-center flex-1">
          <span v-if="displayMode === 'compare'">对比实验：传统模式 vs AI模式</span>
          <span v-else-if="displayMode === 'traditional-only'">传统广告模式体验</span>
          <span v-else>AI感知模式体验</span>
        </h2>
        
        <div class="w-24"></div>
      </div>
    </header>
    
    <!-- 场景选择器 -->
    <div class="container mx-auto px-4 py-6">
      <div class="card">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 class="font-bold text-lg mb-2">选择场景：</h3>
            <div class="flex flex-wrap gap-3">
              <button 
                v-for="scene in allScenes" 
                :key="scene.id"
                @click="switchScene(scene.id)"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  currentSceneId === scene.id 
                    ? 'bg-ai-primary text-white shadow-lg scale-105' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                <span class="mr-2">{{ getSceneEmoji(scene.emotion) }}</span>
                <span>{{ scene.name }}</span>
                <span class="ml-2 text-sm opacity-75">({{ scene.emotion }}分)</span>
              </button>
            </div>
          </div>
          
          <!-- 模式切换 -->
          <div v-if="displayMode === 'compare'" class="flex items-center gap-2">
            <span class="text-sm text-gray-600">显示模式：</span>
            <div class="flex gap-2">
              <button 
                class="px-3 py-1 text-sm rounded bg-ai-primary text-white"
              >
                对比模式
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主对比区域 -->
    <div class="container mx-auto px-4 pb-12">
      
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-ai-primary border-t-transparent"></div>
        <p class="mt-4 text-gray-600 text-lg">AI正在分析场景...</p>
      </div>
      
      <!-- 对比模式布局 -->
      <div v-else-if="displayMode === 'compare'" class="grid md:grid-cols-2 gap-6">
        
        <!-- 左侧：传统模式 -->
        <div class="space-y-4">
          <div class="card border-2 border-red-400">
            <div class="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg mb-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <span class="text-2xl">❌</span>
                <span class="text-xl font-bold">传统广告模式</span>
              </div>
            </div>
            
            <!-- 视频播放器组件（待创建） -->
            <VideoPlayer 
              :scene-id="currentSceneId"
              mode="traditional"
              :current-analysis="currentAnalysis"
              @ad-show="onTraditionalAdShow"
            />
            
            <!-- 传统模式状态 -->
            <div class="mt-4 space-y-3">
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 class="font-bold text-red-800 mb-3 flex items-center gap-2">
                  <span>⚙️</span>
                  <span>系统行为</span>
                </h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-700">插入时机</span>
                    <span class="font-semibold text-red-600">
                      固定第{{ currentAnalysis?.traditional?.timing || 5 }}秒
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-700">内容匹配</span>
                    <span class="font-semibold text-red-600">随机推送</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-700">用户控制</span>
                    <span class="font-semibold text-red-600">强制观看</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-700">情绪感知</span>
                    <span class="font-semibold text-red-600">无</span>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div class="text-xs text-gray-600">
                  {{ currentAnalysis?.traditional?.reason }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧：AI模式 -->
        <div class="space-y-4">
          <div class="card border-2 border-green-400">
            <div class="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg mb-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <span class="text-2xl">✅</span>
                <span class="text-xl font-bold">AI感知模式</span>
              </div>
            </div>
            
            <!-- 视频播放器组件 -->
            <VideoPlayer 
              :scene-id="currentSceneId"
              mode="ai"
              :current-analysis="currentAnalysis"
              @ad-show="onAIAdShow"
            />
            
            <!-- AI决策面板组件（待创建） -->
            <AIPanel 
              v-if="currentAnalysis"
              :analysis="currentAnalysis"
              class="mt-4"
            />
          </div>
        </div>
        
      </div>
      
      <!-- 单独模式布局 -->
      <div v-else class="max-w-4xl mx-auto">
        <div class="card">
          <VideoPlayer 
            :scene-id="currentSceneId"
            :mode="displayMode === 'traditional-only' ? 'traditional' : 'ai'"
            :current-analysis="currentAnalysis"
          />
          
          <AIPanel 
            v-if="displayMode === 'ai-only' && currentAnalysis"
            :analysis="currentAnalysis"
            class="mt-4"
          />
        </div>
      </div>
      
      <!-- 数据对比表格 -->
      <div class="mt-12">
        <CompareTable />
      </div>
      
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import aiEngine from '../services/aiEngine';
import VideoPlayer from '../components/VideoPlayer.vue';
import AIPanel from '../components/AIPanel.vue';
import CompareTable from '../components/CompareTable.vue';

const router = useRouter();
const route = useRoute();

// 状态
const allScenes = ref([]);
const currentSceneId = ref('scene-high');
const currentAnalysis = ref(null);
const loading = ref(true);
const displayMode = ref('compare'); // 'compare' | 'traditional-only' | 'ai-only'

// 初始化
onMounted(async () => {
  // 获取所有场景
  allScenes.value = aiEngine.getAllScenes();
  
  // 从URL获取参数
  if (route.query.scene) {
    currentSceneId.value = route.query.scene;
  }
  if (route.query.mode) {
    displayMode.value = route.query.mode;
  }
  
  // 加载场景分析
  await loadSceneAnalysis();
});

// 监听路由变化
watch(() => route.query, (newQuery) => {
  if (newQuery.scene && newQuery.scene !== currentSceneId.value) {
    currentSceneId.value = newQuery.scene;
    loadSceneAnalysis();
  }
  if (newQuery.mode) {
    displayMode.value = newQuery.mode;
  }
});

// 加载场景分析
const loadSceneAnalysis = async () => {
  loading.value = true;
  
  // 模拟AI分析延迟
  await aiEngine.simulateThinking(800);
  
  currentAnalysis.value = aiEngine.getSceneAnalysis(currentSceneId.value);
  loading.value = false;
};

// 切换场景
const switchScene = async (sceneId) => {
  if (sceneId === currentSceneId.value) return;
  
  currentSceneId.value = sceneId;
  
  // 更新URL
  router.replace({
    query: {
      ...route.query,
      scene: sceneId
    }
  });
  
  await loadSceneAnalysis();
};

// 返回首页
const goHome = () => {
  router.push('/');
};

// 获取场景Emoji
const getSceneEmoji = (emotion) => {
  if (emotion > 70) return '⚡';
  if (emotion > 30) return '😊';
  return '😌';
};

// 广告显示事件
const onTraditionalAdShow = (data) => {
  console.log('Traditional ad shown:', data);
};

const onAIAdShow = (data) => {
  console.log('AI ad shown:', data);
};
</script>

<style scoped>
/* 对比模式专属样式 */
</style>