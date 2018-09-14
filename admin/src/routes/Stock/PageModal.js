import React from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Modal,Select,InputNumber} from 'antd'
import Func from "../../utils/publicFunc"
import formRules from '../../utils/formRules'
const FormItem  = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
class PageModal extends React.Component {
  constructor(props) {
    super(props);
    this.isSearchNull_gift = true;
    this.isSearchNull_gifttype = true;
    this.isSearchNull_netspot = true;
  }
  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...this.props.form.getFieldsValue(),
        status:1,
        active_type:0,
        sign_time:new Date(),
      }
      data.sign_count = data.allocation_count;
      data.gift_type_id&&(data.gift_type_id = data.gift_type_id.key);
      data.gift_id&&(data.gift_id = data.gift_id.key);
      data.allocation_in_id = this.props.default_data[2][0].id;

      this.props.BtnOk(data)
    })
  }
  search_model_func_gift = (value)=> {
    this.isSearchNull_gift = value==='';
    this.props.getSearch_dataFunc('gift',{name:value,gift_type_id:this.gift_type});
  }
  search_model_func_netspot = (value)=> {
    this.isSearchNull_netspot = value==='';
    this.props.getSearch_dataFunc('netspot',{name:value,is_parent:1});
  }
  search_gifts_gifttype = (option)=> {
    this.gift_type = option.key;
    this.props.getSearch_dataFunc('gift',{gift_type_id:option.key});
  }
  search_model_func_giftType = (value)=>{
    this.isSearchNull_gifttype = value==='';
    this.props.getSearch_dataFunc('gift_type',{name:value});
  }
  render() {
    const {formProps,modalType,default_data, search_data,...modalProps} = this.props;
    const { getFieldDecorator} = this.props.form;
    let options = [];
    options[0] = Func.getSelectOptions(search_data[0], default_data[0], this.isSearchNull_gifttype);
    options[1] = Func.getSelectOptions(search_data[1], [], this.isSearchNull_gift);
    //options[2] = Func.getSelectOptions(search_data[2],default_data[2], this.isSearchNull_netspot);

    const modalOpts = {
        onOk:this.handleOk,
        ...modalProps,
    }
    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal" {...formProps}>
          <FormItem label="礼品分类" hasFeedback {...formItemLayout}>
            {getFieldDecorator('gift_type_id', {
              rules: [
                formRules.require,
              ],
            })(<Select
              className="allwidth"
              onSearch={this.search_model_func_giftType}
              showSearch
              onChange = {this.search_gifts_gifttype}
              labelInValue//必须加，不然只显示选择数据的id
              filterOption={false}>
              {options[0]}
            </Select>)
            }
          </FormItem>
          <FormItem label="礼品名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('gift_id', {
              rules: [
                formRules.require,
              ],
            })(<Select
              className="allwidth"
              onSearch={this.search_model_func_gift}
              showSearch
              labelInValue//必须加，不然只显示选择数据的id
              filterOption={false}>
              {options[1]}
            </Select>)
            }
          </FormItem>
          <FormItem label="入库数量" hasFeedback {...formItemLayout}>
            {getFieldDecorator('allocation_count', {
              rules: [
                formRules.require,
              ],
            })(<InputNumber min={1}  className="allwidth" placeholder="入库数量"/>)}
          </FormItem>
          <FormItem label="入库总网点" hasFeedback {...formItemLayout}>
            {getFieldDecorator('allocation_in_id', {
              initialValue: default_data[2].length?default_data[2][0].name:'',
            })(<Input disabled = {true}/>)
            }
          </FormItem>
        </Form>
      </Modal>
    );
  }
};

PageModal.propTypes = {
  form: PropTypes.object,
  formProps: PropTypes.object,
  modalType: PropTypes.string,
}
export default Form.create()(PageModal)
