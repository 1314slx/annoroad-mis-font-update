import React, { Component } from 'react'
import { Form, Input } from 'antd';

class InputValid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      help: '',
      validateStatus: ''
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps, nextStates) {
    if(nextProps.showHelp && !nextProps.inputValue){
      this.setState({
        validateStatus:'error',
        help:"文件夹名称不能为空，请输入文件夹名称"
      })
    }if(!nextProps.showHelp && !nextProps.inputValue){
      this.setState({
        validateStatus:'success',
        help:""
      })
    }
  }
  handleChange = (e) => {
    const {
      onChange,
      pattern,
      showHelp
    } = this.props
    const value = e.target.value;
    this.setState({
      validateStatus: pattern.test(value) ? 'success' : 'error',
      help: pattern.test(value) || '不能包含：引号、括号、空格、回车符以及`*\\$+&%#!~'
    })
    onChange(value)
  }

  render () {
    const {
      placeholder = '新建文件夹',
      inputValue,
    } = this.props

    return (
      <Form wrapperCol={{ span: 24 }}>
        <Form.Item
          validateStatus={this.state.validateStatus}
          help={this.state.help}
        >
          <Input size placeholder={placeholder} value={inputValue} onChange={this.handleChange} />
        </Form.Item>
      </Form>
    )
  }
}

export default InputValid
