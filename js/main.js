// ==================== 主入口文件 ====================

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('AdSense Demo 初始化中...');
    
    // 初始化UI控制器
    uiController.init();
    
    // 添加欢迎提示
    showWelcomeToast();
    
    console.log('初始化完成！');
});

/**
 * 切换场景（全局函数，供HTML调用）
 * @param {string} sceneId - 场景ID
 */
function switchScene(sceneId) {
    const scene = SCENES[sceneId];
    if (!scene) {
        console.error('场景不存在:', sceneId);
        return;
    }

    console.log('切换场景:', scene.name);
    uiController.updateScene(scene);
}

/**
 * 发送消息（全局函数，供HTML调用）
 */
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    if (uiController.isTyping) {
        console.log('AI正在回复中，请稍候...');
        return;
    }

    // 清空输入框
    input.value = '';
    
    // 添加用户消息
    uiController.addChatMessage(message, false);
    
    // 显示加载状态
    uiController.showLoading(true);
    
    try {
        // 调用API获取回复
        const reply = await cozeAPI.sendMessage(message);
        
        // 添加AI回复
        uiController.addChatMessage(reply, true, true);
        
    } catch (error) {
        console.error('发送消息失败:', error);
        uiController.addChatMessage(
            '抱歉，我现在遇到了一些问题，请稍后再试。',
            true,
            false
        );
    } finally {
        uiController.showLoading(false);
    }
}

/**
 * 快捷提问（全局函数，供HTML调用）
 * @param {string} question - 问题
 */
function askQuestion(question) {
    const input = document.getElementById('chatInput');
    input.value = question;
    sendMessage();
}

/**
 * 处理Enter键（全局函数，供HTML调用）
 * @param {KeyboardEvent} event - 键盘事件
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

/**
 * 显示信息弹窗（全局函数，供HTML调用）
 * @param {string} type - 信息类型
 */
function showInfo(type) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    let content = '';
    
    if (type === 'tech') {
        content = `
            <h2 style="margin-bottom: 20px;">技术架构</h2>
            <div style="line-height: 1.8;">
                <h3 style="color: #00a870; margin-top: 20px;">🧠 AI能力层</h3>
                <ul>
                    <li><strong>视频内容理解：</strong>调用视觉大模型（GPT-4V/通义千问VL）分析视频帧</li>
                    <li><strong>情感分析：</strong>基于Transformer的情绪识别模型</li>
                    <li><strong>对话引擎：</strong>接入Coze大语言模型</li>
                    <li><strong>推荐算法：</strong>协同过滤 + 深度学习</li>
                </ul>

                <h3 style="color: #00a870; margin-top: 20px;">⚙️ 决策引擎</h3>
                <ul>
                    <li><strong>情绪阈值判断：</strong>三区间策略（安全/谨慎/禁入）</li>
                    <li><strong>三维匹配：</strong>时间 × 用户 × 内容</li>
                    <li><strong>强化学习优化：</strong>以完播率+转化率为奖励信号</li>
                </ul>

                <h3 style="color: #00a870; margin-top: 20px;">🎨 前端技术</h3>
                <ul>
                    <li><strong>框架：</strong>原生JavaScript（轻量化）</li>
                    <li><strong>图表：</strong>Chart.js</li>
                    <li><strong>样式：</strong>CSS Grid + Flexbox</li>
                    <li><strong>动画：</strong>CSS Transitions + Keyframes</li>
                </ul>

                <h3 style="color: #00a870; margin-top: 20px;">☁️ 部署方案</h3>
                <ul>
                    <li><strong>主方案：</strong>Vercel（全球CDN加速）</li>
                    <li><strong>备选：</strong>GitHub Pages</li>
                    <li><strong>API：</strong>Coze云端API</li>
                </ul>
            </div>
        `;
    } else if (type === 'about') {
        content = `
            <h2 style="margin-bottom: 20px;">关于 AdSense·感知广告</h2>
            <div style="line-height: 1.8;">
                <p style="margin-bottom: 15px;">
                    <strong>AdSense</strong> 是一个基于AI情境感知的智能广告引擎，
                    旨在解决视频平台广告体验与商业价值之间的矛盾。
                </p>

                <h3 style="color: #00a870; margin-top: 20px;">💡 核心理念</h3>
                <p>让广告在<strong>正确的时刻</strong>、以<strong>正确的方式</strong>、
                触达<strong>正确的用户</strong>。</p>

                <h3 style="color: #00a870; margin-top: 20px;">🎯 解决的问题</h3>
                <ul>
                    <li>传统广告固定时间插播，打断观看体验</li>
                    <li>广告内容与用户无关，转化率低</li>
                    <li>用户没有控制权，被迫观看</li>
                    <li>平台收入与用户体验难以平衡</li>
                </ul>

                <h3 style="color: #00a870; margin-top: 20px;">🏆 核心价值</h3>
                <ul>
                    <li><strong>用户：</strong>体验提升65%，控制权增强</li>
                    <li><strong>平台：</strong>广告完播率提升至75%，收入增长15-20%</li>
                    <li><strong>广告主：</strong>ROI提升40%，品牌好感度提升</li>
                </ul>

                <h3 style="color: #00a870; margin-top: 20px;">👨‍💻 作者信息</h3>
                <p>
                    参赛赛道：命题赛道 - 用AI改造腾讯视频广告<br>
                    大赛名称：腾讯PCG AI创造营<br>
                    创作时间：2024年
                </p>
            </div>
        `;
    }
    
    modalBody.innerHTML = content;
    modal.classList.remove('hidden');
}

/**
 * 关闭弹窗（全局函数，供HTML调用）
 */
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
}

/**
 * 点击背景关闭弹窗
 */
document.addEventListener('click', function(e) {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        closeModal();
    }
});

/**
 * 显示欢迎提示
 */
function showWelcomeToast() {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'welcome-toast';
    toast.innerHTML = `
        <div style="
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #00a870 0%, #00d4aa 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 168, 112, 0.3);
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            animation: slideInRight 0.5s ease-out;
            display: flex;
            align-items: center;
            gap: 12px;
        ">
            <i class="bi bi-info-circle" style="font-size: 20px;"></i>
            <div>
                <div style="font-weight: 600; margin-bottom: 4px;">💡 演示提示</div>
                点击下方"演示场景切换"按钮，体验不同场景下的AI决策
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: 8px;
            ">×</button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 5秒后自动消失
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// 添加全局错误处理
window.addEventListener('error', function(e) {
    console.error('全局错误:', e.error);
});

// 添加未捕获的Promise错误处理
window.addEventListener('unhandledrejection', function(e) {
    console.error('未处理的Promise错误:', e.reason);
});

console.log('%c AdSense·感知广告 Demo ', 'background: #00a870; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
console.log('版本: 1.0.0');
console.log('GitHub: [你的仓库地址]');