import React from 'react';
import { Card, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu } from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import getSystemIcons from '../../helpers/getSystemIcons';

export default function Users() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth, shallowEqual);
  console.log({ user });

  const list = user.urls
    .flatMap((item) => item.submenu)
    .find((el) => el?.url === 'users');

  const addMenuItem = (payload) => {
    const data = { ...payload, icon: undefined };
    dispatch(addMenu(data));
    //
  };

  const cards = [
    { id: 1, name: 'retail.user', url: 'users/user', icon: 'user' },
    { id: 2, name: 'customer.user', url: 'users/admin', icon: 'user' },
    { id: 3, name: 'role', url: 'users/role', icon: 'user' },
  ];

  return (
    <div className='product-container'>
      <Row gutter={8}>
        {cards.map((item) => (
          <Col span={8} key={item.id}>
            <Card className='card-view' hoverable>
              <Link to={`/${item.url}`} className='d-block'>
                {getSystemIcons(item.icon)}
                <span className='text'>{t(item.name)}</span>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
