import React, { useEffect } from 'react';
import { Form, Input, Button, Space, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Operations = (props: any) => {
  const [form] = Form.useForm();
  let initialValues: any = props.childData;
  // let initialValues:any= { name: 'John Doe', age: 30, address: { street: '123 Main St', city: 'Anytown', details: { apt: '5A', zip: '12345' } }, phones: ['123-456-7890', '098-765-4321'], emails: ['john@example.com', 'doe@example.com'], nestedArray: [ { "key1": 'value1', key2: 'value2',key3:[{a:"j"}] }, { key1: 'value3', key2: 'value4' ,key3:[{a:"j"}]} ] }
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const renderFormItems = (items: any, parentKey: any[] = []): JSX.Element[] | JSX.Element => {
    return items && Object.entries(items).map(([key, value]) => {
      const name = [...parentKey, key];
  
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Nested object - render sub-form items
        return (
          <div key={name.join('.')} style={{ marginBottom: 16 }}>
            <Title level={5}>{key}</Title>
            {renderFormItems(value, name)}
          </div>
        );
      } else if (Array.isArray(value)) {
        // Array of objects - render list with nested form items
        return (
          <Form.List name={name} key={name.join('.')} initialValue={value.map((item: any) => ({ ...item }))}>
            {(fields, { add, remove }) => (
              <>
                <Title level={5}>{key}</Title>
                {fields.map(({ key: fieldKey, name: fieldName, fieldKey: itemFieldKey, ...restField }) => (
                  <Space key={fieldKey} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    {typeof value[0] === 'object' ? (
                      // Nested object within array - render sub-form items with initial values
                      renderFormItems(value[0],[fieldName]) // Use the current item's structure
                    ) : (
                      <Form.Item
                      {...restField}
                      name={fieldName}
                      fieldKey={itemFieldKey}
                      rules={[{ required: true, message: 'Missing value' }]}
                      >
                      <Input placeholder="Value" />
                      </Form.Item>
                    )}
                    <MinusCircleOutlined onClick={() => remove(fieldName)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add {key}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        );
      } else {
        // Simple field - render form item
        return (
          <>
           <div className="mb-2 d-flex">
        <label className=" qr-custom-label capitalcase"></label>
        
        <Form.Item
            name={name}
            label={key}
            key={name.join('.')}
            rules={[{ required: true, message: `Missing ${key}` }]}
          >
            <Input placeholder={`Enter ${key}`} />
          </Form.Item>
      </div>
          </>

          

        );
      }
    });
  };

  const onFinish = (values: any) => {
    console.log('Received values from form: ', values);
  };

  return (
    <Form form={form} name="dynamic_form" onFinish={onFinish} autoComplete="off">
      {renderFormItems(initialValues)}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Operations;

