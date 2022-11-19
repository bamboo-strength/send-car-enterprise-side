import React, { PureComponent } from 'react';
import { Col, Form, Row } from 'antd';
import { Card } from 'antd-mobile';

const FormItem = Form.Item;

export default class StyleForList extends PureComponent {


  render() {

  const {sectionID,rows,rowData,handleBtnClick} = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return(
      <div>
        <Card.Body key={sectionID} onClick={()=>{handleBtnClick()}}>
          <Row gutter={24}>
            {
              rows.map(rrow => (
                <Col span={24} className="view-config"><FormItem {...formItemLayout} label={rrow.key}><span style={{color: 'rgba(0, 0, 0, 0.85)'}}>{rowData[rrow.value]}</span></FormItem></Col>
              ))
            }
          </Row>
        </Card.Body>
      </div>
    )
  }

}

