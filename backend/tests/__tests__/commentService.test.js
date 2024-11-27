const { commentOnIdea, replyToComment } = require('../commentService');

describe('Comentários em Ideias', () => {
  test('Deve permitir comentar em uma ideia', () => {
    const comment = { ideaId: 101, userId: 1, text: 'Comentário sobre a ideia' };
    const result = commentOnIdea(comment);
    expect(result).toBeTruthy();
  });

  test('Deve impedir comentário sem texto ou sem id de ideia', () => {
    const comment = { ideaId: '', userId: 1, text: '' };
    const result = commentOnIdea(comment);
    expect(result).toBeFalsy();
  });

  test('Deve permitir responder a um comentário', () => {
    const reply = { commentId: 1, text: 'Resposta ao comentário' };
    const result = replyToComment(reply);
    expect(result).toBeTruthy();
  });

  test('Deve impedir resposta sem texto ou sem id do comentário', () => {
    const reply = { commentId: '', text: '' };
    const result = replyToComment(reply);
    expect(result).toBeFalsy();
  });
});
