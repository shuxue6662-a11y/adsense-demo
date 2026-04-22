// ==================== 后端API调用封装 ====================

class VideoAPI {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
    }

    /**
     * 分析预设视频
     * @param {string} sceneId - 场景ID
     * @returns {Promise<object>}
     */
    async analyzePresetVideo(sceneId) {
        console.log('[Video API] 请求分析:', sceneId);
        
        try {
            const response = await fetch(`${this.baseURL}/analyze/${sceneId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('[Video API] 分析成功');
                return data.data;
            } else {
                throw new Error(data.error || '分析失败');
            }
        } catch (error) {
            console.error('[Video API] 请求失败:', error);
            throw error;
        }
    }

    /**
     * 上传并分析自定义视频
     * @param {File} videoFile - 视频文件
     * @returns {Promise<object>}
     */
    async uploadAndAnalyze(videoFile) {
        const formData = new FormData();
        formData.append('video', videoFile);

        try {
            const response = await fetch(`${this.baseURL}/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('[Video API] 上传失败:', error);
            throw error;
        }
    }

    /**
     * 健康检查
     * @returns {Promise<object>}
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return await response.json();
        } catch (error) {
            console.error('[Video API] 健康检查失败:', error);
            return { status: 'error', error: error.message };
        }
    }
}

// 创建全局实例
const videoAPI = new VideoAPI();