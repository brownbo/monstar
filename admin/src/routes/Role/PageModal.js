import React from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Modal,Select,Radio } from 'antd'
import Func from "../../utils/publicFunc"
import formRules from '../../utils/formRules'
import menu from "../../utils/menu"
import CheckGp from "./CheckGp"

const FormItem  = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}
class PageModal extends React.Component {
  constructor(props) {
    super(props);


  }
  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...this.props.form.getFieldsValue(),
      }
      this.props.BtnOk(data)
    })
  }
  render() {
    const { formProps,modalType,...modalProps} = this.props;
    const { getFieldDecorator} = this.props.form;
    const item = this.props.item;

    const modalOpts = {
        onOk:this.handleOk,
        ...modalProps,
    }
    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal" {...formProps}>
          <FormItem label="角色名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input  placeholder="角色名称"/>)}
          </FormItem>
          <FormItem label="是否可用" hasFeedback {...formItemLayout}>
            {getFieldDecorator('enabled', {
              initialValue: item.enabled,
              rules: [
                formRules.require,
              ],
            })(<Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={0}>禁用</Radio>
            </Radio.Group>)}
          </FormItem>
          <FormItem label="权限" hasFeedback {...formItemLayout}>
            {menu.map(item=>{
              const props = {
                checkListChange:this.props.checkedListChange,
                deleteMenuChecked:this.props.deleteMenuChecked,
                checkedList:this.props.checkedList[item.key]?this.props.checkedList[item.key]:[],//选中的checkbox key
                parentCheckd:this.props.checkedList[item.key]===undefined?false:true,//菜单栏目
                Options_parent:{label:item.name,value:item.key},//菜单栏目
                Options_child:item.child?item.child.map(obj=>({label:obj.name,value:obj.key})):[],//菜单子栏目
              }
              return (<CheckGp key={item.key} {...props}/>)
            })}
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
