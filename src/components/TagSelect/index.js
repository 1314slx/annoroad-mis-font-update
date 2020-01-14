import React, { Component } from "react";
import classNames from "classnames";
import { Tag, Icon } from "antd";

import styles from "./index.less";

const { CheckableTag } = Tag;

const TagSelectOption = ({ children, checked, onChange, value }) => (
  <CheckableTag
    checked={checked}
    key={value}
    onChange={state => onChange(value, state)}

  >
    {children}
  </CheckableTag>
);

TagSelectOption.isTagSelectOption = true;

class TagSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      value: props.value || props.defaultValue || [],

      _isShow:false
    };
  }

  componentWillReceiveProps(nextProps) {
    if ("value" in nextProps && nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  onChange = value => {
    console.log('-------------value--------------',value)
    const { onChange } = this.props;
    if (!("value" in this.props)) {
      this.setState({ value });
    }
    if (onChange) {
      onChange(value);
    }
  };

  onSelectAll = checked => {
    console.log("onSelectAll-checked",checked)
     let checkedTags = [];
    if (checked) {
      checkedTags = this.getAllTags();
    }
    this.onChange(checkedTags);
  };

  getAllTags() {
    let { children } = this.props;
    console.log("getAllTags-children",children)
    children = React.Children.toArray(children);
    const checkedTags = children
      .filter(child => this.isTagSelectOption(child))
      .map(child => child.props.value);
    return checkedTags || [];
  }

  handleTagChange = (value, checked) => {
    const { value: v } = this.state;
    const checkedTags = [...v];

    const index = checkedTags.indexOf(value);
    if (checked && index === -1) {
      checkedTags.splice(index, 1);
      checkedTags.push(value);
    } else if (!checked && index > -1) {
      checkedTags.splice(index, 1);
    }
    this.onChange(value);
  };

  handleExpand = () => {
    const { expand } = this.state;
    this.setState({
      expand: !expand
    });
  };

  isTagSelectOption = node => (
      node &&
      node.type &&
      (node.type.isTagSelectOption ||
        node.type.displayName === "TagSelectOption")
    );

  render() {
    const { value, expand } = this.state;
    const { children, className, style, expandable } = this.props;

    const checkedAll = this.getAllTags().length === value.length;

    const cls = classNames(styles.tagSelect, className, {
      [styles.hasExpandTag]: expandable,
      [styles.expanded]: expand
    });
    `<style>
      #tagContent{border:1px solid green !important;background:red}
      #tagContent ant-tag:nth-child(2){background: red;}
    </style>`
    const _tagContent = document.getElementById('tagContent');
    if(_tagContent) {
      const _height = _tagContent.offsetHeight;
      if(_height>33){
        this.mystyles = {
          display:'block'
        }
      }else{
        this.mystyles = {
          display:'none'
        }
      }
    }
    return (
      <div className={cls} style={style}>
        {
         this.props._value ===0?
           <style>
             {`
            #tagContent{}
             #tagContent .ant-tag:nth-child(2){background: #1890ff;color:#ffffff;}
          `
             }
           </style>:""
        }
        <div id='tagContent' className={styles.tagContent_List} style={{display:"block"}}>
        <CheckableTag
          checked={checkedAll}
          key="tag-select-__all__"
          onChange={this.onSelectAll}
          style={{display:"none"}}
        >
          全部
        </CheckableTag>
        {value &&
          React.Children.map(children, child => {
            if (this.isTagSelectOption(child)) {
              return React.cloneElement(child, {
                key: `tag-select-${child.props.value}`,
                value: child.props.value,
                checked: value.indexOf(child.props.value) > -1,
                onChange: this.handleTagChange
              });
            }
            //console.log("child的数据：",React.Children);
            //debugger;
            return child;

          })}
       {expandable && (
          <a className={styles.trigger} onClick={this.handleExpand} style={this.mystyle}>
            {expand ? "收起" : "展开"} <Icon type={expand ? "up" : "down"} />
          </a>
        )}


          {/* <a className={styles.trigger}id="showMoreBtn" onClick={this.handleExpand} style={this.mystyles}>
            {expand ? "收起" : "展开"} <Icon type={expand ? "up" : "down"} />
          </a> */}

        </div>
      </div>
    );
  }
}

TagSelect.Option = TagSelectOption;

export default TagSelect;
