import moment from "moment";

function formatTime(time) {
  moment.locale("zh-cn");
  return moment(time).format("YYYY-MM-DD");
}

function formatTimeEnglish(time) {
  moment.locale("zh-cn");
  return moment(time).format("YYYY/MM/DD");
}

export default {
  formatTime,
  formatTimeEnglish
};
