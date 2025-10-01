import React, { useState } from 'react';
import {
  Card,
  Button,
  InputNumber,
  Space,
  Typography,
  Table,
  Tag,
  Modal,
  message,
  Divider,
} from 'antd';
import {
  CreditCardOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Text, Title } = Typography;

const PartialPaymentSection = ({
  orderData,
  defaultCurrency,
  onAddPayment,
  loading = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  console.log('menim order datam:', orderData);

  // Calculate payment info
  const totalPrice = orderData?.total_price || 0;
  const paidAmount = orderData?.paid_amount || 0;
  const remainingAmount = totalPrice - paidAmount;
  const isFullyPaid = paidAmount >= totalPrice;
  const isPartiallyPaid = paidAmount > 0 && paidAmount < totalPrice;

  // Order payments data
  const orderPayments = orderData?.order_payments || [];

  const validateAmount = (amount) => {
    const newErrors = {};

    if (!amount || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0!';
    } else if (amount > remainingAmount) {
      newErrors.amount = 'Amount cannot exceed remaining balance!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPayment = async () => {
    if (!validateAmount(paymentAmount)) {
      return;
    }

    setSubmitting(true);
    try {
      const paymentData = {
        order_id: orderData?.id,
        amount: paymentAmount,
      };

      await onAddPayment?.(paymentData);

      message.success('Payment added successfully!');
      setIsModalVisible(false);
      setPaymentAmount(0);
      setErrors({});
    } catch (error) {
      console.error('Payment error:', error);
      message.error('Failed to add payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalOpen = () => {
    console.log('Opening modal...');
    setPaymentAmount(remainingAmount > 0 ? remainingAmount : 0);
    setErrors({});
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    console.log('Closing modal...');
    setIsModalVisible(false);
    setPaymentAmount(0);
    setErrors({});
  };

  const paymentColumns = [
    {
      title: 'Payment ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => `#${id}`,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <Text strong>{formatPrice(amount)}</Text>,
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transaction_id',
      key: 'transaction_id',
      render: (transactionId) => (transactionId ? `#${transactionId}` : 'N/A'),
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
  ];

  const getPaymentStatus = () => {
    if (isFullyPaid) {
      return (
        <Tag color='success' icon={<CheckCircleOutlined />}>
          Fully Paid
        </Tag>
      );
    } else if (isPartiallyPaid) {
      return (
        <Tag color='warning' icon={<ClockCircleOutlined />}>
          Partially Paid
        </Tag>
      );
    } else {
      return <Tag color='error'>Unpaid</Tag>;
    }
  };

  const formatPrice = (amount) => {
    if (!defaultCurrency) {
      return `${amount?.toFixed(2) || '0.00'}`;
    }

    const formattedAmount = (amount || 0).toFixed(2);
    return `${defaultCurrency?.position === 'before' ? defaultCurrency?.symbol : ''}${formattedAmount}${defaultCurrency?.position === 'after' ? defaultCurrency?.symbol : ''}`;
  };

  return (
    <>
      <Card
        title={
          <Space>
            <CreditCardOutlined />
            Payment Informationnnn
          </Space>
        }
        extra={
          !isFullyPaid && (
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={handleModalOpen}
              loading={loading}
            >
              Add Payment
            </Button>
          )
        }
      >
        {/* Payment Summary */}
        <div style={{ marginBottom: 24 }}>
          <Space direction='vertical' size='small' style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>Status:</Text>
              {getPaymentStatus()}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Total Order Amount:</Text>
              <Text strong>{formatPrice(totalPrice)}</Text>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Total Paid Amount:</Text>
              <Text strong style={{ color: '#52c41a' }}>
                {formatPrice(paidAmount)}
              </Text>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Remaining Amount:</Text>
              <Text
                strong
                style={{ color: remainingAmount > 0 ? '#ff4d4f' : '#52c41a' }}
              >
                {formatPrice(remainingAmount)}
              </Text>
            </div>
          </Space>
        </div>

        <Divider />

        {/* Payment History */}
        <Title level={5}>Payment History</Title>
        {orderPayments.length > 0 ? (
          <Table
            columns={paymentColumns}
            dataSource={orderPayments}
            pagination={false}
            size='small'
            rowKey='id'
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            <Text type='secondary'>No payments recorded yet</Text>
          </div>
        )}
      </Card>

      {/* Add Payment Modal */}
      <Modal
        title='Add Partial Payment'
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key='cancel' onClick={handleModalClose}>
            Cancel
          </Button>,
          <Button
            key='submit'
            type='primary'
            loading={submitting}
            onClick={handleAddPayment}
          >
            Add Payment
          </Button>,
        ]}
        width={400}
        visible={isModalVisible}
        destroyOnClose={true}
        maskClosable={false}
        zIndex={1000}
      >
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              backgroundColor: '#f5f5f5',
              borderRadius: 6,
            }}
          >
            <Space direction='vertical' size='small' style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type='secondary'>Total Amount:</Text>
                <Text>{formatPrice(totalPrice)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type='secondary'>Already Paid:</Text>
                <Text>{formatPrice(paidAmount)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type='secondary'>Remaining:</Text>
                <Text strong>{formatPrice(remainingAmount)}</Text>
              </div>
            </Space>
          </div>

          <div style={{ marginBottom: 8 }}>
            <Text strong>Payment Amount:</Text>
          </div>

          <InputNumber
            style={{ width: '100%' }}
            placeholder='Enter amount'
            value={paymentAmount}
            onChange={(value) => {
              setPaymentAmount(value);
              if (errors.amount) {
                validateAmount(value);
              }
            }}
            onBlur={() => validateAmount(paymentAmount)}
            min={0.01}
            max={remainingAmount}
            step={0.01}
            precision={2}
            status={errors.amount ? 'error' : ''}
            addonBefore={
              defaultCurrency?.position === 'before' && defaultCurrency?.symbol
            }
            addonAfter={
              defaultCurrency?.position === 'after' && defaultCurrency?.symbol
            }
          />

          {errors.amount && (
            <div
              style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}
            >
              {errors.amount}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default PartialPaymentSection;
