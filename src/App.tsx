import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout, Typography, Button } from 'antd';
import { RobotOutlined, FileTextOutlined } from '@ant-design/icons';
import ChatWindow from './components/ChatWindow';
import RfpList from './components/RfpList';
import RfpDetail from './components/RfpDetail';
import './App.css';

const { Header, Content } = Layout;
const { Text } = Typography;

function AppHeader() {
  const navigate = useNavigate();

  return (
    <Header
      className="app-header"
      style={{
        padding: '0 40px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div className="header-content" style={{ justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <RobotOutlined style={{ fontSize: 20, color: 'white' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.2 }}>
            <h1 className="header-title" style={{ margin: 0, padding: 0, cursor: 'pointer', lineHeight: '1.2' }}>
              AI RFP Assistant
            </h1>
            <Text className="header-subtitle" style={{ display: 'block', margin: 0, padding: 0, lineHeight: '1.4' }}>
              Streamline Your Procurement Process
            </Text>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            type="text"
            icon={<FileTextOutlined />}
            onClick={() => navigate('/')}
            style={{
              color: '#374151',
              fontSize: '14px',
              fontWeight: 500,
              height: '40px',
              padding: '0 16px',
            }}
          >
            All RFPs
          </Button>
          <Button
            type="primary"
            icon={<RobotOutlined />}
            onClick={() => navigate('/chat')}
            style={{
              background: '#2563eb',
              border: 'none',
              fontSize: '14px',
              fontWeight: 500,
              height: '40px',
              padding: '0 20px',
              borderRadius: '8px',
            }}
          >
            Create RFP
          </Button>
        </div>
      </div>
    </Header>
  );
}

function ChatPage() {
  const navigate = useNavigate();

  const handleRfpSaved = () => {
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
      <AppHeader />
      <Content>
        <div style={{ display: 'flex', justifyContent: 'center', height: 'calc(100vh - 72px)' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '900px',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ChatWindow onRfpSaved={handleRfpSaved} />
          </div>
        </div>
      </Content>
    </Layout>
  );
}

function HomePage() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <AppHeader />
      <Content style={{ padding: '40px', background: '#f9fafb' }}>
        <RfpList />
      </Content>
    </Layout>
  );
}

function RfpDetailPage() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <AppHeader />
      <Content style={{ background: '#f9fafb' }}>
        <RfpDetail />
      </Content>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/rfp/:id" element={<RfpDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
