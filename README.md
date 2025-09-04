# 🛍️ Moda Elegante - Loja de Roupas Online

Uma loja de roupas online moderna, responsiva e profissional, desenvolvida com Bootstrap 5 e JavaScript vanilla. Sistema otimizado para dispositivos móveis com breakpoints específicos para iPhone SE (375px) e outras telas pequenas.

## 📋 Características

### ✨ Design e UX
- **Design Moderno e Minimalista**: Interface limpa e elegante
- **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Navegação Intuitiva**: Menu organizado com categorias e busca
- **Animações Suaves**: Transições e efeitos que melhoram a experiência

### 🛒 Funcionalidades de E-commerce
- **Catálogo Completo**: Sistema de filtros eficiente por categoria, preço e tamanho
- **Páginas de Produto**: Galeria de imagens, descrições detalhadas e seleção de variações
- **Carrinho de Compras**: Sidebar responsiva com funcionalidades completas
- **Navbar Centralizada**: Menu centralizado com dropdown premium para categorias
- **Checkout Simplificado**: Formulário otimizado sem integração de pagamento
- **Sistema de Busca**: Busca em tempo real por produtos
- **WhatsApp Float**: Botão flutuante otimizado para mobile

### 📄 Páginas Institucionais
- **Homepage**: Banner principal com carrossel touch/swipe e produtos em destaque
- **Catálogo**: Listagem completa com filtros avançados
- **Produto Individual**: Detalhes completos com galeria
- **Sobre Nós**: História e valores da empresa
- **Contato**: Formulário e informações de contato
- **Políticas**: Termos de uso, privacidade e trocas
- **Pedidos**: Acompanhamento de pedidos
- **Checkout**: Processo de finalização de compra
- **Sucesso**: Confirmação de pedido

## 🏗️ Estrutura do Projeto

```
loja_moderna/
├── index.html              # Página inicial
├── catalogo.html           # Catálogo de produtos
├── produto.html            # Página individual do produto
├── checkout.html           # Finalização de compra
├── sucesso.html           # Confirmação de pedido
├── contato.html           # Página de contato
├── sobre.html             # Sobre a empresa
├── politicas.html         # Políticas da loja
├── assets/
│   ├── css/
│   │   └── style.css      # Estilos customizados
│   └── js/
│       ├── products.js    # Dados e funções dos produtos
│       ├── cart.js        # Gerenciamento do carrinho
│       ├── main.js        # Funcionalidades gerais
│       ├── catalog.js     # Funcionalidades do catálogo
│       ├── product.js     # Funcionalidades da página de produto
│       └── checkout.js    # Funcionalidades do checkout
└── README.md              # Documentação
```

## 🚀 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilos modernos com variáveis CSS
- **Bootstrap 5**: Framework CSS responsivo
- **JavaScript ES6+**: Funcionalidades interativas
- **Font Awesome**: Ícones profissionais
- **Google Fonts**: Tipografia elegante (Inter + Playfair Display)

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- **Desktop**: 1200px+ (navbar centralizada, carrinho visível)
- **Tablet**: 768px - 1199px (layout adaptativo)
- **Mobile**: 320px - 767px (otimizado para toque)
- **iPhone SE/Mini**: 375px (breakpoint específico)
- **Viewport dinâmico**: 100dvh/100svh para hero e sidebar

## 🔧 Instalação e Uso

### Requisitos
- Servidor web (Apache, Nginx, ou servidor local)
- Navegador moderno com suporte a ES6+

### Instalação
1. Faça o download dos arquivos
2. Coloque na pasta do seu servidor web
3. Acesse através do navegador

### Configuração
1. **Produtos**: Edite o arquivo `assets/js/products.js` para adicionar/modificar produtos
2. **Informações da Loja**: Atualize dados de contato nos arquivos HTML
3. **Cores e Estilos**: Modifique as variáveis CSS no arquivo `assets/css/style.css`

## 🛠️ Personalização

### Alterando Cores
```css
:root {
    --primary-color: #2563eb;    /* Cor principal */
    --primary-dark: #1d4ed8;     /* Cor principal escura */
    --secondary-color: #f8fafc;  /* Cor secundária */
    --accent-color: #10b981;     /* Cor de destaque */
}
```

### Adicionando Produtos
```javascript
// Em assets/js/products.js
const produtos = [
    {
        id: 9,
        nome: "Nome do Produto",
        categoria: "feminino", // feminino, masculino, acessorios
        preco: 99.90,
        precoOriginal: 129.90,
        imagem: "url-da-imagem.jpg",
        imagens: ["img1.jpg", "img2.jpg"],
        descricao: "Descrição detalhada",
        tamanhos: ["P", "M", "G"],
        cores: ["Azul", "Vermelho"],
        badge: "Novidade",
        destaque: true,
        rating: 4.5,
        reviews: 10
    }
];
```

## 📊 Funcionalidades Técnicas

### Carrinho de Compras
- Armazenamento local (localStorage)
- Adição/remoção de produtos
- Controle de quantidade
- Cálculo automático de totais
- Persistência entre sessões
- Sidebar responsiva com z-index otimizado

### Sistema de Filtros
- Filtro por categoria
- Filtro por faixa de preço
- Filtro por tamanho
- Ordenação (nome, preço, avaliação)
- Busca por texto

### Performance e UX
- Lazy loading de imagens
- Código otimizado e minificado
- Carregamento assíncrono
- Animações com CSS3
- Navbar com dropdown premium (hover desktop, click mobile)
- Carrossel touch/swipe habilitado
- Safe area para iOS (env(safe-area-inset))
- Viewport dinâmico (100dvh/100svh)

## 🔒 Segurança

- Validação de formulários
- Sanitização de inputs
- Proteção contra XSS
- Estrutura segura de arquivos

## 📈 SEO e Acessibilidade

- Meta tags otimizadas
- Viewport padronizado (sem user-scalable=no)
- Estrutura semântica HTML5
- Alt text em imagens
- Navegação por teclado
- Contraste adequado
- Schema markup ready
- ARIA labels em botões interativos
- Focus trap no carrinho sidebar

## 🎯 Valor Comercial

### Características Profissionais
- **Código Limpo**: Organizado e bem documentado
- **Fácil Manutenção**: Estrutura modular e comentada
- **Escalável**: Fácil adição de novas funcionalidades
- **Cross-browser**: Compatível com navegadores modernos
- **Performance**: Carregamento rápido e otimizado

### Ideal Para
- Lojas de roupas e moda
- E-commerce de pequeno/médio porte
- Catálogos online
- Portfólios de produtos
- Landing pages comerciais

## 💰 Plano de Manutenção (R$ 150/mês)

### Serviços Inclusos
- Atualização de produtos (até 30 produtos/mês)
- Ajustes de layout, cores e responsividade
- Backup mensal automatizado
- Monitoramento de performance mobile
- Correções de bugs e otimizações
- Suporte técnico via WhatsApp/email
- Relatório mensal de métricas e UX
- Atualizações de segurança

### Atualizações Rápidas
- Alteração de preços: 5 minutos
- Adição de produtos: 10 minutos
- Mudança de cores/layout: 15 minutos
- Ajustes de responsividade: 20 minutos
- Atualização de textos: 5 minutos

## 📞 Suporte

Para dúvidas sobre implementação ou customização:
- **Email**: suporte@exemplo.com
- **WhatsApp**: (11) 99999-9999
- **Documentação**: Este arquivo README.md

## 📝 Licença

Este projeto foi desenvolvido para uso comercial. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para o sucesso do seu negócio!**
