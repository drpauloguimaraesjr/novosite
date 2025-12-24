/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://drpauloguimaraesjr.com.br',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
  },
  transform: async (config, path) => {
    // Customizar prioridade e frequência de mudança por rota
    let priority = 0.7;
    let changefreq = 'weekly';

    // Página inicial - maior prioridade
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }

    // Páginas de serviços - alta prioridade
    if (path.startsWith('/servicos/')) {
      priority = 0.9;
      changefreq = 'weekly';
    }

    // Páginas de projetos - média-alta prioridade
    if (path.startsWith('/project/')) {
      priority = 0.8;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};

