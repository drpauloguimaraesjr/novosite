# Instruções de Uso - Componente ServicesShowcase

## Arquivos Criados

1. **ServicesShowcase.tsx** - Componente React/Next.js
2. **ServicesShowcase.css** - Estilos CSS
3. **INSTRUCOES_USO.md** - Este arquivo

---

## Como Usar no Seu Site

### Passo 1: Copiar os Arquivos

1. Copie `ServicesShowcase.tsx` para `/src/components/ServicesShowcase.tsx`
2. Copie `ServicesShowcase.css` para `/src/app/ServicesShowcase.css`

### Passo 2: Importar o CSS no globals.css

Adicione no final do arquivo `/src/app/globals.css`:

```css
@import './ServicesShowcase.css';
```

### Passo 3: Adicionar o Componente na Página

No arquivo `/src/app/page.tsx`, adicione o import:

```typescript
import ServicesShowcase from "@/components/ServicesShowcase";
```

Depois, adicione o componente onde você quer que apareça:

```typescript
<ServicesShowcase />
```

**Sugestão de posicionamento:** Adicione após a seção "About" e antes do "GalleryCarousel":

```typescript
{/* About Section */}
<section className="about-section">
  {/* ... código existente ... */}
</section>

{/* ADICIONE AQUI */}
<ServicesShowcase />

<GalleryCarousel data={siteData.visualArchive} />
```

---

## Personalizando as Imagens

### Opção 1: Adicionar Imagens Localmente

1. Crie uma pasta `/public/images/` (se não existir)
2. Adicione as imagens dos serviços:
   - `checkup-premium.jpg`
   - `reposicao-hormonal.jpg`
   - `emagrecimento.jpg`
   - `performance-esportiva.jpg`
   - `lipedema.jpg`
   - `checkup-casais.jpg`
   - `preparacao-cirurgica.jpg`

### Opção 2: Usar URLs Externas

Edite o arquivo `ServicesShowcase.tsx` e substitua os caminhos das imagens:

```typescript
image: "https://seu-dominio.com/imagem.jpg"
```

### Opção 3: Usar Imagens do Firebase/Storage

Se você usa Firebase Storage (como vi no código), pode fazer upload das imagens e usar as URLs:

```typescript
image: "https://firebasestorage.googleapis.com/..."
```

---

## Personalizando os Textos

Todos os textos estão no array `services` dentro do componente `ServicesShowcase.tsx`.

Para editar, localize:

```typescript
const services: Service[] = [
  {
    id: 1,
    title: "Check-up Premium",
    subtitle: "Conhecer seu corpo é o primeiro passo para transformá-lo",
    description: "Avaliação completa...",
    image: "/images/checkup-premium.jpg",
    slug: "checkup-premium"
  },
  // ... outros serviços
];
```

Edite os campos:
- **title**: Título principal do serviço
- **subtitle**: Subtítulo/frase de impacto
- **description**: Descrição breve
- **image**: Caminho da imagem
- **slug**: URL do serviço (ex: `/servicos/checkup-premium`)

---

## Criando Páginas Individuais para Cada Serviço

### Opção 1: Páginas Estáticas

Crie arquivos em `/src/app/servicos/[slug]/page.tsx`:

```typescript
// /src/app/servicos/checkup-premium/page.tsx
export default function CheckupPremium() {
  return (
    <div>
      <h1>Check-up Premium</h1>
      {/* Conteúdo completo do arquivo 1_checkup_premium.md */}
    </div>
  );
}
```

### Opção 2: Página Dinâmica (Recomendado)

Crie `/src/app/servicos/[slug]/page.tsx`:

```typescript
import { notFound } from 'next/navigation';

const servicesContent = {
  'checkup-premium': {
    title: 'Check-up Premium',
    // ... conteúdo completo
  },
  // ... outros serviços
};

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = servicesContent[params.slug];
  
  if (!service) {
    notFound();
  }

  return (
    <div>
      <h1>{service.title}</h1>
      {/* Renderize o conteúdo */}
    </div>
  );
}
```

---

## Ajustes de Estilo

### Alterar Cores

No CSS, você pode ajustar:

```css
.service-card:hover {
  /* Adicione cor de destaque */
  border-left: 4px solid var(--accent-blue);
}
```

### Alterar Layout

Para 3 colunas em desktop:

```css
.services-grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
}
```

Para lista vertical (1 coluna):

```css
.services-grid {
  grid-template-columns: 1fr;
  max-width: 800px;
  margin: 0 auto;
}
```

---

## Animações GSAP

O componente já inclui:
- ✅ Fade in ao scroll
- ✅ Parallax nas imagens
- ✅ Hover effect nos cards
- ✅ Animação no CTA

Para desabilitar animações:

Remova ou comente o `useEffect` no componente.

---

## Compatibilidade

- ✅ Next.js 13+ (App Router)
- ✅ React 18+
- ✅ GSAP 3+
- ✅ TypeScript
- ✅ Responsivo (mobile, tablet, desktop)

---

## Suporte

Se precisar de ajustes ou tiver dúvidas, me avise!

**Contato:**
- Email: drpauloguimaraesjr@gmail.com
- Telefone: (47) 99254 7770
