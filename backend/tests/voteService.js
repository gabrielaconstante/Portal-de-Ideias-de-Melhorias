let votes = {};
const maxVotesPerDay = 3;
// requisito 4
function voteOnIdea(userId, ideaId) {
  if (!votes[userId]) {
    votes[userId] = [];
  }

  const userVotesToday = votes[userId].filter(vote => vote.date === new Date().toDateString());

  if (userVotesToday.length < maxVotesPerDay) {
    votes[userId].push({ ideaId, date: new Date().toDateString() });
    return true;
  }

  return false;
}

module.exports = { voteOnIdea };
