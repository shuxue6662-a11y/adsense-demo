"""
Coze视觉分析服务
使用Coze API的多模态能力分析视频帧
"""

import requests
import base64
import json
import time
from typing import Dict, Optional
from config import Config


class CozeVisionAnalyzer:
    """Coze视觉分析器"""
    
    def __init__(self):
        self.api_key = Config.COZE_API_KEY
        self.bot_id = Config.COZE_BOT_ID
        self.api_url = Config.COZE_API_URL
        
        if not self.api_key or not self.bot_id:
            raise ValueError("未配置COZE_API_KEY或COZE_BOT_ID，请检查.env文件")
    
    def analyze_frame(self, frame_base64: str, timestamp: float, context: str = "") -> Dict:
        """
        分析视频帧
        
        Args:
            frame_base64: Base64编码的图片
            timestamp: 时间戳（秒）
            context: 上下文信息
            
        Returns:
            分析结果字典
        """
        print(f"[Coze Vision] 分析帧 @ {timestamp:.1f}s")
        
        # 构建分析提示词
        prompt = self._build_prompt(timestamp, context)
        
        try:
            # 调用Coze API
            response = self._call_coze_api(frame_base64, prompt)
            
            # 解析响应
            result = self._parse_response(response)
            
            print(f"[Coze Vision] 分析完成: 情绪{result['emotion_score']}分")
            
            return result
            
        except Exception as e:
            print(f"[Coze Vision] 分析失败: {e}")
            # 返回默认值
            return self._get_fallback_result(timestamp)
    
    def _build_prompt(self, timestamp: float, context: str) -> str:
        """构建分析提示词"""
        return f"""你是「AdSense感知广告引擎」的视频分析AI。请分析这一帧视频画面（时间戳: {timestamp:.1f}秒）。

**分析任务：**
1. 识别场景类型（动作/对话/日常/搞笑等）
2. 评估画面情绪强度（0-100分）：
   - 0-30分：轻松、平静、搞笑场景
   - 30-70分：日常、对话、平稳场景
   - 70-100分：紧张、激烈、冲突、危机场景
3. 分析情绪依据（人物表情、动作、场景氛围）
4. 判断是否适合插入广告

**评分标准：**
- 人物表情紧张/愤怒/恐惧 → 高分
- 快速运动/打斗/追逐 → 高分
- 对话平静/场景日常 → 中分
- 搞笑/放松/温馨 → 低分

**上下文信息：**
{context if context else "无"}

**请严格按照以下JSON格式回复：**
```json
{{
  "emotion_score": 数字(0-100),
  "scene_type": "场景类型",
  "scene_description": "简短描述画面内容",
  "emotion_reasoning": "情绪评分的理由",
  "ad_suitable": true或false,
  "confidence": 数字(0-100)
}}
只返回JSON，不要有其他内容。"""
    def _call_coze_api(self, frame_base64: str, prompt: str) -> Dict:
        """调用Coze API"""
        
        # 构建请求体
        payload = {
            "bot_id": self.bot_id,
            "user_id": f"video_analyzer_{int(time.time())}",
            "stream": False,
            "auto_save_history": False,
            "additional_messages": [
                {
                    "role": "user",
                    "content": prompt,
                    "content_type": "text"
                },
                {
                    "role": "user",
                    "content": frame_base64,
                    "content_type": "image"
                }
            ]
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # 发送请求
        response = requests.post(
            self.api_url,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code != 200:
            raise Exception(f"API请求失败: {response.status_code} - {response.text}")
        
        return response.json()

    def _parse_response(self, response: Dict) -> Dict:
        """解析Coze API响应"""
        try:
            # 提取消息内容
            if 'data' not in response or 'messages' not in response['data']:
                raise Exception("API响应格式错误")
            
            messages = response['data']['messages']
            
            # 找到AI的回复
            ai_message = None
            for msg in messages:
                if msg.get('role') == 'assistant' and msg.get('type') == 'answer':
                    ai_message = msg
                    break
            
            if not ai_message:
                raise Exception("未找到AI回复")
            
            content = ai_message.get('content', '')
            
            # 提取JSON
            json_str = self._extract_json(content)
            result = json.loads(json_str)
            
            # 验证必需字段
            required_fields = ['emotion_score', 'scene_type', 'scene_description']
            for field in required_fields:
                if field not in result:
                    raise Exception(f"缺少必需字段: {field}")
            
            # 确保emotion_score在有效范围内
            result['emotion_score'] = max(0, min(100, int(result['emotion_score'])))
            
            return result
            
        except json.JSONDecodeError as e:
            print(f"[Coze Vision] JSON解析失败: {e}")
            print(f"原始内容: {content}")
            raise Exception("AI返回的不是有效JSON")
        except Exception as e:
            print(f"[Coze Vision] 响应解析失败: {e}")
            raise

    def _extract_json(self, text: str) -> str:
        """从文本中提取JSON"""
        # 尝试提取代码块中的JSON
        if '```json' in text:
            parts = text.split('```json')
            if len(parts) > 1:
                json_part = parts[1].split('```')[0]
                return json_part.strip()
        
        # 尝试提取{}包裹的JSON
        if '{' in text and '}' in text:
            start = text.find('{')
            end = text.rfind('}') + 1
            return text[start:end]
        
        # 如果都没有，返回原文本
        return text.strip()

    def _get_fallback_result(self, timestamp: float) -> Dict:
        """API失败时的降级结果"""
        return {
            'emotion_score': 50,
            'scene_type': 'unknown',
            'scene_description': 'API分析失败，使用默认值',
            'emotion_reasoning': '无法分析',
            'ad_suitable': True,
            'confidence': 0
        }