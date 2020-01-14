/**
 * 存放正则，提供给antd直接使用
 * */

//必须是数字加字母
export const LETTERS_NUMBERS = /^(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]+$/;

//手机号验证
export const CELL_NUMBER = /^.{11}$/;

//密码位数验证
export const PASSWORD = /^[A-Za-z0-9]{6,16}$/;
export const CHECK_WORD_ThIRTY = /^[\s\S]{0,30}$/;
export const CHECK_WORD_FORTY = /^[\s\S]{0,40}$/;
export const CHECK_WORD_FIFTY = /^[\s\S]{1,50}$/;
export const CHECK_WORD_FORTYHUND = /^[\s\S]{0,400}$/;

//8~16位数字、字母或符号组合
export const BOSS_PWD = /((?=.*[0-9])(?=.*[A-z]))|((?=.*[A-z])(?=.*[^A-z0-9]))|((?=.*[0-9])(?=.*[^A-z0-9]))^.{6,16}$/;


// 提交任务校验输入输出是否含有特殊字符
export const CHECK_SUBMIT_TASK =  "^[^\\*|\\|\\$|\\[|\\]|\\+|\\&|\\%|\\#|\\!|\\~|`|'|\\|‘|’|“|”|\"|\\(|\\)|（|）|\\r|\\n|\\s]";
export const CHECK_SUBMIT_TASKOUT =  /^[^\*|\\|\$|\[|\]|\+|\&|\%|\#|\!|\~|`|'|\|‘|’|“|”|"|\(|\)|（|）|\r|\n|\s]+$/;
export const CHECK_RENAME = /^[^\*|\\|\$|\[|\]|\+|\&|\%|\#|\!|\~|`|'|\|‘|’|“|”|"|\(|\)|（|）|\r|\n|\s]+$/;
///正整数
export const CHECK_INTEGER = /^\+?[1-9][0-9]*$/;
//校验输入1-2位正整数  /*// ^(?!0)\d{1,20}$  // 或者  ^[1-9]\d{0,19}$*/
export const CHECK_TWO_NUM = /^[0-9]\d{0,1}$/;
