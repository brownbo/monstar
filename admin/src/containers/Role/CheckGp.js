/**
 * Created by 郑银华 on 2017/12/2.
 */
import React from 'react';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types'
const CheckboxGroup = Checkbox.Group;
class CheckGp extends React.Component {
  state = {
    indeterminate: false,
    checkAll: false,
  };
  onChange = (checkedListKeys) => {
    const {checkListChange,Options_parent,deleteMenuChecked} = this.props;
    if(checkedListKeys.length===0){
      deleteMenuChecked(Options_parent.value);
    }else{
      let newcheckedList = {}
      newcheckedList[Options_parent.value] = checkedListKeys;
      checkListChange(newcheckedList);
    }
  }
  onChangeByMenu = (e) => {
    const {checkListChange,Options_parent,deleteMenuChecked} = this.props;
    if(e.target.checked){
      let newcheckedList = {}
      newcheckedList[Options_parent.value] = [];
      checkListChange(newcheckedList);
    }else{
      deleteMenuChecked(Options_parent.value);
    }
  }
  onCheckAllChange = (e) => {
    const { Options_child,checkListChange,Options_parent,checkedList,deleteMenuChecked} = this.props;
    const isChecked = e.target.checked;
    let newcheckedList = {}
    if(isChecked){
      newcheckedList[Options_parent.value] = Options_child.map(item=>item.value);
      checkListChange({...checkedList,...newcheckedList});
    }else{
      deleteMenuChecked(Options_parent.value);
    }
  }
  render() {
    const {Options_parent,Options_child,checkedList,parentCheckd} = this.props;
    return (
      <div>
        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          {Options_child.length?
          <Checkbox
            indeterminate={!!checkedList.length&&checkedList.length<Options_child.length}
            onChange={this.onCheckAllChange}
            checked={checkedList.length===Options_child.length}
            value={Options_parent.value}
          >
            <span className="menuCheck">{Options_parent.label}</span>
          </Checkbox>:
            <Checkbox checked = {parentCheckd} onChange={this.onChangeByMenu}><span className="menuCheck">{Options_parent.label}</span></Checkbox>
          }
        </div>
        <div className="checkGroupMargin">
        {Options_child.length?<CheckboxGroup options={Options_child} value={checkedList} onChange={this.onChange} />:''}
        </div>
        </div>
    );
  }
};

CheckGp.propTypes = {
  checkListChange:PropTypes.func,
  checkedList:PropTypes.array,//选中的checkbox key
  Options_parent:PropTypes.object,//菜单栏目
  Options_child:PropTypes.array,//菜单子栏目
};

export default CheckGp;
