import { useState, useRef, useEffect } from 'react';
import { Input, Button, Typography, Space, Spin, message as antMessage } from 'antd';
import {
  SendOutlined,
  MessageOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useGenerateRfp } from '../services/api';
import RfpModal from './RfpModal';
import '../App.css';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface ChatWindowProps {
  onRfpSaved?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onRfpSaved }) => {
  const [inputValue, setInputValue] = useState('');
  const [rfpModalOpen, setRfpModalOpen] = useState(false);
  const [generatedRfp, setGeneratedRfp] = useState<any>(null);
  const inputRef = useRef<any>(null);
  const generateRfpMutation = useGenerateRfp();

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle successful RFP generation
  useEffect(() => {
    if (generateRfpMutation.isSuccess && generateRfpMutation.data) {
      // Set generated RFP data and open modal
      if (generateRfpMutation.data.structuredRfp) {
        setGeneratedRfp(generateRfpMutation.data.structuredRfp);
        setRfpModalOpen(true);
        // Clear input after successful generation
        setInputValue('');
      }

      // Auto-focus input after response
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [generateRfpMutation.isSuccess, generateRfpMutation.data]);

  // Handle errors
  useEffect(() => {
    if (generateRfpMutation.isError) {
      antMessage.error('Failed to generate RFP. Please try again.');
    }
  }, [generateRfpMutation.isError]);

  const handleSend = () => {
    if (!inputValue.trim() || generateRfpMutation.isPending) return;

    const messageText = inputValue.trim();
    setInputValue('');

    // Call RFP generation API
    generateRfpMutation.mutate(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRetry = () => {
    if (generateRfpMutation.isError && inputValue.trim()) {
      generateRfpMutation.mutate(inputValue.trim());
    }
  };

  const handleModalClose = () => {
    setRfpModalOpen(false);
    // Don't clear generatedRfp immediately to prevent issues during navigation
    setTimeout(() => {
      setGeneratedRfp(null);
    }, 300);
  };

  const handleSaveSuccess = () => {
    // Close modal first
    setRfpModalOpen(false);
    setGeneratedRfp(null);
    setInputValue('');
    
    // Then trigger navigation after modal is fully closed
    setTimeout(() => {
      if (onRfpSaved) {
        onRfpSaved();
      }
    }, 200);
  };

  return (
    <>
      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={4} className="chat-header-title">
                <MessageOutlined style={{ marginRight: 8, color: '#2563eb' }} />
                Create New RFP
              </Title>
              <Text className="chat-header-subtitle">
                Describe your procurement needs and I'll generate an RFP for you
              </Text>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="messages-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {generateRfpMutation.isPending ? (
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" />
              <Text style={{ display: 'block', marginTop: 16, color: '#6b7280', fontSize: '15px' }}>
                Generating RFP...
              </Text>
            </div>
          ) : (
            <div className="empty-chat-state">
              <div className="empty-chat-icon">
                <MessageOutlined />
              </div>
              <Text className="empty-chat-title">Describe Your Procurement Needs</Text>
              <Text className="empty-chat-subtitle">
                Type what you need to procure and I'll generate a structured RFP for you
              </Text>
              <div className="suggestion-chips">
                <Button
                  type="text"
                  size="small"
                  onClick={() =>
                    setInputValue(
                      'I need 25 desktop computers and 10 projectors for a training center. Budget is $40,000. Delivery in 45 days.'
                    )
                  }
                  style={{ margin: '4px' }}
                >
                  Example: Training Center Equipment
                </Button>
                <Button
                  type="text"
                  size="small"
                  onClick={() =>
                    setInputValue(
                      'I need 20 laptops with 16GB RAM and 15 monitors 27-inch. Budget $50,000. Delivery within 30 days.'
                    )
                  }
                  style={{ margin: '4px' }}
                >
                  Example: Office Equipment
                </Button>
              </div>
            </div>
          )}
          {generateRfpMutation.isError && (
            <div className="error-message">
              <Text type="danger" style={{ marginRight: 8 }}>
                Failed to generate RFP
              </Text>
              <Button
                type="link"
                size="small"
                icon={<ReloadOutlined />}
                onClick={handleRetry}
                style={{ padding: 0 }}
              >
                Retry
              </Button>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="input-container">
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you need to procure... (Press Enter to send, Shift+Enter for new line)"
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={generateRfpMutation.isPending}
              className="chat-input"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={generateRfpMutation.isPending}
              disabled={!inputValue.trim()}
              className="send-button"
            >
              Generate RFP
            </Button>
          </Space.Compact>
        </div>
      </div>

      {/* RFP Modal */}
      {rfpModalOpen && (
        <RfpModal
          open={rfpModalOpen}
          rfpData={generatedRfp}
          onClose={handleModalClose}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </>
  );
};

export default ChatWindow;
