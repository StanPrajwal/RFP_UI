import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Descriptions,
  Table,
  Button,
  Space,
  Tag,
  Spin,
  message,
  Select,
  Empty,
  Modal,
  Row,
  Col,
} from 'antd';
import {
  ArrowLeftOutlined,
  UserAddOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import {
  useFetchAllRfps,
  useFetchVendors,
  useAssignVendors,
  useSendRfp,
  useFetchComparison,
} from '../services/api';
import type { Vendor } from '../services/api';
import '../App.css';

const { Title, Text } = Typography;
const { Option } = Select;

const RfpDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: rfpsData, isLoading: rfpsLoading } = useFetchAllRfps();
  const { data: vendorsData, isLoading: vendorsLoading } = useFetchVendors();
  const { data: comparisonData, isLoading: comparisonLoading } = useFetchComparison(id);
  const assignVendorsMutation = useAssignVendors();
  const sendRfpMutation = useSendRfp();

  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  // Find the current RFP
  const rfp = rfpsData?.data?.find((r) => r._id === id);
  const vendors = vendorsData?.data || [];
  const assignedVendorIds = rfp?.vendorsInvited || [];

  // Get assigned vendor details - remove duplicates
  const uniqueAssignedVendorIds = Array.from(new Set(assignedVendorIds));
  const assignedVendors = vendors.filter((v) => uniqueAssignedVendorIds.includes(v._id));

  useEffect(() => {
    if (rfp) {
      setSelectedVendors(assignedVendorIds);
    }
  }, [rfp, assignedVendorIds]);

  const handleAssignVendors = () => {
    if (!id || selectedVendors.length === 0) {
      message.warning('Please select at least one vendor');
      return;
    }

    assignVendorsMutation.mutate(
      { rfpId: id, vendorIds: selectedVendors },
      {
        onSuccess: () => {
          message.success('Vendors assigned successfully!');
          setShowAssignModal(false);
        },
        onError: (error: any) => {
          message.error(error?.message || 'Failed to assign vendors');
        },
      }
    );
  };

  const handleSendRfp = () => {
    if (!id || selectedVendors.length === 0) {
      message.warning('Please assign vendors first');
      return;
    }

    sendRfpMutation.mutate(
      { rfpId: id, vendorIds: selectedVendors },
      {
        onSuccess: () => {
          message.success('RFP sent to vendors successfully!');
          setShowSendModal(false);
        },
        onError: (error: any) => {
          message.error(error?.message || 'Failed to send RFP');
        },
      }
    );
  };

  if (rfpsLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <Spin size="large" />
        <Text style={{ display: 'block', marginTop: 20, color: '#6b7280' }}>Loading RFP details...</Text>
      </div>
    );
  }

  if (!rfp) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <Empty description="RFP not found" />
        <Button type="primary" onClick={() => navigate('/')} style={{ marginTop: 20 }}>
          Back to RFPs
        </Button>
      </div>
    );
  }

  const { title, descriptionRaw, descriptionStructured, status, createdAt } = rfp;
  const { budget, currencySymbol, deliveryTimeline, paymentTerms, warranty, items } =
    descriptionStructured || {};

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

  const displayItems = items?.filter((item) => item && item.item) || [];

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          style={{ marginBottom: 20 }}
        >
          Back to RFPs
        </Button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2} style={{ marginBottom: 8, color: '#111827', fontFamily: 'Inter, sans-serif' }}>
              {title || 'Untitled RFP'}
            </Title>
            <Space>
              <Tag
                color={status === 'sent' ? 'success' : 'processing'}
                icon={status === 'sent' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                style={{ fontSize: '13px', padding: '4px 12px' }}
              >
                {status || 'draft'}
              </Tag>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                Created: {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
              </Text>
            </Space>
          </div>
          <Space>
            <Button
              type="default"
              icon={<UserAddOutlined />}
              onClick={() => setShowAssignModal(true)}
              size="large"
              style={{ height: '44px', padding: '0 24px' }}
            >
              Assign Vendors
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => setShowSendModal(true)}
              size="large"
              disabled={assignedVendorIds.length === 0}
              style={{
                background: '#2563eb',
                border: 'none',
                height: '44px',
                padding: '0 24px',
              }}
            >
              Send RFP
            </Button>
          </Space>
        </div>
      </div>

      {/* RFP Details */}
      <Card style={{ marginBottom: 24, borderRadius: '12px' }}>
        <Title level={4} style={{ marginBottom: 20, fontFamily: 'Inter, sans-serif' }}>
          RFP Details
        </Title>
        <Descriptions
          bordered
          column={2}
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
              <Text type="secondary">Not Applicable</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Delivery Timeline">
            {deliveryTimeline ? (
              <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
                {deliveryTimeline}
              </Tag>
            ) : (
              <Text type="secondary">Not Applicable</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Terms">
            {paymentTerms ? <Text>{paymentTerms}</Text> : <Text type="secondary">Not Applicable</Text>}
          </Descriptions.Item>
          <Descriptions.Item label="Warranty">
            {warranty ? <Text>{warranty}</Text> : <Text type="secondary">Not Applicable</Text>}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Items Table */}
      {displayItems.length > 0 && (
        <Card style={{ marginBottom: 24, borderRadius: '12px' }}>
          <Title level={4} style={{ marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
            Items Required
          </Title>
          <Table
            dataSource={displayItems}
            columns={itemsTableColumns}
            rowKey={(record, index) => record._id || `item-${index}`}
            pagination={false}
          />
        </Card>
      )}

      {/* Assigned Vendors */}
      <Card style={{ marginBottom: 24, borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0, fontFamily: 'Inter, sans-serif' }}>
            Assigned Vendors
          </Title>
          <Button
            type="link"
            icon={<UserAddOutlined />}
            onClick={() => setShowAssignModal(true)}
          >
            {assignedVendorIds.length > 0 ? 'Edit Vendors' : 'Assign Vendors'}
          </Button>
        </div>
        {assignedVendors.length > 0 ? (
          <div>
            {assignedVendors.map((vendor: Vendor, index: number) => (
              <Card
                key={`vendor-${vendor._id}-${index}`}
                size="small"
                style={{ marginBottom: 12, backgroundColor: '#f9fafb' }}
              >
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text strong style={{ fontSize: '15px' }}>
                    {vendor.name}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    {vendor.email}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    {vendor.phone} • {vendor.address}
                  </Text>
                </Space>
              </Card>
            ))}
          </div>
        ) : (
          <Empty
            description="No vendors assigned yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: '40px 0' }}
          >
            <Button type="primary" icon={<UserAddOutlined />} onClick={() => setShowAssignModal(true)}>
              Assign Vendors
            </Button>
          </Empty>
        )}
      </Card>

      {/* Comparison Section */}
      <Card style={{ marginBottom: 24, borderRadius: '12px', border: '2px solid #2563eb' }}>
        <Title level={4} style={{ marginBottom: 20, fontFamily: 'Inter, sans-serif' }}>
          <BarChartOutlined style={{ marginRight: 8, color: '#2563eb' }} />
          Vendor Proposals Comparison
        </Title>

        {comparisonLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin />
            <Text style={{ display: 'block', marginTop: 12, color: '#6b7280' }}>
              Analyzing proposals...
            </Text>
          </div>
        ) : comparisonData?.data?.comparison ? (
            <>
              {/* Summary */}
              {comparisonData.data.comparison.summary && (
                <div style={{ marginBottom: 24 }}>
                  {comparisonData.data.comparison.summary.note && (
                    <Text
                      type="secondary"
                      style={{ display: 'block', marginBottom: 16, fontStyle: 'italic' }}
                    >
                      {comparisonData.data.comparison.summary.note}
                    </Text>
                  )}
                  <Row gutter={[16, 16]}>
                    {comparisonData.data.comparison.summary.bestPrice && (
                      <Col xs={24} sm={8}>
                        <Card size="small" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bfdbfe' }}>
                          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                            Best Price
                          </Text>
                          <Text strong style={{ fontSize: '16px', display: 'block' }}>
                            {comparisonData.data.comparison.summary.bestPrice.vendorName}
                          </Text>
                          <Text style={{ color: '#2563eb', fontSize: '14px', fontWeight: 600 }}>
                            {comparisonData.data.comparison.summary.bestPrice.currency || '$'}
                            {comparisonData.data.comparison.summary.bestPrice.price !== null && comparisonData.data.comparison.summary.bestPrice.price !== undefined
                              ? comparisonData.data.comparison.summary.bestPrice.price.toLocaleString()
                              : 'N/A'}
                          </Text>
                        </Card>
                      </Col>
                    )}
                    {comparisonData.data.comparison.summary.bestDelivery && (
                      <Col xs={24} sm={8}>
                        <Card size="small" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                            Best Delivery
                          </Text>
                          <Text strong style={{ fontSize: '16px', display: 'block' }}>
                            {comparisonData.data.comparison.summary.bestDelivery.vendorName}
                          </Text>
                          <Text style={{ color: '#059669', fontSize: '14px', fontWeight: 600 }}>
                            {comparisonData.data.comparison.summary.bestDelivery.timeline}
                          </Text>
                        </Card>
                      </Col>
                    )}
                    {comparisonData.data.comparison.summary.bestOverall && (
                      <Col xs={24} sm={8}>
                        <Card size="small" style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
                          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                            Best Overall
                          </Text>
                          <Text strong style={{ fontSize: '16px', display: 'block' }}>
                            {comparisonData.data.comparison.summary.bestOverall.vendorName}
                          </Text>
                          <Text style={{ color: '#d97706', fontSize: '14px', fontWeight: 600 }}>
                            Score:{' '}
                            {comparisonData.data.comparison.summary.bestOverall.score !== null &&
                            comparisonData.data.comparison.summary.bestOverall.score !== undefined
                              ? `${comparisonData.data.comparison.summary.bestOverall.score}/10`
                              : 'N/A'}
                          </Text>
                        </Card>
                      </Col>
                    )}
                  </Row>
                </div>
              )}

              {/* Comparison Table */}
              {comparisonData.data.comparison.comparisonTable &&
                comparisonData.data.comparison.comparisonTable.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <Title level={5} style={{ marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
                      Detailed Comparison
                    </Title>
                    <Table
                      dataSource={comparisonData.data.comparison.comparisonTable}
                      columns={[
                        {
                          title: 'Vendor',
                          dataIndex: 'vendorName',
                          key: 'vendorName',
                          render: (text: string) => <Text strong>{text}</Text>,
                        },
                        {
                          title: 'Total Price',
                          key: 'totalPrice',
                          render: (_: any, record: any) => (
                            <Text strong style={{ color: '#2563eb' }}>
                              {record.currency || '$'}
                              {record.totalPrice?.toLocaleString() || 'N/A'}
                            </Text>
                          ),
                        },
                        {
                          title: 'Delivery',
                          dataIndex: 'deliveryTimeline',
                          key: 'deliveryTimeline',
                          render: (text: string) => text || 'Not Applicable',
                        },
                        {
                          title: 'Payment Terms',
                          dataIndex: 'paymentTerms',
                          key: 'paymentTerms',
                          render: (text: string) => text || 'Not Applicable',
                        },
                        {
                          title: 'Warranty',
                          dataIndex: 'warranty',
                          key: 'warranty',
                          render: (text: string) => text || 'Not Applicable',
                        },
                        {
                          title: 'Overall Score',
                          dataIndex: 'overallScore',
                          key: 'overallScore',
                          align: 'center' as const,
                          render: (score: number | null | undefined) => {
                            if (score === null || score === undefined) return <Text type="secondary">N/A</Text>;
                            return (
                              <Tag color={score >= 8 ? 'green' : score >= 6 ? 'orange' : 'red'}>
                                {score}/10
                              </Tag>
                            );
                          },
                        },
                        {
                          title: 'Price Score',
                          dataIndex: 'priceScore',
                          key: 'priceScore',
                          align: 'center' as const,
                          render: (score: number | null | undefined) => {
                            if (score === null || score === undefined) return <Text type="secondary">N/A</Text>;
                            return <Tag color="blue">{score}/10</Tag>;
                          },
                        },
                        {
                          title: 'Delivery Score',
                          dataIndex: 'deliveryScore',
                          key: 'deliveryScore',
                          align: 'center' as const,
                          render: (score: number | null | undefined) => {
                            if (score === null || score === undefined) return <Text type="secondary">N/A</Text>;
                            return <Tag color="cyan">{score}/10</Tag>;
                          },
                        },
                        {
                          title: 'Warranty Score',
                          dataIndex: 'warrantyScore',
                          key: 'warrantyScore',
                          align: 'center' as const,
                          render: (score: number | null | undefined) => {
                            if (score === null || score === undefined) return <Text type="secondary">N/A</Text>;
                            return <Tag color="purple">{score}/10</Tag>;
                          },
                        },
                        {
                          title: 'Completeness',
                          dataIndex: 'completenessScore',
                          key: 'completenessScore',
                          align: 'center' as const,
                          render: (score: number | null | undefined) => {
                            if (score === null || score === undefined) return <Text type="secondary">N/A</Text>;
                            return <Tag color="geekblue">{score}/10</Tag>;
                          },
                        },
                        {
                          title: 'AI Recommendation',
                          dataIndex: 'aiRecommendation',
                          key: 'aiRecommendation',
                          align: 'center' as const,
                          render: (rec: string | null | undefined) => {
                            if (!rec) return <Text type="secondary">N/A</Text>;
                            return (
                              <Tag color={rec.toLowerCase().includes('recommended') ? 'green' : 'default'}>
                                {rec}
                              </Tag>
                            );
                          },
                        },
                      ]}
                      rowKey="vendorId"
                      pagination={false}
                      size="small"
                      expandable={{
                        expandedRowRender: (record: any) => (
                          <div style={{ padding: '16px', backgroundColor: '#f9fafb' }}>
                            {record.strengths && record.strengths.length > 0 && (
                              <div style={{ marginBottom: 12 }}>
                                <Text strong style={{ display: 'block', marginBottom: 8, color: '#059669' }}>
                                  Strengths:
                                </Text>
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                  {record.strengths.map((strength: string, idx: number) => (
                                    <li key={idx}>
                                      <Text style={{ fontSize: '13px' }}>{strength}</Text>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {record.weaknesses && record.weaknesses.length > 0 && (
                              <div>
                                <Text strong style={{ display: 'block', marginBottom: 8, color: '#dc2626' }}>
                                  Weaknesses:
                                </Text>
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                  {record.weaknesses.map((weakness: string, idx: number) => (
                                    <li key={idx}>
                                      <Text style={{ fontSize: '13px' }}>{weakness}</Text>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ),
                        rowExpandable: (record: any) =>
                          (record.strengths && record.strengths.length > 0) ||
                          (record.weaknesses && record.weaknesses.length > 0),
                      }}
                    />
                  </div>
                )}

              {/* Recommendation */}
              {comparisonData.data.comparison.recommendation && (
                <div
                  style={{
                    padding: '20px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  <Title level={5} style={{ marginBottom: 12, color: '#1e40af', fontFamily: 'Inter, sans-serif' }}>
                    <CheckCircleOutlined style={{ marginRight: 8, color: '#2563eb' }} />
                    Recommendation
                  </Title>
                  <Text strong style={{ display: 'block', marginBottom: 8, fontSize: '16px' }}>
                    Recommended Vendor: {comparisonData.data.comparison.recommendation.recommendedVendorName}
                  </Text>
                  <Text style={{ display: 'block', marginBottom: 12, color: '#1e293b', lineHeight: '1.6' }}>
                    {comparisonData.data.comparison.recommendation.reasoning}
                  </Text>
                  {comparisonData.data.comparison.recommendation.keyFactors.length > 0 && (
                    <div>
                      <Text strong style={{ display: 'block', marginBottom: 8, fontSize: '13px' }}>
                        Key Factors:
                      </Text>
                      <Space wrap>
                        {comparisonData.data.comparison.recommendation.keyFactors.map((factor, idx) => (
                          <Tag key={idx} color="blue" style={{ marginBottom: 4 }}>
                            {factor}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <Empty
              description={
                <div>
                  <Text style={{ fontSize: '16px', color: '#111827', display: 'block', marginBottom: 8 }}>
                    No comparison data available
                  </Text>
                  <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                    Send the RFP to vendors and wait for proposals to see the comparison
                  </Text>
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ padding: '60px 0' }}
            />
          )}
        </Card>

      {/* Original Description */}
      {descriptionRaw && (
        <Card style={{ borderRadius: '12px' }}>
          <Title level={4} style={{ marginBottom: 12, fontFamily: 'Inter, sans-serif' }}>
            Original Description
          </Title>
          <Text style={{ color: '#6b7280', fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
            {descriptionRaw}
          </Text>
        </Card>
      )}

      {/* Assign Vendors Modal */}
      <Modal
        title="Assign Vendors"
        open={showAssignModal}
        onCancel={() => setShowAssignModal(false)}
        onOk={handleAssignVendors}
        okText="Assign"
        confirmLoading={assignVendorsMutation.isPending}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Select Vendors:
          </Text>
          {vendorsLoading ? (
            <Spin />
          ) : (
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select vendors to assign"
              value={selectedVendors}
              onChange={setSelectedVendors}
              optionLabelProp="label"
            >
              {vendors.map((vendor: Vendor) => (
                <Option key={vendor._id} value={vendor._id} label={vendor.name}>
                  <div>
                    <Text strong>{vendor.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {vendor.email} • {vendor.phone}
                    </Text>
                  </div>
                </Option>
              ))}
            </Select>
          )}
        </div>
        {selectedVendors.length > 0 && (
          <Text type="secondary" style={{ fontSize: '13px' }}>
            {selectedVendors.length} vendor{selectedVendors.length > 1 ? 's' : ''} selected
          </Text>
        )}
      </Modal>

      {/* Send RFP Modal */}
      <Modal
        title="Send RFP to Vendors"
        open={showSendModal}
        onCancel={() => setShowSendModal(false)}
        onOk={handleSendRfp}
        okText="Send"
        confirmLoading={sendRfpMutation.isPending}
        width={500}
      >
        <div>
          <Text style={{ display: 'block', marginBottom: 16 }}>
            Are you sure you want to send this RFP to the assigned vendors?
          </Text>
          {selectedVendors.length > 0 && (
            <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Vendors ({selectedVendors.length}):
              </Text>
              {selectedVendors.map((vendorId) => {
                const vendor = vendors.find((v) => v._id === vendorId);
                return vendor ? (
                  <Text key={vendorId} style={{ display: 'block', fontSize: '13px' }}>
                    • {vendor.name} ({vendor.email})
                  </Text>
                ) : null;
              })}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default RfpDetail;
