// ==================== 场景数据配置 ====================

const SCENES = {
    high: {
        id: 'high',
        name: '高潮场景',
        image: 'assets/images/scenes/high-emotion.jpg',
        dramaTitle: '《庆余年 第二季》第15集',
        sceneDesc: '范若若生死危机',
        
        emotion: {
            score: 85,
            level: '高度紧张',
            color: '#ff4444',
            gradient: 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)',
            icon: 'bi-lightning-fill'
        },
        
        decision: {
            scene: '范若若生死危机',
            emotionText: '紧张 · 85分',
            emotionClass: 'danger',
            adDecision: '延迟插播',
            adDecisionIcon: 'bi-x-circle',
            adDecisionClass: 'danger',
            waitReason: '下一个情绪低谷',
            waitTime: '约3分钟后'
        },
        
        showAd: false,
        
        aiTag: {
            text: 'AI检测到高情绪场景，已延迟广告',
            class: 'danger'
        },
        
        flowActiveSteps: [1, 2, 3], // 决策流程激活步骤
        
        aiMessage: '检测到当前剧情情绪强度高达85分（范若若生死危机场景），这是剧情的核心高潮时刻。根据我的分析模型，在此类高情绪场景插入广告会导致：\n• 用户反感度提升300%\n• 广告跳过率达到92%\n• 品牌好感度下降45%\n\n因此我决定延迟广告插播，预计在3分钟后（情绪降至30分以下时）再投放。这样既保护了你的观看体验，也确保广告主的投放效果。'
    },
    
    mid: {
        id: 'mid',
        name: '日常场景',
        image: 'assets/images/scenes/mid-emotion.jpg',
        dramaTitle: '《庆余年 第二季》第15集',
        sceneDesc: '朝堂对话场景',
        
        emotion: {
            score: 40,
            level: '情绪平稳',
            color: '#ffaa00',
            gradient: 'linear-gradient(135deg, #ffaa00 0%, #ffcc00 100%)',
            icon: 'bi-emoji-smile'
        },
        
        decision: {
            scene: '朝堂对话场景',
            emotionText: '平稳 · 40分',
            emotionClass: 'warning',
            adDecision: '插入互动广告',
            adDecisionIcon: 'bi-check-circle',
            adDecisionClass: 'warning',
            waitReason: '当前时机适中',
            waitTime: '30秒后投放'
        },
        
        showAd: true,
        adData: {
            image: 'assets/images/ads/game-ad.jpg',
            title: '王者荣耀 × 庆余年联动',
            desc: '新英雄"范闲"上线，登录领取限定皮肤',
            brand: '王者荣耀',
            type: '游戏广告',
            reason: '当前情绪强度40分，处于剧情过渡期。为你匹配了游戏广告，原因：\n✓ 时间匹配：深夜23:45，游戏高活时段\n✓ 用户匹配：你是游戏玩家，对此类广告接受度高\n✓ 内容匹配：《庆余年》联动款，与当前观看内容强相关\n✓ 互动奖励：答题正确可减少30秒广告时长'
        },
        
        aiTag: {
            text: 'AI已匹配适中场景广告',
            class: 'warning'
        },
        
        flowActiveSteps: [1, 2, 3, 4],
        
        aiMessage: '当前情绪强度40分，处于剧情过渡阶段（朝堂对话场景），既不是高潮也不是低谷，属于"谨慎区"。\n\n在这个区间，我选择投放互动广告：\n• 广告类型：游戏广告（王者荣耀×庆余年联动）\n• 匹配理由：你是游戏玩家，且这是联动款，与观看内容强相关\n• 特殊设计：提供答题互动，答对可减少30秒广告时长\n\n这种设计让广告从"被迫观看"变成"主动参与"，用户接受度提升60%。'
    },
    
    low: {
        id: 'low',
        name: '轻松场景',
        image: 'assets/images/scenes/low-emotion.jpg',
        dramaTitle: '《庆余年 第二季》第15集',
        sceneDesc: '搞笑日常片段',
        
        emotion: {
            score: 15,
            level: '轻松惬意',
            color: '#44bb44',
            gradient: 'linear-gradient(135deg, #44bb44 0%, #66dd66 100%)',
            icon: 'bi-emoji-laughing'
        },
        
        decision: {
            scene: '搞笑日常片段',
            emotionText: '轻松 · 15分',
            emotionClass: 'success',
            adDecision: '最优投放时机',
            adDecisionIcon: 'bi-check-circle-fill',
            adDecisionClass: 'success',
            waitReason: '立即投放',
            waitTime: '正在投放中'
        },
        
        showAd: true,
        adData: {
            image: 'assets/images/ads/food-ad.jpg',
            title: '美团外卖 - 深夜食堂',
            desc: '新用户立减15元，0元起送夜宵美食',
            brand: '美团外卖',
            type: '生活服务广告',
            reason: '完美时机！情绪强度仅15分，是剧情笑点刚过的放松时刻。为你匹配美食外卖广告的理由：\n✓ 时间强匹配：深夜23:45，正是夜宵时间\n✓ 场景匹配：轻松搞笑场景，适合生活化广告\n✓ 用户匹配：22岁游戏玩家，深夜观看习惯，外卖高频用户\n✓ 转化优化：此时购买欲望最高，预计转化率提升40%'
        },
        
        aiTag: {
            text: 'AI已选择最优时机投放',
            class: 'success'
        },
        
        flowActiveSteps: [1, 2, 3, 4],
        
        aiMessage: '完美时机！当前情绪强度仅15分，处于"安全区"。这是剧情刚过完一个搞笑桥段后的放松时刻，是投放广告的黄金窗口。\n\n为你匹配的是美团外卖广告，精准匹配逻辑：\n• 时间维度：深夜23:45，夜宵高峰期\n• 用户维度：22岁游戏玩家，深夜观看习惯，属于外卖核心用户\n• 场景维度：轻松场景，对生活化广告接受度最高\n• 数据支撑：此时投放外卖广告，转化率比白天提升40%\n\n这种三维精准匹配，让广告感觉像是"正好需要"而不是"被强迫观看"。'
    }
};

// 情绪曲线数据（模拟45分钟剧集的情绪波动）
const EMOTION_CURVE_DATA = {
    high: [45, 50, 62, 70, 78, 82, 85, 83, 80, 75], // 当前在高点
    mid: [45, 50, 55, 52, 48, 42, 40, 38, 35, 32],  // 当前在中点
    low: [32, 28, 25, 20, 15, 18, 22, 25, 28, 30]   // 当前在低点
};

// 冻结数据，防止被修改
Object.freeze(SCENES);
Object.freeze(EMOTION_CURVE_DATA);