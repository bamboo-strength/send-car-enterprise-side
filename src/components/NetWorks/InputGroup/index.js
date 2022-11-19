import React from 'react';
import './index.css';

export default class InputGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxLength: [],
      numList: [],
      isFocus: false,
      num: ''
    };
    this.textChange = this.textChange.bind(this);
    this.inputFocus = this.inputFocus.bind(this);
  }

  componentDidMount() {
    const {length,onRef} = this.props;
    onRef(this)
    switch (length) {
      case 4:
        this.setState({
          boxLength: [0, 1, 2, 3]
        })
        break;
      case 6:
        this.setState({
          boxLength: [0, 1, 2, 3, 4, 5]
        })
        break;
      default:
        this.setState({
          boxLength: [0, 1, 2, 3, 4, 5]
        })
    }
  }

  textChange(e) {
    const value = e.target.value.replace(/[^\d]/g, '')
    const {getValue} = this.props
    getValue(value)
    this.setState({
      num: value
    })
    setTimeout(() => {
      const {num} = this.state
      this.setState({
        numList: num.split('')
      })
    }, 100);
  }

  inputFocus() {
    this.refs.focus()
    this.setState({isFocus: true})
  }

  render() {
    const {length, type, str} = this.props;
    let {num, numList} = this.state
    const {isFocus, boxLength} = this.state;
    if (str === '') {
      num = ''
      numList = []
    }

    return (
      <div>
        {
          type === 'line' ?
            <div className="box-root-container">
              <input
                ref={ref => this.refs = ref}
                className="box-input"
                maxLength={length}
                value={num}
                onChange={this.textChange}
                onBlur={() => this.setState({isFocus: false})}
              />
              <div className="box-containers">
                {boxLength.map((item, index) => {
                  return (
                    <div key={index}>
                      {numList[item]}
                      <span className="shake" style={{display: item === numList.length && isFocus ? 'block' : 'none'}}>|</span>
                    </div>
                  )
                })}
              </div>
            </div> : ''
        }
        {
          type === 'box' ?
            <div onClick={this.inputFocus} className="box-root-container">
              <input
                ref={ref => this.refs = ref}
                className="box-input"
                maxLength={length}
                value={num}
                onChange={this.textChange}
                onBlur={() => this.setState({isFocus: false})}
                type='number'
              />
              <div className="box-container">
                {boxLength.map((item, index) => {
                  const aa = numList[item] ? numList[item].replace(/./g, '•') : ''
                  return (
                    <div key={index}>
                      {aa}
                      <span className="shake" style={{display: item === numList.length && isFocus ? 'block' : 'none'}}>|</span>
                    </div>
                  )
                })}
              </div>
            </div> : ''
        }
      </div>
    );
  }
}
