Page({
  data: {
    inputValue: '',
    scrollIntoViewId: '',
    showHistoryPanel: false,
    currentSessionId: null,
    sessionList: [
      {
        id: 1,
        timestamp: '2026-04-02 18:40',
        messages: [
          { id: 1, role: 'ai', content: '你好，我是你的食材助手。你可以问我食材搭配和烹饪建议。', timestamp: '2026-04-02 18:40' },
          { id: 2, role: 'user', content: '番茄炒蛋要不要加糖？', timestamp: '2026-04-02 18:41' },
          { id: 3, role: 'ai', content: '可以少量加一点，能提升番茄的鲜味。', timestamp: '2026-04-02 18:41' }
        ]
      },
      {
        id: 2,
        timestamp: '2026-04-01 20:15',
        messages: [
          { id: 1, role: 'ai', content: '你好，我是你的食材助手。你可以问我食材搭配和烹饪建议。', timestamp: '2026-04-01 20:15' },
          { id: 2, role: 'user', content: '牛肉适合和什么蔬菜一起炒？', timestamp: '2026-04-01 20:16' },
          { id: 3, role: 'ai', content: '青椒、洋葱和西兰花都很适合，口感和营养都不错。', timestamp: '2026-04-01 20:16' }
        ]
      },
      {
        id: 3,
        timestamp: '2026-03-31 19:30',
        messages: [
          { id: 1, role: 'ai', content: '你好，我是你的食材助手。你可以问我食材搭配和烹饪建议。', timestamp: '2026-03-31 19:30' },
          { id: 2, role: 'user', content: '鸡胸肉怎么做才不柴？', timestamp: '2026-03-31 19:31' },
          { id: 3, role: 'ai', content: '先腌制再快炒，或者低温煎熟后静置，会更嫩。', timestamp: '2026-03-31 19:31' }
        ]
      },
      {
        id: 4,
        timestamp: '2026-03-30 18:20',
        messages: [
          { id: 1, role: 'ai', content: '你好，我是你的食材助手。你可以问我食材搭配和烹饪建议。', timestamp: '2026-03-30 18:20' },
          { id: 2, role: 'user', content: '今晚做鱼，有什么简单做法？', timestamp: '2026-03-30 18:21' },
          { id: 3, role: 'ai', content: '清蒸最省事，姜丝葱段铺底，蒸 8 到 10 分钟即可。', timestamp: '2026-03-30 18:21' }
        ]
      },
      {
        id: 5,
        timestamp: '2026-03-29 12:10',
        messages: [
          { id: 1, role: 'ai', content: '你好，我是你的食材助手。你可以问我食材搭配和烹饪建议。', timestamp: '2026-03-29 12:10' },
          { id: 2, role: 'user', content: '适合便当的家常菜推荐一下。', timestamp: '2026-03-29 12:11' },
          { id: 3, role: 'ai', content: '土豆烧鸡丁和西兰花炒胡萝卜都很适合，放凉后也好吃。', timestamp: '2026-03-29 12:11' }
        ]
      }
    ],
    chatList: [],
    historyList: []
  },

  onLoad() {
    this.initCurrentSession();
  },

  onReady() {
    this.scrollToBottom();
  },

  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  onNewSessionTap() {
    const timestamp = this.getNowTimestamp();
    const newSession = {
      id: Date.now(),
      timestamp,
      messages: [
        {
          id: 1,
          role: 'ai',
          content: '你好，我是你的食材助手。你可以问我食材搭配和烹饪建议。',
          timestamp
        }
      ]
    };
    const sessionList = [newSession, ...this.data.sessionList];
    this.setData({
      inputValue: '',
      showHistoryPanel: false,
      sessionList
    }, () => {
      this.switchSession(newSession.id);
      this.refreshHistoryList();
      this.scrollToBottom();
    });
  },

  scrollToBottom() {
    const { chatList } = this.data;
    if (!chatList.length) {
      return;
    }
    const lastMessage = chatList[chatList.length - 1];
    this.setData({
      scrollIntoViewId: `chat-item-${lastMessage.id}`
    });
  },

  onSendTap() {},

  onHistoryTap() {
    this.refreshHistoryList();
    this.setData({
      showHistoryPanel: !this.data.showHistoryPanel
    });
  },

  onSelectHistory(e) {
    const { id } = e.currentTarget.dataset;
    this.switchSession(Number(id));
    this.setData({
      showHistoryPanel: false
    }, () => {
      this.scrollToBottom();
    });
  },

  onDeleteHistory(e) {
    const { id } = e.currentTarget.dataset;
    const deleteId = Number(id);
    const nextSessionList = this.data.sessionList.filter(session => session.id !== deleteId);
    if (!nextSessionList.length) {
      this.setData({
        sessionList: [],
        historyList: [],
        currentSessionId: null,
        chatList: [],
        showHistoryPanel: false
      });
      return;
    }
    const sortedSessionList = this.getSortedSessionList(nextSessionList);
    const nextCurrentId = this.data.currentSessionId === deleteId
      ? sortedSessionList[0].id
      : this.data.currentSessionId;
    const nextCurrentSession = sortedSessionList.find(item => item.id === nextCurrentId) || sortedSessionList[0];
    this.setData({
      sessionList: sortedSessionList,
      currentSessionId: nextCurrentSession.id,
      chatList: nextCurrentSession.messages
    }, () => {
      this.refreshHistoryList();
      this.scrollToBottom();
    });
  },

  initCurrentSession() {
    const sortedSessionList = this.getSortedSessionList(this.data.sessionList);
    const latestSession = sortedSessionList[0] || null;
    this.setData({
      sessionList: sortedSessionList,
      currentSessionId: latestSession ? latestSession.id : null,
      chatList: latestSession ? latestSession.messages : []
    }, () => {
      this.refreshHistoryList();
    });
  },

  switchSession(sessionId) {
    const targetSession = this.data.sessionList.find(item => item.id === sessionId);
    if (!targetSession) {
      return;
    }
    this.setData({
      currentSessionId: targetSession.id,
      chatList: targetSession.messages
    });
  },

  refreshHistoryList() {
    const historyList = this.getSortedSessionList(this.data.sessionList).map(session => {
      const lastUserMessage = [...session.messages].reverse().find(message => message.role === 'user');
      return {
        id: session.id,
        timestamp: session.timestamp,
        lastQuestion: lastUserMessage ? lastUserMessage.content : '新的会话'
      };
    });
    this.setData({
      historyList
    });
  },

  getSortedSessionList(list) {
    return [...list].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  getNowTimestamp() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}`;
  }
});
