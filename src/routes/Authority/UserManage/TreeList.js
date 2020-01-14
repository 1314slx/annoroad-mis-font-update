import React, { Component } from "react";
import { Tree, Spin } from "antd";
import { connect } from "dva";

const TreeNode = Tree.TreeNode;

import styles from "../index.less";
import { setItem, getItem } from "../../../utils/utils";

/*const data = [{
  name: '北京梦哆啦网络科技有限公司',
  key: '0-0',
  children: [{
    name: '战略合作中心',
    key: '0-0-0',
    children: [{
      name: '业务发展中心',
      key: '0-0-0-0',
    }, {
      name: '研发运营中心',
      key: '0-0-0-1',
    }]
  }, {
    name: '中台管理中心',
    key: '0-0-1',
    children: [{
      name: '后台职能中心',
      key: '0-0-1-0',
    }]
  }]
}]*/
@connect(({ authority, loading }) => ({
  authority,
  loading: loading.effects["authority/departmentList"]
}))
export default class TreeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      loading: false
    };
  }

  _getTreeData(parentId) {
    const _parentId = parentId ? parentId : 0;
    const data = getItem(_parentId);
    if (data) {
      this.setState({ treeData: JSON.parse(data) });
    } else {
      this.setState({ loading: true });
      this.props
        .dispatch({
          type: "authority/departmentList",
          payload: {
            parent_id: _parentId
          }
        })
        .then(() => {
          const { departmentList } = this.props.authority;
          if (departmentList != 0) {
            this.setState({ treeData: departmentList, loading: false });
            setItem(_parentId, JSON.stringify(departmentList));
          }
        });
    }
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

  componentDidMount() {
    this._getTreeData();
  }

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

  onLoadData = treeNode => {
    return new Promise(resolve => {
      const _parentId = treeNode.props.id;
      const data = getItem(_parentId);
      if (data) {
        const treeData = [...JSON.parse(data)];
        this.getNewTreeData(treeData, treeNode.props.eventKey);
      } else {
        this.props
          .dispatch({
            type: "authority/departmentList",
            payload: {
              parent_id: _parentId
            }
          })
          .then(() => {
            const { departmentList } = this.props.authority;
            if (departmentList != 0) {
              setItem(_parentId, JSON.stringify(departmentList));
              const treeData = [...departmentList];
              this.getNewTreeData(treeData, treeNode.props.eventKey);
            }
          });
      }

      resolve();
    });
  };

  getNewTreeData(treeData, curKey) {
    const _treeData = this.state.treeData;

    const loop = data => {
      if (data) {
        data.forEach(item => {
          if (item.children) {
            loop(item.children);
          } else {
            if (curKey == item.key) {
              item.children = treeData;
            }
          }
        });
      }
    };
    loop(_treeData);
    this.setState({ treeData: _treeData });
  }

  render() {
    const { title, checkable } = this.props;

    const loop = data =>
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode title={item.name} key={item.key} id={item.id}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={item.name}
            key={item.key}
            isLeaf={item.isLeaf}
            id={item.id}
          />
        );
      });
    const treeNodes = loop(this.state.treeData);

    return (
      <div className={title ? styles.treeListBox : ""}>
        <h4>{title}</h4>
        <Spin spinning={this.state.loading}>
          <Tree
            checkable={checkable}
            onSelect={this.onSelect}
            onCheck={this.onCheck}
            loadData={this.onLoadData}
          >
            {/*   {treeNodes}*/}
            <TreeNode title="北京梦哆啦网络科技有限公司" key="0-0">
              <TreeNode title="战略合作中心" key="0-0-0">
                <TreeNode title="业务发展中心" key="0-0-0-0" />
                <TreeNode title="研发运营中心" key="0-0-0-1" />
              </TreeNode>
              <TreeNode title="中台管理中心" key="0-0-1">
                <TreeNode title="后台职能中心" key="0-0-1-0" />
                <TreeNode
                  title={<span style={{ color: "#08c" }}>sss</span>}
                  key="0-0-1-0"
                />
              </TreeNode>
            </TreeNode>
          </Tree>
        </Spin>
      </div>
    );
  }
}
