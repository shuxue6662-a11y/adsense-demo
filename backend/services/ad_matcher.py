"""
广告匹配服务
根据分析结果匹配最优广告
"""

from typing import Dict, List


class AdMatcher:
    """广告匹配器"""
    
    # 广告库
    AD_POOL = {
        'food': {
            'brand': '美团外卖',
            'title': '深夜食堂 · 0元起送',
            'desc': '新用户立减15元，夜宵美食送到家',
            'image': 'food-ad.jpg',
            'tags': ['美食', '外卖', '夜宵']
        },
        'game': {
            'brand': '王者荣耀',
            'title': '《庆余年》联动皮肤上线',
            'desc': '新英雄"范闲"登场，登录领取限定皮肤',
            'image': 'game-ad.jpg',
            'tags': ['游戏', '联动', '皮肤']
        },
        'general': {
            'brand': '腾讯视频',
            'title': '开通VIP免广告',
            'desc': '首月仅需9.9元，畅享4K超清',
            'image': 'vip-ad.jpg',
            'tags': ['会员', 'VIP', '优惠']
        }
    }
    
    def __init__(self):
        pass
    
    def match_ad(
        self, 
        emotion: int, 
        scene_type: str, 
        timestamp: float,
        user_profile: Dict = None
    ) -> Dict:
        """
        匹配广告
        
        Args:
            emotion: 情绪强度
            scene_type: 场景类型
            timestamp: 时间戳
            user_profile: 用户画像
            
        Returns:
            广告数据
        """
        # 默认用户画像
        if user_profile is None:
            user_profile = {
                'age': 22,
                'gender': 'male',
                'interests': ['game', 'drama'],
                'time_preference': 'night'
            }
        
        # 根据时间判断
        hour = int(timestamp // 3600)
        is_night = 22 <= hour or hour < 6
        
        # 匹配逻辑
        if is_night:
            ad_type = 'food'
        elif 'game' in user_profile['interests']:
            ad_type = 'game'
        else:
            ad_type = 'general'
        
        ad_data = self.AD_POOL[ad_type].copy()
        
        # 添加匹配理由
        ad_data['match_reason'] = self._generate_match_reason(
            ad_type, emotion, scene_type, timestamp, user_profile
        )
        
        return ad_data
    
    def _generate_match_reason(
        self, 
        ad_type: str, 
        emotion: int, 
        scene_type: str, 
        timestamp: float,
        user_profile: Dict
    ) -> str:
        """生成匹配理由"""
        
        reasons = []
        
        # 时间匹配
        hour = int(timestamp // 3600)
        if 22 <= hour or hour < 6:
            reasons.append(f"✓ 时间匹配：深夜{hour}点，正是夜宵时间")
        
        # 情绪匹配
        if emotion < 30:
            reasons.append(f"✓ 情绪匹配：情绪放松({emotion}分)，对生活服务广告接受度高")
        
        # 用户匹配
        if ad_type == 'game' and 'game' in user_profile.get('interests', []):
            reasons.append(f"✓ 用户匹配：{user_profile['age']}岁游戏玩家，核心目标用户")
        
        return '\n'.join(reasons) if reasons else '基于用户画像推荐'