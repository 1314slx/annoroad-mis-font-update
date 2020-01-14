//签名管理数据
export const getSignatureData = data => {
  return [
    {
      key: 0,
      time: "2017-01-16 14:00:01",
      name: "梦哆啦1",
      age: 17,
      status: "审核中",
      action: false
    },
    {
      key: 1,
      time: "2017-01-16 14:00:01",
      name: "梦哆啦2",
      age: 18,
      status: "审核成功",
      action: false
    },
    {
      key: 2,
      time: "2017-01-16 14:00:01",
      name: "梦哆啦3",
      age: 17,
      status: "审核失败",
      action: true, //只有审核失败是true
      reason: "失败原因失败原因"
    }
  ];
};
