const { registerUser, loginUser, recoverPassword } = require('../authService');

describe('Cadastro e Login', () => {
  test('Deve permitir o cadastro de um novo usuário', () => {
    const user = { email: 'usuario@email.com', password: 'senha123' };
    const result = registerUser(user);
    expect(result).toBeTruthy();
  });

  test('Deve permitir o login com credenciais válidas', () => {
    const credentials = { email: 'usuario@email.com', password: 'senha123' };
    const result = loginUser(credentials);
    expect(result).toBeTruthy();
  });

  test('Deve retornar erro para login com credenciais inválidas', () => {
    const credentials = { email: 'usuario@email.com', password: 'senha_errada' };
    const result = loginUser(credentials);
    expect(result).toBeFalsy();
  });

  test('Deve permitir a recuperação de senha com email válido', () => {
    const email = 'usuario@email.com';
    const result = recoverPassword(email);
    expect(result).toBeTruthy();
  });
});
