// ==================== 视频时间轴标注数据 ====================

const VIDEO_TIMELINES = {
    'scene-high': {
        duration: 30, // 30秒视频
        videoFile: 'assets/videos/scene-high.mp4',
        sceneName: '高潮场景 - 范若若生死危机',
        
        // 每秒的情绪强度（预先标注）
        emotionCurve: [
            { time: 0, emotion: 65, description: '紧张氛围铺垫' },
            { time: 3, emotion: 72, description: '冲突开始' },
            { time: 6, emotion: 78, description: '范若若被围攻' },
            { time: 9, emotion: 85, description: '生死危机' },
            { time: 12, emotion: 88, description: '范闲赶来' },
            { time: 15, emotion: 90, description: '战斗高潮' },
            { time: 18, emotion: 82, description: '开始反击' },
            { time: 21, emotion: 70, description: '局势转变' },
            { time: 24, emotion: 55, description: '危机解除' },
            { time: 27, emotion: 42, description: '胜利' },
            { time: 30, emotion: 35, description: '结束' }
        ],
        
        // AI分析触发点
        aiAnalysisTriggers: [
            {
                time: 0,
                step: 1,
                text: '开始分析视频内容...',
                confidence: 0
            },
            {
                time: 1,
                step: 1,
                text: '检测到紧张场景：人物表情严肃、动作快速',
                confidence: 75
            },
            {
                time: 2,
                step: 2,
                text: '匹配用户画像：22岁男性，古装剧观众',
                confidence: 88
            },
            {
                time: 3,
                step: 3,
                text: '综合决策中...',
                confidence: 0
            },
            {
                time: 4,
                step: 3,
                text: '情绪强度72分，超过阈值，延迟广告',
                confidence: 92
            }
        ],
        
        // 传统广告插入点（固定）
        traditionalAdPoint: 15, // 第15秒强制插广告
        
        // AI智能决策
        aiDecision: {
            shouldShowAd: false,
            reason: '情绪强度持续>70分，属于禁入区',
            waitUntil: 27, // 等到第27秒
            finalDecision: '延迟至情绪低谷（第27秒）再投放'
        }
    },
    
    'scene-mid': {
        duration: 30,
        videoFile: 'assets/videos/scene-mid.mp4',
        sceneName: '日常场景 - 朝堂对话',
        
        emotionCurve: [
            { time: 0, emotion: 35, description: '平稳开场' },
            { time: 5, emotion: 40, description: '对话开始' },
            { time: 10, emotion: 45, description: '观点交锋' },
            { time: 15, emotion: 42, description: '气氛缓和' },
            { time: 20, emotion: 38, description: '达成共识' },
            { time: 25, emotion: 32, description: '对话结束' },
            { time: 30, emotion: 30, description: '场景结束' }
        ],
        
        aiAnalysisTriggers: [
            {
                time: 1,
                step: 1,
                text: '识别场景：朝堂对话，节奏平稳',
                confidence: 89
            },
            {
                time: 2,
                step: 2,
                text: '用户画像匹配：游戏玩家，深夜观看',
                confidence: 91
            },
            {
                time: 3,
                step: 3,
                text: '决策：情绪40分，可插入互动广告',
                confidence: 93
            }
        ],
        
        traditionalAdPoint: 15,
        
        aiDecision: {
            shouldShowAd: true,
            adType: 'interactive',
            adData: {
                brand: '王者荣耀',
                title: '《庆余年》联动皮肤上线',
                interaction: '答题可减少30秒'
            },
            showAt: 18 // 在第18秒显示
        }
    },
    
    'scene-low': {
        duration: 30,
        videoFile: 'assets/videos/scene-low.mp4',
        sceneName: '轻松场景 - 搞笑日常',
        
        emotionCurve: [
            { time: 0, emotion: 28, description: '轻松氛围' },
            { time: 5, emission: 22, description: '开始搞笑' },
            { time: 10, emotion: 15, description: '笑点高潮' },
            { time: 15, emotion: 18, description: '继续轻松' },
            { time: 20, emotion: 20, description: '日常对话' },
            { time: 25, emotion: 25, description: '场景过渡' },
            { time: 30, emotion: 30, description: '结束' }
        ],
        
        aiAnalysisTriggers: [
            {
                time: 1,
                step: 1,
                text: '识别：搞笑场景，情绪放松',
                confidence: 94
            },
            {
                time: 2,
                step: 2,
                text: '最佳时机：深夜+轻松场景',
                confidence: 90
            },
            {
                time: 3,
                step: 3,
                text: '决策：黄金窗口，投放生活服务广告',
                confidence: 96
            }
        ],
        
        traditionalAdPoint: 15,
        
        aiDecision: {
            shouldShowAd: true,
            adType: 'normal',
            adData: {
                brand: '美团外卖',
                title: '深夜食堂，0元起送',
                matchReason: '时间+场景+用户三维匹配'
            },
            showAt: 12 // 在第12秒（笑点刚过）显示
        }
    }
};

Object.freeze(VIDEO_TIMELINES);