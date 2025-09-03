// ===== DEMO: LOJA MASCULINA EXECUTIVA =====
// Copie este conteúdo para config.js para aplicar este tema

const SITE_CONFIG = {
    brand: {
        name: "Executive Style",
        tagline: "Moda Masculina Executiva",
        description: "Roupas masculinas premium para o homem moderno. Camisas, ternos e acessórios de alta qualidade para o ambiente corporativo.",
        logo: "fas fa-user-tie",
        favicon: "assets/favicon.ico"
    },

    theme: {
        primary: "#1f2937",        // Cinza escuro
        primaryDark: "#111827",    // Cinza muito escuro
        secondary: "#f9fafb",      // Cinza muito claro
        accent: "#3b82f6",         // Azul corporativo
        success: "#059669",        
        warning: "#d97706",        
        danger: "#dc2626",         
        dark: "#000000",          
        muted: "#6b7280",         
        border: "#e5e7eb",        
        background: "#ffffff",     
        backgroundLight: "#f8fafc" 
    },

    contact: {
        phone: "(11) 91234-5678",
        whatsapp: "5511912345678",
        email: "vendas@executivestyle.com.br",
        address: {
            street: "Av. Paulista, 1000",
            neighborhood: "Bela Vista",
            city: "São Paulo",
            state: "SP",
            zipCode: "01310-100"
        }
    },

    texts: {
        hero: {
            title: "Coleção <span class='text-primary'>Executive 2024</span>",
            subtitle: "Vista-se com elegância e profissionalismo. Peças premium para o homem de negócios moderno.",
            ctaText: "Ver Coleção"
        }
    },

    categories: [
        { id: "ternos", name: "Ternos", icon: "fas fa-user-tie" },
        { id: "camisas", name: "Camisas", icon: "fas fa-tshirt" },
        { id: "gravatas", name: "Gravatas", icon: "fas fa-necktie" },
        { id: "sapatos", name: "Sapatos", icon: "fas fa-shoe-prints" }
    ]
};
