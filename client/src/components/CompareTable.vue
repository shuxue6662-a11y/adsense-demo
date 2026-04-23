<template>
  <div class="card">
    <h3 class="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
      <span>📊</span>
      <span>实验数据对比</span>
    </h3>
    
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b-2 border-gray-300">
            <th class="px-6 py-4 text-left font-bold text-gray-700">评估维度</th>
            <th class="px-6 py-4 text-center font-bold text-red-600 bg-red-50">
              <div class="flex items-center justify-center gap-2">
                <span>❌</span>
                <span>传统模式</span>
              </div>
            </th>
            <th class="px-6 py-4 text-center font-bold text-green-600 bg-green-50">
              <div class="flex items-center justify-center gap-2">
                <span>✅</span>
                <span>AI模式</span>
              </div>
            </th>
            <th class="px-6 py-4 text-center font-bold text-ai-primary bg-purple-50">
              <div class="flex items-center justify-center gap-2">
                <span>📈</span>
                <span>提升幅度</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-700">广告完播率</td>
            <td class="px-6 py-4 text-center">
              <span class="text-2xl font-bold text-red-600">{{ metrics.traditional.completionRate }}%</span>
            </td>
            <td class="px-6 py-4 text-center">
              <span class="text-2xl font-bold text-green-600">{{ metrics.ai.completionRate }}%</span>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-xl">
                ↑ {{ metrics.improvement.completionRate }}%
              </div>
            </td>
          </tr>
          
          <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-700">用户满意度</td>
            <td class="px-6 py-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <span class="text-2xl font-bold text-red-600">{{ metrics.traditional.satisfaction }}</span>
                <div class="flex text-yellow-400">
                  <span v-for="i in 5" :key="i">
                    {{ i <= 2 ? '⭐' : '☆' }}
                  </span>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <span class="text-2xl font-bold text-green-600">{{ metrics.ai.satisfaction }}</span>
                <div class="flex text-yellow-400">
                  <span v-for="i in 5" :key="i">
                    {{ i <= 4 ? '⭐' : '☆' }}
                  </span>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-xl">
                ↑ {{ metrics.improvement.satisfaction }}%
              </div>
            </td>
          </tr>
          
          <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-700">广告点击率</td>
            <td class="px-6 py-4 text-center">
              <span class="text-2xl font-bold text-red-600">{{ metrics.traditional.clickRate }}%</span>
            </td>
            <td class="px-6 py-4 text-center">
              <span class="text-2xl font-bold text-green-600">{{ metrics.ai.clickRate }}%</span>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-xl">
                ↑ {{ metrics.improvement.clickRate }}%
              </div>
            </td>
          </tr>
          
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-700">用户流失率</td>
            <td class="px-6 py-4 text-center">
              <span class="text-2xl font-bold text-red-600">{{ metrics.traditional.churnRate }}%</span>
            </td>
            <td class="px-6 py-4 text-center">
              <span class="text-2xl font-bold text-green-600">{{ metrics.ai.churnRate }}%</span>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="inline-block bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full font-bold text-xl">
                ↓ {{ Math.abs(metrics.improvement.churnRate) }}%
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 数据说明 -->
    <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 class="font-semibold text-blue-900 mb-2 flex items-center gap-2">
        <span>📌</span>
        <span>数据说明</span>
      </h4>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• 数据基于AI分析结果和行业基准测算</li>
        <li>• 完播率：用户完整观看广告的比例</li>
        <li>• 点击率：用户点击广告进一步了解的比例</li>
        <li>• 流失率：因广告打扰而离开平台的用户比例</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import aiEngine from '../services/aiEngine';

const metrics = ref({
  traditional: {
    completionRate: 0,
    satisfaction: 0,
    clickRate: 0,
    churnRate: 0
  },
  ai: {
    completionRate: 0,
    satisfaction: 0,
    clickRate: 0,
    churnRate: 0
  },
  improvement: {
    completionRate: 0,
    satisfaction: 0,
    clickRate: 0,
    churnRate: 0
  }
});

onMounted(() => {
  // 获取对比数据
  metrics.value = aiEngine.getComparisonMetrics();
});
</script>