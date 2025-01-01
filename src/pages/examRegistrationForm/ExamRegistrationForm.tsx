import React from 'react';
import { Form, Input, DatePicker, Select, Button, message } from 'antd';
import { Exam, registerExam } from '../../services/apis/examAPI';
import dayjs from 'dayjs';
import '../../styles/pages/examRegistrationForm/ExamRegistrationForm.css';

interface ExamRegistrationFormProps {
  exam: Exam;
  onClose: () => void;
  onSuccess: () => void;
}

const ExamRegistrationForm: React.FC<ExamRegistrationFormProps> = ({ exam, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const formattedData = {
        exam_id: exam.nid,
        user_info: {
          ...values,
          birthday: values.birthday.format('YYYY-MM-DD')
        }
      };

      const response = await registerExam(formattedData);
      message.success('Đăng ký kỳ thi thành công');
      onSuccess();
    } catch (error) {
      message.error('Đăng ký kỳ thi thất bại. Vui lòng thử lại');
    }
  };

  return (
    <div className="exam-registration-form">
      <h2>Đăng ký kỳ thi: {exam.title}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="fullname"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="birthday"
          label="Ngày sinh"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
        >
          <Select>
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="identification"
          label="CMND/CCCD"
          rules={[
            { required: true, message: 'Vui lòng nhập CMND/CCCD' },
            { len: 12, message: 'CCCD phải có 12 số' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="permanent_address"
          label="Địa chỉ thường trú"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ thường trú' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="temporary_address"
          label="Địa chỉ tạm trú"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ tạm trú' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại' },
            { pattern: /^\+84\d{9,10}$/, message: 'Số điện thoại không hợp lệ (định dạng: +84xxxxxxxxx)' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item className="form-buttons">
          <Button type="default" onClick={onClose}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ExamRegistrationForm;