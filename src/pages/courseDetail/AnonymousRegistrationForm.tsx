import React from 'react';
import { Form, Input, Button } from 'antd';

interface AnonymousRegistrationFormProps {
  onSubmit: (values: any) => void;
  loading: boolean;
}

const AnonymousRegistrationForm: React.FC<AnonymousRegistrationFormProps> = ({ 
  onSubmit, 
  loading 
}) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Form.Item
        label="Họ và tên"
        name="fullname"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email' },
          { type: 'email', message: 'Email không hợp lệ' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="CMND/CCCD"
        name="identification_code"
        rules={[{ required: true, message: 'Vui lòng nhập CMND/CCCD' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Nơi làm việc"
        name="workplace"
        rules={[{ required: true, message: 'Vui lòng nhập nơi làm việc' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AnonymousRegistrationForm;