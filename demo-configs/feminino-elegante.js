// ===== DEMO: LOJA FEMININA ELEGANTE =====
// Copie este conteúdo para config.js para aplicar este tema

const SITE_CONFIG = {
    brand: {
        name: "Bella Moda",
        tagline: "Elegância que Encanta",
        description: "Descubra peças únicas e elegantes para mulheres que valorizam estilo e sofisticação. Moda feminina premium com entrega rápida.",
        logo: "fas fa-heart",
        favicon: "assets/favicon.ico"
    },

    theme: {
        primary: "#ec4899",        // Rosa elegante
        primaryDark: "#be185d",    // Rosa escuro
        secondary: "#fdf2f8",      // Rosa muito claro
        accent: "#f59e0b",         // Dourado
        success: "#059669",        
        warning: "#d97706",        
        danger: "#dc2626",         
        dark: "#1f2937",          
        muted: "#6b7280",         
        border: "#f3e8ff",        // Borda suave
        background: "#ffffff",     
        backgroundLight: "#fef7ff" // Fundo levemente rosado
    },

    contact: {
        phone: "(11) 98765-4321",
        whatsapp: "5511987654321",
        email: "contato@bellamoda.com.br",
        address: {
            street: "Rua Augusta, 456",
            neighborhood: "Jardins",
            city: "São Paulo",
            state: "SP",
            zipCode: "01305-000"
        }
    },

    texts: {
        hero: {
            title: "Coleção <span class='text-primary'>Primavera Elegante</span>",
            subtitle: "Descubra peças exclusivas que realçam sua feminilidade com elegância e sofisticação únicas.",
            ctaText: "Explorar Coleção"
        }
    },

    categories: [
        { id: "vestidos", name: "Vestidos", icon: "fas fa-female" },
        { id: "blusas", name: "Blusas", icon: "fas fa-tshirt" },
        { id: "acessorios", name: "Acessórios", icon: "fas fa-gem" },
        { id: "calcados", name: "Calçados", icon: "fas fa-shoe-prints" }
    ]
};
