// ==================== 模式切换控制器（核心新增）====================

class ModeController {
    constructor() {
        this.currentMode = 'ai'; // 默认AI模式
        this.traditionalAdTimer = null;
        this.skipCountdown = null;
    }

    /**
     * 初始化
     */
    init() {
        console.log('[Mode Controller] 初始化，当前模式:', this.currentMode);
        this.applyMode(this.currentMode);
    }

    /**
     * 切换模式
     * @param {string} mode - 'ai' 或 'traditional'
     */
    switchMode(mode) {
        if (this.currentMode === mode) return;

        console.log('[Mode Controller] 切换模式:', this.currentMode, '→', mode);
        this.currentMode = mode;

        // 应用模式
        this.applyMode(mode);

        // 更新UI状态
        this.updateModeUI(mode);

        // 触发场景更新
        const currentScene = SCENES[uiController.currentSceneId || 'high'];
        uiController.updateScene(currentScene);
    }

    /**
     * 应用模式样式和行为
     * @param {string} mode
     */
    applyMode(mode) {
        const body = document.body;

        if (mode === 'traditional') {
            body.classList.add('traditional-mode');
            body.classList.remove('ai-mode');
            
            // 传统模式：自动触发广告弹窗
            this.showTraditionalAd();
        } else {
            body.classList.remove('traditional-mode');
            body.classList.add('ai-mode');
            
            // AI模式：隐藏传统广告弹窗
            this.hideTraditionalAd();
        }
    }

    /**
     * 更新模式UI按钮状态
     * @param {string} mode
     */
    updateModeUI(mode) {
        const aiBtn = document.getElementById('aiMode');
        const traditionalBtn = document.getElementById('traditionalMode');
        const tagline = document.getElementById('modeTagline');
        const comparisonTip = document.getElementById('comparisonTip');

        if (mode === 'ai') {
            aiBtn.classList.add('active');
            traditionalBtn.classList.remove('active');
            tagline.textContent = '让AI在正确的时刻，以正确的方式投放广告';
            comparisonTip.textContent = '💡 切换到"传统广告"查看对比效果';
        } else {
            traditionalBtn.classList.add('active');
            aiBtn.classList.remove('active');
            tagline.textContent = '传统广告系统：固定时间点强制插播';
            comparisonTip.textContent = '⚠️ 这就是传统广告让人厌烦的原因';
            comparisonTip.style.background = 'rgba(255, 68, 68, 0.1)';
            comparisonTip.style.color = '#ff4444';
            comparisonTip.style.borderColor = 'rgba(255, 68, 68, 0.2)';
        }
    }

    /**
     * 显示传统广告弹窗（模拟强制插播）
     */
    showTraditionalAd() {
        console.log('[Mode Controller] 显示传统广告弹窗');
        
        const popup = document.getElementById('traditionalAdPopup');
        const skipBtn = document.getElementById('skipBtn');
        const timerSpan = document.getElementById('adTimer');

        // 清除之前的定时器
        if (this.traditionalAdTimer) {
            clearInterval(this.traditionalAdTimer);
        }
        if (this.skipCountdown) {
            clearInterval(this.skipCountdown);
        }

        // 显示弹窗
        popup.classList.remove('hidden');

        // 跳过倒计时
        let countdown = 5;
        skipBtn.classList.add('disabled');
        skipBtn.textContent = `${countdown}秒后可跳过`;

        this.skipCountdown = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                skipBtn.textContent = `${countdown}秒后可跳过`;
            } else {
                skipBtn.classList.remove('disabled');
                skipBtn.innerHTML = '<i class="bi bi-forward-fill"></i> 跳过广告';
                skipBtn.onclick = () => this.skipTraditionalAd();
                clearInterval(this.skipCountdown);
            }
        }, 1000);

        // 广告时长倒计时
        let adTime = 60;
        timerSpan.textContent = `${adTime}秒后可跳过`;

        this.traditionalAdTimer = setInterval(() => {
            adTime--;
            if (adTime > 5) {
                timerSpan.textContent = `${adTime}秒后可跳过`;
            } else if (adTime > 0) {
                timerSpan.textContent = `${adTime}秒后关闭`;
            } else {
                this.hideTraditionalAd();
            }
        }, 1000);
    }

    /**
     * 隐藏传统广告弹窗
     */
    hideTraditionalAd() {
        console.log('[Mode Controller] 隐藏传统广告弹窗');
        
        const popup = document.getElementById('traditionalAdPopup');
        popup.classList.add('hidden');

        if (this.traditionalAdTimer) {
            clearInterval(this.traditionalAdTimer);
        }
        if (this.skipCountdown) {
            clearInterval(this.skipCountdown);
        }
    }

    /**
     * 跳过传统广告
     */
    skipTraditionalAd() {
        console.log('[Mode Controller] 用户跳过传统广告');
        this.hideTraditionalAd();

        // 显示提示
        this.showToast('已跳过广告，但这种体验真的好吗？', 'warning');
    }

    /**
     * 显示提示消息
     * @param {string} message
     * @param {string} type - 'success' | 'warning' | 'info'
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        
        let icon = 'bi-info-circle';
        let color = '#00a870';
        
        if (type === 'warning') {
            icon = 'bi-exclamation-triangle';
            color = '#ffaa00';
        } else if (type === 'success') {
            icon = 'bi-check-circle';
            color = '#44bb44';
        }

        toast.innerHTML = `
            <div style="
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: ${color};
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
                display: flex;
                align-items: center;
                gap: 12px;
            ">
                <i class="bi ${icon}" style="font-size: 20px;"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * 获取当前模式
     * @returns {string}
     */
    getCurrentMode() {
        return this.currentMode;
    }
}

// 创建全局实例
const modeController = new ModeController();