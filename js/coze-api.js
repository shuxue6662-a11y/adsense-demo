// ==================== Coze API 封装（修正版）====================

class CozeAPI {
    constructor() {
        this.apiUrl = CONFIG.COZE.API_URL;
        this.apiKey = CONFIG.COZE.API_KEY;
        this.botId = CONFIG.COZE.BOT_ID;
        this.userId = CONFIG.COZE.USER_ID;
        this.conversationId = null;
        this.messageHistory = [];
        
        console.log('[Coze API] 初始化配置:', {
            apiUrl: this.apiUrl,
            botId: this.botId,
            userId: this.userId,
            hasApiKey: !!this.apiKey
        });
    }

    /**
     * 发送消息到Coze
     * @param {string} message - 用户消息
     * @returns {Promise<string>} - AI回复
     */
    async sendMessage(message) {
        console.log('[Coze API] 发送消息:', message);
        
        // 如果未配置API或关闭了真实API，使用降级方案
        if (!CONFIG.USE_REAL_API || !this.apiKey || !this.botId) {
            console.log('[Coze API] 使用降级方案（预设回答）');
            return this.getFallbackResponse(message);
        }

        try {
            // 构建请求体（严格按照Coze API v3文档）
            const requestBody = {
                bot_id: this.botId,
                user_id: this.userId,
                stream: false, // 使用非流式响应，更容易调试
                auto_save_history: true, // 保存对话历史
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

            console.log('[Coze API] 请求体:', JSON.stringify(requestBody, null, 2));

            // 发送请求
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('[Coze API] 响应状态:', response.status);

            // 检查HTTP状态
            if (!response.ok) {
                const errorText = await response.text();
                console.error('[Coze API] HTTP错误:', response.status, errorText);
                throw new Error(`API请求失败: ${response.status} - ${errorText}`);
            }

            // 解析响应
            const data = await response.json();
            console.log('[Coze API] 响应数据:', JSON.stringify(data, null, 2));

            // 检查业务状态码
            if (data.code !== 0) {
                throw new Error(`API业务错误: ${data.code} - ${data.msg}`);
            }

            // 保存会话ID
            if (data.data && data.data.conversation_id) {
                this.conversationId = data.data.conversation_id;
                console.log('[Coze API] 会话ID:', this.conversationId);
            }

            // 获取Chat ID
            const chatId = data.data?.id;
            if (!chatId) {
                throw new Error('未获取到Chat ID');
            }

            console.log('[Coze API] Chat ID:', chatId);

            // 非流式响应需要轮询获取结果
            const aiReply = await this.pollChatResult(this.conversationId, chatId);
            
            // 保存到历史记录
            this.messageHistory.push({
                user: message,
                ai: aiReply,
                timestamp: Date.now()
            });

            return aiReply;

        } catch (error) {
            console.error('[Coze API] 调用失败:', error);
            // 失败时使用降级方案
            return this.getFallbackResponse(message);
        }
    }

    /**
     * 轮询获取对话结果（非流式响应专用）
     * @param {string} conversationId - 会话ID
     * @param {string} chatId - 对话ID
     * @returns {Promise<string>}
     */
    async pollChatResult(conversationId, chatId) {
        const maxAttempts = 30; // 最多轮询30次（30秒）
        const pollInterval = 1000; // 每次间隔1秒

        for (let i = 0; i < maxAttempts; i++) {
            await this.sleep(pollInterval);

            try {
                // 查询对话详情
                const statusUrl = `https://api.coze.cn/v3/chat/retrieve?conversation_id=${conversationId}&chat_id=${chatId}`;
                
                const statusResponse = await fetch(statusUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Accept': 'application/json'
                    }
                });

                if (!statusResponse.ok) {
                    console.warn('[Coze API] 查询对话状态失败:', statusResponse.status);
                    continue;
                }

                const statusData = await statusResponse.json();
                console.log(`[Coze API] 第${i+1}次轮询:`, statusData.data?.status);

                // 检查对话状态
                const status = statusData.data?.status;
                
                if (status === 'completed') {
                    // 对话完成，获取消息列表
                    return await this.getMessages(conversationId, chatId);
                } else if (status === 'failed' || status === 'canceled') {
                    throw new Error(`对话处理失败: ${status}`);
                } else if (status === 'in_progress') {
                    // 继续等待
                    continue;
                }

            } catch (error) {
                console.warn('[Coze API] 轮询出错:', error);
            }
        }

        throw new Error('获取对话结果超时');
    }

    /**
     * 获取对话消息
     * @param {string} conversationId - 会话ID
     * @param {string} chatId - 对话ID
     * @returns {Promise<string>}
     */
    async getMessages(conversationId, chatId) {
        try {
            const messagesUrl = `https://api.coze.cn/v3/chat/message/list?conversation_id=${conversationId}&chat_id=${chatId}`;
            
            const response = await fetch(messagesUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`获取消息失败: ${response.status}`);
            }

            const data = await response.json();
            console.log('[Coze API] 消息列表:', JSON.stringify(data, null, 2));

            // 提取AI回复
            return this.extractReplyFromMessages(data);

        } catch (error) {
            console.error('[Coze API] 获取消息失败:', error);
            throw error;
        }
    }

    /**
     * 从消息列表中提取AI回复
     * @param {object} data - 消息列表数据
     * @returns {string}
     */
    extractReplyFromMessages(data) {
        try {
            if (!data.data || !Array.isArray(data.data)) {
                throw new Error('消息列表格式错误');
            }

            // 找到最后一条assistant的answer消息
            const messages = data.data;
            const aiMessage = messages
                .reverse()
                .find(msg => msg.role === 'assistant' && msg.type === 'answer');

            if (!aiMessage || !aiMessage.content) {
                throw new Error('未找到AI回复消息');
            }

            // 解析content（可能是字符串或JSON）
            let content = aiMessage.content;
            if (typeof content === 'string') {
                try {
                    const parsed = JSON.parse(content);
                    content = parsed.content || parsed.text || content;
                } catch (e) {
                    // 不是JSON，直接使用
                }
            }

            return String(content);

        } catch (error) {
            console.error('[Coze API] 解析消息失败:', error);
            return '抱歉，我暂时无法回答这个问题。';
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
        console.log('[Coze API] 会话已重置');
    }

    /**
     * 获取对话历史
     * @returns {Array}
     */
    getHistory() {
        return this.messageHistory;
    }

    /**
     * 延迟函数
     * @param {number} ms - 毫秒
     * @returns {Promise}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 创建全局实例
const cozeAPI = new CozeAPI();