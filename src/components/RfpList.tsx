import { Card, Row, Col, Typography, Tag, Button, Empty, Spin, Space } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useFetchAllRfps } from '../services/api';
import { useNavigate } from 'react-router-dom';
import type { RFP } from '../services/api';
import '../App.css';

const { Title, Text } = Typography;

const RfpList: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useFetchAllRfps();

  const handleViewDetails = (rfpId: string) => {
    navigate(`/rfp/${rfpId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'sent' ? 'success' : 'processing';
  };

  const getStatusIcon = (status: string) => {
    return status === 'sent' ? <CheckCircleOutlined /> : <ClockCircleOutlined />;
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <Spin size="large" />
        <Text style={{ display: 'block', marginTop: 20, color: '#6b7280', fontSize: '15px' }}>
          Loading RFPs...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <Text type="danger" style={{ fontSize: '15px' }}>Failed to load RFPs. Please try again.</Text>
        <Button onClick={() => refetch()} style={{ marginTop: 20 }} type="primary">
          Retry
        </Button>
      </div>
    );
  }

  const rfps = data?.data || [];

  return (
    <div className="rfp-list-container">
      {/* Header */}
      <div className="rfp-list-header">
        <div>
          <Title level={2} className="rfp-list-title">
            Request for Proposals
          </Title>
          <Text className="rfp-list-subtitle">
            {rfps.length} {rfps.length === 1 ? 'RFP' : 'RFPs'} {rfps.length > 0 ? 'found' : 'created'}
          </Text>
        </div>
      </div>

      {/* RFP Cards Grid */}
      {rfps.length === 0 ? (
        <div className="rfp-empty-state">
          <Empty
            description={
              <div>
                <Text
                  style={{
                    fontSize: '18px',
                    color: '#111827',
                    display: 'block',
                    marginBottom: 8,
                    fontWeight: 500,
                  }}
                >
                  No RFPs created yet
                </Text>
                <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                  Create your first RFP using AI-powered natural language
                </Text>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <Row gutter={[20, 20]} className="rfp-cards-grid">
          {rfps.map((rfp: RFP) => {
            const budget = rfp.descriptionStructured?.budget;
            const currencySymbol = rfp.descriptionStructured?.currencySymbol || '$';
            const deliveryTimeline = rfp.descriptionStructured?.deliveryTimeline;
            const items = rfp.descriptionStructured?.items || [];
            const vendorsInvited = rfp.vendorsInvited || [];

            return (
              <Col xs={24} sm={12} lg={8} xl={6} key={rfp._id}>
                <Card
                  hoverable
                  className="rfp-card"
                  onClick={() => handleViewDetails(rfp._id)}
                  style={{
                    height: '100%',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ marginBottom: 20 }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 14 }}>
                      <Tag
                        color={getStatusColor(rfp.status)}
                        icon={getStatusIcon(rfp.status)}
                        style={{
                          fontSize: '12px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          textTransform: 'capitalize',
                          fontWeight: 500,
                          margin: 0,
                        }}
                      >
                        {rfp.status || 'draft'}
                      </Tag>
                      <Text type="secondary" style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {rfp.createdAt ? formatDate(rfp.createdAt) : 'N/A'}
                      </Text>
                    </Space>
                    <Title
                      level={5}
                      style={{
                        margin: 0,
                        color: '#111827',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '16px',
                        lineHeight: '1.4',
                      }}
                      ellipsis={{ tooltip: rfp.title, rows: 2 }}
                    >
                      {rfp.title || 'Untitled RFP'}
                    </Title>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                      <div>
                        <Text
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontWeight: 500,
                            display: 'block',
                            marginBottom: 4,
                          }}
                        >
                          Budget
                        </Text>
                        {budget !== null && budget !== undefined ? (
                          <Text
                            style={{
                              fontSize: '20px',
                              fontWeight: 700,
                              color: '#2563eb',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            {currencySymbol}
                            {budget.toLocaleString()}
                          </Text>
                        ) : (
                          <Text
                            type="secondary"
                            style={{
                              fontSize: '15px',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            Not Applicable
                          </Text>
                        )}
                      </div>
                      <div>
                        <Text
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontWeight: 500,
                            display: 'block',
                            marginBottom: 4,
                          }}
                        >
                          Delivery Timeline
                        </Text>
                        {deliveryTimeline ? (
                          <Text
                            style={{
                              fontSize: '15px',
                              fontWeight: 600,
                              color: '#111827',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            {deliveryTimeline}
                          </Text>
                        ) : (
                          <Text
                            type="secondary"
                            style={{
                              fontSize: '15px',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            Not Applicable
                          </Text>
                        )}
                      </div>
                    </Space>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid #f3f4f6',
                      paddingTop: 16,
                      marginTop: 'auto',
                    }}
                  >
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Text type="secondary" style={{ fontSize: '13px', color: '#9ca3af' }}>
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </Text>
                      {vendorsInvited.length > 0 && (
                        <Text type="secondary" style={{ fontSize: '13px', color: '#9ca3af' }}>
                          {vendorsInvited.length} {vendorsInvited.length === 1 ? 'vendor' : 'vendors'}
                        </Text>
                      )}
                    </Space>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default RfpList;
