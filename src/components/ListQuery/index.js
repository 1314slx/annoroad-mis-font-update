import React, { Component, Fragment } from "react";
import { Card, Table, Row, Pagination } from "antd";
import Search from "../Search/index";
import JumpLink from "../Button/JumpLink";
import styles from "./index.less";

/**
 * 每个页面都引用一堆antd组件
 * 封装以后不需要同样类型的页面引用同样的模块，只需要在这一个地方引用即可
 * 子组件专注显示，不关心业务，父组件专心处理业务
 *
 * loading            | boolean | 加载loading
 * dataSource         | array   | antd组件Table的 dataSource 数据格式（必传）
 * link               | string  | 新建按钮的跳转链接，不传不显示新建
 * items              | array   | 数组对象，搜索生成页面的对象  具体参考Search组件说明
 * current            | int     | 分页显示第几页（必传）
 * pageSize           | int     | 每页大小(默认15)
 * total              | int     | 分页总共有多少条数据（必传）
 * columns            | array   | antd组件Table的 columns 数据格式（必传）
 * onSubmit           | function| 处理搜索提交的方法，不传不显示搜索
 * pagination         | function| 处理翻页的方法
 * bordered           | boolean | Card 是否显示边框 false表示不显示边框，不传或者传true 显示边框
 * linkName           | string  | 按钮名字 可不传，不传就是"+ 新建"
 *
 * onClick            | function| 如果按钮不是跳转，则自定义方法
 * */

export default class ListQuery extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  onChange = (pageNumber) => {
    if(this.props.onChange){
      this.props.onChange(pageNumber, this.props.pageSize || 15);
    }
  }

  render() {
    const {
      loading,
      dataSource,
      link,
      items,
      current,
      total,
      columns,
      onSubmit,
      onReset,
      updateByTime,
      pagination,
      bordered,
      linkName,
      scroll,
      onClick,
      components,
      pageSize,
      className
    } = this.props;

    return (
      <Card bordered={bordered} className={styles.buttonMargin}>
        {onSubmit && items ? (
          <Search items={items} loading={loading} onSubmit={onSubmit} onReset={onReset} updateByTime={updateByTime}   />
          /*<Search items={items} loading={loading} onSubmit={onSubmit} onReset={onReset} {/!* onChange={onChange}*!/} />*/
        ) : (
          <Fragment />
        )}

        {link || onClick ? (
          <JumpLink
            style={onSubmit ? styles.newBtn : ""}
            type="primary"
            onClick={onClick}
            name={linkName ? linkName : "+ 新建"}
            link={link}
          />
        ) : (
          <div className={styles.empty} />
        )}

        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          size="middle"
          className={`${styles.businessTable} ${className?className:''}`}
          // scroll={{ x: scroll ? scroll : 1200 }}
          pagination={false}
          components={components}
        />

        {current ? (
          <Row type="flex" justify="end" className={styles.paginationBox}>
            <Pagination
              showQuickJumper
              pageSize={pageSize || 15}
              onChange={pagination}
              current={current}
              total={total}
              // onChange={this.onChange}
            />
          </Row>
        ) : (
          <Fragment />
        )}
      </Card>
    );
  }
}
