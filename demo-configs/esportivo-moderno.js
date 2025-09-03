// ===== DEMO: LOJA ESPORTIVA MODERNA =====
// Copie este conteúdo para config.js para aplicar este tema

const SITE_CONFIG = {
    brand: {
        name: "Sport Zone",
        tagline: "Performance e Estilo",
        description: "Roupas e acessórios esportivos para quem busca performance e estilo. Tênis, roupas fitness e equipamentos de qualidade.",
        logo: "fas fa-running",
        favicon: "assets/favicon.ico"
    },

    theme: {
        primary: "#3b82f6",        // Azul vibrante
        primaryDark: "#1d4ed8",    // Azul escuro
        secondary: "#f0f9ff",      // Azul muito claro
        accent: "#ef4444",         // Vermelho energia
        success: "#059669",        
        warning: "#f59e0b",        
        danger: "#dc2626",         
        dark: "#1f2937",          
        muted: "#6b7280",         
        border: "#dbeafe",        
        background: "#ffffff",     
        backgroundLight: "#f8fafc" 
    },

    contact: {
        phone: "(11) 95555-7777",
        whatsapp: "5511955557777",
        email: "vendas@sportzone.com.br",
        address: {
            street: "Rua dos Esportes, 789",
            neighborhood: "Vila Olímpia",
            city: "São Paulo",
            state: "SP",
            zipCode: "04551-060"
        }
    },

    texts: {
        hero: {
            title: "Coleção <span class='text-primary'>Performance 2024</span>",
            subtitle: "Supere seus limites com roupas e equipamentos esportivos de alta performance e design moderno.",
            ctaText: "Treinar Agora"
        }
    },

    categories: [
        { id: "tenis", name: "Tênis", icon: "fas fa-shoe-prints" },
        { id: "fitness", name: "Fitness", icon: "fas fa-dumbbell" },
        { id: "corrida", name: "Corrida", icon: "fas fa-running" },
        { id: "acessorios", name: "Acessórios", icon: "fas fa-stopwatch" }
    ]
};
