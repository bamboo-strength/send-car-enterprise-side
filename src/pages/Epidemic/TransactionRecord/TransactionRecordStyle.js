import MatrixListItem from '@/components/MatrixMobile/MatrixListItem';
import React from 'react';

export function DetailStyle(props) {
  const {list} = props

  return (
    <div style={{ margin: 10, background: 'white', borderRadius: '5px', padding: '10px 15px' }}>
      {
        list.map(item => {
          return (
            <MatrixListItem label={item.title} title={item.extra} />
          );
        })
      }
    </div>
  )
}
