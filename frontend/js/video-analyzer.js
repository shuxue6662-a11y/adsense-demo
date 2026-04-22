// ==================== 视频分析器 ====================

class VideoAnalyzer {
    constructor() {
        this.currentVideo = null;
        this.currentTimeline = null;
        this.videoElement = null;
        this.isPlaying = false;
        this.updateInterval = null;
    }

    /**
     * 初始化视频播放器
     */
    init() {
        // 创建video元素替换img
        const screenDiv = document.querySelector('.video-screen');
        const oldImg = document.getElementById('sceneImage');
        
        this.videoElement = document.createElement('video');
        this.videoElement.id = 'sceneVideo';
        this.videoElement.style.width = '100%';
        this.videoElement.style.height = '100%';
        this.videoElement.style.objectFit = 'cover';
        this.videoElement.controls = false; // 隐藏默认控制条
        this.videoElement.muted = true; // 静音（避免干扰）
        
        // 替换元素
        oldImg.replaceWith(this.videoElement);
        
        // 绑定事件
        this.videoElement.addEventListener('timeupdate', () => this.onTimeUpdate());
        this.videoElement.addEventListener('ended', () => this.onVideoEnded());
        
        console.log('[Video Analyzer] 初始化完成');
    }

    /**
     * 加载并播放视频
     * @param {string} sceneId - 场景ID
     */
    loadScene(sceneId) {
        const timeline = VIDEO_TIMELINES[sceneId];
        if (!timeline) {
            console.error('场景不存在:', sceneId);
            return;
        }

        console.log('[Video Analyzer] 加载场景:', timeline.sceneName);
        
        this.currentTimeline = timeline;
        this.videoElement.src = timeline.videoFile;
        this.videoElement.load();
        
        // 自动播放
        this.play();
    }

    /**
     * 播放视频
     */
    play() {
        this.videoElement.play()
            .then(() => {
                this.isPlaying = true;
                console.log('[Video Analyzer] 视频开始播放');
            })
            .catch(err => {
                console.error('[Video Analyzer] 播放失败:', err);
                // 浏览器可能阻止自动播放，显示播放按钮
                this.showPlayButton();
            });
    }

    /**
     * 暂停视频
     */
    pause() {
        this.videoElement.pause();
        this.isPlaying = false;
    }

    /**
     * 时间更新事件（核心）
     */
    onTimeUpdate() {
        if (!this.currentTimeline) return;

        const currentTime = Math.floor(this.videoElement.currentTime);
        
        // 更新情绪强度
        this.updateEmotion(currentTime);
        
        // 触发AI分析
        this.triggerAIAnalysis(currentTime);
        
        // 检查广告插入点
        this.checkAdInsertion(currentTime);
    }

    /**
     * 更新情绪强度显示
     * @param {number} currentTime
     */
    updateEmotion(currentTime) {
        const curve = this.currentTimeline.emotionCurve;
        const point = curve.find(p => p.time === currentTime);
        
        if (point) {
            // 更新UI
            uiController.updateEmotionBar({
                score: point.emotion,
                level: this.getEmotionLevel(point.emotion),
                color: this.getEmotionColor(point.emotion),
                gradient: this.getEmotionGradient(point.emotion),
                icon: this.getEmotionIcon(point.emotion)
            });
            
            // 更新决策面板
            const emotionClass = point.emotion > 70 ? 'danger' : 
                                 point.emotion > 30 ? 'warning' : 'success';
            
            document.getElementById('decisionEmotion').textContent = 
                `${this.getEmotionLevel(point.emotion)} · ${point.emotion}分`;
            document.getElementById('decisionEmotion').className = 
                `decision-value ${emotionClass}`;
        }
    }

    /**
     * 触发AI分析动画
     * @param {number} currentTime
     */
    triggerAIAnalysis(currentTime) {
        const triggers = this.currentTimeline.aiAnalysisTriggers;
        const trigger = triggers.find(t => t.time === currentTime);
        
        if (trigger) {
            console.log('[AI Analysis]', trigger.text);
            
            // 更新AI分析步骤
            const stepElement = document.getElementById(`step${trigger.step}`);
            if (stepElement) {
                stepElement.classList.add('active');
                stepElement.querySelector('p').textContent = trigger.text;
                
                if (trigger.confidence > 0) {
                    stepElement.querySelector('.confidence-fill').style.width = 
                        `${trigger.confidence}%`;
                    stepElement.querySelector('.confidence-value').textContent = 
                        `置信度: ${trigger.confidence}%`;
                }
            }
        }
    }

    /**
     * 检查广告插入点
     * @param {number} currentTime
     */
    checkAdInsertion(currentTime) {
        const mode = modeController.getCurrentMode();
        
        // 传统模式：固定时间点强制插广告
        if (mode === 'traditional' && 
            currentTime === this.currentTimeline.traditionalAdPoint) {
            console.log('[Traditional Mode] 触发固定广告');
            this.pause();
            modeController.showTraditionalAd();
        }
        
        // AI模式：智能判断
        if (mode === 'ai' && this.currentTimeline.aiDecision.shouldShowAd) {
            if (currentTime === this.currentTimeline.aiDecision.showAt) {
                console.log('[AI Mode] 触发智能广告');
                this.showSmartAd();
            }
        }
    }

    /**
     * 显示智能广告
     */
    showSmartAd() {
        const adData = this.currentTimeline.aiDecision.adData;
        if (adData) {
            // 暂停视频
            this.pause();
            
            // 显示广告（使用现有的UI）
            uiController.showAd({
                image: `assets/images/ads/${adData.brand.toLowerCase()}-ad.jpg`,
                title: adData.title,
                desc: adData.desc || '',
                reason: adData.matchReason || ''
            });
            
            // 显示用户主动权面板
            document.getElementById('userControlPanel').classList.remove('hidden');
        }
    }

    /**
     * 视频结束事件
     */
    onVideoEnded() {
        console.log('[Video Analyzer] 视频播放结束');
        // 循环播放
        this.videoElement.currentTime = 0;
        this.play();
    }

    /**
     * 显示播放按钮（浏览器阻止自动播放时）
     */
    showPlayButton() {
        const playBtn = document.createElement('div');
        playBtn.className = 'video-play-button';
        playBtn.innerHTML = `
            <button onclick="videoAnalyzer.play()" style="
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: var(--gradient-primary);
                border: none;
                color: white;
                font-size: 32px;
                cursor: pointer;
                box-shadow: 0 8px 32px rgba(0, 168, 112, 0.5);
            ">
                <i class="bi bi-play-fill"></i>
            </button>
        `;
        playBtn.style.position = 'absolute';
        playBtn.style.top = '50%';
        playBtn.style.left = '50%';
        playBtn.style.transform = 'translate(-50%, -50%)';
        playBtn.style.zIndex = '100';
        
        document.querySelector('.video-screen').appendChild(playBtn);
    }

    // 辅助方法
    getEmotionLevel(score) {
        if (score > 70) return '高度紧张';
        if (score > 50) return '较为紧张';
        if (score > 30) return '情绪平稳';
        return '轻松惬意';
    }

    getEmotionColor(score) {
        if (score > 70) return '#ff4444';
        if (score > 30) return '#ffaa00';
        return '#44bb44';
    }

    getEmotionGradient(score) {
        if (score > 70) return 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)';
        if (score > 30) return 'linear-gradient(135deg, #ffaa00 0%, #ffcc00 100%)';
        return 'linear-gradient(135deg, #44bb44 0%, #66dd66 100%)';
    }

    getEmotionIcon(score) {
        if (score > 70) return 'bi-lightning-fill';
        if (score > 30) return 'bi-emoji-smile';
        return 'bi-emoji-laughing';
    }
}

// 创建全局实例
const videoAnalyzer = new VideoAnalyzer();