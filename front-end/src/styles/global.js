// src/styles/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Fonte moderna importada do Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: #f4f7fc;
    color: #343a40;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    color: #2c3e50;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button,
  input,
  select,
  textarea {
    font-family: inherit;
    font-size: 1rem;
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    background-color: #63a81f;
    color: #fff;
    transition: background 0.3s ease;
  }

  button:hover {
    background-color: #56941b;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  input,
  select,
  textarea {
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 10px;
    background-color: #fff;
    transition: border-color 0.3s ease;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: #63a81f;
    box-shadow: 0 0 0 2px rgba(99, 168, 31, 0.2);
  }
`;

export default GlobalStyle;
