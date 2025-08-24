class DonateManager {
    constructor() {
        this.init();
    }

    async init() {
        await i18n.init();
        this.bindEvents();
    }

    bindEvents() {
        // Back button handler
        document.getElementById('back-btn').addEventListener('click', () => {
            window.location.href = 'popup.html';
        });

        // Copy button handlers
        document.querySelectorAll('.copy-address-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const addressId = e.target.getAttribute('data-address');
                this.copyAddress(addressId);
            });
        });
    }

    async copyAddress(addressId) {
        const addressElement = document.getElementById(addressId);
        const address = addressElement.textContent;
        
        try {
            await navigator.clipboard.writeText(address);
            this.showToast(i18n.t('addressCopied'));
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = address;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast(i18n.t('addressCopied'));
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : '#4CAF50'};
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize donate manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DonateManager();
});