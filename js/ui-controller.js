// ==================== UI 控制器 ====================

class UIController {
    constructor() {
        this.currentScene = 'high';
        this.chart = null;
        this.isTyping = false;
        this.emotionUpdateInterval = null;
    }

    /**
     * 初始化
     */
    init() {
        // 初始化情绪曲线图
        this.initEmotionChart();
        
        // 设置默认场景
        this.updateScene(SCENES.high);
        
        // 如果启用了自动播放，开始更新情绪曲线
        if (CONFIG.DEMO.AUTO_PLAY_EMOTION_CHANGE) {
            this.startEmotionAnimation();
        }

        // 绑定快捷键
        this.bindKeyboardShortcuts();
    }

    /**
     * 初始化情绪曲线图
     */
    initEmotionChart() {
        const ctx = document.getElementById('emotionChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['0分', '5分', '10分', '15分', '20分', '25分', '30分', '35分', '40分', '45分'],
                datasets: [{
                    label: '情绪强度',
                    data: EMOTION_CURVE_DATA.high,
                    borderColor: '#ff4444',
                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#ff4444',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#ff4444',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `情绪强度: ${context.parsed.y}分`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#a0a0a0',
                            stepSize: 25
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            color: '#a0a0a0'
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    /**
     * 更新场景
     * @param {object} scene - 场景数据
     */
    updateScene(scene) {
        this.currentScene = scene.id;

        // 更新视频画面
        document.getElementById('sceneImage').src = scene.image;
        document.getElementById('dramaTitle').textContent = scene.dramaTitle;

        // 更新AI标签
        const aiTag = document.getElementById('aiTag');
        aiTag.querySelector('#aiTagText').textContent = scene.aiTag.text;
        aiTag.className = `ai-tag ${scene.aiTag.class}`;

        // 更新情绪条
        this.updateEmotionBar(scene.emotion);

        // 更新决策面板
        this.updateDecisionPanel(scene.decision);

        // 更新决策流程
        this.updateDecisionFlow(scene.flowActiveSteps);

        // 更新情绪曲线图
        this.updateEmotionChart(scene.id);

        // 更新广告显示
        if (scene.showAd && scene.adData) {
            this.showAd(scene.adData);
        } else {
            this.hideAd();
        }

        // 添加AI自动消息
        this.addAIMessage(scene.aiMessage, true);

        // 更新场景按钮激活状态
        this.updateSceneButtons(scene.id);

        // 添加动画效果
        this.animateSceneChange();
    }

    /**
     * 更新情绪条
     * @param {object} emotion - 情绪数据
     */
    updateEmotionBar(emotion) {
        const fill = document.getElementById('emotionFill');
        const score = document.getElementById('emotionScore');
        const label = document.getElementById('emotionLabel');

        // 平滑过渡
        setTimeout(() => {
            fill.style.width = `${emotion.score}%`;
            fill.style.background = emotion.gradient;
            score.textContent = `${emotion.score}/100`;
            score.style.color = emotion.color;

            label.innerHTML = `
                <i class="${emotion.icon}"></i>
                <span>${emotion.level} - ${SCENES[this.currentScene].sceneDesc}</span>
            `;
        }, 100);
    }

    /**
     * 更新决策面板
     * @param {object} decision - 决策数据
     */
    updateDecisionPanel(decision) {
        document.getElementById('decisionScene').textContent = decision.scene;
        
        const emotionValue = document.getElementById('decisionEmotion');
        emotionValue.textContent = decision.emotionText;
        emotionValue.className = `decision-value ${decision.emotionClass}`;

        const adDecision = document.getElementById('decisionAd');
        adDecision.innerHTML = `
            <i class="${decision.adDecisionIcon}"></i>
            ${decision.adDecision}
        `;
        adDecision.className = `decision-value ${decision.adDecisionClass}`;

        document.getElementById('decisionWait').textContent = decision.waitReason;
        document.getElementById('decisionTime').textContent = decision.waitTime;
    }

    /**
     * 更新决策流程可视化
     * @param {Array} activeSteps - 激活的步骤索引
     */
    updateDecisionFlow(activeSteps) {
        const steps = document.querySelectorAll('.flow-step');
        steps.forEach((step, index) => {
            if (activeSteps.includes(index + 1)) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    /**
     * 更新情绪曲线图
     * @param {string} sceneId - 场景ID
     */
    updateEmotionChart(sceneId) {
        if (!this.chart) return;

        const data = EMOTION_CURVE_DATA[sceneId];
        const color = SCENES[sceneId].emotion.color;

        this.chart.data.datasets[0].data = data;
        this.chart.data.datasets[0].borderColor = color;
        this.chart.data.datasets[0].backgroundColor = color.replace(')', ', 0.1)').replace('rgb', 'rgba');
        this.chart.data.datasets[0].pointBackgroundColor = color;
        
        this.chart.update('none'); // 不使用动画，立即更新
    }

    /**
     * 显示广告
     * @param {object} adData - 广告数据
     */
    showAd(adData) {
        const container = document.getElementById('adContainer');
        
        document.getElementById('adImage').src = adData.image;
        document.getElementById('adTitle').textContent = adData.title;
        document.getElementById('adDesc').textContent = adData.desc;
        document.getElementById('adReasonText').textContent = adData.reason;

        container.classList.remove('hidden');
        container.classList.add('slide-enter');
    }

    /**
     * 隐藏广告
     */
    hideAd() {
        const container = document.getElementById('adContainer');
        container.classList.add('hidden');
    }

    /**
     * 添加聊天消息
     * @param {string} text - 消息内容
     * @param {boolean} isAI - 是否是AI消息
     * @param {boolean} useTyping - 是否使用打字机效果
     */
    addChatMessage(text, isAI = false, useTyping = false) {
        const messagesContainer = document.getElementById('chatMessages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isAI ? 'ai-message' : 'user-message'}`;

        const now = new Date();
        const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

        if (isAI) {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="bi bi-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text" id="typing-target"></div>
                    <div class="message-time">${timeString}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${this.escapeHtml(text)}</div>
                    <div class="message-time">${timeString}</div>
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);

        if (isAI && useTyping) {
            this.typeWriter(text, messageDiv.querySelector('#typing-target'));
        } else if (isAI) {
            messageDiv.querySelector('#typing-target').innerHTML = this.formatMessage(text);
        }

        // 滚动到底部
        this.scrollToBottom(messagesContainer);
    }

    /**
     * 添加AI消息（带去重）
     * @param {string} text - 消息内容
     * @param {boolean} clearPrevious - 是否清除之前的自动消息
     */
    addAIMessage(text, clearPrevious = false) {
        const messagesContainer = document.getElementById('chatMessages');
        
        if (clearPrevious) {
            // 只保留用户消息，删除自动生成的AI消息
            const messages = messagesContainer.querySelectorAll('.message');
            messages.forEach((msg, index) => {
                if (index > 0) { // 保留第一条欢迎消息
                    msg.remove();
                }
            });
        }

        this.addChatMessage(text, true, true);
    }

    /**
     * 打字机效果
     * @param {string} text - 文本内容
     * @param {HTMLElement} element - 目标元素
     */
    async typeWriter(text, element) {
        this.isTyping = true;
        element.textContent = '';
        
        const formattedText = this.formatMessage(text);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formattedText;
        
        // 简化版：直接显示（完整版可以逐字显示）
        for (let i = 0; i < text.length; i++) {
            if (!this.isTyping) break;
            element.textContent = text.substring(0, i + 1);
            await this.sleep(CONFIG.DEMO.MESSAGE_TYPING_SPEED);
        }
        
        element.innerHTML = formattedText;
        this.isTyping = false;
    }

    /**
     * 格式化消息（支持换行和列表）
     * @param {string} text - 原始文本
     * @returns {string} - 格式化后的HTML
     */
    formatMessage(text) {
        return text
            .replace(/\n/g, '<br>')
            .replace(/• /g, '<br>• ')
            .replace(/✓ /g, '<br>✓ ');
    }

    /**
     * HTML转义
     * @param {string} text - 原始文本
     * @returns {string}
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 滚动到底部
     * @param {HTMLElement} element - 容器元素
     */
    scrollToBottom(element) {
        setTimeout(() => {
            element.scrollTop = element.scrollHeight;
        }, 100);
    }

    /**
     * 更新场景按钮状态
     * @param {string} activeId - 激活的场景ID
     */
    updateSceneButtons(activeId) {
        const buttons = document.querySelectorAll('.scene-btn');
        buttons.forEach(btn => {
            if (btn.onclick.toString().includes(activeId)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * 场景切换动画
     */
    animateSceneChange() {
        const screen = document.querySelector('.video-screen');
        screen.style.opacity = '0';
        
        setTimeout(() => {
            screen.style.opacity = '1';
        }, 150);
    }

    /**
     * 开始情绪动画
     */
    startEmotionAnimation() {
        // 这里可以添加情绪值的动态变化效果
        // 暂时省略，避免干扰演示
    }

    /**
     * 绑定键盘快捷键
     */
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // 1, 2, 3 键切换场景
            if (e.key === '1') switchScene('high');
            if (e.key === '2') switchScene('mid');
            if (e.key === '3') switchScene('low');
            
            // Enter 键发送消息
            if (e.key === 'Enter' && e.target.id === 'chatInput') {
                sendMessage();
            }
        });
    }

    /**
     * 工具函数：延迟
     * @param {number} ms - 毫秒
     * @returns {Promise}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 显示加载状态
     * @param {boolean} show - 是否显示
     */
    showLoading(show) {
        const indicator = document.getElementById('processingIndicator');
        if (show) {
            indicator.style.display = 'flex';
        } else {
            indicator.style.display = 'none';
        }
    }
}

// 创建全局实例
const uiController = new UIController();