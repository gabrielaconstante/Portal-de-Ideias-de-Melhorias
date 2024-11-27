let notifications = [];
// Requisito 7
function notifyUser(userId, notificationType) {
  if (userId && notificationType) {
    notifications.push({ userId, notificationType });
    return true;
  }
  return false;
}

module.exports = { notifyUser };
