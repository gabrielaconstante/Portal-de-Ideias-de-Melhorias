const { changeIdeaStatus } = require('../adminService');

describe('Gerenciamento de Status das Ideias', () => {
  test('Deve permitir alterar o status de uma ideia para "implementada"', () => {
    const ideaId = 101;
    const status = 'implementada';
    const result = changeIdeaStatus(ideaId, status);
    expect(result).toBeTruthy();
  });

  test('Deve impedir alterar o status de uma ideia para um status inválido', () => {
    const ideaId = 101;
    const status = 'status_invalido';
    const result = changeIdeaStatus(ideaId, status);
    expect(result).toBeFalsy();
  });
});
