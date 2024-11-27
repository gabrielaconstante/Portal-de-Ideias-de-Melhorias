let ideas = [];
// requisito 2, 3 e 6 
function createIdea(idea) {
  if (idea.title && idea.description) {
    ideas.push(idea);
    return true;
  }
  return false;
}

function getIdeas() {
  return ideas;
}

function filterIdeasByCategory(category) {
  return ideas.filter(idea => idea.category === category);
}

function filterIdeasByStatus(status) {
  return ideas.filter(idea => idea.status === status);
}

module.exports = { createIdea, getIdeas, filterIdeasByCategory, filterIdeasByStatus };
