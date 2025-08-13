import { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../contexts/AuthContext';
import Layout from '../layout/Layout';
import api from '../../services/api';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaCreditCard, FaPlus, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

// Estilização
const TitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: linear-gradient(90deg, #7AC143 0%, #27ae60 100%);
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    margin-bottom: 16px;
  }
`;

const TitleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    font-family: 'Inter', sans-serif;
  }

  svg {
    font-size: 28px;
  }

  @media (max-width: 768px) {
    h1 { font-size: 24px; }
    svg { font-size: 24px; }
  }
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 20px;
  font-family: 'Inter', sans-serif;
`;

const Form = styled.form`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: 'Inter', sans-serif;

  &:focus {
    border-color: #7ac143;
  }
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #333;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: ${(props) => (props.danger ? '#e74c3c' : '#7AC143')};
  color: white;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s ease, transform 0.1s ease;

  &:hover {
    background: ${(props) => (props.danger ? '#d43f30' : '#6AB03A')};
    transform: translateY(-1px);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    font-size: 16px;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    table { min-width: 500px; }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
`;

const Th = styled.th`
  padding: 12px 8px;
  background: #f2f9f4;
  color: #333;
  text-align: left;
  vertical-align: middle;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 2px solid #e6e6e6;
  white-space: nowrap;

  &:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
  &:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; text-align: center; }
`;

const Td = styled.td`
  padding: 12px 8px;
  text-align: left;
  vertical-align: middle;
  font-size: 14px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;

  &:last-child { text-align: center; }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 4px;
  }
`;

const Tr = styled.tr`
  transition: background-color 0.2s ease;
  cursor: pointer;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover { background-color: #f7fafc; }

  &.selected { background-color: #e6f4ea; border-left: 4px solid #7ac143; }
`;

const TipoPagamentoList = () => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [tipos, setTipos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedTipoId, setSelectedTipoId] = useState(null);

  useEffect(() => {
    if (user.role === 'Admin') {
      fetchTipos();
    }
  }, [user]);

  const fetchTipos = () => {
    api.get('/api/tipos-pagamento').then((response) => {
      setTipos(Array.isArray(response.data) ? response.data : []);
    }).catch((error) => {
      toast.error('Erro ao carregar tipos de pagamento.');
      setTipos([]);
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja excluir este tipo de pagamento?')) {
      try {
        await api.delete(`/api/tipos-pagamento/${id}`);
        fetchTipos();
        toast.success('Tipo de pagamento excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir tipo de pagamento.');
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await api.put(`/api/tipos-pagamento/${editingId}`, data);
        toast.success('Tipo de pagamento atualizado com sucesso!');
      } else {
        await api.post('/api/tipos-pagamento', data);
        toast.success('Tipo de pagamento criado com sucesso!');
      }
      fetchTipos();
      reset();
      setEditingId(null);
    } catch (error) {
      toast.error('Erro ao salvar tipo de pagamento.');
    }
  };

  const handleEdit = (tipo) => {
    setEditingId(tipo.id);
    setValue('nome', tipo.nome);
    setValue('ativo', tipo.ativo);
  };

  const handleSelectTipo = (id) => {
    setSelectedTipoId(id === selectedTipoId ? null : id);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectTipo(id);
    }
  };

  const handleRefresh = () => {
    fetchTipos();
    reset();
    setEditingId(null);
    setSelectedTipoId(null);
    toast.info('Lista atualizada!');
  };

  return (
    <Layout onRefresh={handleRefresh}>
      <TitleContainer>
        <TitleContent>
          <FaCreditCard />
          <h1>Tipos de Pagamento</h1>
        </TitleContent>
      </TitleContainer>
      {user.role === 'Admin' && (
        <Card>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Input {...register('nome')} placeholder="Nome do Tipo" required />
            <CheckboxLabel>
              <Input type="checkbox" {...register('ativo')} defaultChecked={true} />
              Ativo
            </CheckboxLabel>
            <Button type="submit">
              {editingId ? <><FaEdit /> Atualizar</> : <><FaPlus /> Criar</>}
            </Button>
            {editingId && (
              <Button danger onClick={() => { reset(); setEditingId(null); }}>
                <FaTimes /> Cancelar
              </Button>
            )}
          </Form>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Nome</Th>
                  <Th>Ativo</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {tipos.length > 0 ? (
                  tipos.map((tipo) => (
                    <Tr
                      key={tipo.id}
                      className={selectedTipoId === tipo.id ? 'selected' : ''}
                      onClick={() => handleSelectTipo(tipo.id)}
                      onKeyDown={(e) => handleKeyDown(e, tipo.id)}
                      tabIndex={0}
                      aria-selected={selectedTipoId === tipo.id}
                      role="row"
                    >
                      <Td>{tipo.nome || 'N/A'}</Td>
                      <Td style={{ color: tipo.ativo ? '#7AC143' : '#e74c3c' }}>
                        {tipo.ativo ? 'Sim' : 'Não'}
                      </Td>
                      <Td>
                        <Button onClick={(e) => { e.stopPropagation(); handleEdit(tipo); }} title="Editar tipo de pagamento">
                          <FaEdit /> Editar
                        </Button>
                        <Button danger onClick={(e) => { e.stopPropagation(); handleDelete(tipo.id); }} title="Excluir tipo de pagamento">
                          <FaTrash /> Excluir
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="3">Nenhum tipo de pagamento encontrado.</Td>
                  </Tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>
        </Card>
      )}
    </Layout>
  );
};

export default TipoPagamentoList;