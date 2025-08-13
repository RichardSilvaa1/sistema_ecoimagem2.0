import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Layout from '../layout/Layout';
import api from '../../services/api';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { FaHospital, FaEdit, FaTrash, FaSave, FaTimes, FaUser, FaCog } from 'react-icons/fa';

// Styled Components (mantidos iguais, sem alterações)
const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
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
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
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
    letter-spacing: 0.5px;
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
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  padding: 16px 0;

  @media (max-width: 500px) {
    grid-template-columns: 1fr; /* Stack inputs on very small screens */
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;

  &:focus-within {
    border-color: #7ac143;
    box-shadow: 0 0 0 2px rgba(122, 193, 67, 0.2);
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #4a5568;
  outline: none;

  &::placeholder {
    color: #6b7280;
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e6e6e6;
  margin-top: 16px;

  @media (max-width: 500px) {
    flex-direction: column; /* Stack buttons on small screens */
    button {
      width: 100%; /* Make buttons full width */
    }
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: ${(props) => (props.secondary ? '#6b7280' : props.danger ? '#e74c3c' : '#7AC143')};
  color: white;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.secondary ? '#5a6268' : props.danger ? '#d43f30' : '#6AB03A'};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 13px;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  box-sizing: border-box;
  table-layout: fixed; /* Use fixed layout for better column control */

  @media (max-width: 768px) {
    /* On smaller screens, force table to act more like blocks */
    display: block;
    width: 100%;

    thead {
      display: none; /* Hide table headers on small screens */
    }

    tbody {
      display: block;
      width: 100%;
    }
  }
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

  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    text-align: center;
  }

  /* Define relative widths for better responsiveness */
  &:nth-child(1) { width: 35%; } /* Nome */
  &:nth-child(2) { width: 45%; } /* E-mail */
  &:nth-child(3) { width: 20%; text-align: center; } /* Ações */


  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 4px;
    display: none; /* Hide headers on small screens */
  }
`;

const ThContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 8px;

  svg {
    font-size: 16px;
    color: ${({ iconColor }) => iconColor || '#333'};
  }

  span {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    svg { font-size: 14px; }
    span { font-size: 12px; }
  }
`;

const Tr = styled.tr`
  transition: background-color 0.2s ease;
  cursor: pointer;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: block;
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid #e6e6e6; /* Add a border for better visual separation on mobile */
    box-shadow: 0 2px 5px rgba(0,0,0,0.05); /* Slightly more prominent shadow */
  }
`;

const Td = styled.td`
  padding: 12px 8px;
  text-align: left;
  vertical-align: middle;
  font-size: 14px;
  box-sizing: border-box;
  border-bottom: none; /* Remove individual cell borders */

  &:last-child {
    text-align: center;
  }

  @media (max-width: 768px) {
    display: block; /* Make table data cells behave as blocks */
    text-align: right; /* Align content to the right */
    padding: 8px 0; /* Adjust padding */
    font-size: 13px;
    border-bottom: 1px solid #eee; /* Add a subtle separator between fields */
    white-space: normal; /* Allow text to wrap */

    &:last-child {
      border-bottom: none; /* No border for the last item */
      text-align: left; /* Align buttons to the left */
      padding-top: 15px; /* Add space above buttons */
    }

    /* Add a pseudo-element to display the "header" for each cell */
    &::before {
      content: attr(data-label); /* Use data-label for the content */
      float: left;
      font-weight: 600;
      text-transform: uppercase;
      color: #6b7280;
      font-size: 12px;
    }
  }
`;

// New styled component for mobile actions to stack buttons
const MobileActions = styled.div`
  display: flex;
  gap: 8px; /* Space between buttons */

  @media (max-width: 768px) {
    flex-direction: column; /* Stack buttons vertically */
    width: 100%;
    button {
      width: 100%; /* Make buttons full width */
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;

  @media (max-width: 500px) {
    flex-direction: column; /* Stack buttons on small screens */
    button {
      width: 100%;
    }
  }
`;

const ClinicasList = () => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [clinicas, setClinicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchClinicas();
    }
  }, [user]);

  const fetchClinicas = () => {
    setLoading(true);
    api.get('/api/clinicas')
      .then((response) => {
        // Sort clinicas by name in alphabetical order (case-insensitive)
        const sortedClinicas = (response.data || []).sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setClinicas(sortedClinicas);
        setLoading(false);
      })
      .catch((error) => {
        toast.error('Erro ao carregar clínicas.');
        setLoading(false);
      });
  };

  const onSubmitForm = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email || null,
      };

      if (editId) {
        await api.put(`/api/clinicas/${editId}`, payload);
        toast.success('Clínica atualizada com sucesso!');
      } else {
        await api.post('/api/clinicas', payload);
        toast.success('Clínica criada com sucesso!');
      }
      reset();
      setEditId(null);
      fetchClinicas(); // Refetch to ensure sorted order after save
    } catch (error) {
      toast.error('Erro ao salvar clínica.');
    }
  };

  const handleEdit = (clinica) => {
    setEditId(clinica.id);
    setValue('name', clinica.name);
    setValue('email', clinica.email || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/clinicas/${deleteId}`);
      fetchClinicas(); // Refetch to ensure sorted order after delete
      setDeleteId(null);
      toast.success('Clínica excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir clínica.');
      setDeleteId(null);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
  };

  const handleClearForm = () => {
    reset();
    setEditId(null);
  };

  const handleRefresh = () => {
    fetchClinicas();
    reset();
    setEditId(null);
    toast.info('Lista de clínicas atualizada!');
  };

  if (loading && !editId) {
    return (
      <Layout onRefresh={handleRefresh}>
        <TitleContainer>
          <TitleContent>
            <FaHospital />
            <h1>Gerenciar Clínicas</h1>
          </TitleContent>
        </TitleContainer>
        <p>Carregando...</p>
      </Layout>
    );
  }

  return (
    <Layout onRefresh={handleRefresh}>
      <TitleContainer>
        <TitleContent>
          <FaHospital />
          <h1>Gerenciar Clínicas</h1>
        </TitleContent>
      </TitleContainer>

      {user?.role === 'Admin' && (
        <Card>
          <h2>{editId ? 'Editar Clínica' : 'Cadastrar Clínica'}</h2>
          <Form onSubmit={handleSubmit(onSubmitForm)}>
            <FormGroup>
              <Label htmlFor="name">Nome da Clínica</Label>
              <InputContainer>
                <Input
                  id="name"
                  {...register('name', { required: 'Nome é obrigatório' })}
                  placeholder="Nome da Clínica"
                />
              </InputContainer>
              {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">E-mail (Opcional)</Label>
              <InputContainer>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'E-mail inválido',
                    },
                  })}
                  placeholder="E-mail (opcional)"
                />
              </InputContainer>
              {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </FormGroup>
            <ButtonGroup>
              <Button type="submit" title={editId ? 'Atualizar clínica' : 'Salvar clínica'}>
                <FaSave /> {editId ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button secondary onClick={handleClearForm} title="Limpar formulário">
                <FaTimes /> Limpar
              </Button>
            </ButtonGroup>
          </Form>
        </Card>
      )}

      <Card>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th><ThContent iconColor="#2c3e50"><FaHospital /><span>Nome</span></ThContent></Th>
                <Th><ThContent iconColor="#3498db"><FaUser /><span>E-mail</span></ThContent></Th>
                <Th><ThContent iconColor="#6b7280"><FaCog /><span>Ações</span></ThContent></Th>
              </tr>
            </thead>
            <tbody>
              {clinicas.length > 0 ? (
                clinicas.map((clinica) => (
                  <Tr key={clinica.id}>
                    <Td data-label="Nome:">{clinica.name || 'N/A'}</Td>
                    <Td data-label="E-mail:">{clinica.email || '-'}</Td>
                    <Td data-label="Ações:">
                      {user?.role === 'Admin' && (
                        <MobileActions>
                          <Button onClick={() => handleEdit(clinica)} title="Editar clínica">
                            <FaEdit /> Editar
                          </Button>
                          <Button danger onClick={() => openDeleteModal(clinica.id)} title="Excluir clínica">
                            <FaTrash /> Excluir
                          </Button>
                        </MobileActions>
                      )}
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="3" style={{ textAlign: 'center' }}>Nenhuma clínica encontrada.</Td>
                </Tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>
      </Card>

      {deleteId && (
        <ModalOverlay>
          <ModalContent>
            <h2>Confirmar Exclusão</h2>
            <p>Deseja realmente excluir esta clínica?</p>
            <ModalButtons>
              <Button onClick={handleDelete} title="Confirmar exclusão">
                Confirmar
              </Button>
              <Button secondary onClick={closeDeleteModal} title="Cancelar">
                Cancelar
              </Button>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
};

export default ClinicasList;
