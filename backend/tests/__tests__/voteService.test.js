const { voteOnIdea } = require('../voteService');

describe('Votação em Ideias', () => {
  test('Deve permitir votar em uma ideia se o usuário não excedeu o limite de votos', () => {
    const userId = 1;
    const ideaId = 101;
    const result = voteOnIdea(userId, ideaId);
    expect(result).toBeTruthy();
  });

  test('Deve impedir votar em uma ideia se o usuário excedeu o limite de votos por dia', () => {
    const userId = 1;
    const ideaId = 102;
    voteOnIdea(userId, ideaId); // 1º voto
    voteOnIdea(userId, ideaId); // 2º voto
    voteOnIdea(userId, ideaId); // 3º voto
    const result = voteOnIdea(userId, ideaId); // 4º voto, deve falhar
    expect(result).toBeFalsy();
  });
});

