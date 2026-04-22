// ==================== 视频播放器控制器 ====================

class VideoPlayer {
    constructor() {
        this.videoElement = null;
        this.currentTimeline = null;
        this.isPlaying = false;
        this.updateInterval = null;
    }

    /**
     * 初始化视频播放器
     */
    init() {
        console.log('[Video Player] 初始化');
        
        // 创建video元素替换img
        const screenDiv = document.querySelector('.video-screen');
        const oldImg = document.getElementById('sceneImage');
        
        if (oldImg) {
            this.videoElement = document.createElement('video');
            this.videoElement.id = 'sceneVideo';
            this.videoElement.style.width = '100%';
            this.videoElement.style.height = '100%';
            this.videoElement.style.objectFit = 'cover';
            this.videoElement.controls = false;
            this.videoElement.muted = true;
            
            oldImg.replaceWith(this.videoElement);
            
            // 绑定事件
            this.videoElement.addEventListener('timeupdate', () => this.onTimeUpdate());
            this.videoElement.addEventListener('ended', () => this.onVideoEnded());
            this.videoElement.addEventListener('loadeddata', () => this.onVideoLoaded());
        }
    }

    /**
     * 加载场景（使用真实API分析）
     * @param {string} sceneId - 场景ID
     */
    async loadScene(sceneId) {
        console.log('[Video Player] 加载场景:', sceneId);
        
        try {
            // 显示加载提示
            this.showLoading('AI正在分析视频，请稍候...');
            
            // 调用后端API分析视频
            const analysisData = await videoAPI.analyzePresetVideo(sceneId);
            
            console.log('[Video Player] 收到分析数据:', analysisData);
            
            // 保存分析数据
            this.currentTimeline = analysisData;
            
            // 加载视频
            const videoURL = `http://localhost:5000/api/video/${sceneId}`;
            this.videoElement.src = videoURL;
            this.videoElement.load();
            
        } catch (error) {
            console.error('[Video Player] 加载失败:', error);
            this.hideLoading();
            alert(`加载失败: ${error.message}\n\n请确保：\n1. 后端服务已启动\n2. 视频文件已放置到正确位置`);
        }
    }

    /**
     * 视频加载完成
     */
    onVideoLoaded() {
        console.log('[Video Player] 视频加载完成');
        this.hideLoading();
        this.play();
    }

    /**
     * 播放视频
     */
    play() {
        const promise = this.videoElement.play();
        
        if (promise !== undefined) {
            promise.then(() => {
                this.isPlaying = true;
                console.log('[Video Player] 开始播放');
            }).catch(error => {
                console.warn('[Video Player] 自动播放被阻止:', error);
                this.showPlayButton();
            });
        }
    }

    /**
     * 暂停视频
     */
    pause() {
        this.videoElement.pause();
        this.isPlaying = false;
    }

    /**
     * 时间更新事件
     */
    onTimeUpdate() {
        if (!this.currentTimeline) return;

        const currentTime = this.videoElement.currentTime;
        
        // 更新情绪显示
        this.updateEmotion(currentTime);
        
        // 检查广告插入点
        this.checkAdInsertion(currentTime);
    }

    /**
     * 更新情绪显示
     * @param {number} currentTime - 当前时间（秒）
     */
    updateEmotion(currentTime) {
        const curve = this.currentTimeline.emotion_curve;
        
        // 找到最近的情绪点
        const nearestPoint = curve.reduce((prev, curr) => {
            return Math.abs(curr.time - currentTime) < Math.abs(prev.time - currentTime) ? curr : prev;
        });

        if (nearestPoint) {
            // 更新UI（调用uiController）
            const emotionData = {
                score: nearestPoint.emotion,
                level: this.getEmotionLevel(nearestPoint.emotion),
                color: this.getEmotionColor(nearestPoint.emotion),
                gradient: this.getEmotionGradient(nearestPoint.emotion),
                icon: this.getEmotionIcon(nearestPoint.emotion)
            };
            
            uiController.updateEmotionBar(emotionData);
            
            // 更新决策面板
            const emotionClass = nearestPoint.emotion > 70 ? 'danger' : 
                                 nearestPoint.emotion > 30 ? 'warning' : 'success';
            
            const decisionEmotion = document.getElementById('decisionEmotion');
            if (decisionEmotion) {
                decisionEmotion.textContent = `${emotionData.level} · ${nearestPoint.emotion}分`;
                decisionEmotion.className = `decision-value ${emotionClass}`;
            }
        }
    }

    /**
     * 检查广告插入点
     * @param {number} currentTime - 当前时间
     */
    checkAdInsertion(currentTime) {
        const mode = modeController.getCurrentMode();
        const decisions = this.currentTimeline.ad_decisions;
        
        // 传统模式
        if (mode === 'traditional') {
            const traditionalAd = decisions.traditional.find(
                d => Math.abs(d.time - currentTime) < 0.5
            );
            
            if (traditionalAd && !traditionalAd.triggered) {
                console.log('[Traditional Mode] 触发固定广告 @', currentTime);
                this.pause();
                modeController.showTraditionalAd();
                traditionalAd.triggered = true;
            }
        }
        
        // AI模式
        if (mode === 'ai') {
            const aiAd = decisions.ai.find(
                d => d.action === 'insert_smart_ad' && 
                     Math.abs(d.time - currentTime) < 0.5
            );
            
            if (aiAd && !aiAd.triggered) {
                console.log('[AI Mode] 触发智能广告 @', currentTime);
                this.showSmartAd(aiAd);
                aiAd.triggered = true;
            }
        }
    }

    /**
     * 显示智能广告
     * @param {object} decision - AI决策数据
     */
    showSmartAd(decision) {
        if (decision.ad_data) {
            this.pause();
            
            uiController.showAd({
                image: `assets/images/ads/${decision.ad_data.image}`,
                title: decision.ad_data.title,
                desc: decision.ad_data.desc,
                reason: decision.ad_data.match_reason || decision.reason
            });
            
            document.getElementById('userControlPanel')?.classList.remove('hidden');
        }
    }

    /**
     * 视频结束
     */
    onVideoEnded() {
        console.log('[Video Player] 视频播放结束');
        // 循环播放
        this.videoElement.currentTime = 0;
        this.play();
    }

    /**
     * 显示加载提示
     */
    showLoading(message = '加载中...') {
        const loading = document.createElement('div');
        loading.id = 'video-loading';
        loading.innerHTML = `
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                z-index: 1000;
                background: rgba(0, 0, 0, 0.8);
                padding: 30px 50px;
                border-radius: 16px;
            ">
                <div style="
                    width: 60px;
                    height: 60px;
                    border: 4px solid #00a870;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <p style="color: white; font-size: 16px; margin: 0;">${message}</p>
            </div>
        `;
        document.querySelector('.video-screen').appendChild(loading);
    }

    /**
     * 隐藏加载提示
     */
    hideLoading() {
        const loading = document.getElementById('video-loading');
        if (loading) loading.remove();
    }

    /**
     * 显示播放按钮
     */
    showPlayButton() {
        const playBtn = document.createElement('div');
        playBtn.className = 'video-play-button';
        playBtn.innerHTML = `
            <button onclick="videoPlayer.play()" style="
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
const videoPlayer = new VideoPlayer();