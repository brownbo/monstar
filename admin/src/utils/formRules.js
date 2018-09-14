
/**
 * Created by 郑银华 on 2017/12/20.
 */

/**
 * form表单验证规则和提示语句集合
 */
module.exports = {
  require: {
    required: true,
    message:'该项内容不能为空'
  },
  whitespace: {
    whitespace: true,
    message:'不能以空格开头'
  },
  dOrW: {
    pattern:/^[\d\w]+$/,
    message:'只能是数字或字母,不能含有其他非法字符，如空格'
  },
  url:{
    type:'url',
    message:'网址格式错误.eg:www.a.com'
  },
  intAndzero:{
    pattern:/^[0-9]*[0-9][0-9]*$/,
    message:'请输入大于或等于0的整数',
  },
  longlat:{
    pattern:/^[0-9]+.?[0-9]+,[0-9]+.?[0-9]+$/,
    message:'格式错误，参考（120.12,33.33）',
  },
  phoneNo:{
    pattern:/^[1][0-9]{10}$/,
    message:'手机号格式不正确',
  },
  idCard:{
    pattern:/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    message:'证件号码格式不正确',
  },
  passport:{
    pattern:/^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8,10})$/,
    message:'证件号码格式不正确',
  },
  disCount:{
    pattern:/^((0\.[1-9]{1})|10|(([1-9]{1})(\.\d{1})?))$/,
    message:'折扣格式不正确',
  },
  pwdLength6:{
    pattern:/^[\S]{6,}$/,
    message:'请输入6位及以上密码',
  },
}



