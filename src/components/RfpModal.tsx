import { Modal, Typography, Descriptions, Table, Button, Tag, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useCreateRfp } from '../services/api';
import type { GenerateRFPResponse } from '../services/interface.service';


const { Title, Text } = Typography;

interface RfpModalProps {
  open: boolean;
  rfpData: GenerateRFPResponse['structuredRfp'] | null;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

const RfpModal: React.FC<RfpModalProps> = ({ open, rfpData, onClose, onSaveSuccess }) => {
  const createRfpMutation = useCreateRfp();

  const handleSave = () => {
    if (!rfpData) return;

    createRfpMutation.mutate(
      {
        title: rfpData.title,
        descriptionRaw: rfpData.descriptionRaw,
        descriptionStructured: rfpData.descriptionStructured,
      },
      {
        onSuccess: () => {
          message.success('RFP saved successfully!');
          // Close modal first
          onClose();
          // Then trigger navigation after a small delay to ensure modal is closed
          setTimeout(() => {
            if (onSaveSuccess) {
              onSaveSuccess();
            }
          }, 100);
        },
        onError: (error: any) => {
          message.error(error?.message || 'Failed to save RFP. Please try again.');
        },
      }
    );
  };

  if (!rfpData) return null;

  const { title, descriptionStructured } = rfpData;
  const { budget, currencySymbol, deliveryTimeline, paymentTerms, warranty, items } =
    descriptionStructured;

  const itemsTableColumns = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
      render: (quantity: number) => (
        <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
          {quantity}
        </Tag>
      ),
    },
    {
      title: 'Specifications',
      dataIndex: 'specs',
      key: 'specs',
      render: (specs: string | null) => (
        <Text type="secondary">{specs || 'Not Applicable'}</Text>
      ),
    },
  ];

  // Filter out null/undefined items for display
  const displayItems = items?.filter((item) => item && item.item) || [];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <Title level={4} style={{ margin: 0, fontFamily: 'Inter, sans-serif' }}>
          Generated RFP
        </Title>
      }
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={createRfpMutation.isPending}
          disabled={createRfpMutation.isPending}
          style={{
            background: '#2563eb',
            border: 'none',
          }}
        >
          Save RFP
        </Button>,
      ]}
      className="rfp-modal"
      maskClosable={false}
      closable={!createRfpMutation.isPending}
    >
      <div style={{ padding: '8px 0' }}>
        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <Title level={5} style={{ marginBottom: 8, color: '#111827', fontFamily: 'Inter, sans-serif' }}>
            {title || 'Untitled RFP'}
          </Title>
          <Text type="secondary" style={{ fontFamily: 'Inter, sans-serif' }}>
            Review the generated RFP details below
          </Text>
        </div>

        {/* Key Information - Show all fields, display "Not Applicable" for null values */}
        <Descriptions
          bordered
          column={2}
          size="small"
          style={{ marginBottom: 24 }}
          labelStyle={{
            fontWeight: 600,
            backgroundColor: '#f9fafb',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <Descriptions.Item label="Budget">
            {budget !== null && budget !== undefined ? (
              <Text strong style={{ fontSize: '16px', color: '#2563eb', fontFamily: 'Inter, sans-serif' }}>
                {currencySymbol || '$'}
                {budget.toLocaleString()}
              </Text>
            ) : (
              <Text type="secondary" style={{ fontFamily: 'Inter, sans-serif' }}>
                Not Applicable
              </Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Delivery Timeline">
            {deliveryTimeline ? (
              <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
                {deliveryTimeline}
              </Tag>
            ) : (
              <Text type="secondary" style={{ fontFamily: 'Inter, sans-serif' }}>
                Not Applicable
              </Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Terms">
            {paymentTerms ? (
              <Text style={{ fontFamily: 'Inter, sans-serif' }}>{paymentTerms}</Text>
            ) : (
              <Text type="secondary" style={{ fontFamily: 'Inter, sans-serif' }}>
                Not Applicable
              </Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Warranty">
            {warranty ? (
              <Text style={{ fontFamily: 'Inter, sans-serif' }}>{warranty}</Text>
            ) : (
              <Text type="secondary" style={{ fontFamily: 'Inter, sans-serif' }}>
                Not Applicable
              </Text>
            )}
          </Descriptions.Item>
        </Descriptions>

        {/* Items Table */}
        {displayItems.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Title level={5} style={{ marginBottom: 12, color: '#111827', fontFamily: 'Inter, sans-serif' }}>
              Items Required
            </Title>
            <Table
              dataSource={displayItems}
              columns={itemsTableColumns}
              rowKey={(record, index) => record._id || `item-${index}`}
              pagination={false}
              size="small"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>
        )}

        {/* Original Description */}
        {rfpData.descriptionRaw && (
          <div style={{ marginTop: 24, padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
              <strong>Original Description:</strong>
            </Text>
            <Text
              style={{
                display: 'block',
                marginTop: '8px',
                fontSize: '13px',
                color: '#6b7280',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {rfpData.descriptionRaw}
            </Text>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RfpModal;
