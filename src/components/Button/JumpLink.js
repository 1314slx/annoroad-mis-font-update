import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Button } from "antd";

/**
 * 返回按钮
 * 返回按钮就干一件事儿，跳转一个地址，没有什么业务需要处理
 * 如果返回有业务，重写onClick事件即可
 * 封装不需要每个页面都引入dva/router,不需要每个页面都写一个返回的方法
 *
 * 只需传入按钮名字和跳转地址即可
 *
 * style    |object|    按钮样式
 * name     |string|    按钮名字
 * link     |string|    跳转链接
 * onClick  |function|  复杂跳转的时候重写onClick
 * */

@connect()
export default class JumpLink extends Component {
  click = () => {
    const { link, onClick } = this.props;

    if (onClick) {
      this.props.onClick();
    } else {
      this.props.dispatch(routerRedux.push(link));
    }
  };

  render() {
    const { name, type, style } = this.props;

    const _type = type ? type : "default";

    return (
      <Button type={_type} onClick={this.click} className={style}>
        {name}
      </Button>
    );
  }
}
