import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Layout from '../layout/Layout';
import api from '../../services/api';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { FaUser, FaTrash, FaSave, FaTimes, FaKey, FaTag, FaHospitalUser, FaHospital } from 'react-icons/fa'; // Added new icons

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
  font-family: 'Inter', sans-serif;
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
  font-family: 'Inter', sans-serif;

  &::placeholder {
    color: #6b7280;
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Select = styled.select`
  flex: 1;
  padding: 10px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
  color: #4a5568;
  outline: none;
  font-family: 'Inter', sans-serif;

  &:focus {
    border-color: #7ac143;
    box-shadow: 0 0 0 2px rgba(122, 193, 67, 0.2);
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
  grid-column: 1 / -1; /* Make button group span full width */

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
  background: ${(props) => (props.danger ? '#e74c3c' : props.secondary ? '#6b7280' : '#7AC143')};
  color: white;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;

  &:hover {
    background: ${(props) => (props.danger ? '#d43f30' : props.secondary ? '#5a6268' : '#6AB03A')};
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
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  table-layout: fixed; /* Use fixed layout for better column control */

  @media (max-width: 768px) {
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

  &:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
  &:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; text-align: center; }

  /* Define relative widths for better responsiveness */
  &:nth-child(1) { width: 18%; } /* Usuário */
  &:nth-child(2) { width: 18%; } /* Nome */
  &:nth-child(3) { width: 15%; } /* Perfil */
  &:nth-child(4) { width: 25%; } /* Clínica */
  &:nth-child(5) { width: 24%; text-align: center; } /* Ações */

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

const Td = styled.td`
  padding: 12px 8px;
  text-align: left;
  vertical-align: middle;
  font-size: 14px;
  background: #fff;
  border-bottom: none; /* Remove individual cell borders */
  word-wrap: break-word; /* Allow long words to break and wrap */

  &:last-child { text-align: center; }

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

const Tr = styled.tr`
  transition: background-color 0.2s ease;
  cursor: pointer;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover { background-color: #f7fafc; }

  @media (max-width: 768px) {
    display: block;
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid #e6e6e6; /* Add a border for better visual separation on mobile */
    box-shadow: 0 2px 5px rgba(0,0,0,0.05); /* Slightly more prominent shadow */
  }
`;

const ClinicOptionWrapper = styled.div`
  grid-column: 1 / -1; /* Occupy full width */
  display: flex;
  flex-direction: row; /* Side-by-side radio buttons */
  gap: 32px; /* Increased space between radio buttons */
  margin: 8px 0;
  max-width: 750px; /* Slightly wider to accommodate gap */
  flex-wrap: wrap; /* Allow wrapping on smaller desktop screens if needed */

  @media (max-width: 768px) {
    flex-direction: column; /* Stack vertically on mobile */
    gap: 12px;
    max-width: 100%; /* Full width on mobile */
  }
`;

const ClinicOptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4a5568;
  white-space: nowrap; /* Keep label text on one line */
`;

const ClinicFieldsWrapper = styled.div`
  grid-column: 1 / -1; /* Occupy full width */
  margin: 8px 0;
  display: grid;
  grid-template-columns: 1fr 1fr; /* Side-by-side fields */
  gap: 12px;
  max-width: 750px; /* Match ClinicOptionWrapper width */

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack vertically on mobile */
    max-width: 100%; /* Full width on mobile */
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

const UsuariosList = () => {
  const { user, loading } = useContext(AuthContext);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
  const role = useWatch({ control, name: 'role', defaultValue: 'Admin' });
  const manageClinicOption = useWatch({ control, name: 'manageClinic', defaultValue: 'new' });

  const [usuarios, setUsuarios] = useState([]);
  const [clinicas, setClinicas] = useState([]);

  const fetchUsuarios = () => {
    api.get('/api/usuarios')
      .then((response) => setUsuarios(response.data || []))
      .catch(() => toast.error('Erro ao carregar usuários.'));
  };

  const fetchClinicas = () => {
    api.get('/api/clinicas')
      .then((response) => setClinicas(response.data || []))
      .catch(() => toast.error('Erro ao carregar clínicas.'));
  };

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchUsuarios();
      fetchClinicas();
    }
  }, [user]);

  const handleDelete = async (userId) => {
    if (window.confirm('Deseja excluir este usuário?')) {
      try {
        await api.delete(`/api/usuarios/${userId}`);
        fetchUsuarios();
        toast.success('Usuário excluído com sucesso!');
      } catch {
        toast.error('Erro ao excluir usuário.');
      }
    }
  };

  const handleChangePassword = async (userId) => {
    const newPassword = prompt('Digite a nova senha:');
    if (!newPassword) return; // User cancelled or entered empty

    // Basic validation for password length
    if (newPassword.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    try {
      await api.put(`/api/usuarios/${userId}/password`, { password: newPassword });
      toast.success('Senha alterada com sucesso!');
    } catch (error) {
      toast.error('Erro ao alterar senha.');
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        username: data.username,
        password: data.password,
        name: data.name,
        role: data.role === 'clinica' ? 'Clínica' : data.role,
      };

      if (data.role === 'clinica') {
        if (manageClinicOption === 'new') {
          payload.clinic = {
            name: data.clinic_name,
            email: data.clinic_email || null, // Envia null se o campo estiver vazio
          };
        } else if (manageClinicOption === 'existing' && data.existingClinicId) {
          payload.existingClinicId = parseInt(data.existingClinicId);
        }
      }

      await api.post('/api/usuarios', payload);
      fetchUsuarios();
      fetchClinicas(); // Atualiza a lista de clínicas após criar uma nova
      reset();
      toast.success('Usuário criado com sucesso!');
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(error.response.data.message || 'Erro ao criar usuário: Conflito.');
      } else if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.msg));
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erro ao criar usuário.');
      }
    }
  };

  const handleRefresh = () => {
    fetchUsuarios();
    fetchClinicas();
    reset();
    toast.info('Lista de usuários atualizada!');
  };

  if (loading) {
    return (
      <Layout onRefresh={handleRefresh}>
        <TitleContainer>
          <TitleContent>
            <FaUser />
            <h1>Gerenciar Usuários</h1>
          </TitleContent>
        </TitleContainer>
        <p>Carregando...</p>
      </Layout>
    );
  }

  if (!user || user.role !== 'Admin') {
    return (
      <Layout onRefresh={handleRefresh}>
        <TitleContainer>
          <TitleContent>
            <FaUser />
            <h1>Gerenciar Usuários</h1>
          </TitleContent>
        </TitleContainer>
        <p>Você não tem permissão para acessar esta página.</p>
      </Layout>
    );
  }

  return (
    <Layout onRefresh={handleRefresh}>
      <TitleContainer>
        <TitleContent>
          <FaUser />
          <h1>Gerenciar Usuários</h1>
        </TitleContent>
      </TitleContainer>

      <Card>
        <h2>Cadastrar Novo Usuário</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="username">Usuário</Label>
            <InputContainer>
              <Input
                id="username"
                {...register('username', { required: 'Usuário é obrigatório' })}
                placeholder="Nome de Usuário"
              />
            </InputContainer>
            {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <InputContainer>
              <Input
                id="password"
                type="password"
                {...register('password', { required: 'Senha é obrigatória', minLength: { value: 6, message: 'Senha deve ter no mínimo 6 caracteres' } })}
                placeholder="Senha"
              />
            </InputContainer>
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="name">Nome</Label>
            <InputContainer>
              <Input
                id="name"
                {...register('name', { required: 'Nome é obrigatório' })}
                placeholder="Nome Completo"
              />
            </InputContainer>
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="role">Perfil</Label>
            <InputContainer>
              <Select id="role" {...register('role')} required>
                <option value="Admin">Administrador</option>
                <option value="clinica">Clínica</option>
              </Select>
            </InputContainer>
          </FormGroup>

          {role === 'clinica' && (
            <ClinicOptionWrapper>
              <ClinicOptionItem>
                <Input type="radio" id="newClinic" value="new" {...register('manageClinic')} defaultChecked />
                <Label htmlFor="newClinic">Criar nova clínica</Label>
              </ClinicOptionItem>
              <ClinicOptionItem>
                <Input type="radio" id="existingClinic" value="existing" {...register('manageClinic')} />
                <Label htmlFor="existingClinic">Associar a uma clínica existente</Label>
              </ClinicOptionItem>
            </ClinicOptionWrapper>
          )}

          {role === 'clinica' && manageClinicOption === 'new' && (
            <ClinicFieldsWrapper>
              <FormGroup>
                <Label htmlFor="clinic_name">Nome da Clínica</Label>
                <InputContainer>
                  <Input
                    id="clinic_name"
                    {...register('clinic_name', { required: 'Nome da clínica é obrigatório' })}
                    placeholder="Nome da Clínica"
                  />
                </InputContainer>
                {errors.clinic_name && <ErrorMessage>{errors.clinic_name.message}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="clinic_email">Email da Clínica (Opcional)</Label>
                <InputContainer>
                  <Input
                    id="clinic_email"
                    type="email"
                    {...register('clinic_email', {
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'E-mail inválido',
                      },
                    })}
                    placeholder="Email da Clínica (opcional)"
                  />
                </InputContainer>
                {errors.clinic_email && <ErrorMessage>{errors.clinic_email.message}</ErrorMessage>}
              </FormGroup>
            </ClinicFieldsWrapper>
          )}

          {role === 'clinica' && manageClinicOption === 'existing' && (
            <ClinicFieldsWrapper>
              <FormGroup>
                <Label htmlFor="existingClinicId">Clínica Existente</Label>
                <InputContainer>
                  <Controller
                    name="existingClinicId"
                    control={control}
                    rules={{ required: 'Selecione uma clínica existente' }}
                    render={({ field }) => (
                      <Select id="existingClinicId" {...field} required>
                        <option value="">Selecione uma clínica</option>
                        {clinicas.map((clinica) => (
                          <option key={clinica.id} value={clinica.id}>
                            {clinica.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </InputContainer>
                {errors.existingClinicId && <ErrorMessage>{errors.existingClinicId.message}</ErrorMessage>}
              </FormGroup>
            </ClinicFieldsWrapper>
          )}

          <ButtonGroup> {/* Using the new ButtonGroup styled component */}
            <Button type="submit" title="Criar usuário">
              <FaSave /> Criar
            </Button>
            <Button secondary onClick={() => reset()} title="Limpar formulário"> {/* Changed to secondary */}
              <FaTimes /> Limpar
            </Button>
          </ButtonGroup>
        </Form>
      </Card>

      <Card>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th><ThContent iconColor="#2c3e50"><FaUser /><span>Usuário</span></ThContent></Th>
                <Th><ThContent iconColor="#3498db"><FaUser /><span>Nome</span></ThContent></Th>
                <Th><ThContent iconColor="#f39c12"><FaTag /><span>Perfil</span></ThContent></Th>
                <Th><ThContent iconColor="#27ae60"><FaHospital /><span>Clínica</span></ThContent></Th>
                <Th><ThContent iconColor="#6b7280"><FaKey /><span>Ações</span></ThContent></Th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <Tr key={usuario.id}>
                    <Td data-label="Usuário:">{usuario.username || 'N/A'}</Td>
                    <Td data-label="Nome:">{usuario.name || 'N/A'}</Td>
                    <Td data-label="Perfil:">{usuario.role || 'N/A'}</Td>
                    <Td data-label="Clínica:">{usuario.clinic_id ? clinicas.find((c) => c.id === usuario.clinic_id)?.name : '-'}</Td>
                    <Td data-label="Ações:">
                      <MobileActions> {/* Wrap buttons in MobileActions */}
                        <Button
                          onClick={() => handleChangePassword(usuario.id)}
                          title="Alterar senha"
                        >
                          <FaKey /> Senha
                        </Button>
                        <Button danger onClick={() => handleDelete(usuario.id)} title="Excluir usuário">
                          <FaTrash /> Excluir
                        </Button>
                      </MobileActions>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="5" style={{ textAlign: 'center' }}>Nenhum usuário encontrado.</Td>
                </Tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>
      </Card>
    </Layout>
  );
};

export default UsuariosList;