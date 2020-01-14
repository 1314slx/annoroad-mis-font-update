//融资渠道列表
export const setChannelList = value => {
  const data =
    value && value.body && value.body !== "" ? value.body.datas : false;
  if (!data) {
    return {
      body: {
        datas: []
      }
    };
  }
  //列表数据
  const channelList = [];

  data.map((value, index) => {
    channelList.push({
      key: index,
      ...value
    });
  });

  value.body.datas = channelList;

  return value.body;
};
