// ==================== Coze API 封装 ====================

class CozeAPI {
    constructor() {
        this.apiUrl = CONFIG.COZE.API_URL;
        this.apiKey = CONFIG.COZE.API_KEY;
        this.botId = CONFIG.COZE.BOT_ID;
        this.userId = CONFIG.COZE.USER_ID;
        this.conversationId = null;
        this.messageHistory = [];
    }

    /**
     * 发送消息到Coze
     * @param {string} message - 用户消息
     * @returns {Promise<string>} - AI回复
     */
    async sendMessage(message) {
        // 如果未配置API或关闭了真实API，使用降级方案
        if (!CONFIG.USE_REAL_API || !this.apiKey || !this.botId) {
            return this.getFallbackResponse(message);
        }

        try {
            // 构建请求体
            const requestBody = {
                bot_id: this.botId,
                user_id: this.userId,
                stream: false,
                auto_save_history: true,
                additional_messages: [
                    {
                        role: 'user',
                        content: message,
                        content_type: 'text'
                    }
                ]
            };

            // 如果有会话ID，继续之前的对话
            if (this.conversationId) {
                requestBody.conversation_id = this.conversationId;
            }

            // 发送请求
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();

            // 保存会话ID
            if (data.conversation_id) {
                this.conversationId = data.conversation_id;
            }

            // 提取AI回复
            const aiReply = this.extractReply(data);
            
            // 保存到历史记录
            this.messageHistory.push({
                user: message,
                ai: aiReply,
                timestamp: Date.now()
            });

            return aiReply;

        } catch (error) {
            console.error('Coze API调用失败:', error);
            // 失败时使用降级方案
            return this.getFallbackResponse(message);
        }
    }

    /**
     * 从API响应中提取回复内容
     * @param {object} data - API响应数据
     * @returns {string}
     */
    extractReply(data) {
        try {
            // Coze API v3响应结构
            if (data.messages && data.messages.length > 0) {
                // 找到最后一条AI回复
                const aiMessage = data.messages
                    .reverse()
                    .find(msg => msg.role === 'assistant' && msg.type === 'answer');
                
                if (aiMessage && aiMessage.content) {
                    return aiMessage.content;
                }
            }

            // 如果没有找到有效回复
            throw new Error('未找到有效的AI回复');

        } catch (error) {
            console.error('解析AI回复失败:', error);
            return '抱歉，我现在有点卡顿，请稍后再试。';
        }
    }

    /**
     * 降级方案：使用预设回答
     * @param {string} message - 用户消息
     * @returns {string}
     */
    getFallbackResponse(message) {
        const msg = message.toLowerCase().trim();

        // 遍历预设回答，找到匹配的关键词
        for (const [keyword, response] of Object.entries(CONFIG.FALLBACK_RESPONSES)) {
            if (keyword === 'default') continue;
            
            if (msg.includes(keyword) || msg.includes(keyword.toLowerCase())) {
                return response;
            }
        }

        // 如果没有匹配，返回默认回答
        return CONFIG.FALLBACK_RESPONSES.default;
    }

    /**
     * 重置会话
     */
    resetConversation() {
        this.conversationId = null;
        this.messageHistory = [];
    }

    /**
     * 获取对话历史
     * @returns {Array}
     */
    getHistory() {
        return this.messageHistory;
    }
}

// 创建全局实例
const cozeAPI = new CozeAPI();