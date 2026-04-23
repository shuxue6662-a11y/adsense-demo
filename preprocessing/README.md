# AdSense Demo - 预处理脚本

## 功能说明

这个目录包含使用 Ollama 进行视频场景 AI 分析的预处理脚本。

## 使用步骤

### 1. 安装依赖

```powershell
cd preprocessing
npm install

2. 配置环境变量
检查 .env 文件，确保配置正确：

env

OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen3:14b

3. 准备视频素材
将3个视频文件（10-15秒）放入 source-videos/ 目录：

scene-high.mp4 - 高潮场景（紧张、冲突）
scene-normal.mp4 - 日常场景（对话、过渡）
scene-relax.mp4 - 轻松场景（搞笑、风景）
4. 测试 Ollama 连接
PowerShell

npm run test
5. 提取视频帧（可选）
PowerShell

npm run extract
6. AI 分析
PowerShell

npm run analyze
分析结果将保存在 output/analysis-results.json

7. 复制结果到前端
PowerShell

copy output\analysis-results.json ..\client\src\data\