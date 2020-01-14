//协议列表查询
export const commonContract = value => {
  const data = value && value.body && value.body !== "" ? value.body : {};
  return data;
};
