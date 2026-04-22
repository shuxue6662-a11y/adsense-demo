"""
视频分析核心服务
使用OpenCV提取视频帧，调用Coze Vision分析
"""

import cv2
import base64
import numpy as np
import os
import json
import hashlib
from typing import Dict, List, Optional, Callable
from services.coze_vision import CozeVisionAnalyzer
from config import Config


class VideoAnalyzer:
    """视频分析器"""
    
    def __init__(self):
        self.coze_vision = CozeVisionAnalyzer()
        self.cache_dir = Config.CACHE_FOLDER
        
    def analyze_video(
        self, 
        video_path: str, 
        progress_callback: Optional[Callable] = None
    ) -> Dict:
        """
        完整分析视频
        
        Args:
            video_path: 视频文件路径
            progress_callback: 进度回调函数
            
        Returns:
            分析结果字典
        """
        print(f"\n{'='*60}")
        print(f"[Video Analyzer] 开始分析视频: {video_path}")
        print(f"{'='*60}\n")
        
        # 检查缓存
        cache_key = self._get_cache_key(video_path)
        cached_result = self._load_from_cache(cache_key)
        if cached_result:
            print("[Video Analyzer] 使用缓存结果")
            return cached_result
        
        # 打开视频
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise Exception(f"无法打开视频文件: {video_path}")
        
        # 获取视频信息
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        print(f"视频信息:")
        print(f"  时长: {duration:.2f}秒")
        print(f"  帧率: {fps:.2f} FPS")
        print(f"  总帧数: {total_frames}")
        print(f"  分辨率: {width}x{height}\n")
        
        # 初始化结果
        result = {
            'video_info': {
                'duration': duration,
                'fps': fps,
                'total_frames': total_frames,
                'width': width,
                'height': height
            },
            'emotion_curve': [],
            'scenes': [],
            'ad_decisions': {
                'traditional': [],
                'ai': []
            }
        }
        
        # 采样间隔（每秒采样Config.ANALYSIS_FPS帧）
        sample_interval = int(fps / Config.ANALYSIS_FPS)
        frame_count = 0
        analyzed_count = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # 每隔sample_interval帧采样一次
            if frame_count % sample_interval == 0:
                timestamp = frame_count / fps
                
                # 分析当前帧
                try:
                    analysis = self._analyze_single_frame(frame, timestamp, result['emotion_curve'])
                    
                    result['emotion_curve'].append({
                        'time': round(timestamp, 1),
                        'emotion': analysis['emotion_score'],
                        'description': analysis['scene_description'],
                        'scene_type': analysis['scene_type'],
                        'confidence': analysis.get('confidence', 0)
                    })
                    
                    analyzed_count += 1
                    
                    # 进度回调
                    if progress_callback:
                        progress = (frame_count / total_frames) * 100
                        progress_callback({
                            'progress': progress,
                            'current_time': timestamp,
                            'analyzed_frames': analyzed_count,
                            'latest_emotion': analysis['emotion_score']
                        })
                    
                    print(f"[{timestamp:6.1f}s] 情绪: {analysis['emotion_score']:3d}/100 | "
                          f"场景: {analysis['scene_type']:15s} | "
                          f"描述: {analysis['scene_description'][:30]}")
                    
                except Exception as e:
                    print(f"[{timestamp:6.1f}s] 分析失败: {e}")
            
            frame_count += 1
        
        cap.release()
        
        print(f"\n分析完成！共分析 {analyzed_count} 帧")
        
        # 生成广告决策
        result['ad_decisions'] = self._generate_ad_decisions(result['emotion_curve'])
        
        # 保存到缓存
        self._save_to_cache(cache_key, result)
        
        return result
    
    def _analyze_single_frame(
        self, 
        frame: np.ndarray, 
        timestamp: float,
        previous_results: List[Dict]
    ) -> Dict:
        """分析单帧"""
        
        # 将帧转为base64
        frame_base64 = self._frame_to_base64(frame)
        
        # 构建上下文（使用前面的分析结果）
        context = self._build_context(previous_results)
        
        # 调用Coze Vision分析
        analysis = self.coze_vision.analyze_frame(frame_base64, timestamp, context)
        
        return analysis
    
    def _frame_to_base64(self, frame: np.ndarray) -> str:
        """将OpenCV帧转为base64编码"""
        # 调整大小以减少传输量（保持宽高比）
        max_size = 1024
        height, width = frame.shape[:2]
        
        if width > max_size or height > max_size:
            if width > height:
                new_width = max_size
                new_height = int(height * (max_size / width))
            else:
                new_height = max_size
                new_width = int(width * (max_size / height))
            
            frame = cv2.resize(frame, (new_width, new_height))
        
        # 编码为JPEG
        _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
        
        # 转为base64
        frame_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return f"data:image/jpeg;base64,{frame_base64}"
    
    def _build_context(self, previous_results: List[Dict]) -> str:
        """构建上下文信息"""
        if not previous_results:
            return ""
        
        # 取最近3个分析结果
        recent = previous_results[-3:]
        
        context_parts = []
        for item in recent:
            context_parts.append(
                f"- {item['time']:.1f}s: 情绪{item['emotion']}分, {item['description']}"
            )
        
        return "最近的分析结果:\n" + "\n".join(context_parts)
    
    def _generate_ad_decisions(self, emotion_curve: List[Dict]) -> Dict:
        """根据情绪曲线生成广告决策"""
        
        decisions = {
            'traditional': [],  # 传统广告决策
            'ai': []            # AI智能决策
        }
        
        for i, point in enumerate(emotion_curve):
            time = point['time']
            emotion = point['emotion']
            
            # 传统模式：每15秒固定插入
            if int(time) % 15 == 0 and time > 0:
                decisions['traditional'].append({
                    'time': time,
                    'action': 'force_insert',
                    'reason': f'固定时间点插播（第{int(time)}秒）'
                })
            
            # AI模式决策
            if emotion > 70:
                # 高情绪：延迟广告
                decisions['ai'].append({
                    'time': time,
                    'action': 'delay',
                    'emotion': emotion,
                    'reason': f'情绪强度{emotion}分，超过70分阈值，延迟广告插播'
                })
            elif emotion < 30:
                # 低情绪：检查是否是从高情绪转为低情绪
                if i > 0 and emotion_curve[i-1]['emotion'] > 50:
                    decisions['ai'].append({
                        'time': time,
                        'action': 'insert_smart_ad',
                        'emotion': emotion,
                        'reason': f'黄金时机：情绪从高降至{emotion}分',
                        'ad_type': self._determine_ad_type(time, point)
                    })
        
        return decisions
    
    def _determine_ad_type(self, time: float, point: Dict) -> str:
        """判断广告类型"""
        hour = int(time // 3600)
        
        # 深夜时段推荐美食
        if 23 <= hour or hour < 6:
            return 'food'
        
        # 根据场景类型推荐
        scene_type = point.get('scene_type', '').lower()
        if 'action' in scene_type or 'game' in scene_type:
            return 'game'
        
        return 'general'
    
    def _get_cache_key(self, video_path: str) -> str:
        """生成缓存键"""
        # 使用文件路径+修改时间生成唯一键
        stat = os.stat(video_path)
        key_string = f"{video_path}_{stat.st_mtime}_{stat.st_size}"
        return hashlib.md5(key_string.encode()).hexdigest()
    
    def _load_from_cache(self, cache_key: str) -> Optional[Dict]:
        """从缓存加载"""
        cache_file = os.path.join(self.cache_dir, f"{cache_key}.json")
        
        if os.path.exists(cache_file):
            try:
                with open(cache_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"[Cache] 加载失败: {e}")
        
        return None
    
    def _save_to_cache(self, cache_key: str, data: Dict):
        """保存到缓存"""
        cache_file = os.path.join(self.cache_dir, f"{cache_key}.json")
        
        try:
            with open(cache_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"[Cache] 结果已缓存: {cache_file}")
        except Exception as e:
            print(f"[Cache] 保存失败: {e}")