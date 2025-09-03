// ===== CONFIGURAÇÃO WHITE LABEL =====
// Este arquivo centraliza todas as configurações customizáveis do site
// Para personalizar para um cliente, apenas altere os valores abaixo

const SITE_CONFIG = {
    // ===== INFORMAÇÕES DA MARCA =====
    brand: {
        name: "Moda Elegante",
        tagline: "Sua loja de roupas online",
        description: "Descubra as melhores roupas femininas e masculinas. Frete grátis para todo Brasil em compras acima de R$ 200,00.",
        logo: "fas fa-gem", // Ícone FontAwesome ou URL da imagem
        favicon: "assets/favicon.ico"
    },

    // ===== CORES DO TEMA =====
    theme: {
        primary: "#2563eb",        // Cor principal
        primaryDark: "#1d4ed8",    // Cor principal escura
        secondary: "#f8fafc",      // Cor secundária
        accent: "#10b981",         // Cor de destaque
        success: "#059669",        // Verde para sucesso
        warning: "#d97706",        // Laranja para avisos
        danger: "#dc2626",         // Vermelho para erros
        dark: "#1f2937",          // Texto escuro
        muted: "#6b7280",         // Texto esmaecido
        border: "#e5e7eb",        // Bordas
        background: "#ffffff",     // Fundo
        backgroundLight: "#f9fafb" // Fundo claro
    },

    // ===== INFORMAÇÕES DE CONTATO =====
    contact: {
        phone: "(11) 99999-9999",
        whatsapp: "5511999999999",
        email: "contato@modaelegante.com",
        address: {
            street: "Rua das Flores, 123",
            neighborhood: "Centro",
            city: "São Paulo",
            state: "SP",
            zipCode: "01234-567"
        },
        social: {
            instagram: "https://instagram.com/modaelegante",
            facebook: "https://facebook.com/modaelegante",
            twitter: "https://twitter.com/modaelegante"
        }
    },

    // ===== CONFIGURAÇÕES DE VENDAS =====
    sales: {
        freeShippingMinValue: 200,
        currency: "R$",
        paymentMethods: ["PIX", "Cartão de Crédito", "Boleto"],
        deliveryDays: "5-10 dias úteis",
        returnPolicy: "30 dias para trocas e devoluções"
    },

    // ===== CATEGORIAS DISPONÍVEIS =====
    categories: [
        {
            id: "feminino",
            name: "Feminino",
            icon: "fas fa-female",
            description: "Roupas femininas modernas e elegantes"
        },
        {
            id: "masculino",
            name: "Masculino",
            icon: "fas fa-male",
            description: "Roupas masculinas com estilo e conforto"
        },
        {
            id: "acessorios",
            name: "Acessórios",
            icon: "fas fa-glasses",
            description: "Acessórios para completar seu look"
        }
    ],

    // ===== TEXTOS PERSONALIZÁVEIS =====
    texts: {
        hero: {
            title: "Coleção <span class='text-primary'>Verão 2024</span>",
            subtitle: "Descubra as peças perfeitas para renovar seu guarda-roupa com elegância, conforto e estilo único.",
            ctaText: "Ver Catálogo"
        },
        about: {
            title: "Sobre Nossa Loja",
            description: "Somos uma loja especializada em moda feminina e masculina, oferecendo peças de qualidade com os melhores preços do mercado."
        },
        features: [
            {
                icon: "fas fa-shipping-fast",
                title: "Entrega Rápida",
                description: "Receba seus produtos em até 5 dias úteis"
            },
            {
                icon: "fas fa-shield-alt",
                title: "Compra Segura",
                description: "Seus dados protegidos com certificado SSL"
            },
            {
                icon: "fas fa-undo",
                title: "Troca Garantida",
                description: "30 dias para trocas e devoluções"
            }
        ]
    },

    // ===== CONFIGURAÇÕES TÉCNICAS =====
    technical: {
        googleAnalytics: "", // ID do Google Analytics
        facebookPixel: "",   // ID do Facebook Pixel
        gtmId: "",          // Google Tag Manager ID
        recaptchaSiteKey: "", // reCAPTCHA site key
        apiEndpoint: "/api", // Endpoint da API
        enablePWA: true,    // Ativar Progressive Web App
        enableOffline: true // Ativar modo offline
    }
};

// ===== FUNÇÕES UTILITÁRIAS =====
class ConfigManager {
    static applyTheme() {
        const root = document.documentElement;
        const theme = SITE_CONFIG.theme;
        
        // Aplicar cores CSS customizadas
        root.style.setProperty('--primary-color', theme.primary);
        root.style.setProperty('--primary-dark', theme.primaryDark);
        root.style.setProperty('--secondary-color', theme.secondary);
        root.style.setProperty('--accent-color', theme.accent);
        root.style.setProperty('--success-color', theme.success);
        root.style.setProperty('--warning-color', theme.warning);
        root.style.setProperty('--danger-color', theme.danger);
        root.style.setProperty('--text-dark', theme.dark);
        root.style.setProperty('--text-muted', theme.muted);
        root.style.setProperty('--border-color', theme.border);
        root.style.setProperty('--bg-color', theme.background);
        root.style.setProperty('--bg-light', theme.backgroundLight);
    }

    static updateBrandInfo() {
        const brand = SITE_CONFIG.brand;
        
        // Atualizar título da página
        document.title = `${brand.name} - ${brand.tagline}`;
        
        // Atualizar meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = brand.description;
        }
        
        // Atualizar logo e nome da marca
        document.querySelectorAll('.navbar-brand').forEach(element => {
            const icon = element.querySelector('i');
            const text = element.childNodes[element.childNodes.length - 1];
            
            if (icon && brand.logo.startsWith('fas')) {
                icon.className = `${brand.logo} me-2`;
            }
            
            if (text) {
                text.textContent = brand.name;
            }
        });
    }

    static updateContactInfo() {
        const contact = SITE_CONFIG.contact;
        
        // Atualizar WhatsApp
        document.querySelectorAll('.whatsapp-float').forEach(element => {
            element.href = `https://wa.me/${contact.whatsapp}`;
        });
        
        // Atualizar informações de contato no footer
        const phoneElements = document.querySelectorAll('[data-contact="phone"]');
        phoneElements.forEach(el => el.textContent = contact.phone);
        
        const emailElements = document.querySelectorAll('[data-contact="email"]');
        emailElements.forEach(el => el.textContent = contact.email);
    }

    static updateTexts() {
        const texts = SITE_CONFIG.texts;
        
        // Atualizar hero section
        const heroTitle = document.querySelector('[data-text="hero-title"]');
        if (heroTitle) {
            heroTitle.innerHTML = texts.hero.title;
        }
        
        const heroSubtitle = document.querySelector('[data-text="hero-subtitle"]');
        if (heroSubtitle) {
            heroSubtitle.textContent = texts.hero.subtitle;
        }
        
        const heroCta = document.querySelector('[data-text="hero-cta"]');
        if (heroCta) {
            heroCta.textContent = texts.hero.ctaText;
        }
    }

    static init() {
        // Aplicar todas as configurações
        this.applyTheme();
        this.updateBrandInfo();
        this.updateContactInfo();
        this.updateTexts();
        
        console.log('🎨 Configurações white label aplicadas!');
        console.log('📋 Para personalizar, edite o arquivo config.js');
    }
}

// Auto-inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    ConfigManager.init();
});

// Exportar configurações para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_CONFIG, ConfigManager };
}
