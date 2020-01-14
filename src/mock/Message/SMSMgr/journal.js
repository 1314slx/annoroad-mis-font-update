/**
 * 计费条数
 * */

import { concealment } from "../../../utils/utils";

export const getJournalData = data => {
  return [
    {
      key: 0,
      time: "2017-01-16 14:00:01",
      sendStatus: "发送完成",
      sendOut: true,
      content:
        "短信内容短信内容短信内容短信内容短信内容短信内容短信内容短信内容",
      phone: concealment("18511550798"),
      receiveStatus: "接收成功",
      action: false,
      number: 2
    },
    {
      key: 1,
      time: "2017-01-16 14:00:01",
      sendStatus: "发送失败",
      sendOut: false, //只有发送失败 false
      content: "短信内容短信内容",
      sendReason: "失败原因",
      phone: "137****8536",
      receiveStatus: "等待返回",
      action: false,
      number: 1
    },
    {
      key: 2,
      time: "2017-01-16 14:00:01",
      sendStatus: "发送中",
      sendOut: true,
      content: "短信内容",
      phone: "137****8536",
      receiveStatus: "接收失败",
      action: true, //只有接收失败是true
      receiveReason: "失败原因",
      number: 1
    }
  ];
};
