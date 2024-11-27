let comments = [];
// requisito 5
function commentOnIdea(comment) {
  if (comment.text && comment.ideaId && comment.userId) {
    comments.push(comment);
    return true;
  }
  return false;
}

function replyToComment(reply) {
  const { commentId, text } = reply;
  const comment = comments.find(c => c.id === commentId);
  if (comment && text) {
    comment.replies = comment.replies || [];
    comment.replies.push(reply);
    return true;
  }
  return false;
}

module.exports = { commentOnIdea, replyToComment };
