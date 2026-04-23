/**
 * AI引擎服务
 * 负责读取预计算的分析结果并提供查询接口
 */

import analysisData from '../data/analysis-results.json';

class AIEngine {
  constructor() {
    this.data = analysisData;
    this.userProfile = analysisData.userProfile;
    this.adDatabase = analysisData.adDatabase;
    this.scenes = analysisData.scenes;
    this.metrics = analysisData.comparisonMetrics;
  }
  
  /**
   * 获取场景分析结果
   * @param {string} sceneId - 场景ID（如 'scene-high'）
   * @returns {Object} 场景分析结果
   */
  getSceneAnalysis(sceneId) {
    const scene = this.scenes[sceneId];
    if (!scene) {
      console.warn(`场景 ${sceneId} 不存在`);
      return null;
    }
    return scene;
  }
  
  /**
   * 获取所有场景列表
   * @returns {Array} 场景列表
   */
  getAllScenes() {
    return Object.values(this.scenes).map(scene => ({
      id: scene.metadata.id,
      name: scene.metadata.name,
      description: scene.metadata.description,
      emotion: scene.emotion,
      emotionLabel: scene.emotionLabel,
      emotionColor: scene.emotionColor
    }));
  }
  
  /**
   * 获取广告信息
   * @param {string} adId - 广告ID
   * @returns {Object} 广告信息
   */
  getAdInfo(adId) {
    return Object.values(this.adDatabase).find(ad => ad.id === adId);
  }
  
  /**
   * 获取所有广告
   * @returns {Array} 广告列表
   */
  getAllAds() {
    return Object.values(this.adDatabase);
  }
  
  /**
   * 获取用户画像
   * @returns {Object} 用户画像
   */
  getUserProfile() {
    return this.userProfile;
  }
  
  /**
   * 获取对比数据
   * @returns {Object} 传统模式 vs AI模式的对比指标
   */
  getComparisonMetrics() {
    return this.metrics;
  }
  
  /**
   * 模拟AI思考延迟
   * @param {number} duration - 延迟时长（毫秒）
   * @returns {Promise}
   */
  async simulateThinking(duration = 800) {
    return new Promise(resolve => setTimeout(resolve, duration));
  }
  
  /**
   * 根据情绪强度获取颜色
   * @param {number} emotion - 情绪强度（0-100）
   * @returns {string} 颜色值
   */
  getEmotionColor(emotion) {
    if (emotion > 70) return '#ff4444';
    if (emotion > 30) return '#ffaa00';
    return '#44bb44';
  }
  
  /**
   * 根据情绪强度获取Emoji
   * @param {number} emotion - 情绪强度（0-100）
   * @returns {string} Emoji
   */
  getEmotionEmoji(emotion) {
    if (emotion > 70) return '⚡';
    if (emission > 30) return '😊';
    return '😌';
  }
  
  /**
   * 格式化时间（秒 -> 分:秒）
   * @param {number} seconds - 秒数
   * @returns {string} 格式化的时间
   */
  formatTiming(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    if (min > 0) {
      return `${min}分${sec}秒`;
    }
    return `${sec}秒`;
  }
  
  /**
   * 获取分析统计信息
   * @returns {Object} 统计信息
   */
  getAnalysisStats() {
    return {
      version: this.data.version,
      generatedAt: this.data.generatedAt,
      model: this.data.model,
      totalScenes: Object.keys(this.scenes).length,
      ...this.data.analysisStats
    };
  }
}

// 导出单例
export default new AIEngine();