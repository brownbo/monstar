import React from 'react';
import PropTypes from 'prop-types'
import {Form, Input, Modal, Select, InputNumber, Tabs, Radio, Spin, message, Icon} from 'antd'
import Func from "../../utils/publicFunc"
import formRules from '../../utils/formRules'
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

function debounce(func, delay = 100) {
  let timer = null;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, arguments), delay);
  }
}

class PageModal extends React.Component {
  state = {
    tab: 0,
  }

  constructor(props) {
    super(props);
    this.searchGiftOpts = {gift_id:'',netspot_id:''};
    this.timer = null;//防抖计时器
  }

  handleOk = () => {
    const tab = this.state.tab;
    const modalType = this.props.modalType;
    if (modalType === 'create' && tab === 0 && this.props.btnDisabled) {
      message.info('该申请单当前状态无法调拨，请重新输入!');
      return;
    }
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...this.props.form.getFieldsValue(),
      }
      if (modalType === 'create' && this.state.tab === 1) {
        data.gift_id = data.gift_id_;
        data.allocation_out_id = data.allocation_out_id_;
        data.allocation_in_id = data.allocation_in_id_;
        data.allocation_count = data.allocation_count_;
        data.active_type = data.active_type_;
        delete data['gift_id_'];
        delete data['allocation_out_id_'];
        delete data['allocation_in_id_'];
        delete data['allocation_count_'];
        delete data['active_type_'];
        data.status = 0;
        data.create_time = new Date().getTime();
      }
      if (data.allocation_out_id === data.allocation_in_id) {
        message.info('调出、调入网点不能相同');
        return;
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

      data.allocation_out_id&&(data.allocation_out_id = data.allocation_out_id.key);
      data.allocation_in_id&&(data.allocation_in_id = data.allocation_in_id.key);
      data.gift_id&&(data.gift_id = data.gift_id.key);

      this.props.BtnOk(data)
    })
  }
  handleTab = (key)=> {
    this.props.resetFileds();
    this.setState({tab: parseInt(key)});
  }
  search_model_func_gift = (value)=> {
    this.props.getSearch_dataFunc('gift', {name:value});
  }
  search_model_func_netspot = (value)=> {
    this.props.getSearch_dataFunc('netspot', {name:value});
  }
  handleSearchGift = (e)=>{
    const value = e.target.value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() =>{
      if (value) {
        this.props.form.resetFields(['allocation_out_id']);
        this.props.getExamineDetailByID(value);
      }
    }, 500);
  }
  searchGiftCount_netspot = (option)=> {
    const {currentItem, modalType} = this.props;
    const {tab} = this.state;
    let obj = {};
    if (modalType === 'create') {
      if (tab === 0) {
        const gift_id = this.props.form.getFieldsValue(['gift_id']).gift_id;
        obj.gift_id = gift_id?gift_id.key:'';
      } else {
        const gift_id = this.props.form.getFieldsValue(['gift_id_']).gift_id_;
        obj.gift_id = gift_id?gift_id.key:'';
      }
    } else {
      obj.gift_id = currentItem.gift.id;
    }
    obj.allocation_out_id = option.key;
    this.props.searchGiftCount({
      gift_id:obj.gift_id,
      netspot_id:obj.allocation_out_id
    })

  }
  searchGiftCount_gift = (option)=> {
    const {tab} = this.state;
    let obj = {};
    if (tab === 0) {
      obj = this.props.form.getFieldsValue(['allocation_out_id']);
    } else {
      const allocation_out_id = this.props.form.getFieldsValue(['allocation_out_id_']).allocation_out_id_;
      obj.allocation_out_id = allocation_out_id?allocation_out_id.key:'';
    }
    obj.gift_id = option.key;
    this.props.searchGiftCount({
      gift_id:obj.gift_id,
      netspot_id:obj.allocation_out_id
    })
  }

  render() {
    const {formProps, currentItem, modalType, SearchLoading, gift_search_data,ExamineObj, default_data, search_data, ...modalProps} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {tab} = this.state;
    const modalOpts = {
      onOk: this.handleOk,
      ...modalProps,
    }
    let options = [];
    if (Object.keys(ExamineObj).length) {
      options[0] = Func.getSelectOptions(search_data[0], default_data[0], true, ExamineObj.gift, ExamineObj.gift.id);
      options[1] = Func.getSelectOptions(search_data[1], default_data[1], true);
      options[2] = Func.getSelectOptions(search_data[1], default_data[1], true, ExamineObj.sub_netspot, ExamineObj.sub_netspot.id);
    } else {
      options[0] = Func.getSelectOptions(search_data[0], default_data[0], true);
      options[1] = Func.getSelectOptions(search_data[1], default_data[1], true);
      options[2] = Func.getSelectOptions(search_data[1], default_data[1], true);
    }
    if (modalType === 'update') {
      options[3] = Func.getSelectOptions(search_data[1], default_data[1], true, currentItem.allocation_out, currentItem.allocation_out_id);
      options[4] = Func.getSelectOptions(search_data[1], default_data[1], true, ExamineObj.allocation_in, ExamineObj.allocation_in_id);
    }
    const max = gift_search_data[0]?gift_search_data[0].stock:0;
    return (
      <Modal {...modalOpts}>
        {modalType === 'create' ?
          <Form layout="horizontal" {...formProps}>
            <Tabs defaultActiveKey="0" size="small" onChange={this.handleTab}>
              <TabPane tab={<span><Icon type="retweet"/>申请审核调拨</span>} key="0">
                {!tab ?
                  <div>
                    <Spin tip="查询中..." spinning={SearchLoading}>
                      <FormItem label="申请单ID" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('examine_id', {
                          rules: [
                            formRules.require, formRules.whitespace,
                          ],
                        })(
                          <Input onChange={this.handleSearchGift} placeholder="申请单ID"/>
                        )}
                      </FormItem>
                    </Spin>
                    <FormItem label="礼品名称" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('gift_id', ExamineObj.gift_id?{
                        initialValue:{key:ExamineObj.gift_id.toString(),label:ExamineObj.gift.name.toString()},
                        rules: [
                          formRules.require,
                        ],
                      }:{
                        rules: [
                          formRules.require,
                        ],
                      })(<Select
                        disabled={true}
                        className="allwidth"
                        onSearch={this.search_model_func_gift}
                        showSearch
                        labelInValue
                        onChange={this.searchGiftCount_gift}
                        filterOption={false}>
                        {options[0]}
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
                          onChange={this.searchGiftCount_netspot}
                          filterOption={false}>
                          {options[1]}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label="调入网点" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('allocation_in_id', ExamineObj.sub_netspot_id?{
                        initialValue:{key:ExamineObj.sub_netspot_id.toString(),label:ExamineObj.sub_netspot.name.toString()},
                        rules: [
                          formRules.require,
                        ],
                      }:{
                        rules: [
                          formRules.require,
                        ],
                      })(
                        <Select
                          disabled={true}
                          className="allwidth"
                          onSearch={this.search_model_func_netspot}
                          showSearch
                          labelInValue
                          filterOption={false}>
                          {options[2]}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label="调入数量" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('allocation_count', {
                        initialValue: !tab ? ExamineObj.pass_count : ExamineObj._count,
                        rules: [
                          formRules.require,
                        ],
                      })(<InputNumber min={1} disabled={true}  className="allwidth" placeholder={max?"调入数量1~"+max:'还没选择网点或该网点库存为0'}/>)
                      }
                    </FormItem>
                    <FormItem label="调拨方式" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('active_type', {
                        initialValue: 0,
                        rules: [
                          formRules.require,
                        ],
                      })(<Radio.Group
                        disabled={true} >

                        <Radio key={0} value={0}>调拨</Radio>
                        <Radio key={1} value={1}>退还</Radio>
                      </Radio.Group>)
                      }
                    </FormItem></div> : ''}
              </TabPane>
              <TabPane tab={<span><Icon type="swap"/>直接调拨</span>} key="1">
                {tab ? <div>
                  <FormItem label="礼品名称" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('gift_id_', {
                      rules: [
                        formRules.require,
                      ],
                    })(<Select
                      className="allwidth"
                      onSearch={this.search_model_func_gift}
                      showSearch
                      labelInValue
                      onChange={this.searchGiftCount_gift}
                      filterOption={false}>
                      {options[0]}
                    </Select>)
                    }
                  </FormItem>
                  < FormItem label="调出网点" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('allocation_out_id_', {
                      rules: [
                        formRules.require,
                      ],
                    })(
                      <Select
                        className="allwidth"
                        onSearch={this.search_model_func_netspot}
                        showSearch
                        labelInValue
                        onChange={this.searchGiftCount_netspot}
                        filterOption={false}>
                        {options[1]}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem label="调入网点" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('allocation_in_id_', {
                      rules: [
                        formRules.require,
                      ],
                    })(
                      <Select
                        className="allwidth"
                        onSearch={this.search_model_func_netspot}
                        showSearch
                        labelInValue
                        filterOption={false}>
                        {options[1]}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem label="调入数量" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('allocation_count_', {
                      rules: [
                        formRules.require,
                      ],
                    })(<InputNumber min={1} className="allwidth" placeholder={max?"调入数量1~"+max:'还没选择网点或该网点库存为0'}/>)
                    }
                  </FormItem>
                  <FormItem label="调拨方式" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('active_type_', {
                      rules: [
                        formRules.require,
                      ],
                    })(<Radio.Group>
                      <Radio key={0} value={0}>调拨</Radio>
                      <Radio key={1} value={1}>退还</Radio>
                    </Radio.Group>)
                    }
                  </FormItem></div> : ''}
              </TabPane>
            </Tabs>
          </Form> :
          <Form layout="horizontal" {...formProps}>
            <FormItem label="礼品名称" hasFeedback {...formItemLayout}>
              <Input disabled={true} placeholder={currentItem.gift.name}/>
            </FormItem>
            < FormItem label="调出网点" hasFeedback {...formItemLayout}>
              {getFieldDecorator('allocation_out_id', currentItem.allocation_out_id?{
                initialValue:{key:currentItem.allocation_out_id.toString(),label:currentItem.allocation_out.name.toString()},
                rules: [
                  formRules.require,
                ],
              }:{
                rules: [
                  formRules.require,
                ],
              })(
                <Select
                  className="allwidth"
                  onSearch={this.search_model_func_netspot}
                  showSearch
                  labelInValue
                  onChange={this.searchGiftCount_netspot}
                  filterOption={false}>
                  {options[3]}
                </Select>
              )}
            </FormItem>
            <FormItem label="调入网点" hasFeedback {...formItemLayout}>
              {getFieldDecorator('allocation_in_id', currentItem.allocation_in_id?{
                initialValue:{key:currentItem.allocation_in_id.toString(),label:currentItem.allocation_in.name.toString()},
                rules: [
                  formRules.require,
                ],
              }:{
                rules: [
                  formRules.require,
                ],
              })(
                <Select
                  className="allwidth"
                  onSearch={this.search_model_func_netspot}
                  showSearch
                  labelInValue
                  filterOption={false}>
                  {options[4]}
                </Select>
              )}
            </FormItem>
            <FormItem label="调入数量" hasFeedback {...formItemLayout}>
              {getFieldDecorator('allocation_count', {
                initialValue: currentItem.allocation_count,
                rules: [
                  formRules.require,
                ],
              })(<InputNumber min={1} className="allwidth" placeholder={max?"调入数量1~"+max:'还没选择网点或该网点库存为0'}/>)
              }
            </FormItem>
            <FormItem label="调拨方式" hasFeedback {...formItemLayout}>
              {getFieldDecorator('active_type', {
                initialValue: currentItem.active_type,
                rules: [
                  formRules.require,
                ],
              })(<Radio.Group>
                <Radio key={0} value={0}>调拨</Radio>
                <Radio key={1} value={1}>退还</Radio>
              </Radio.Group>)
              }
            </FormItem>

          </Form>
        }
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
