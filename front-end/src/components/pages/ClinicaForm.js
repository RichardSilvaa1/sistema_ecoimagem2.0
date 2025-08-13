import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import api from '../../services/api';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaHospital, FaSave, FaTimes } from 'react-icons/fa';

// Título estilizado
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
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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
    letter-spacing: 0.5px;
  }

  svg {
    font-size: 28px;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 24px;
    }
    svg {
      font-size: 24px;
    }
  }
`;

// Formulário estilizado
const Form = styled.form`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  margin: 12px 0;

  &:focus {
    border-color: #7ac143;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #7ac143;
  color: white;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
  margin-right: 8px;

  &:hover {
    background: #6ab03a;
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

  &.cancel {
    background: #6b7280;
    &:hover {
      background: #5a6268;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }
  }
`;

const ClinicaForm = () => {
  const { id } = useParams();
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api.get(`/api/clinicas/${id}`).then((response) => {
        const clinica = response.data;
        setValue('name', clinica.name);
        setValue('email', clinica.email);
      });
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await api.put(`/api/clinicas/${id}`, data);
        toast.success('Clínica atualizada com sucesso!');
      } else {
        await api.post('/api/clinicas', data);
        toast.success('Clínica criada com sucesso!');
      }
      navigate('/clinicas');
    } catch (error) {
      toast.error('Erro ao salvar clínica.');
    }
  };

  const handleCancel = () => {
    navigate('/clinicas');
  };

  return (
    <Layout>
      <TitleContainer>
        <TitleContent>
          <FaHospital />
          <h1>{id ? 'Editar Clínica' : 'Nova Clínica'}</h1>
        </TitleContent>
      </TitleContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register('name')} placeholder="Nome da Clínica" required />
        <Input {...register('email')} type="email" placeholder="E-mail" required />
        <Button type="submit" title="Salvar clínica">
          <FaSave /> Salvar
        </Button>
        <Button type="button" className="cancel" onClick={handleCancel} title="Cancelar">
          <FaTimes /> Cancelar
        </Button>
      </Form>
    </Layout>
  );
};

export default ClinicaForm;