import React, { Component } from "react";
import { Tree, Spin } from "antd";

const TreeNode = Tree.TreeNode;

const datas = [
  {
    name: "北京梦哆啦网络科技有限公司",
    key: "0-0",
    children: [
      {
        name: "战略合作中心",
        key: "0-0-0",
        children: [
          {
            name: "业务发展中心",
            key: "0-0-0-0"
          },
          {
            name: "研发运营中心",
            key: "0-0-0-1"
          }
        ]
      },
      {
        name: "中台管理中心",
        key: "0-0-1",
        children: [
          {
            name: "后台职能中心",
            key: "0-0-1-0"
          }
        ]
      }
    ]
  }
];

export default class TreeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      loading: false
    };
  }

  _getNode(data) {
    const _data = data;
    if (_data) {
      return _data.map(value => {
        return (
          <TreeNode title={value.name} key={value.key}>
            {this._getNode(value.children)}
          </TreeNode>
        );
      });
    }
  }

  componentDidMount() {}

  /*componentWillReceiveProps(nextProps) {
    this.setState({
      treeData: nextProps.departmentList,
    });
  }*/

  //选择哪个？
  onCheck = (checkedKeys, info) => {
    //console.log('onCheck', checkedKeys, info);

    if (this.props.onCheck) {
      this.props.onCheck(checkedKeys, info);
    }
  };
  //点击哪个？
  onSelect = (selectedKeys, info) => {
    //console.log('selected', selectedKeys, info);
    if (this.props.onSelect) {
      this.props.onSelect(selectedKeys, info);
    }
  };

  render() {
    const { checkable, data, disabled, defaultCheckedKeys } = this.props;

    let _data = data ? data : [];
    return (
      <div>
        <Spin spinning={this.state.loading}>
          <Tree
            checkable={checkable}
            disabled={disabled}
            checkedKeys={defaultCheckedKeys}
            defaultExpandAll={defaultCheckedKeys ? true : false}
            onSelect={this.onSelect}
            onCheck={this.onCheck}
          >
            {this._getNode(_data)}
          </Tree>
        </Spin>
      </div>
    );
  }
}
