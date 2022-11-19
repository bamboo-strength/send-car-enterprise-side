import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { List, Avatar, Empty } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Workplace.less';
import { getCurrentUser } from '../../utils/authority';




@connect(({ user, project, activities, loading }) => ({
  currentUser: user.currentUser,
  project,
  activities,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  projectLoading: loading.effects['project/fetchNotice'],
  activitiesLoading: loading.effects['activities/fetchList'],
}))
class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'project/fetchNotice',
    });
    dispatch({
      type: 'activities/fetchList',
    });
  }

  renderActivities() {
    const {
      activities: { list },
    } = this.props;
    return list.map(item => {
      const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
        if (item[key]) {
          return (
            <a href={item[key].link} key={item[key].name}>
              {item[key].name}
            </a>
          );
        }
        return key;
      });
      return (
        <List.Item key={item.id}>
          <List.Item.Meta
            avatar={<Avatar src={item.user.avatar} />}
            title={
              <span>
                <a className={styles.username}>{item.user.name}</a>
                &nbsp;
                <span className={styles.event}>{events}</span>
              </span>
            }
            description={
              <span className={styles.datetime} title={item.updatedAt}>
                {moment(item.updatedAt).fromNow()}
              </span>
            }
          />
        </List.Item>
      );
    });
  }

  render() {
   const logo = `./tenant/pics/home.jpg`;
    return (
      <div>

        <img src={logo} width="1620px" height="715px" alt="" />

      </div>
    );
  }
}

export default Workplace;
