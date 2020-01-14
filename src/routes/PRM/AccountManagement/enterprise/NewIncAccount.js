import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Card, Button, Form, Row, message } from "antd";
import { getAccountType } from "../../../../utils/options";

const FormItem = Form.Item;

import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ColFormItem from "components/ColFormItem/index";
import JumpLink from "components/Button/JumpLink";
import {
  LETTERS_NUMBERS,
  CELL_NUMBER,
  PASSWORD
} from "../../../../utils/pattern";

class NewIncAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      chooseWhich: "企业选择",
      whichParameter: "enterprise_no"
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  newIncAccountHandler = e => {
    e.preventDefault();

    const { form, dispatch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const { password, passwordConfirmation } = fieldsValue;
      if (password === passwordConfirmation) {
        //如果需要对参数做处理单独写方法
        const values = {
          ...fieldsValue,
          status: fieldsValue["status"] ? 1 : 2 //使用状态 1:开启,2:关闭
        };

        //console.log('新建企业账号提交:', values);

        dispatch({
          type: "account/createAccount",
          payload: values
        }).then(() => {
          const { account, dispatch } = this.props;

          if (account.createStatus) {
            message.success("保存成功");

            setTimeout(() => {
              dispatch(routerRedux.push("/account/enterprise"));
            }, 1000);
          }
        });
      } else {
        message.error("请确认密码输入");
      }
    });
  };

  //账号类型的改变觉得名称选择是集团还是企业
  //  1 集团 | 2 企业
  onChange = value => {
    let _type = "企业选择";
    let _parameter = "enterprise_no";
    switch (value) {
      case 1:
        _type = "集团选择";
        _parameter = "group_no";
        break;
      case 2:
        break;
    }
    this.setState(
      {
        chooseWhich: _type,
        whichParameter: _parameter
      },
      () => {
        this._getListData(value);
      }
    );
  };
  //获取企业/集团列表
  //先去查redux里边是否有值，没有的话去接口拿
  _getListData(value) {
    const { dispatch, account } = this.props;
    const { enterpriseList, groupList } = account;

    let _type = "";
    let _list = null;

    if (value === 1) {
      _type = "account/queryGroupList";
      _list = groupList;
    } else if (value === 2) {
      _type = "account/queryEnterpriseList";
      _list = enterpriseList;
    }

    if (!_list) {
      dispatch({
        type: _type
      });
    }
  }

  //设置layout
  //主要是区别第一个不需要偏移量
  getLayout(value) {
    return {
      sm: { span: 24 },
      md: { span: 12 },
      lg: { span: 8 },
      xl: { span: 7, offset: !value ? 1 : 0 }
    };
  }

  render() {
    const { form, account, loading } = this.props;
    const { chooseWhich, whichParameter } = this.state;
    const { enterpriseList, groupList } = account;

    const _option =
      whichParameter === "enterprise_no" ? enterpriseList : groupList;

    return (
      <PageHeaderLayout title="新建企业账号">
        <Form onSubmit={this.newIncAccountHandler}>
          <Card>
            <Row>
              <ColFormItem
                layout={this.getLayout(1)}
                form={form}
                label="账号类型"
                type="Select"
                options={getAccountType}
                onChange={this.onChange}
                parameter="type"
              />

              <ColFormItem
                layout={this.getLayout()}
                form={form}
                label={chooseWhich} //默认企业选择
                type="Select"
                options={_option ? _option : []}
                parameter={whichParameter}
              />

              <ColFormItem
                layout={this.getLayout()}
                form={form}
                label="用户名"
                pattern={LETTERS_NUMBERS}
                parameter="user_name"
                placeholder="必须输入数字加字母"
              />
            </Row>

            <Row>
              <ColFormItem
                layout={this.getLayout(1)}
                form={form}
                label="登录手机号"
                pattern={CELL_NUMBER}
                parameter="login_mobile"
                placeholder="请输入正确的手机号"
              />

              <ColFormItem
                layout={this.getLayout()}
                form={form}
                label="登录密码"
                pattern={PASSWORD}
                parameter="password"
                placeholder="密码最少应该6位"
              />

              <ColFormItem
                layout={this.getLayout()}
                form={form}
                label="登录密码确认"
                pattern={PASSWORD}
                parameter="passwordConfirmation"
                placeholder="密码最少应该6位"
              />
            </Row>

            <Row>
              <ColFormItem
                layout={this.getLayout(1)}
                form={form}
                type="Switch"
                label="是否启用"
                required={false}
                initialValue={true}
                parameter="status"
              />
            </Row>

            <Row>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "10px" }}
                  loading={loading}
                >
                  保存
                </Button>

                <JumpLink name="取消" link="/account/enterprise" />
              </FormItem>
            </Row>
          </Card>
        </Form>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ account, loading }) => ({
  account,
  loading: loading.effects["account/createAccount"]
}))(Form.create()(NewIncAccount));
