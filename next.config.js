const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Necessário para Docker
  
  // Configuração de imagens para funcionar em container
  images: {
    unoptimized: true, // Evita problemas com otimização de imagens no container
  },
};

module.exports = nextConfig;

