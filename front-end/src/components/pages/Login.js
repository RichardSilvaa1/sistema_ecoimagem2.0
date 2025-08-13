import { useContext, useState } from 'react'; // Importa hooks do React para gerenciar estado e contexto.
import { useForm } from 'react-hook-form'; // Importa hook para gerenciamento de formulários e validação.
import { useNavigate } from 'react-router-dom'; // Importa hook para navegação programática.
import { AuthContext } from '../../contexts/AuthContext'; // Importa o contexto de autenticação para gerenciar o login.
import styled, { keyframes } from 'styled-components'; // Importa styled-components para estilização e keyframes para animações.
import { toast } from 'react-toastify'; // Importa toastify para exibir notificações.
import { FaUser, FaLock, FaExclamationCircle, FaEye, FaEyeSlash, FaStethoscope, FaHeart, FaShieldAlt } from 'react-icons/fa'; // Importa ícones do Font Awesome.

// --- Animações (somente para ícones) ---
// Define a animação 'float' para um efeito de flutuação vertical.
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Define a animação 'spin' para um efeito de rotação.
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// --- Container Principal ---
// Estiliza o container principal da página de login, ocupando toda a altura da viewport,
// com um gradiente de fundo, centralização de conteúdo e elementos decorativos.
const Container = styled.div`
  display: flex; /* Define o container como um flex container. */
  justify-content: center; /* Centraliza os itens flex ao longo do eixo principal (horizontal). */
  align-items: center; /* Centraliza os itens flex ao longo do eixo cruzado (vertical). */
  min-height: 70vh; /* Garante que o container ocupe no mínimo 100% da altura da viewport. */
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 25%, #e6fffa 75%, #cffafe 100%); /* Aplica um gradiente linear de fundo com cores suaves. */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; /* Define a família da fonte a ser usada. */
  position: relative; /* Define a posição como relativa para que os elementos pseudo-elementos possam ser posicionados absolutamente dentro dele. */
  overflow: hidden; /* Oculta qualquer conteúdo que transborde do container. */
  padding: 15px; /* Adiciona um preenchimento interno de 20px em todos os lados. */
  box-sizing: border-box; /* Garante que padding e border sejam incluídos na largura e altura total do elemento. */

  /* Elementos de fundo decorativos (mantidos estáticos) */
  &::before { /* Estiliza um pseudo-elemento 'before' para um círculo decorativo superior esquerdo. */
    content: ''; /* Conteúdo vazio, necessário para pseudo-elementos. */
    position: absolute; /* Posiciona o pseudo-elemento absolutamente em relação ao seu pai (Container). */
    top: 80px; /* Distância do topo do container. */
    left: 80px; /* Distância da esquerda do container. */
    width: 128px; /* Largura do círculo. */
    height: 128px; /* Altura do círculo. */
    background: rgba(16, 185, 129, 0.1); /* Cor de fundo com transparência. */
    border-radius: 50%; /* Torna o elemento um círculo. */
    filter: blur(3rem); /* Aplica um desfoque ao círculo. */

    @media (max-width: 768px) { /* Media query: aplica estilos quando a largura da tela é no máximo 768px. */
      width: 80px; /* Reduz a largura do círculo. */
      height: 80px; /* Reduz a altura do círculo. */
      top: 50px; /* Ajusta a posição do topo. */
      left: 30px; /* Ajusta a posição da esquerda. */
      filter: blur(2rem); /* Reduz o desfoque. */
    }
  }

  &::after { /* Estiliza um pseudo-elemento 'after' para um círculo decorativo inferior direito. */
    content: ''; /* Conteúdo vazio. */
    position: absolute; /* Posiciona o pseudo-elemento absolutamente. */
    bottom: 80px; /* Distância da parte inferior do container. */
    right: 80px; /* Distância da direita do container. */
    width: 160px; /* Largura do círculo. */
    height: 160px; /* Altura do círculo. */
    background: rgba(20, 184, 166, 0.1); /* Cor de fundo com transparência. */
    border-radius: 50%; /* Torna o elemento um círculo. */
    filter: blur(3rem); /* Aplica um desfoque. */

    @media (max-width: 768px) { /* Media query: aplica estilos quando a largura da tela é no máximo 768px. */
      width: 100px; /* Reduz a largura do círculo. */
      height: 100px; /* Reduz a altura do círculo. */
      bottom: 50px; /* Ajusta a posição da parte inferior. */
      right: 30px; /* Ajusta a posição da direita. */
      filter: blur(2rem); /* Reduz o desfoque. */
    }
  }
`;

// Estiliza um elemento flutuante decorativo no fundo, visível apenas em telas maiores.
const FloatingElement = styled.div`
  position: absolute;
  top: 50%;
  left: 33%;
  width: 96px;
  height: 96px;
  background: rgba(6, 182, 212, 0.1);
  border-radius: 50%;
  filter: blur(2rem);

  @media (max-width: 768px) {
    display: none;
  }
`;

// --- Card Principal ---
// Estiliza o card principal do formulário de login, com fundo semi-transparente,
// efeito de desfoque, bordas arredondadas e sombra.
const Card = styled.div`
  background: rgba(255, 255, 255, 0.8); /* Define o fundo do card como branco com 80% de opacidade. */
  backdrop-filter: blur(20px); /* Aplica um efeito de desfoque ao fundo dos elementos atrás do card. */
  border: 1px solid rgba(255, 255, 255, 0.2); /* Adiciona uma borda fina e semi-transparente. */
  border-radius: 24px; /* Arredonda os cantos do card. */
  padding: 50px 40px; /* Define o preenchimento interno: 50px vertical e 40px horizontal. */
  box-shadow: /* Adiciona múltiplas sombras ao card. */
    0 25px 50px rgba(0, 0, 0, 0.1), /* Sombra externa, deslocada 25px verticalmente, com desfoque e 10% de opacidade. */
    inset 0 1px 0 rgba(255, 255, 255, 0.2); /* Sombra interna (inset), simulando um brilho superior. */
  max-width: 420px; /* Define a largura máxima do card. */
  width: 100%; /* Garante que o card ocupe 100% da largura disponível até o max-width. */
  text-align: center; /* Centraliza o texto dentro do card. */
  position: relative; /* Define a posição como relativa para que elementos filhos possam ser posicionados absolutamente dentro dele. */
  z-index: 10; /* Garante que o card esteja acima de outros elementos com z-index menor. */
  transition: all 0.3s ease; /* Adiciona uma transição suave para todas as propriedades CSS em 0.3 segundos. */

  @media (max-width: 480px) { /* Media query: aplica estilos para telas com largura máxima de 480px (smartphones). */
    padding: 40px 25px; /* Reduz o preenchimento interno para telas menores. */
    border-radius: 20px; /* Suaviza ainda mais o arredondamento da borda para telas menores. */
  }
`;

// --- Logo Container ---
// Container para o ícone do logo e o badge de coração.
const LogoContainer = styled.div`
  position: relative; /* Define a posição como relativa para permitir o posicionamento absoluto de elementos filhos (como o HeartBadge). */
  margin-bottom: 30px; /* Adiciona um espaço de 30px abaixo do container do logo. */
  display: flex; /* Define o container como um flex container. */
  justify-content: center; /* Centraliza os itens flex ao longo do eixo principal (horizontal). */
  align-items: center; /* Centraliza os itens flex ao longo do eixo cruzado (vertical). */
`;

// Estiliza o ícone principal do logo (estetoscópio), com gradiente de fundo, sombra
// e animação de flutuação.
const LogoIcon = styled.div`
  position: relative; /* Define a posição como relativa para permitir o posicionamento absoluto de elementos filhos (como o HeartBadge). */
  width: 80px; /* Define a largura do ícone. */
  height: 80px; /* Define a altura do ícone. */
  border-radius: 16px; /* Arredonda os cantos do ícone. */
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); /* Aplica um gradiente de fundo verde/azulado. */
  color: #fff; /* Define a cor do ícone interno como branco. */
  font-size: 30px; /* Define o tamanho da fonte do ícone. */
  display: flex; /* Define o ícone como um flex container. */
  align-items: center; /* Centraliza o conteúdo (o ícone FaStethoscope) verticalmente. */
  justify-content: center; /* Centraliza o conteúdo (o ícone FaStethoscope) horizontalmente. */
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3); /* Adiciona uma sombra suave ao ícone. */
  transition: all 0.4s ease; /* Adiciona uma transição suave para todas as propriedades CSS. */
  animation: ${float} 3s ease-in-out infinite; /* Aplica a animação 'float' com duração de 3s, suave, e infinita. */

  @media (max-width: 480px) { /* Media query: estilos para telas menores. */
    width: 70px; /* Reduz a largura do ícone. */
    height: 70px; /* Reduz a altura do ícone. */
    font-size: 26px; /* Reduz o tamanho da fonte do ícone. */
  }
`;

// Estiliza o badge de coração sobreposto ao logo, com gradiente, sombra
// e animação de flutuação com atraso.
const HeartBadge = styled.div`
  position: absolute; /* Posiciona o badge absolutamente em relação ao seu pai mais próximo com posição relativa (LogoIcon). */
  top: -8px; /* Desloca o badge 8px para cima do topo do seu pai. */
  right: -8px; /* Desloca o badge 8px para a direita do lado direito do seu pai. */
  width: 32px; /* Define a largura do badge. */
  height: 32px; /* Define a altura do badge. */
  background: linear-gradient(135deg, #fb7185 0%, #ec4899 100%); /* Aplica um gradiente de fundo rosa/magenta. */
  border-radius: 50%; /* Torna o elemento um círculo. */
  display: flex; /* Define o badge como um flex container. */
  align-items: center; /* Centraliza o conteúdo (o ícone FaHeart) verticalmente. */
  justify-content: center; /* Centraliza o conteúdo (o ícone FaHeart) horizontalmente. */
  font-size: 14px; /* Define o tamanho da fonte do ícone do coração. */
  color: white; /* Define a cor do ícone do coração como branco. */
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4); /* Adiciona uma sombra ao badge. */
  animation: ${float} 3s ease-in-out infinite 0.5s; /* Aplica a animação 'float' com um atraso de 0.5s. */

  @media (max-width: 480px) { /* Media query: estilos para telas menores. */
    width: 28px; /* Reduz a largura do badge. */
    height: 28px; /* Reduz a altura do badge. */
    font-size: 12px; /* Reduz o tamanho da fonte do ícone do coração. */
    top: -6px; /* Ajusta a posição do topo. */
    right: -6px; /* Ajusta a posição da direita. */
  }
`;

// --- Títulos ---
// Estiliza o título principal da página ("Eco Imagem").
const MainTitle = styled.h1`
  font-size: 28px; /* Define o tamanho da fonte do título. */
  font-weight: 700; /* Define o peso da fonte como negrito. */
  color: #1f2937; /* Define a cor do texto do título. */
  margin-bottom: 8px; /* Adiciona um espaço de 8px abaixo do título. */
  letter-spacing: -0.5px; /* Reduz ligeiramente o espaçamento entre as letras. */
  line-height: 1.2; /* Define a altura da linha do texto. */

  @media (max-width: 480px) { /* Media query: estilos para telas menores. */
    font-size: 24px; /* Reduz o tamanho da fonte do título para telas menores. */
  }
`;

// Estiliza o subtítulo da página ("Sistema de Gestão de Exames").
const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 32px;
  font-weight: 400;

  @media (max-width: 480px) {
    margin-bottom: 28px;
    font-size: 13px;
  }
`;

// --- Formulário ---
// Estiliza o formulário de login, organizado em coluna com espaçamento entre os campos.
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

// Container para cada campo do formulário (label, input, mensagem de erro).
const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
`;

// Estiliza o rótulo de cada campo de entrada.
const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    font-size: 14px;
  }
`;

// --- Input Container ---
// Container para o campo de entrada, usado para posicionar o ícone de toggle de senha.
const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

// --- Input ---
// Estiliza o campo de entrada de texto, com estilos para estado normal, com erro, foco e hover.
const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.hasError ? '#fca5a5' : '#e5e7eb'}; /* Borda vermelha se houver erro */
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  font-size: 16px;
  color: #1f2937;
  outline: none;
  transition: all 0.2s ease;
  font-weight: 400;
  box-sizing: border-box;

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }

  &:focus {
    border-color: ${props => props.hasError ? '#ef4444' : '#10b981'}; /* Borda de foco, muda se houver erro */
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 0 0 4px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; /* Sombra de foco, muda se houver erro */
  }

  &:hover {
    border-color: ${props => props.hasError ? '#fca5a5' : '#d1d5db'};
    background: rgba(255, 255, 255, 0.6);
  }

  ${props => props.hasPasswordToggle && `
    padding-right: 50px; /* Adiciona padding à direita se tiver o toggle de senha */
  `}

  @media (max-width: 480px) {
    padding: 14px 16px;
    font-size: 16px;
    border-radius: 10px;
  }
`;

// Estiliza o botão de toggle para mostrar/ocultar a senha.
const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #374151;
    background: rgba(0, 0, 0, 0.05);
  }

  &:focus {
    outline: none;
    color: #10b981;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    right: 10px;
  }
`;

// --- Mensagem de Erro ---
// Estiliza a mensagem de erro exibida abaixo dos campos de entrada.
const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 14px;
  margin-top: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    margin-top: 6px;
  }
`;

// --- Checkbox ---
// Container para o checkbox "Lembrar-me".
const RememberContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  margin: 8px 0;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

// Estiliza o label e o próprio input do checkbox.
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  cursor: pointer;
  font-weight: 400;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 2px solid #d1d5db;
    accent-color: #10b981; /* Cor de destaque do checkbox */
    
    &:focus {
      outline: 2px solid rgba(16, 185, 129, 0.2);
      outline-offset: 2px;
    }
  }
`;

// --- Botão ---
// Estiliza o botão de submissão do formulário, com gradiente, sombra e estados de hover/active/disabled.
const Button = styled.button`
  padding: 16px 20px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.2);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
    box-shadow: 0 15px 35px rgba(16, 185, 129, 0.3);
  }

  &:active:not(:disabled) {
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 14px 18px;
    font-size: 15px;
    border-radius: 10px;
  }
`;

// Container para o conteúdo do botão quando está carregando (spinner + texto).
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

// Estiliza o spinner de carregamento.
const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite; /* Animação de rotação aplicada */
`;

// --- Badge de Segurança ---
// Estiliza o badge de segurança abaixo do card do formulário.
const SecurityBadge = styled.div`
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 24px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);

  @media (max-width: 480px) {
    padding: 12px;
    margin-top: 20px;
    border-radius: 12px;
  }
`;

// Estiliza o texto dentro do badge de segurança, incluindo o ícone.
const SecurityText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 400;

  svg {
    color: #10b981;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    
    svg {
      font-size: 14px;
    }
  }
`;

// --- Footer ---
// Estiliza o texto do rodapé.
const Footer = styled.div`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #9ca3af;

  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 20px;
  }
`;

// Componente funcional Login
const Login = () => {
  // Acessa a função de login do AuthContext.
  const { login } = useContext(AuthContext);
  // Inicializa o react-hook-form para validação e gerenciamento do formulário.
  const { register, handleSubmit, formState: { errors } } = useForm();
  // Hook para navegação programática.
  const navigate = useNavigate();
  // Estado para controlar a visibilidade da senha.
  const [showPassword, setShowPassword] = useState(false);
  // Estado para indicar se o login está em andamento (loading).
  const [isLoading, setIsLoading] = useState(false);

  // Função chamada ao submeter o formulário.
  const onSubmit = async (data) => {
    setIsLoading(true); // Ativa o estado de loading.
    try {
      // Chama a função de login do AuthContext com os dados do formulário.
      const userRole = await login(data.username, data.password);

      toast.success('Login realizado com sucesso!'); // Exibe mensagem de sucesso.
      console.log('Tipo de usuário retornado:', userRole); // Loga o tipo de usuário.

      // Redireciona o usuário com base na sua função.
      if (userRole?.toLowerCase() === 'admin') {
        navigate('/dashboard');
      } else if (userRole?.toLowerCase() === 'clínica' || userRole?.toLowerCase() === 'clinica') {
        navigate('/exames');
      } else {
        navigate('/'); // Redireciona para a página inicial por padrão.
      }
    } catch (error) {
      // Captura e exibe mensagens de erro do login.
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // Desativa o estado de loading, independentemente do sucesso ou falha.
    }
  };

  return (
    // Renderiza o container principal.
    <Container>
      {/* Elemento flutuante decorativo. */}
      <FloatingElement />
      
      <div>
        {/* Card do formulário de login. */}
        <Card>
          {/* Seção do logo. */}
          <LogoContainer>
            {/* Ícone principal do logo com animação. */}
            <LogoIcon>
              <FaStethoscope />
              {/* Badge de coração com animação. */}
              <HeartBadge>
                <FaHeart />
              </HeartBadge>
            </LogoIcon>
          </LogoContainer>
          
          {/* Título principal e subtítulo. */}
          <MainTitle>Eco Imagem</MainTitle>
          <Subtitle>Sistema de Gestão de Exames</Subtitle>
          
          {/* Formulário de Login. */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Campo de Usuário. */}
            <FieldContainer>
              <Label>
                <FaUser />
                Usuário
              </Label>
              <InputContainer>
                <Input
                  {...register('username', { required: 'O nome de usuário é obrigatório.' })} // Registra o input com validação de obrigatoriedade.
                  type="text"
                  placeholder="Digite seu nome de usuário"
                  hasError={!!errors.username} // Passa prop para estilização condicional de erro.
                  aria-label="Nome de usuário"
                  autoComplete="username"
                />
                {errors.username && ( // Exibe mensagem de erro se houver.
                  <ErrorMessage>
                    <FaExclamationCircle />
                    {errors.username.message}
                  </ErrorMessage>
                )}
              </InputContainer>
            </FieldContainer>

            {/* Campo de Senha. */}
            <FieldContainer>
              <Label>
                <FaLock />
                Senha
              </Label>
              <InputContainer>
                <Input
                  {...register('password', { required: 'A senha é obrigatória.' })} // Registra o input com validação de obrigatoriedade.
                  type={showPassword ? 'text' : 'password'} // Alterna entre tipo texto e password.
                  placeholder="Digite sua senha"
                  hasError={!!errors.password} // Passa prop para estilização condicional de erro.
                  hasPasswordToggle={true} // Passa prop para adicionar padding ao input.
                  aria-label="Senha"
                  autoComplete="current-password"
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // Alterna a visibilidade da senha.
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Ícone para mostrar/ocultar senha. */}
                </PasswordToggle>
                {errors.password && ( // Exibe mensagem de erro se houver.
                  <ErrorMessage>
                    <FaExclamationCircle />
                    {errors.password.message}
                  </ErrorMessage>
                )}
              </InputContainer>
            </FieldContainer>

            {/* Checkbox "Lembrar-me". */}
            <RememberContainer>
              <CheckboxLabel>
                <input type="checkbox" />
                Lembrar-me
              </CheckboxLabel>
            </RememberContainer>

            {/* Botão de Submissão. */}
            <Button type="submit" disabled={isLoading}> {/* Desabilita o botão enquanto está carregando. */}
              {isLoading ? ( // Exibe spinner e texto "Entrando..." se estiver carregando.
                <LoadingContainer>
                  <Spinner />
                  Entrando...
                </LoadingContainer>
              ) : ( // Caso contrário, exibe "Entrar no Sistema".
                'Entrar no Sistema'
              )}
            </Button>
          </Form>
        </Card>

        {/* Badge de Segurança. */}
        <SecurityBadge>
          <SecurityText>
            <FaShieldAlt />
            Conexão segura e criptografada
          </SecurityText>
          <SecurityText>
            © 2025 Eco Imagem. Todos os direitos reservados.
          </SecurityText>
        </SecurityBadge>
      </div>
    </Container>
  );
};

export default Login; // Exporta o componente Login.
