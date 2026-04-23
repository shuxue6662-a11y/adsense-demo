/**
 * Ollama 连接测试脚本
 * 运行方式：node test-ollama.js
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:14b';

async function testOllamaConnection() {
  console.log('═══════════════════════════════════════════════');
  console.log('🧪 Ollama 连接测试');
  console.log('═══════════════════════════════════════════════\n');
  
  console.log(`📍 Ollama 地址: ${OLLAMA_HOST}`);
  console.log(`🤖 使用模型: ${OLLAMA_MODEL}\n`);
  
  try {
    // 测试1：检查Ollama服务是否运行
    console.log('测试1: 检查Ollama服务...');
    const healthCheck = await axios.get(`${OLLAMA_HOST}/api/tags`, {
      timeout: 5000
    });
    console.log('✅ Ollama服务运行正常\n');
    
    // 测试2：检查模型是否存在
    console.log('测试2: 检查模型是否存在...');
    const models = healthCheck.data.models || [];
    const modelExists = models.some(m => m.name === OLLAMA_MODEL);
    
    if (!modelExists) {
      console.log('❌ 模型不存在！');
      console.log('\n可用模型列表：');
      models.forEach(m => console.log(`  - ${m.name}`));
      console.log(`\n请先下载模型：ollama pull ${OLLAMA_MODEL}`);
      process.exit(1);
    }
    console.log('✅ 模型存在\n');
    
    // 测试3：测试基础对话
    console.log('测试3: 测试模型推理能力...');
    console.log('发送提示词: "请用一句话介绍你自己"\n');
    
    const startTime = Date.now();
    const response = await axios.post(
      `${OLLAMA_HOST}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt: '请用一句话介绍你自己',
        stream: false,
        options: {
          temperature: 0.7
        }
      },
      {
        timeout: 60000 // 60秒超时
      }
    );
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('✅ 推理成功\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 AI 响应:');
    console.log(response.data.response);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`⏱️  推理耗时: ${duration}秒`);
    console.log(`📊 生成tokens: ${response.data.eval_count || 'N/A'}`);
    
    if (response.data.eval_count && response.data.eval_duration) {
      const tokensPerSec = (response.data.eval_count / (response.data.eval_duration / 1e9)).toFixed(2);
      console.log(`🚀 生成速度: ${tokensPerSec} tokens/秒`);
    }
    
    console.log('\n═══════════════════════════════════════════════');
    console.log('🎉 所有测试通过！Ollama 已准备就绪');
    console.log('═══════════════════════════════════════════════');
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 解决方案：');
      console.log('1. 检查Ollama是否运行：');
      console.log('   - Windows: 打开Ollama应用');
      console.log('   - 或在PowerShell运行: ollama serve');
      console.log('2. 检查端口11434是否被占用');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n🔧 解决方案：');
      console.log('模型推理超时，可能原因：');
      console.log('1. 模型太大，首次加载需要时间');
      console.log('2. 电脑性能不足');
      console.log('3. 尝试使用更小的模型（如 qwen2.5:7b）');
    }
    
    process.exit(1);
  }
}

// 运行测试
testOllamaConnection();