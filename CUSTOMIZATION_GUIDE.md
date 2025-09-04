# 🎨 Guia de Customização White Label

## 📋 Visão Geral
Este sistema foi projetado para ser facilmente customizável para diferentes clientes e marcas. Sistema otimizado para dispositivos móveis com breakpoints específicos e navbar centralizada premium. Todas as configurações estão centralizadas no arquivo `assets/js/config.js`.

## 🚀 Customização Rápida (5 minutos)

### 1. Alterar Marca e Logo
```javascript
// No arquivo config.js, seção brand:
brand: {
    name: "Sua Loja",                    // Nome da loja
    tagline: "Slogan da sua marca",      // Slogan
    logo: "fas fa-store",                // Ícone FontAwesome
}
```

### 2. Trocar Cores do Tema
```javascript
// Seção theme - apenas altere as cores:
theme: {
    primary: "#e11d48",        // Rosa para loja feminina
    primaryDark: "#be185d",    // Rosa escuro
    accent: "#f59e0b",         // Dourado para destaque
}
```

### 3. Atualizar Contatos
```javascript
// Seção contact:
contact: {
    phone: "(11) 98765-4321",
    whatsapp: "5511987654321",
    email: "vendas@sualoja.com",
}
```

## 🎯 Exemplos de Configuração por Nicho

### 👗 Loja Feminina Elegante
```javascript
brand: { name: "Bella Moda", tagline: "Elegância Feminina" },
theme: { 
    primary: "#ec4899",     // Rosa
    accent: "#f59e0b"       // Dourado
},
features: {
    responsiveOptimized: true,
    touchSwipeEnabled: true,
    premiumDropdown: true
}
```

### 👔 Loja Masculina Executiva
```javascript
brand: { name: "Executive Style", tagline: "Moda Masculina Executiva" },
theme: { 
    primary: "#1f2937",     // Cinza escuro
    accent: "#3b82f6"       // Azul
}
```

### 👶 Loja Infantil
```javascript
brand: { name: "Kids Fashion", tagline: "Moda Infantil Divertida" },
theme: { 
    primary: "#10b981",     // Verde
    accent: "#f59e0b"       // Laranja
}
```

### 👟 Loja de Esportes
```javascript
brand: { name: "Sport Zone", tagline: "Moda Esportiva" },
theme: { 
    primary: "#3b82f6",     // Azul
    accent: "#ef4444"       // Vermelho
}
```

## 📦 Gerenciamento de Produtos

### Adicionar Novos Produtos
Edite o arquivo `assets/js/products.js`:

```javascript
// Adicione novos produtos ao array:
{
    id: 25,
    nome: "Novo Produto",
    preco: 199.90,
    categoria: "feminino",
    imagem: "assets/images/produto25.jpg",
    // ... outras propriedades
}
```

### Alterar Categorias
No `config.js`, seção categories:
```javascript
categories: [
    { id: "casual", name: "Casual", icon: "fas fa-tshirt" },
    { id: "formal", name: "Formal", icon: "fas fa-user-tie" },
    // Adicione mais categorias conforme necessário
]
```

## 🎨 Paletas de Cores Sugeridas

### Feminino Elegante
- Primary: `#ec4899` (Rosa)
- Accent: `#f59e0b` (Dourado)
- Secondary: `#fdf2f8` (Rosa claro)

### Masculino Executivo
- Primary: `#1f2937` (Cinza escuro)
- Accent: `#3b82f6` (Azul)
- Secondary: `#f9fafb` (Cinza claro)

### Jovem/Moderno
- Primary: `#8b5cf6` (Roxo)
- Accent: `#06d6a0` (Verde água)
- Secondary: `#f3f4f6` (Cinza muito claro)

### Luxo/Premium
- Primary: `#000000` (Preto)
- Accent: `#d4af37` (Dourado)
- Secondary: `#f8f9fa` (Branco sujo)

## 📱 Configurações Avançadas

### Google Analytics
```javascript
technical: {
    googleAnalytics: "GA_MEASUREMENT_ID",
    facebookPixel: "PIXEL_ID",
}
```

### Métodos de Pagamento
```javascript
sales: {
    paymentMethods: ["PIX", "Cartão", "Boleto", "PayPal"],
    freeShippingMinValue: 150, // Valor mínimo frete grátis
}
```

## 🔧 Checklist de Customização

- [ ] Alterar nome da marca
- [ ] Definir cores do tema
- [ ] Atualizar informações de contato
- [ ] Configurar WhatsApp Business
- [ ] Adicionar produtos específicos
- [ ] Definir categorias relevantes
- [ ] Configurar métodos de pagamento
- [ ] Adicionar Google Analytics
- [ ] Testar responsividade em iPhone SE (375px)
- [ ] Verificar navbar centralizada
- [ ] Testar dropdown de categorias
- [ ] Validar carrossel touch/swipe
- [ ] Verificar todos os links
- [ ] Testar carrinho sidebar em mobile

## 💼 Pacotes de Venda Sugeridos

### 🥉 Básico - R$ 1.200
- Customização de cores e marca
- Até 50 produtos
- Responsividade otimizada
- Navbar centralizada
- Suporte por 30 dias

### 🥈 Profissional - R$ 3.000
- Tudo do básico +
- Até 200 produtos
- Integração com redes sociais
- Google Analytics configurado
- Otimizações para iPhone SE
- Dropdown premium
- Suporte por 90 dias

### 🥇 Premium - R$ 6.000
- Tudo do profissional +
- Produtos ilimitados
- Integração com gateway de pagamento
- Sistema de cupons
- Painel administrativo
- Monitoramento UX mobile
- Suporte por 1 ano

## 📞 Suporte Técnico
Para implementação e customização, entre em contato:
- Email: suporte@seudominio.com
- WhatsApp: (11) 99999-9999
- Documentação completa: docs.seudominio.com
