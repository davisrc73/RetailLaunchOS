// ==============================================================================
// Configuração Geral da Aplicação (RetailLaunchOS)
// ==============================================================================

module.exports = {
  appName: 'RetailLaunchOS',
  department: 'Gabinete Multimédia - Fnac Darty',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  apiPrefix: '/api/v1',
  brands: ['Fnac', 'Darty', 'Fnac Express'],
  defaultCurrency: 'EUR'
};
