import React from 'react';
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
const {goBack, push} = routerRedux;

import PropTypes from 'prop-types'
import moment from 'moment'
import PageModal from './PageModal'
import {
  Form,
  Input,
  Button,
  Upload,
  Alert,
  Modal,
  Select,
  Radio,
  DatePicker,
  Row,
  Col,
  Icon,
  message,
  InputNumber
} from 'antd'
const {TextArea} = Input;
import Func from "../../utils/publicFunc"
import formRules from '../../utils/formRules'
import styles from './app.css'

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}
class EvalGoodsDetail extends React.Component {
  state = {
    btnType: false,
    reply_content: '',
  }

  constructor(props) {
    super(props);
    this.api_name = 'evalGoods';
    this.isSearchNull = true;//查询下拉框内容否为空
  }

  componentDidMount() {
    const id = this.props.params;
    this.props.dispatch({
      type: `${this.api_name}/getDetail`,
      payload: {
        ...id,
      },
    })

    this.props.dispatch({
      type: `${this.api_name}/getEvalListDetail`,
      payload: {
        ...id,
      }
    })

  }

  handClick = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...this.props.form.getFieldsValue(),
        parent_eval_id: this.props.params.id,
        goods_id: this.props.evalGoods.currentItem.goods_id,
        reply_time: new Date(),
        reply_user_id: this.props.login.currentUser.id,
      };
      data = {
        ...data,
      }
      this.props.dispatch({
        type: `${this.api_name}/add`,
        payload: {
          ...data
        }
      })
    })
  }
  handCancle = () => {
    this.props.dispatch({
      type: `${this.api_name}/query`,
      payload: {
        back: true
      }
    });
  }

  render() {
    const {currentItem, childEvalList} = this.props.evalGoods;
    const evalTime = Func.getDate_ymdNew(currentItem.eval_time);
    const {formProps} = this.props;
    if (currentItem.eval_customer) {
      var customer = currentItem.eval_customer.name.substring(0, 1);

    }
    const {getFieldDecorator} = this.props.form;
    const replyList = [];
    const evalList = [];
    childEvalList.forEach((obj)=> {
      if (obj.eval_content && obj.eval_content != '') {
        evalList.push(<Col className={styles.flex} key={obj.id}>
          <Col className={styles.time}>
            <Col>追加评论</Col>
          </Col>
          <Col className={styles.content}>{obj.eval_content}</Col>
        </Col>)
      } else if (obj.reply_content && obj.reply_content != '') {
        replyList.push(<Col className={styles.flex} key={obj.id}>
          <Col className={styles.time}>
          </Col>
          <Col className={styles.replyCor}>回复 : {obj.reply_content}</Col>
        </Col>)
      }
    })
    return (
      <div>
        <Row gutter={8} className={styles.tableBorder}>
          <table className={styles.dataTable}>
            <tbody>
            <tr>
              <td className={styles.maxwidth}>
                <div className={styles.flex}>
                  <div className={styles.time}>
                    <div className={styles.firstEval}>初次评价</div>
                    <div className={styles.Evaltime}>{evalTime}</div>
                  </div>
                  <div className={styles.content}>{currentItem.eval_content}</div>
                </div>
                {evalList}
                {replyList}
              </td>
              <td className={styles.name}>{customer}***(匿名)</td>
            </tr>
            </tbody>
          </table>
        </Row>
        <Row >
        </Row>
        <Row className="marginTop10">
          <Col span={12}>
            <Form layout="horizontal" {...formProps}>
              <FormItem label="回复内容" hasFeedback {...formItemLayout}>
                {getFieldDecorator('reply_content', {
                  rules: [
                    formRules.require,formRules.whitespace,
                  ],
                })(<TextArea  placeholder="回复内容"/>)}
              </FormItem>

            </Form>
          </Col>
          <Col span={4} push={8}>
            <Button className={styles.margin_right} type='primary' icon="edit"
                    onClick={this.handClick}>
              确定
            </Button>
            <Button icon="left" onClick={this.handCancle}>取消</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
;

EvalGoodsDetail
  .propTypes = {
  evalGoods: PropTypes.object,
  goods: PropTypes.object,
  customer: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
}
export default connect(({evalGoods, goods, customer, loading, login})=>
  ({evalGoods, goods, customer, loading, login})
)
(Form.create()(EvalGoodsDetail))



