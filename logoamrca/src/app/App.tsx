import { AnimatedLogo } from "./components/AnimatedLogo";

export default function App() {
  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col items-center gap-8 p-8">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold mb-2">Animação da Logomarca DNA</h1>
          <p className="text-gray-600">100% vetorial • Loop infinito suave • Código SVG puro</p>
        </div>
        
        <AnimatedLogo size={400} speed={3} autoPlay={true} />
        
        <div className="mt-8 max-w-2xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-3">✅ Componente 100% em código:</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">🎨 Vetorial puro (SVG + Motion React)</p>
              <p className="text-gray-600">Nenhuma imagem PNG/GIF - escala perfeitamente para qualquer tamanho</p>
            </div>
            <div>
              <p className="font-medium mb-1">♾️ Loop infinito sem interrupções</p>
              <p className="text-gray-600">DNA duplicado para transição perfeita e contínua</p>
            </div>
            <div>
              <p className="font-medium mb-1">📐 Proporções exatas</p>
              <p className="text-gray-600">DNA ocupa 55% da largura interna, colado na borda esquerda</p>
            </div>
            <div>
              <p className="font-medium mb-1">🚀 Exportável e reutilizável</p>
              <code className="block bg-gray-100 p-2 rounded text-xs mt-1">
                {`<AnimatedLogo size={300} speed={2} color="#010101" />`}
              </code>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="font-medium mb-2">Parâmetros customizáveis:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li><strong>size:</strong> Tamanho em pixels (padrão: 300)</li>
                <li><strong>speed:</strong> Duração da animação em segundos (padrão: 4)</li>
                <li><strong>autoPlay:</strong> Iniciar automaticamente (padrão: true)</li>
                <li><strong>color:</strong> Cor do DNA e borda (padrão: #010101)</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <AnimatedLogo size={180} speed={5} autoPlay={true} />
            <p className="mt-2 text-sm text-gray-600">Lento (5s)</p>
          </div>
          <div className="text-center">
            <AnimatedLogo size={180} speed={2.5} autoPlay={true} />
            <p className="mt-2 text-sm text-gray-600">Normal (2.5s)</p>
          </div>
          <div className="text-center">
            <AnimatedLogo size={180} speed={1.2} autoPlay={true} />
            <p className="mt-2 text-sm text-gray-600">Rápido (1.2s)</p>
          </div>
        </div>

        <div className="mt-8 bg-black text-white p-6 rounded-lg max-w-2xl">
          <h3 className="text-lg font-semibold mb-3">💡 Como usar em seu projeto:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Copie o arquivo <code className="bg-gray-700 px-1 rounded">/src/app/components/AnimatedLogo.tsx</code></li>
            <li>Instale a dependência: <code className="bg-gray-700 px-1 rounded">npm install motion</code></li>
            <li>Importe e use: <code className="bg-gray-700 px-1 rounded">{`import { AnimatedLogo } from "./components/AnimatedLogo"`}</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}