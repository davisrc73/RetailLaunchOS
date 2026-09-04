// ==============================================================================
// Modelo: Project (Aberturas de Lojas Fnac/Darty)
// ==============================================================================

// Mock inicial de dados para suporte imediato antes da ligação ativa à base de dados
const initialProjects = [
  {
    id: 1,
    code: 'FNAC-CAS-2026',
    name: 'Fnac Cascais',
    brand: 'Fnac',
    store_format: 'Flagship',
    location: 'CascaiShopping, Piso 1, Loja 142',
    go_live_date: '2026-09-22',
    target_completion_date: '2026-09-18',
    daily_cost: 485.50,
    total_budget: 45000.00,
    status: 'em_curso',
    signage_status: 'validacao',
    playlist_version: 'v2.4-cascais',
    progress: 82
  },
  {
    id: 2,
    code: 'DARTY-PDN-2026',
    name: 'Darty Parque das Nações',
    brand: 'Darty',
    store_format: 'Standard',
    location: 'Av. D. João II, Lisboa',
    go_live_date: '2026-10-16',
    target_completion_date: '2026-10-09',
    daily_cost: 390.00,
    total_budget: 32000.00,
    status: 'planeamento',
    signage_status: 'configuracao',
    playlist_version: 'v1.1-darty-pt',
    progress: 48
  },
  {
    id: 3,
    code: 'FNAC-BOA-2026',
    name: 'Fnac Porto Boavista',
    brand: 'Fnac',
    store_format: 'Express',
    location: 'Avenida da Boavista, Porto',
    go_live_date: '2026-11-08',
    target_completion_date: '2026-11-01',
    daily_cost: 260.00,
    total_budget: 21500.00,
    status: 'planeamento',
    signage_status: 'pendente',
    playlist_version: 'v1.0-porto',
    progress: 25
  }
];

class Project {
  static async findAll() {
    return initialProjects;
  }

  static async findById(id) {
    return initialProjects.find(p => p.id === parseInt(id) || p.code === id) || null;
  }

  static async create(data) {
    const newProject = {
      id: initialProjects.length + 1,
      code: data.code || `FNAC-NEW-${Date.now()}`,
      name: data.name,
      brand: data.brand || 'Fnac',
      store_format: data.store_format || 'Standard',
      location: data.location || '',
      go_live_date: data.go_live_date,
      daily_cost: parseFloat(data.daily_cost) || 0,
      total_budget: parseFloat(data.total_budget) || 0,
      status: data.status || 'planeamento',
      signage_status: data.signage_status || 'pendente',
      playlist_version: data.playlist_version || 'v1.0',
      progress: 0
    };
    initialProjects.push(newProject);
    return newProject;
  }

  static async getKpis() {
    const totalDaily = initialProjects.reduce((acc, p) => acc + p.daily_cost, 0);
    const avgDaily = initialProjects.length ? totalDaily / initialProjects.length : 0;
    const totalBudget = initialProjects.reduce((acc, p) => acc + p.total_budget, 0);

    return {
      nextOpening: initialProjects[0],
      signageReadiness: 87,
      avgDailyCost: avgDaily,
      totalBudget: totalBudget,
      activeProjectsCount: initialProjects.length
    };
  }
}

module.exports = Project;
