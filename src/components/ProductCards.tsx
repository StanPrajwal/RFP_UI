import { useState, useMemo } from 'react';
import { Card, Row, Col, Typography, Empty, Spin, Tag, Input, Button, Space, Modal } from 'antd';
import {
  ShoppingOutlined,
  SearchOutlined,
  EyeOutlined,
  DollarOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import type { Product } from '../services/api';
import '../App.css';

const { Meta } = Card;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

interface ProductCardsProps {
  products: Product[];
  loading?: boolean;
}

const ProductCards: React.FC<ProductCardsProps> = ({ products, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading-state">
          <Spin size="large" />
          <Text className="loading-text">Loading products...</Text>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="products-container">
        <Title level={3} className="products-title">
          <ShoppingOutlined style={{ marginRight: 8, color: '#667eea' }} />
          Products
        </Title>
        <Text className="products-subtitle">Discover products recommended by AI</Text>
        <Empty
          description={
            <span className="empty-description">
              No products to display yet. Start chatting to see product recommendations!
            </span>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="empty-state"
        />
      </div>
    );
  }

  return (
    <div className="products-container">
      {/* Header with Search */}
      <div className="products-header">
        <div>
          <Title level={3} className="products-title">
            <ShoppingOutlined style={{ marginRight: 8, color: '#667eea' }} />
            Recommended Products
          </Title>
          <Text className="products-subtitle">
            {filteredProducts.length} of {products.length}{' '}
            {products.length === 1 ? 'product' : 'products'}
            {searchQuery && ` matching "${searchQuery}"`}
          </Text>
        </div>
        <Search
          placeholder="Search products..."
          allowClear
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: 300 }}
          className="product-search"
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <Text className="no-results-text">No products found matching your search.</Text>
          <Button
            type="link"
            icon={<ClearOutlined />}
            onClick={() => setSearchQuery('')}
            style={{ marginTop: 8 }}
          >
            Clear search
          </Button>
        </div>
      ) : (
        <Row gutter={[24, 24]} className="products-grid">
          {filteredProducts.map((product, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                className="product-card"
                style={{
                  animation: `fadeInUp 0.4s ease ${index * 0.05}s both`,
                }}
                cover={
                  product.image ? (
                    <div className="product-image-container">
                      <img
                        alt={product.name}
                        src={product.image}
                        className="product-image"
                        loading="lazy"
                      />
                      <div className="product-overlay">
                        <Button
                          type="primary"
                          icon={<EyeOutlined />}
                          onClick={() => handleViewDetails(product)}
                          className="view-details-button"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="product-image-placeholder">
                      <ShoppingOutlined />
                    </div>
                  )
                }
                actions={[
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(product)}
                    key="view"
                  >
                    View
                  </Button>,
                ]}
              >
                <Meta
                  title={<Text className="product-name">{product.name}</Text>}
                  description={
                    <div className="product-description">
                      {product.description && (
                        <Paragraph
                          ellipsis={{ tooltip: product.description, rows: 2 }}
                          className="product-description-text"
                        >
                          {product.description}
                        </Paragraph>
                      )}
                      <div className="product-footer">
                        {product.price !== undefined && (
                          <div className="product-price">
                            <DollarOutlined style={{ fontSize: 16, marginRight: 4 }} />
                            <Text className="price-text">${product.price.toFixed(2)}</Text>
                          </div>
                        )}
                        {product.category && (
                          <Tag color="purple" className="product-category">
                            {product.category}
                          </Tag>
                        )}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Product Detail Modal */}
      <Modal
        title={
          <Space>
            <ShoppingOutlined style={{ color: '#667eea' }} />
            <span>{selectedProduct?.name}</span>
          </Space>
        }
        open={!!selectedProduct}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
        ]}
        width={600}
        className="product-modal"
      >
        {selectedProduct && (
          <div className="product-detail">
            {selectedProduct.image && (
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="product-detail-image"
              />
            )}
            <div className="product-detail-content">
              {selectedProduct.description && (
                <Paragraph className="product-detail-description">
                  {selectedProduct.description}
                </Paragraph>
              )}
              <div className="product-detail-info">
                {selectedProduct.price !== undefined && (
                  <div className="product-detail-price">
                    <Text strong className="price-label">Price:</Text>
                    <Text className="price-value">${selectedProduct.price.toFixed(2)}</Text>
                  </div>
                )}
                {selectedProduct.category && (
                  <div className="product-detail-category">
                    <Text strong className="category-label">Category:</Text>
                    <Tag color="purple">{selectedProduct.category}</Tag>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductCards;
