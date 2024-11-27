const { createIdea, getIdeas, filterIdeasByCategory, filterIdeasByStatus } = require('../ideaService');

describe('Criação de Ideias', () => {
  test('Deve permitir a criação de uma nova ideia com título e descrição', () => {
    const idea = { title: 'Nova Ideia', description: 'Descrição detalhada da ideia' };
    const result = createIdea(idea);
    expect(result).toBeTruthy();
  });

  test('Deve impedir a criação de ideia sem título ou descrição', () => {
    const idea = { title: '', description: '' };
    const result = createIdea(idea);
    expect(result).toBeFalsy();
  });
});

describe('Visualização de Ideias', () => {
  test('Deve retornar todas as ideias', () => {
    const ideas = getIdeas();
    expect(ideas).toBeInstanceOf(Array);
  });

  test('Deve filtrar ideias por categoria', () => {
    const category = 'Melhoria';
    const filteredIdeas = filterIdeasByCategory(category);
    expect(filteredIdeas.every(idea => idea.category === category)).toBeTruthy();
  });

  test('Deve filtrar ideias por status', () => {
    const status = 'implementada';
    const filteredIdeas = filterIdeasByStatus(status);
    expect(filteredIdeas.every(idea => idea.status === status)).toBeTruthy();
  });
});
