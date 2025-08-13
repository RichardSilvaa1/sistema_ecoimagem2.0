import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Layout from '../layout/Layout';
import api from '../../services/api';
import styled from 'styled-components';
import { toast } from 'react-toastify';

// Estilo do Card
const Card = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 24px;
`;

// Estilo das Abas
const Tabs = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: ${(props) => (props.active ? '#7AC143' : '#E6E6E6')};
  color: ${(props) => (props.active ? 'white' : '#333')};
  font-size: 14px;
  transition: background 0.3s ease;
`;

// Estilo da Tabela
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 15px;
  background: #f2f9f4;
  color: #333;
  text-align: left;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  color: ${(props) => (props.status === 'Enviado' ? 'green' : props.status === 'Falhou' ? 'red' : 'inherit')};
`;

// Estilo do Input de Filtro
const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  width: 200px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #7AC143;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const Logs = () => {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('actions');
  const [exameId, setExameId] = useState('');

  const fetchLogs = async () => {
    if (user?.role !== 'Admin') {
      toast.error('Acesso negado: Apenas administradores podem visualizar logs.');
      return;
    }

    try {
      if (activeTab === 'actions') {
        const response = await api.get('/api/logs');
        setLogs(response.data || []);
      } else {
        const endpoint = exameId ? `/api/logs/email-logs/${exameId}` : '/api/logs/email-logs';
        const response = await api.get(endpoint);
        setEmailLogs(response.data || []);
      }
    } catch (error) {
      const message = error.response?.data?.error || `Erro ao carregar logs de ${activeTab === 'actions' ? 'ações' : 'e-mails'}`;
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user, activeTab]);

  const handleFilter = () => {
    fetchLogs();
    toast.info('Logs atualizados!');
  };

  return (
    <Layout onRefresh={handleFilter}>
      <h1>Logs</h1>
      {user?.role === 'Admin' ? (
        <>
          <Tabs>
            <TabButton
              active={activeTab === 'actions'}
              onClick={() => setActiveTab('actions')}
            >
              Ações
            </TabButton>
            <TabButton
              active={activeTab === 'emails'}
              onClick={() => {
                setActiveTab('emails');
                setExameId('');
              }}
            >
              E-mails
            </TabButton>
          </Tabs>
          {activeTab === 'emails' && (
            <FilterContainer>
              <Input
                type="text"
                placeholder="ID do Exame"
                value={exameId}
                onChange={(e) => setExameId(e.target.value)}
              />
              <Button onClick={handleFilter}>Filtrar</Button>
            </FilterContainer>
          )}
          <Card>
            {activeTab === 'actions' ? (
              <Table>
                <thead>
                  <tr>
                    <Th>Exame ID</Th>
                    <Th>Usuário ID</Th>
                    <Th>Ação</Th>
                    <Th>Data/Hora</Th>
                    <Th>Detalhes</Th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <tr key={log.id}>
                        <Td>{log.exame_id || 'N/A'}</Td>
                        <Td>{log.user_id || 'N/A'}</Td>
                        <Td>{log.action || 'N/A'}</Td>
                        <Td>{new Date(log.timestamp).toLocaleString()}</Td>
                        <Td>{log.details || '-'}</Td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <Td colSpan="5">Nenhum log de ação encontrado.</Td>
                    </tr>
                  )}
                </tbody>
              </Table>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Clínica</Th>
                    <Th>E-mail da Clínica</Th>
                    <Th>Nome do Pet</Th>
                    <Th>Status</Th>
                    <Th>Mensagem de Erro</Th>
                    <Th>Data/Hora</Th>
                  </tr>
                </thead>
                <tbody>
                  {emailLogs.length > 0 ? (
                    emailLogs.map((log) => (
                      <tr key={log.id}>
                        <Td>{log.Exame?.Clinica?.name || 'N/A'}</Td>
                        <Td>{log.sent_to || 'N/A'}</Td>
                        <Td>{log.Exame?.animal_name || 'N/A'}</Td>
                        <Td status={log.status}>{log.status || 'N/A'}</Td>
                        <Td>{log.error_message || '-'}</Td>
                        <Td>{new Date(log.sent_at).toLocaleString()}</Td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <Td colSpan="6">Nenhum log de e-mail encontrado.</Td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Card>
        </>
      ) : (
        <p>Acesso negado: Apenas administradores podem visualizar logs.</p>
      )}
    </Layout>
  );
};

export default Logs;
