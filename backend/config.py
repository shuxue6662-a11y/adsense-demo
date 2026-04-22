import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

class Config:
    """应用配置"""
    
    # Flask基础配置
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('FLASK_ENV') == 'development'
    
    # 文件上传配置
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100MB
    ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv'}
    
    # Coze API配置
    COZE_API_KEY = os.getenv('COZE_API_KEY')
    COZE_BOT_ID = os.getenv('COZE_BOT_ID')
    COZE_API_URL = 'https://api.coze.cn/v3/chat'
    
    # 预设视频路径
    PRESET_VIDEOS = {
        'scene-high': 'videos/preset/scene-high.mp4',
        'scene-mid': 'videos/preset/scene-mid.mp4',
        'scene-low': 'videos/preset/scene-low.mp4'
    }
    
    # 视频分析配置
    ANALYSIS_FPS = 1  # 每秒采样1帧
    CACHE_FOLDER = 'cache'
    
    # 服务器配置
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', 5000))

    @staticmethod
    def init_app(app):
        """初始化应用配置"""
        # 创建必要的文件夹
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(Config.CACHE_FOLDER, exist_ok=True)
        os.makedirs('videos/preset', exist_ok=True)