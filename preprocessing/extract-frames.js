/**
 * 视频帧提取脚本
 * 功能：从视频中提取关键帧用于AI分析
 * 运行方式：node extract-frames.js
 */

import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRAME_RATE = process.env.FRAME_RATE || 1;

// 场景配置
const SCENES = [
  { 
    id: 'scene-high', 
    name: '高潮场景',
    description: '紧张、冲突、动作场景'
  },
  { 
    id: 'scene-normal', 
    name: '日常场景',
    description: '对话、过渡场景'
  },
  { 
    id: 'scene-relax', 
    name: '轻松场景',
    description: '搞笑、风景、轻松场景'
  }
];

/**
 * 提取单个视频的关键帧
 */
async function extractFrames(sceneId, sceneName) {
  const videoPath = path.join(__dirname, 'source-videos', `${sceneId}.mp4`);
  const outputDir = path.join(__dirname, 'frames', sceneId);
  
  // 检查视频文件是否存在
  if (!fs.existsSync(videoPath)) {
    console.log(`⚠️  跳过 ${sceneName}: 视频文件不存在`);
    console.log(`   请将视频命名为 ${sceneId}.mp4 并放入 source-videos/ 目录\n`);
    return 0;
  }
  
  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  } else {
    // 清空已有的帧
    const existingFrames = fs.readdirSync(outputDir);
    existingFrames.forEach(file => {
      fs.unlinkSync(path.join(outputDir, file));
    });
  }
  
  console.log(`\n📹 处理视频: ${sceneName} (${sceneId})`);
  console.log(`   输入: ${videoPath}`);
  console.log(`   输出: ${outputDir}`);
  
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on('start', (commandLine) => {
        console.log(`   执行命令: ffmpeg ${commandLine.split('ffmpeg')[1]}`);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          process.stdout.write(`\r   进度: ${Math.floor(progress.percent)}%`);
        }
      })
      .on('end', () => {
        const frames = fs.readdirSync(outputDir);
        console.log(`\r   ✅ 提取完成: ${frames.length} 帧\n`);
        resolve(frames.length);
      })
      .on('error', (err) => {
        console.error(`\n   ❌ 错误: ${err.message}\n`);
        reject(err);
      })
      // 每秒提取N帧
      .outputOptions([
        `-vf fps=${FRAME_RATE}`,
        '-q:v 2'  // 图片质量：1最好，31最差
      ])
      .output(path.join(outputDir, 'frame-%03d.jpg'))
      .run();
  });
}

/**
 * 获取视频信息
 */
function getVideoInfo(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration;
        const size = metadata.format.size;
        resolve({ duration, size });
      }
    });
  });
}

/**
 * 主函数
 */
async function main() {
  console.log('═══════════════════════════════════════════════');
  console.log('🎬 视频关键帧提取工具');
  console.log('═══════════════════════════════════════════════');
  console.log(`配置: 每秒提取 ${FRAME_RATE} 帧\n`);
  
  // 检查source-videos目录
  const sourceDir = path.join(__dirname, 'source-videos');
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
  }
  
  const videoFiles = fs.readdirSync(sourceDir).filter(f => f.endsWith('.mp4'));
  
  if (videoFiles.length === 0) {
    console.log('⚠️  未找到视频文件！\n');
    console.log('请按以下步骤操作：');
    console.log('1. 准备3个视频片段（10-15秒）');
    console.log('2. 命名为：');
    SCENES.forEach(scene => {
      console.log(`   - ${scene.id}.mp4  (${scene.description})`);
    });
    console.log(`3. 放入目录：${sourceDir}`);
    console.log('4. 重新运行此脚本\n');
    process.exit(0);
  }
  
  console.log(`找到 ${videoFiles.length} 个视频文件：`);
  videoFiles.forEach(f => console.log(`  - ${f}`));
  
  let totalFrames = 0;
  
  for (const scene of SCENES) {
    try {
      const frameCount = await extractFrames(scene.id, scene.name);
      totalFrames += frameCount;
    } catch (error) {
      console.error(`处理 ${scene.name} 失败:`, error.message);
    }
  }
  
  console.log('═══════════════════════════════════════════════');
  console.log(`🎉 提取完成！共 ${totalFrames} 帧`);
  console.log('═══════════════════════════════════════════════');
  console.log('\n下一步：运行 npm run analyze 开始AI分析\n');
}

// 执行
main().catch(console.error);