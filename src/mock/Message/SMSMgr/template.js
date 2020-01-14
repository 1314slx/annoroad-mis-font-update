//模板管理
export const getTemplateData = data => {
  return [
    {
      key: 0,
      id: "123",
      time: "2017-01-16 14:00:01",
      type: 2,
      typeText: "通知类",
      content:
        "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
      remarks: "备注备注备注备注备注备注",
      status: "审核中",
      action: false
    },
    {
      key: 1,
      id: "123",
      time: "2017-01-16 14:00:01",
      type: 1, //短信类型
      typeText: "验证码类", //短信类型，列表展示文字
      content: "内容内容内容内容内容",
      remarks: "备注备注备注备注备注备注",
      status: "审核成功",
      action: false
    },
    {
      key: 2,
      id: "123",
      time: "2017-01-16 14:00:01",
      type: 1,
      typeText: "验证码类",
      content: "内容内容内容内容内容",
      remarks: "备注备注备",
      status: "审核失败",
      action: true,
      reason: "失败原因"
    },
    {
      key: 3,
      id: "123",
      time: "2017-01-16 14:00:01",
      type: 2,
      typeText: "通知类",
      content: "内容内容内容内容内容",
      remarks: "备注备注备",
      status: "审核失败",
      action: true,
      reason: "失败原因"
    }
  ];
};
