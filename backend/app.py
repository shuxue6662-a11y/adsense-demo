"""
Flask主程序
提供视频分析API
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import traceback
from config import Config
from services.video_analyzer import VideoAnalyzer
from services.ad_matcher import AdMatcher


app = Flask(__name__)
app.config.from_object(Config)
Config.init_app(app)
CORS(app)

# 初始化服务
video_analyzer = VideoAnalyzer()
ad_matcher = AdMatcher()


def allowed_file(filename):
    """检查文件类型"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS


@app.route('/')
def index():
    """API首页"""
    return jsonify({
        'name': 'AdSense Video Analysis API',
        'version': '1.0.0',
        'endpoints': {
            'analyze_preset': '/api/analyze/<scene_id>',
            'upload': '/api/upload',
            'health': '/api/health'
        }
    })


@app.route('/api/health')
def health_check():
    """健康检查"""
    return jsonify({
        'status': 'ok',
        'coze_configured': bool(Config.COZE_API_KEY and Config.COZE_BOT_ID)
    })


@app.route('/api/analyze/<scene_id>', methods=['GET'])
def analyze_preset_video(scene_id):
    """
    分析预设视频
    
    URL参数：
        scene_id: scene-high | scene-mid | scene-low
    """
    print(f"\n{'='*60}")
    print(f"[API] 收到分析请求: {scene_id}")
    print(f"{'='*60}\n")
    
    # 检查场景ID是否有效
    if scene_id not in Config.PRESET_VIDEOS:
        return jsonify({
            'success': False,
            'error': f'无效的场景ID: {scene_id}',
            'valid_ids': list(Config.PRESET_VIDEOS.keys())
        }), 400
    
    # 获取视频路径
    video_path = Config.PRESET_VIDEOS[scene_id]
    
    # 检查文件是否存在
    if not os.path.exists(video_path):
        return jsonify({
            'success': False,
            'error': f'视频文件不存在: {video_path}',
            'help': '请将视频文件放到 backend/videos/preset/ 目录下'
        }), 404
    
    try:
        # 分析视频
        result = video_analyzer.analyze_video(video_path)
        
        # 匹配广告（为每个AI决策点匹配广告）
        for decision in result['ad_decisions']['ai']:
            if decision['action'] == 'insert_smart_ad':
                ad_data = ad_matcher.match_ad(
                    emotion=decision['emotion'],
                    scene_type='',
                    timestamp=decision['time']
                )
                decision['ad_data'] = ad_data
        
        return jsonify({
            'success': True,
            'scene_id': scene_id,
            'data': result
        })
        
    except Exception as e:
        print(f"[API] 分析失败:")
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500


@app.route('/api/upload', methods=['POST'])
def upload_and_analyze():
    """
    上传并分析自定义视频
    
    表单参数：
        video: 视频文件
    """
    # 检查是否有文件
    if 'video' not in request.files:
        return jsonify({
            'success': False,
            'error': '没有上传文件'
        }), 400
    
    file = request.files['video']
    
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': '文件名为空'
        }), 400
    
    if not allowed_file(file.filename):
        return jsonify({
            'success': False,
            'error': '不支持的文件类型',
            'allowed': list(Config.ALLOWED_EXTENSIONS)
        }), 400
    
    try:
        # 保存文件
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        print(f"[API] 文件已保存: {filepath}")
        
        # 分析视频
        result = video_analyzer.analyze_video(filepath)
        
        # 匹配广告
        for decision in result['ad_decisions']['ai']:
            if decision['action'] == 'insert_smart_ad':
                ad_data = ad_matcher.match_ad(
                    emotion=decision['emotion'],
                    scene_type='',
                    timestamp=decision['time']
                )
                decision['ad_data'] = ad_data
        
        return jsonify({
            'success': True,
            'filename': filename,
            'data': result
        })
        
    except Exception as e:
        print(f"[API] 上传分析失败:")
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/video/<scene_id>')
def serve_video(scene_id):
    """提供视频文件"""
    if scene_id not in Config.PRESET_VIDEOS:
        return jsonify({'error': 'Invalid scene_id'}), 404
    
    video_path = Config.PRESET_VIDEOS[scene_id]
    
    if not os.path.exists(video_path):
        return jsonify({'error': 'Video file not found'}), 404
    
    return send_file(video_path, mimetype='video/mp4')


if __name__ == '__main__':
    print("\n" + "="*60)
    print("AdSense视频分析API服务器启动中...")
    print("="*60)
    print(f"环境: {Config.DEBUG and '开发' or '生产'}")
    print(f"地址: http://{Config.HOST}:{Config.PORT}")
    print(f"Coze已配置: {bool(Config.COZE_API_KEY)}")
    print("="*60 + "\n")
    
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )