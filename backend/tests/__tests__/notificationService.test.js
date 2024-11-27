const { notifyUser } = require('../notificationService');

describe('Notificações', () => {
  test('Deve enviar notificação para o usuário', () => {
    const userId = 1;
    const notificationType = 'novo_comentario';
    const result = notifyUser(userId, notificationType);
    expect(result).toBeTruthy();
  });

  test('Deve impedir enviar notificação sem tipo de notificação ou id de usuário', () => {
    const userId = '';
    const notificationType = '';
    const result = notifyUser(userId, notificationType);
    expect(result).toBeFalsy();
  });
});

