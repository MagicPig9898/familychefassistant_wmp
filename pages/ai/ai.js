Page({
  data: {
    inputValue: '',
    chatList: [
      {
        id: 1,
        role: 'ai',
        content: '你好，我是你的食材助手。你可以问我食材搭配和烹饪建议。'
      },
      {
        id: 2,
        role: 'user',
        content: '今天晚饭推荐什么？'
      },
      {
        id: 3,
        role: 'ai',
        content: '可以试试清炒时蔬加蒸鱼，清淡又省时。'
      }
    ]
  },

  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  onNewSessionTap() {
    this.setData({
      inputValue: '',
      chatList: [
        {
          id: 1,
          role: 'ai',
          content: '你好，我是你的食材助手。你可以问我食材搭配和烹饪建议。'
        }
      ]
    });
  },

  onSendTap() {},

  onHistoryTap() {}
});
