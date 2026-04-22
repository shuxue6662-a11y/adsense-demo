# AdSense·感知广告 - 完整版

> 基于AI视频分析的智能广告引擎

## 项目简介

AdSense使用AI技术实时分析视频内容的情绪强度，在最佳时机投放最相关的广告，实现用户体验、平台收益、广告主价值的三方平衡。

## 技术栈

- **后端**: Python + Flask + OpenCV + Coze API
- **前端**: 原生JavaScript + HTML5 + CSS3
- **AI**: Coze多模态视觉分析

## 快速开始

### 1. 环境要求

- Python 3.8+
- 现代浏览器（Chrome/Edge/Firefox）

### 2. 安装依赖

```bash
# 后端
cd backend
pip install -r requirements.txt

# 前端无需安装（纯静态）

### 3. 配置环境变量
```Bash

cd backend
cp .env.example .env
# 编辑.env，填入你的Coze API Key和Bot ID

### 4. 准备视频素材
将3个30秒MP4视频放到 backend/videos/preset/ 目录：

- scene-high.mp4 - 高潮场景
- scene-mid.mp4 - 日常场景
- scene-low.mp4 - 轻松场景

### 5. 启动服务
```Bash

# 启动后端
cd backend
python app.py

# 启动前端（新终端）
cd frontend
python -m http.server 8000

### 6. 访问Demo
打开浏览器访问: http://localhost:8000