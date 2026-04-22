// ==================== 场景数据配置（优化版）====================

const SCENES = {
    high: {
        id: 'high',
        name: '高潮场景',
        image: 'assets/images/scenes/high-emotion.jpg',
        dramaTitle: '《庆余年 第二季》第15集',
        sceneDesc: '范若若生死危机',
        sceneDetail: '范若若被朝臣围攻，性命危在旦夕，范闲赶来营救的关键时刻',
        
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
        
        flowActiveSteps: [1, 2, 3], // 决策流程激活到第3步
        
        // AI分析过程详情
        aiAnalysis: {
            step1: {
                text: '画面分析：人物表情紧张、动作激烈、音乐节奏快',
                confidence: 92
            },
            step2: {
                text: '用户画像：22岁男性，古装剧深度观众，完整度高',
                confidence: 88
            },
            step3: {
                text: '综合决策：情绪85分>70分阈值，延迟广告至低谷',
                confidence: 95
            }
        },
        
        aiMessage: '检测到当前剧情情绪强度高达85分（范若若生死危机场景），这是剧情的核心高潮时刻。\n\n根据我的分析模型，在此类高情绪场景插入广告会导致：\n• 用户反感度提升300%\n• 广告跳过率达到92%\n• 品牌好感度下降45%\n\n因此我决定延迟广告插播，预计在3分钟后（情绪降至30分以下时）再投放。这样既保护了你的观看体验，也确保广告主的投放效果。',
        
        // 传统广告对比
        traditionalBehavior: {
            action: '强制插播60秒广告',
            timing: '第23分45秒（固定时间点）',
            userReaction: '68%用户选择跳过或关闭',
            brandImpact: '品牌好感度-32分'
        }
    },
    
    mid: {
        id: 'mid',
        name: '日常场景',
        image: 'assets/images/scenes/mid-emotion.jpg',
        dramaTitle: '《庆余年 第二季》第15集',
        sceneDesc: '朝堂对话场景',
        sceneDetail: '范闲与庆帝在朝堂上进行策略对话，气氛严肃但不紧张',
        
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
            reason: '当前情绪强度40分，处于剧情过渡期。为你匹配了游戏广告，原因：\n✓ 时间匹配：深夜23:45，游戏高活时段\n✓ 用户匹配：你是游戏玩家，对此类广告接受度高\n✓ 内容匹配：《庆余年》联动款，与当前观看内容强相关\n✓ 互动奖励：答题正确可减少30秒广告时长',
            detailedReason: {
                title: '三维精准匹配详解',
                dimensions: [
                    {
                        name: '时间维度匹配',
                        score: 92,
                        details: [
                            '当前时间：23:45（深夜）',
                            '游戏在线高峰：22:00-02:00',
                            '用户历史数据：深夜时段游戏活跃度+85%',
                            '转化率预测：比白天提升47%'
                        ]
                    },
                    {
                        name: '用户画像匹配',
                        score: 88,
                        details: [
                            '年龄：22岁（游戏核心用户群）',
                            '兴趣标签：游戏玩家、古装剧爱好者',
                            '设备：手机端（游戏下载便捷度高）',
                            '历史行为：近30天游戏类广告点击率38%'
                        ]
                    },
                    {
                        name: '内容场景匹配',
                        score: 95,
                        details: [
                            '观看内容：《庆余年》（与广告联动）',
                            '情绪状态：40分平稳期（接受度高）',
                            'IP联动：同主题强化品牌认知',
                            '预期效果：品牌好感度+28分'
                        ]
                    }
                ],
                predictedPerformance: {
                    clickRate: '3.8%（行业平均1.2%）',
                    conversionRate: '12.5%（行业平均4.3%）',
                    roi: '1:4.2（行业平均1:2.5）',
                    userSatisfaction: '4.1/5（传统广告2.1/5）'
                }
            }
        },
        
        aiTag: {
            text: 'AI已匹配适中场景广告',
            class: 'warning'
        },
        
        flowActiveSteps: [1, 2, 3, 4],
        
        aiAnalysis: {
            step1: {
                text: '画面分析：对话场景，节奏平稳，无强烈情绪波动',
                confidence: 89
            },
            step2: {
                text: '用户画像：游戏玩家标签，深夜观看，手机设备',
                confidence: 91
            },
            step3: {
                text: '综合决策：情绪适中，插入互动广告提升参与感',
                confidence: 93
            }
        },
        
        aiMessage: '当前情绪强度40分，处于剧情过渡阶段（朝堂对话场景），既不是高潮也不是低谷，属于"谨慎区"。\n\n在这个区间，我选择投放互动广告：\n• 广告类型：游戏广告（王者荣耀×庆余年联动）\n• 匹配理由：你是游戏玩家，且这是联动款，与观看内容强相关\n• 特殊设计：提供答题互动，答对可减少30秒广告时长\n\n这种设计让广告从"被迫观看"变成"主动参与"，用户接受度提升60%。',
        
        traditionalBehavior: {
            action: '随机插播通用广告',
            timing: '第23分45秒（固定时间点）',
            userReaction: '72%用户不关注广告内容',
            brandImpact: '点击率仅0.8%'
        }
    },
    
    low: {
        id: 'low',
        name: '轻松场景',
        image: 'assets/images/scenes/low-emotion.jpg',
        dramaTitle: '《庆余年 第二季》第15集',
        sceneDesc: '搞笑日常片段',
        sceneDetail: '范闲与王启年的日常斗嘴，轻松幽默的喜剧桥段',
        
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
            reason: '完美时机！情绪强度仅15分，是剧情笑点刚过的放松时刻。为你匹配美食外卖广告的理由：\n✓ 时间强匹配：深夜23:45，正是夜宵时间\n✓ 场景匹配：轻松搞笑场景，适合生活化广告\n✓ 用户匹配：22岁游戏玩家，深夜观看习惯，外卖高频用户\n✓ 转化优化：此时购买欲望最高，预计转化率提升40%',
            detailedReason: {
                title: '黄金投放窗口分析',
                dimensions: [
                    {
                        name: '时间黄金窗口',
                        score: 96,
                        details: [
                            '时刻：23:45（夜宵需求峰值）',
                            '用户状态：追剧放松，易产生消费冲动',
                            '竞品分析：此时段外卖订单量+210%',
                            '历史数据：深夜外卖广告转化率18.5%'
                        ]
                    },
                    {
                        name: '情绪最佳状态',
                        score: 94,
                        details: [
                            '情绪值：15分（安全区，接受度最高）',
                            '场景：搞笑桥段后（心情愉悦）',
                            '心理学依据：正面情绪提升购买意愿32%',
                            '用户反馈：此类场景广告好感度+45分'
                        ]
                    },
                    {
                        name: '需求精准匹配',
                        score: 91,
                        details: [
                            '生理需求：深夜观看易产生饥饿感',
                            '行为特征：手机端观看，下单便捷',
                            '用户画像：22岁单身男性，外卖重度用户',
                            'LBS定位：周边餐饮配送范围内'
                        ]
                    }
                ],
                predictedPerformance: {
                    clickRate: '8.2%（行业平均2.1%）',
                    conversionRate: '18.5%（行业平均6.2%）',
                    roi: '1:5.8（行业平均1:2.8）',
                    userSatisfaction: '4.5/5（传统广告1.8/5）'
                }
            }
        },
        
        aiTag: {
            text: 'AI已选择最优时机投放',
            class: 'success'
        },
        
        flowActiveSteps: [1, 2, 3, 4],
        
        aiAnalysis: {
            step1: {
                text: '画面分析：轻松喜剧场景，笑点刚过，情绪放松',
                confidence: 94
            },
            step2: {
                text: '用户画像：深夜观看，手机端，历史外卖订单频繁',
                confidence: 90
            },
            step3: {
                text: '综合决策：黄金窗口，投放生活服务广告最优',
                confidence: 96
            }
        },
        
        aiMessage: '完美时机！当前情绪强度仅15分，处于"安全区"。这是剧情刚过完一个搞笑桥段后的放松时刻，是投放广告的黄金窗口。\n\n为你匹配的是美团外卖广告，精准匹配逻辑：\n• 时间维度：深夜23:45，夜宵高峰期\n• 用户维度：22岁游戏玩家，深夜观看习惯，属于外卖核心用户\n• 场景维度：轻松场景，对生活化广告接受度最高\n• 数据支撑：此时投放外卖广告，转化率比白天提升47%\n\n这种三维精准匹配，让广告感觉像是"正好需要"而不是"被强迫观看"。',
        
        traditionalBehavior: {
            action: '插播汽车广告（不匹配）',
            timing: '第30分00秒（固定时间点）',
            userReaction: '89%用户认为广告不相关',
            brandImpact: '转化率仅0.3%，浪费广告费'
        }
    }
};

// 情绪曲线数据（模拟45分钟剧集的情绪波动）
const EMOTION_CURVE_DATA = {
    high: {
        labels: ['0分', '5分', '10分', '15分', '20分', '23分', '25分', '30分', '35分', '40分'],
        data: [45, 50, 62, 70, 78, 85, 83, 75, 68, 60],
        currentIndex: 5 // 当前在第23分钟
    },
    mid: {
        labels: ['0分', '5分', '10分', '15分', '20分', '23分', '25分', '30分', '35分', '40分'],
        data: [45, 50, 55, 52, 48, 40, 38, 35, 32, 30],
        currentIndex: 5
    },
    low: {
        labels: ['0分', '5分', '10分', '15分', '20分', '23分', '25分', '30分', '35分', '40分'],
        data: [32, 28, 25, 20, 18, 15, 18, 22, 25, 28],
        currentIndex: 5
    }
};

// 传统广告系统行为模拟
const TRADITIONAL_AD_CONFIG = {
    insertionPoints: [15, 30], // 固定在第15分钟和第30分钟插播
    adDuration: 60, // 60秒广告
    skipAvailableAfter: 5, // 5秒后可跳过
    adPool: [
        {
            type: '汽车广告',
            relevance: 12, // 相关性评分（满分100）
            userGroup: '35-50岁高收入男性',
            mismatch: '当前用户22岁，不匹配'
        },
        {
            type: '母婴产品',
            relevance: 5,
            userGroup: '25-35岁已婚女性',
            mismatch: '当前用户单身男性，完全不匹配'
        },
        {
            type: '理财产品',
            relevance: 18,
            userGroup: '30-50岁中高收入',
            mismatch: '当前用户22岁学生/初入职场，不匹配'
        }
    ],
    userBehavior: {
        skipRate: 78, // 78%用户选择跳过
        closeRate: 12, // 12%用户直接关闭视频
        completeRate: 10, // 仅10%用户看完
        negativeReaction: 85 // 85%用户产生负面情绪
    }
};

// 冻结数据，防止被修改
Object.freeze(SCENES);
Object.freeze(EMOTION_CURVE_DATA);
Object.freeze(TRADITIONAL_AD_CONFIG);