let ideas = [];

function changeIdeaStatus(ideaId, status) {
  const validStatuses = ['nova', 'em análise', 'implementada', 'rejeitada'];
  if (!validStatuses.includes(status)) return false;

  const idea = ideas.find(idea => idea.id === ideaId);
  if (idea) {
    idea.status = status;
    return true;
  }

  return false;
}

module.exports = { changeIdeaStatus };
