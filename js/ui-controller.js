// ==================== UI 控制器（优化版）====================

class UIController {
    constructor() {
        this.currentSceneId = 'high';
        this.chart = null;
        this.isTyping = false;
        this.emotionUpdateInterval = null;
    }

    /**
     * 初始化
     */
    init() {
        console.log('[UI Controller] 初始化');
        
        // 初始化情绪曲线图
        this.initEmotionChart();
        
        // 设置默认场景
        this.updateScene(SCENES.high);
        
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
                labels: EMOTION_CURVE_DATA.high.labels,
                datasets: [{
                    label: '情绪强度',
                    data: EMOTION_CURVE_DATA.high.data,
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
        this.currentSceneId = scene.id;
        console.log('[UI Controller] 更新场景:', scene.name);

        // 更新视频画面
        document.getElementById('sceneImage').src = scene.image;
        document.getElementById('dramaTitle').textContent = scene.dramaTitle;

        // 更新AI标签
        const aiTag = document.getElementById('aiTag');
        aiTag.querySelector('#aiTagText').textContent = scene.aiTag.text;
        aiTag.className = `ai-tag ai-mode-only ${scene.aiTag.class}`;

        // 更新AI分析过程
        this.updateAIAnalysis(scene.aiAnalysis);

        // 更新情绪条
        this.updateEmotionBar(scene.emotion);

        // 更新决策面板
        this.updateDecisionPanel(scene.decision);

        // 更新决策流程
        this.updateDecisionFlow(scene.flowActiveSteps);

        // 更新情绪曲线图
        this.updateEmotionChart(scene.id);

        // 更新广告显示
        if (scene.showAd && scene.adData && modeController.getCurrentMode() === 'ai') {
            this.showAd(scene.adData);
            // 显示用户主动权面板
            document.getElementById('userControlPanel').classList.remove('hidden');
        } else {
            this.hideAd();
            document.getElementById('userControlPanel').classList.add('hidden');
        }

        // 添加AI自动消息
        this.addAIMessage(scene.aiMessage, true);

        // 更新场景按钮激活状态
        this.updateSceneButtons(scene.id);

        // 添加动画效果
        this.animateSceneChange();
    }

    /**
     * 更新AI分析过程（新增）
     * @param {object} analysis
     */
    updateAIAnalysis(analysis) {
        if (!analysis) return;

        // 更新步骤1
        if (analysis.step1) {
            document.getElementById('step1Text').textContent = analysis.step1.text;
            document.querySelector('#step1 .confidence-fill').style.width = `${analysis.step1.confidence}%`;
            document.querySelector('#step1 .confidence-value').textContent = `置信度: ${analysis.step1.confidence}%`;
        }

        // 更新步骤2
        if (analysis.step2) {
            document.getElementById('step2Text').textContent = analysis.step2.text;
            document.querySelector('#step2 .confidence-fill').style.width = `${analysis.step2.confidence}%`;
            document.querySelector('#step2 .confidence-value').textContent = `置信度: ${analysis.step2.confidence}%`;
        }

        // 更新步骤3
        if (analysis.step3) {
            document.getElementById('step3Text').textContent = analysis.step3.text;
            document.querySelector('#step3 .confidence-fill').style.width = `${analysis.step3.confidence}%`;
            document.querySelector('#step3 .confidence-value').textContent = `置信度: ${analysis.step3.confidence}%`;
        }

        // 更新最终决策
        const scene = SCENES[this.currentSceneId];
        document.getElementById('finalDecision').textContent = scene.decision.adDecision + '，' + scene.decision.waitReason;
    }

    /**
     * 更新情绪条
     * @param {object} emotion
     */
    updateEmotionBar(emotion) {
        const fill = document.getElementById('emotionFill');
        const score = document.getElementById('emotionScore');
        const label = document.getElementById('emotionLabel');

        setTimeout(() => {
            fill.style.width = `${emotion.score}%`;
            fill.style.background = emotion.gradient;
            score.textContent = `${emotion.score}/100`;
            score.style.color = emotion.color;

            label.innerHTML = `
                <i class="${emotion.icon}"></i>
                <span>${emotion.level} - ${SCENES[this.currentSceneId].sceneDesc}</span>
            `;
        }, 100);
    }

    /**
     * 更新决策面板
     * @param {object} decision
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
     * @param {Array} activeSteps
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
     * @param {string} sceneId
     */
    updateEmotionChart(sceneId) {
        if (!this.chart) return;

        const curveData = EMOTION_CURVE_DATA[sceneId];
        const color = SCENES[sceneId].emotion.color;

        this.chart.data.labels = curveData.labels;
        this.chart.data.datasets[0].data = curveData.data;
        this.chart.data.datasets[0].borderColor = color;
        this.chart.data.datasets[0].backgroundColor = color.replace(')', ', 0.1)').replace('rgb', 'rgba');
        this.chart.data.datasets[0].pointBackgroundColor = color;
        
        this.chart.update('none');
    }

    /**
     * 显示广告
     * @param {object} adData
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
     * @param {string} text
     * @param {boolean} isAI
     * @param {boolean} useTyping
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
                    <div class="message-text" id="typing-target-${Date.now()}"></div>
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
            const targetId = messageDiv.querySelector('[id^="typing-target"]').id;
            this.typeWriter(text, document.getElementById(targetId));
        } else if (isAI) {
            messageDiv.querySelector('[id^="typing-target"]').innerHTML = this.formatMessage(text);
        }

        this.scrollToBottom(messagesContainer);
    }

    /**
     * 添加AI消息（带去重）
     * @param {string} text
     * @param {boolean} clearPrevious
     */
    addAIMessage(text, clearPrevious = false) {
        const messagesContainer = document.getElementById('chatMessages');
        
        if (clearPrevious) {
            const messages = messagesContainer.querySelectorAll('.message');
            messages.forEach((msg, index) => {
                if (index > 0) {
                    msg.remove();
                }
            });
        }

        this.addChatMessage(text, true, true);
    }

    /**
     * 打字机效果
     * @param {string} text
     * @param {HTMLElement} element
     */
    async typeWriter(text, element) {
        this.isTyping = true;
        element.textContent = '';
        
        for (let i = 0; i < text.length; i++) {
            if (!this.isTyping) break;
            element.textContent = text.substring(0, i + 1);
            await this.sleep(CONFIG.DEMO.MESSAGE_TYPING_SPEED);
        }
        
        element.innerHTML = this.formatMessage(text);
        this.isTyping = false;
    }

    /**
     * 格式化消息
     * @param {string} text
     * @returns {string}
     */
    formatMessage(text) {
        return text
            .replace(/\n/g, '<br>')
            .replace(/• /g, '<br>• ')
            .replace(/✓ /g, '<br>✓ ');
    }

    /**
     * HTML转义
     * @param {string} text
     * @returns {string}
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 滚动到底部
     * @param {HTMLElement} element
     */
    scrollToBottom(element) {
        setTimeout(() => {
            element.scrollTop = element.scrollHeight;
        }, 100);
    }

    /**
     * 更新场景按钮状态
     * @param {string} activeId
     */
    updateSceneButtons(activeId) {
        const buttons = document.querySelectorAll('.scene-btn');
        buttons.forEach(btn => {
            const btnSceneId = btn.onclick.toString().match(/switchScene\('(\w+)'\)/)?.[1];
            if (btnSceneId === activeId) {
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
        screen.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            screen.style.opacity = '1';
            screen.style.transform = 'scale(1)';
        }, 150);
    }

    /**
     * 绑定键盘快捷键
     */
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key === '1') switchScene('high');
            if (e.key === '2') switchScene('mid');
            if (e.key === '3') switchScene('low');
            if (e.key === 'Enter' && e.target.id === 'chatInput') {
                sendMessage();
            }
        });
    }

    /**
     * 显示加载状态
     * @param {boolean} show
     */
    showLoading(show) {
        const indicator = document.getElementById('processingIndicator');
        if (indicator) {
            indicator.style.display = show ? 'flex' : 'none';
        }
    }

    /**
     * 延迟函数
     * @param {number} ms
     * @returns {Promise}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 创建全局实例
const uiController = new UIController();