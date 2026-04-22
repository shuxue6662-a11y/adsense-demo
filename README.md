# AdSense·感知广告 - 腾讯视频AI广告引擎

> 基于AI情境感知的智能广告系统，让广告在正确的时刻以正确的方式出现

## 📌 项目简介

AdSense是参加腾讯PCG AI创造营的参赛作品，旨在用AI改造腾讯视频广告体验。

**核心理念：** 通过多模态AI分析剧情情绪、用户画像和观看场景，在最佳时机投放最相关的广告，实现用户体验、平台收益、广告效果的三方平衡。

## 🎯 解决的问题

- ❌ 传统广告固定时间插播，打断观看体验
- ❌ 广告内容与用户无关，转化率低
- ❌ 用户没有控制权，被迫观看
- ✅ **AdSense**: 情绪感知 + 精准匹配 + 主动权赋能

## ✨ 核心功能

1. **情境感知引擎**
   - 视频内容理解（剧情情绪识别）
   - 用户行为分析（观看习惯、偏好）
   - 环境感知（时间、设备、场景）

2. **智能决策系统**
   - 插播时机决策（三区间策略）
   - 三维精准匹配（时间×用户×内容）
   - 强化学习优化

3. **用户主动权**
   - 广告类型自选
   - 互动减时长
   - 决策透明化（可询问AI）

## 🚀 快速开始

### 在线体验

👉 **Demo链接**: [https://adsense-demo.vercel.app](https://adsense-demo.vercel.app)

### 本地运行

```bash
# 克隆项目
git clone https://github.com/your-username/adsense-demo.git

# 进入目录
cd adsense-demo

# 使用本地服务器运行（任选其一）
# 方法1: 使用Python
python -m http.server 8000

# 方法2: 使用Node.js
npx serve

# 方法3: 使用VS Code的Live Server插件
# 右键index.html -> Open with Live Server

# 访问 http://localhost:8000