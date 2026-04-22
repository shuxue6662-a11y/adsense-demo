// ==================== 主入口文件（优化版）====================

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('AdSense Demo 初始化中...');
    
    // 初始化视频播放器（新增）
    videoPlayer.init();
    
    // 初始化其他控制器
    modeController.init();
    uiController.init();
    
    // 健康检查后端
    checkBackendHealth();
    
    initDashboard();
    showWelcomeToast();
    
    console.log('初始化完成！');
});


// 新增：检查后端健康状态
async function checkBackendHealth() {
    try {
        const health = await videoAPI.healthCheck();
        console.log('[Backend] 健康检查:', health);
        
        if (health.status !== 'ok') {
            showBackendWarning();
        }
    } catch (error) {
        console.error('[Backend] 无法连接:', error);
        showBackendWarning();
    }
}


// 新增：显示后端警告
function showBackendWarning() {
    const warning = document.createElement('div');
    warning.innerHTML = `
        <div style="
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4444;
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(255, 68, 68, 0.5);
        ">
            <i class="bi bi-exclamation-triangle"></i>
            后端服务未启动，请先运行 <code>python backend/app.py</code>
        </div>
    `;
    document.body.appendChild(warning);
}


/**
 * 切换模式（全局函数，供HTML调用）
 * @param {string} mode - 'ai' 或 'traditional'
 */
function switchMode(mode) {
    console.log('[Main] 切换模式:', mode);
    modeController.switchMode(mode);
}

/**
 * 切换场景（全局函数，供HTML调用）
 * @param {string} sceneId - 场景ID
 */
function switchScene(sceneId) {
    console.log('[Main] 切换场景:', sceneId);
    
    // 使用视频播放器加载（新增）
    videoPlayer.loadScene(sceneId);
    
    // 更新UI
    const scene = SCENES[sceneId];
    if (scene) {
        uiController.updateScene(scene);
    }
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
        console.error('[Main] 发送消息失败:', error);
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

// ==================== 数据仪表板功能 ====================

/**
 * 初始化数据仪表板
 */
function initDashboard() {
    console.log('[Main] 初始化数据仪表板');
    // 默认显示用户价值面板
    switchDashboardTab('user');
}

/**
 * 切换仪表板标签页（全局函数，供HTML调用）
 * @param {string} tab - 'user' | 'platform' | 'advertiser'
 */
function switchDashboardTab(tab) {
    console.log('[Main] 切换仪表板标签:', tab);
    
    // 更新标签按钮状态
    const tabButtons = document.querySelectorAll('.dashboard-tabs .tab-btn');
    tabButtons.forEach(btn => {
        const btnTab = btn.onclick?.toString().match(/switchDashboardTab\('(\w+)'\)/)?.[1];
        if (btnTab === tab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 更新面板显示
    const panels = {
        user: document.getElementById('userDashboard'),
        platform: document.getElementById('platformDashboard'),
        advertiser: document.getElementById('advertiserDashboard')
    };

    Object.keys(panels).forEach(key => {
        if (key === tab) {
            panels[key].classList.add('active');
        } else {
            panels[key].classList.remove('active');
        }
    });
}

/**
 * 刷新仪表板数据（全局函数，供HTML调用）
 */
function refreshDashboard() {
    console.log('[Main] 刷新仪表板数据');
    
    // 添加刷新动画
    const refreshBtn = document.querySelector('.refresh-btn');
    refreshBtn.style.transform = 'rotate(360deg)';
    
    setTimeout(() => {
        refreshBtn.style.transform = 'rotate(0deg)';
        modeController.showToast('数据已刷新', 'success');
    }, 600);
}

// ==================== 用户主动权功能 ====================

/**
 * 打开广告选择器（全局函数，供HTML调用）
 */
function openAdSelector() {
    console.log('[Main] 打开广告选择器');
    const modal = document.getElementById('adSelectorModal');
    modal.classList.remove('hidden');
}

/**
 * 关闭广告选择器（全局函数，供HTML调用）
 */
function closeAdSelector() {
    console.log('[Main] 关闭广告选择器');
    const modal = document.getElementById('adSelectorModal');
    modal.classList.add('hidden');
}

/**
 * 选择广告类型（全局函数，供HTML调用）
 * @param {string} type - 广告类型
 */
function selectAdType(type) {
    console.log('[Main] 用户选择广告类型:', type);
    
    const typeNames = {
        food: '美食餐饮',
        game: '游戏娱乐',
        digital: '数码科技',
        beauty: '美妆时尚',
        travel: '旅游出行',
        education: '教育培训'
    };
    
    closeAdSelector();
    
    modeController.showToast(
        `已选择"${typeNames[type]}"广告，将为你换取15分钟免广告观看！`,
        'success'
    );
    
    // 隐藏当前广告
    uiController.hideAd();
}

/**
 * 打开答题界面（全局函数，供HTML调用）
 */
function openQuiz() {
    console.log('[Main] 打开答题界面');
    const modal = document.getElementById('quizModal');
    modal.classList.remove('hidden');
    
    // 启动倒计时
    startQuizTimer();
}

/**
 * 关闭答题界面（全局函数，供HTML调用）
 */
function closeQuiz() {
    console.log('[Main] 关闭答题界面');
    const modal = document.getElementById('quizModal');
    modal.classList.add('hidden');
    
    // 清除倒计时
    if (window.quizTimerInterval) {
        clearInterval(window.quizTimerInterval);
    }
}

/**
 * 启动答题倒计时
 */
function startQuizTimer() {
    let time = 10;
    const timerSpan = document.getElementById('quizTimer');
    
    if (window.quizTimerInterval) {
        clearInterval(window.quizTimerInterval);
    }
    
    window.quizTimerInterval = setInterval(() => {
        time--;
        timerSpan.textContent = time;
        
        if (time <= 0) {
            clearInterval(window.quizTimerInterval);
            closeQuiz();
            modeController.showToast('答题超时，下次再试吧！', 'warning');
        }
    }, 1000);
}

/**
 * 回答问题（全局函数，供HTML调用）
 * @param {string} answer - 用户选择的答案
 */
function answerQuiz(answer) {
    console.log('[Main] 用户回答:', answer);
    
    if (window.quizTimerInterval) {
        clearInterval(window.quizTimerInterval);
    }
    
    if (answer === 'C') {
        closeQuiz();
        modeController.showToast('回答正确！广告时长减少30秒 🎉', 'success');
    } else {
        modeController.showToast('回答错误，但感谢参与！', 'warning');
        setTimeout(() => {
            closeQuiz();
        }, 1500);
    }
}

/**
 * 使用积分跳过（全局函数，供HTML调用）
 */
function skipWithPoints() {
    console.log('[Main] 使用积分跳过广告');
    
    // 模拟积分扣除
    modeController.showToast('已消耗20积分，跳过当前广告', 'success');
    uiController.hideAd();
    document.getElementById('userControlPanel').classList.add('hidden');
}

/**
 * 显示广告详细分析（全局函数，供HTML调用）
 */
function showAdReasonDetail() {
    console.log('[Main] 显示广告详细分析');
    
    const modal = document.getElementById('adReasonModal');
    const contentDiv = document.getElementById('adReasonDetailContent');
    
    // 获取当前场景的详细分析数据
    const currentScene = SCENES[uiController.currentSceneId];
    const detailedReason = currentScene.adData?.detailedReason;
    
    if (!detailedReason) {
        contentDiv.innerHTML = '<p>暂无详细分析数据</p>';
        modal.classList.remove('hidden');
        return;
    }
    
    // 生成详细分析HTML
    let html = `<h3>${detailedReason.title}</h3>`;
    
    detailedReason.dimensions.forEach((dim, index) => {
        html += `
            <div class="analysis-dimension">
                <div class="dimension-header">
                    <h4>${index + 1}. ${dim.name}</h4>
                    <span class="dimension-score">匹配度: ${dim.score}%</span>
                </div>
                <div class="dimension-details">
                    ${dim.details.map(detail => `
                        <div class="detail-item">
                            <i class="bi bi-check-circle" style="color: #00a870;"></i>
                            <span>${detail}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    // 添加预期效果
    html += `
        <div class="predicted-performance">
            <h4>📊 预期投放效果</h4>
            <div class="performance-grid">
                <div class="performance-item">
                    <span class="label">点击率</span>
                    <span class="value">${detailedReason.predictedPerformance.clickRate}</span>
                </div>
                <div class="performance-item">
                    <span class="label">转化率</span>
                    <span class="value">${detailedReason.predictedPerformance.conversionRate}</span>
                </div>
                <div class="performance-item">
                    <span class="label">ROI</span>
                    <span class="value">${detailedReason.predictedPerformance.roi}</span>
                </div>
                <div class="performance-item">
                    <span class="label">用户满意度</span>
                    <span class="value">${detailedReason.predictedPerformance.userSatisfaction}</span>
                </div>
            </div>
        </div>
    `;
    
    contentDiv.innerHTML = html;
    modal.classList.remove('hidden');
}

/**
 * 关闭广告详细分析（全局函数，供HTML调用）
 */
function closeAdReasonDetail() {
    console.log('[Main] 关闭广告详细分析');
    const modal = document.getElementById('adReasonModal');
    modal.classList.add('hidden');
}

// ==================== 模态窗口通用关闭 ====================

/**
 * 点击背景关闭模态窗口
 */
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
        
        // 清理答题倒计时
        if (window.quizTimerInterval) {
            clearInterval(window.quizTimerInterval);
        }
    }
});

// ==================== 欢迎提示 ====================

/**
 * 显示欢迎提示
 */
function showWelcomeToast() {
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
            max-width: 400px;
        ">
            <i class="bi bi-lightbulb" style="font-size: 24px;"></i>
            <div>
                <div style="font-weight: 600; margin-bottom: 4px;">💡 演示提示</div>
                <div style="font-size: 13px; opacity: 0.95;">
                    1. 点击顶部"模式切换"按钮，体验传统广告 vs AI智能广告<br>
                    2. 切换下方"场景按钮"，查看不同情绪下的AI决策
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="
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
                font-size: 18px;
            ">×</button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 8秒后自动消失
    setTimeout(() => {
        const toastEl = toast.querySelector('div');
        if (toastEl) {
            toastEl.style.opacity = '0';
            toastEl.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }
    }, 8000);
}

// ==================== 全局错误处理 ====================

window.addEventListener('error', function(e) {
    console.error('[Global Error]', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('[Unhandled Promise]', e.reason);
});

// ==================== 开发者信息 ====================

console.log('%c AdSense·感知广告 Demo ', 'background: #00a870; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold; font-size: 16px;');
console.log('%c 版本: 1.0.0 ', 'background: #333; color: white; padding: 4px 8px; border-radius: 4px;');
console.log('%c 腾讯PCG AI创造营参赛作品 ', 'background: #ffaa00; color: white; padding: 4px 8px; border-radius: 4px;');
console.log('\n快捷键提示:');
console.log('  1 - 切换到高潮场景');
console.log('  2 - 切换到日常场景');
console.log('  3 - 切换到轻松场景');
console.log('  Enter - 发送聊天消息\n');