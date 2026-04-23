<template>
  <div class="min-h-screen flex flex-col">
    
    <!-- 顶部导航 -->
    <nav class="bg-white shadow-sm py-4 px-6">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🎬</span>
          <span class="text-xl font-bold gradient-text">AdSense·感知广告</span>
        </div>
        <div class="flex items-center gap-4 text-sm text-gray-600">
          <span>⚡ Powered by AI</span>
          <span class="badge badge-primary">Demo v1.0</span>
        </div>
      </div>
    </nav>
    
    <!-- 主体内容 -->
    <main class="flex-1 flex flex-col items-center justify-center p-8">
      
      <!-- Hero区域 -->
      <div class="text-center mb-16 animate-fade-in">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">
          <span class="gradient-text">AI让广告不再烦人</span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 mb-4">
          情境感知 · 智能决策 · 精准匹配
        </p>
        <p class="text-gray-500 max-w-2xl mx-auto">
          基于AI的情绪识别和智能推荐，让广告在对的时刻，以对的方式出现
        </p>
      </div>
      
      <!-- 模式选择卡片 -->
      <div class="grid md:grid-cols-2 gap-8 max-w-5xl w-full mb-16 animate-slide-up">
        
        <!-- 传统模式 -->
        <div 
          class="card-hover group cursor-pointer border-2 border-transparent hover:border-red-400 transition-all"
          @click="selectMode('traditional')"
        >
          <div class="text-center">
            <div class="text-7xl mb-6 group-hover:scale-110 transition-transform">😫</div>
            <h3 class="text-2xl font-bold mb-3">传统广告模式</h3>
            <div class="space-y-2 text-gray-600 mb-6">
              <p class="flex items-center justify-center gap-2">
                <span class="text-red-500">❌</span>
                <span>固定时间强制插入</span>
              </p>
              <p class="flex items-center justify-center gap-2">
                <span class="text-red-500">❌</span>
                <span>内容随机推送</span>
              </p>
              <p class="flex items-center justify-center gap-2">
                <span class="text-red-500">❌</span>
                <span>无视用户情绪</span>
              </p>
            </div>
            <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <div class="text-sm text-red-700">
                <div class="font-semibold mb-1">用户体验</div>
                <div class="flex items-center justify-center gap-2">
                  <div class="flex">
                    <span v-for="i in 5" :key="i" class="text-lg">
                      {{ i <= 2 ? '⭐' : '☆' }}
                    </span>
                  </div>
                  <span class="text-xs">2.1/5.0</span>
                </div>
              </div>
            </div>
            <button class="btn-danger w-full">
              体验传统模式
            </button>
          </div>
        </div>
        
        <!-- AI模式 -->
        <div 
          class="card-hover group cursor-pointer border-2 border-ai-primary bg-gradient-to-br from-white to-purple-50 transition-all"
          @click="selectMode('ai')"
        >
          <div class="text-center">
            <div class="text-7xl mb-6 group-hover:scale-110 transition-transform animate-float">😊</div>
            <h3 class="text-2xl font-bold mb-3">AI感知模式</h3>
            <div class="space-y-2 text-gray-600 mb-6">
              <p class="flex items-center justify-center gap-2">
                <span class="text-green-500">✅</span>
                <span>情境智能识别</span>
              </p>
              <p class="flex items-center justify-center gap-2">
                <span class="text-green-500">✅</span>
                <span>精准匹配推荐</span>
              </p>
              <p class="flex items-center justify-center gap-2">
                <span class="text-green-500">✅</span>
                <span>保护用户体验</span>
              </p>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
              <div class="text-sm text-green-700">
                <div class="font-semibold mb-1">用户体验</div>
                <div class="flex items-center justify-center gap-2">
                  <div class="flex">
                    <span v-for="i in 5" :key="i" class="text-lg">
                      {{ i <= 4 ? '⭐' : '☆' }}
                    </span>
                  </div>
                  <span class="text-xs">4.3/5.0</span>
                </div>
              </div>
            </div>
            <button class="btn-primary w-full">
              体验AI模式
            </button>
          </div>
        </div>
        
      </div>
      
      <!-- 对比实验入口 -->
      <div class="text-center mb-16">
        <button 
          class="btn-primary text-lg px-10 py-5 shadow-lg hover:shadow-2xl"
          @click="goCompare"
        >
          📊 左右对比实验模式
        </button>
        <p class="text-sm text-gray-500 mt-3">
          同时体验两种模式，直观对比差异
        </p>
      </div>
      
      <!-- 场景快速选择 -->
      <div class="max-w-6xl w-full">
        <h3 class="text-3xl font-bold mb-8 text-center">
          🎭 快速体验不同场景
        </h3>
        
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-ai-primary border-t-transparent"></div>
          <p class="mt-4 text-gray-600">加载场景数据...</p>
        </div>
        
        <div v-else class="grid md:grid-cols-3 gap-6">
          <div 
            v-for="scene in scenes" 
            :key="scene.id"
            class="card-hover cursor-pointer group"
            @click="goScene(scene.id)"
          >
            <!-- 场景图标 -->
            <div class="text-center mb-4">
              <div class="text-5xl mb-2 group-hover:scale-110 transition-transform">
                {{ getSceneEmoji(scene.emotion) }}
              </div>
              <h4 class="text-xl font-bold mb-1">{{ scene.name }}</h4>
              <p class="text-sm text-gray-600">{{ scene.description }}</p>
            </div>
            
            <!-- 情绪强度条 -->
            <div class="mb-4">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">情绪强度</span>
                <span class="font-bold" :style="{ color: scene.emotionColor }">
                  {{ scene.emotion }}/100
                </span>
              </div>
              <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full transition-all duration-500 rounded-full"
                  :style="{ 
                    width: scene.emotion + '%',
                    backgroundColor: scene.emotionColor 
                  }"
                ></div>
              </div>
              <div class="text-center mt-2">
                <span 
                  class="text-sm font-semibold"
                  :style="{ color: scene.emotionColor }"
                >
                  {{ scene.emotionLabel }}
                </span>
              </div>
            </div>
            
            <!-- 快速体验按钮 -->
            <button class="btn-secondary w-full text-sm group-hover:bg-ai-primary group-hover:text-white group-hover:border-ai-primary">
              快速体验 →
            </button>
          </div>
        </div>
      </div>
      
      <!-- 数据亮点 -->
      <div class="mt-20 max-w-6xl w-full">
        <div class="bg-gradient-to-r from-ai-primary to-ai-secondary rounded-2xl p-8 md:p-12 text-white">
          <h3 class="text-3xl font-bold mb-8 text-center">AI模式效果提升</h3>
          <div class="grid md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold mb-2">+171%</div>
              <div class="text-sm opacity-90">广告完播率</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold mb-2">+105%</div>
              <div class="text-sm opacity-90">用户满意度</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold mb-2">+300%</div>
              <div class="text-sm opacity-90">广告点击率</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-bold mb-2">-72%</div>
              <div class="text-sm opacity-90">用户流失率</div>
            </div>
          </div>
        </div>
      </div>
      
    </main>
    
    <!-- 页脚 -->
    <footer class="bg-white border-t border-gray-200 py-6 mt-20">
      <div class="container mx-auto px-4 text-center text-sm text-gray-600">
        <p>腾讯PCG AI产品大赛</p>
        <p class="mt-1">AdSense感知广告 - 让AI替用户守住那道门</p>
      </div>
    </footer>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import aiEngine from '../services/aiEngine';

const router = useRouter();
const scenes = ref([]);
const loading = ref(true);

onMounted(async () => {
  // 模拟加载延迟（增加真实感）
  await aiEngine.simulateThinking(500);
  scenes.value = aiEngine.getAllScenes();
  loading.value = false;
});

// 选择模式（单独体验）
const selectMode = (mode) => {
  router.push({ 
    name: 'Compare', 
    query: { 
      mode: mode === 'traditional' ? 'traditional-only' : 'ai-only',
      scene: 'scene-high' 
    } 
  });
};

// 对比模式
const goCompare = () => {
  router.push({ 
    name: 'Compare', 
    query: { 
      mode: 'compare',
      scene: 'scene-high' 
    } 
  });
};

// 快速体验某个场景
const goScene = (sceneId) => {
  router.push({ 
    name: 'Compare', 
    query: { 
      mode: 'compare',
      scene: sceneId 
    } 
  });
};

// 获取场景Emoji
const getSceneEmoji = (emotion) => {
  if (emotion > 70) return '⚡';
  if (emotion > 30) return '😊';
  return '😌';
};
</script>

<style scoped>
/* 页面专属样式 */
</style>