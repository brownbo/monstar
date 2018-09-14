import React from 'react';
import PropTypes from 'prop-types'
import {Form, Input, Modal, Select, Radio, InputNumber, Row, Col,message} from 'antd'
import Func from "../../utils/publicFunc"
import formRules from '../../utils/formRules'
import styles from "./app.css"

const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
}
class PageModal extends React.Component {
  state = {
    showTextarea: false,//是否显示失败原因输入框
    showAllocation: true,//是否显示调拨表单
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...this.props.form.getFieldsValue(),
      }

      if(this.props.doType){//调拨
        data.is_allocation = 1;
      }else{//审核与调拨
        if(!this.state.showTextarea)data.is_allocation = this.state.showAllocation?1:0;
        if(this.state.showAllocation)data.pass_count = data.allocation_count;
      }
      if(data.is_allocation){//调拨单填写
        data.examine_id = this.props.currentItem.id;
        data.allocation_out_id&&(data.allocation_out_id = data.allocation_out_id.key );
        if(data.allocation_out_id===data.allocation_in_id){
          message.info('调入网点不能和调出网点相同');
          return false;
        }
        const max = this.props.gift_search_data[0]?this.props.gift_search_data[0].stock:0;
        if(max===0){
          message.info('调出网点库存为0，请重新选择');
          return false;
        }
        if(data.allocation_count>max){
          message.info(`调出数量不能大于该网点库存总量(${max})`);
          return false;
        }
      };
      this.props.BtnOk(data)
    })
  }
  search_model_func_netspot = (value)=>{
    this.props.getSearch_dataFunc('netspot',{name:value});
  }
  searchGiftCount = (option)=>{
    this.props.searchGiftCount({
      gift_id:this.props.currentItem.gift.id,
      netspot_id:option.key
    })
  }
  render() {
    const {currentItem, doType,formProps,default_data, search_data,gift_search_data, ...modalProps} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {showTextarea, showAllocation} = this.state;
    const options = Func.getSelectOptions(search_data,default_data,true);
    const modalOpts = {
      onOk: this.handleOk,
      ...modalProps,
    }
    const max = gift_search_data[0]?gift_search_data[0].stock:0;
    return (
      <Modal {...modalOpts}>
        <Row>
          <Col span={12}>
            <div className='term'>申请编号</div>
            <div className='term_detail'>{currentItem.id}</div>
          </Col>
          <Col span={12}>
            <div className='term'>礼品名称</div>
            <div className='term_detail'>{currentItem.gift.name}</div>
          </Col>
          <Col span={12}>
            <div className='term'>申请网点</div>
            <div className='term_detail'>{currentItem.sub_netspot.name}</div>
          </Col>
          <Col span={12}>
            <div className='term'>申请数量</div>
            <div className='term_detail'>{currentItem._count}</div>
          </Col>

          <Col span={12}>
            <div className='term'>申请人</div>
            <div className='term_detail'>{currentItem.applicant?currentItem.applicant.name:''}</div>
          </Col>
          <Col span={12}>
            <div className='term'>申请时间</div>
            <div className='term_detail'>{Func.getDate_ymdhms(currentItem.application_time)}</div>
          </Col>
        </Row>
          {doType?
            <Row>

            <Col span={12}>
              <div className='term'>通过数量</div>
              <div className='term_detail'>{currentItem.pass_count}</div>
            </Col></Row>:""
          }

        <Form layout="horizontal" {...formProps}>
          {!doType?
          <FormItem label="审核结果" hasFeedback {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: 1,
              rules: [
                formRules.require,
              ],
            })(<Radio.Group onChange={e=> {
              this.setState({showTextarea: e.target.value === 2,showAllocation:true})
            }
            }>
              <Radio value={1}>通过</Radio>
              <Radio value={2}>不通过</Radio>
            </Radio.Group>)}
          </FormItem>:''}
          {showTextarea ? <FormItem label="不通过原因" hasFeedback {...formItemLayout}>
            {getFieldDecorator('option', {
              rules: [
                formRules.require,formRules.whitespace,
              ],
            })(<Input autosize={{minRows: 4, maxRows: 6}} type='textarea' placeholder="填写原因"/>)}
          </FormItem> :
          !doType?
            <FormItem label="调拨状态" hasFeedback {...formItemLayout}>
              {getFieldDecorator('doNow', {
                initialValue: 1,
                rules: [
                  formRules.require,
                ],
              })(<Radio.Group onChange={e=> {this.setState({showAllocation: e.target.value === 1})}}>
                <Radio value={1}>立即调拨</Radio>
                <Radio value={0}>稍后调拨</Radio>
              </Radio.Group>)}
            </FormItem>:''
          }
          {showAllocation&&!showTextarea ?
            <div className="my-border">
              <p className="alloca-text">调拨信息填写:</p>
              <FormItem label="礼品名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('gift_id', {
                  initialValue: currentItem.gift.id.toString(),
                })(
                  <Select disabled={true} className="allwidth">
                    <Option key ={0} value={currentItem.gift.id.toString()}>{currentItem.gift.name}</Option>
                  </Select>)
                }
              </FormItem>
              <FormItem label="调出网点" hasFeedback {...formItemLayout}>
                {getFieldDecorator('allocation_out_id', {
                  rules: [
                    formRules.require,
                  ],
                })(
                  <Select
                    className="allwidth"
                    onSearch={this.search_model_func_netspot}
                    showSearch
                    labelInValue
                    onChange={this.searchGiftCount}
                    filterOption={false}>
                    {options}
                  </Select>
                )}
              </FormItem>
              <FormItem label="调入网点" hasFeedback {...formItemLayout}>
                {getFieldDecorator('allocation_in_id', {
                  initialValue: currentItem.sub_netspot.id.toString(),
                })(
                  <Select disabled={true} className="allwidth">
                    <Option key ={0} value={currentItem.sub_netspot.id.toString()}>{currentItem.sub_netspot.name}</Option>
                  </Select>)
                }
              </FormItem>
              <FormItem label="调入数量" hasFeedback {...formItemLayout}>
                {getFieldDecorator('allocation_count', {
                  initialValue: doType?currentItem.pass_count:currentItem._count,
                  rules: [
                    formRules.require,
                  ],
                })(<InputNumber min={1} max={doType?currentItem.pass_count:currentItem._count} disabled={doType?true:false} className="allwidth" placeholder={doType?currentItem.pass_coun:(max?"调入数量1~"+max:'该网点库存为0，不能调拨')}/>)
                }
              </FormItem>
            </div>
            : !showTextarea?<FormItem label="通过数量" hasFeedback {...formItemLayout}>
              {getFieldDecorator('pass_count', {
                initialValue: currentItem._count,
                rules: [
                  formRules.require,
                ],
              })(<InputNumber min={1} max ={currentItem._count} className="allwidth" placeholder={'通过数量，最大不超过申请数量'}/>)
              }
            </FormItem>:''}

        </Form>
      </Modal>
    );
  }
}
;

PageModal.propTypes = {
  form: PropTypes.object,
  formProps: PropTypes.object,
  modalType: PropTypes.string,
}
export default Form.create()(PageModal)
