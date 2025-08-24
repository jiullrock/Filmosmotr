class Settings {
    constructor() {
        this.defaultSettings = {
            language: 'ru',
            searchEngine: 'yandex',
            searchTemplate: 'смотреть *name* онлайн'
        };
        
        this.searchEngines = {
            yandex: 'https://yandex.ru/search/?text=',
            google: 'https://www.google.com/search?q=',
            bing: 'https://www.bing.com/search?q=',
            duckduckgo: 'https://duckduckgo.com/?q='
        };
        
        this.currentSettings = { ...this.defaultSettings };
        
        this.init();
    }

    async init() {
        await this.loadSettings();
        await i18n.init(); // Initialize i18n system
        this.bindEvents();
        this.updateUI();
        this.updateTemplatePreview();
    }

    bindEvents() {
        // Back button
        document.getElementById('back-btn').addEventListener('click', () => {
            window.location.href = 'popup.html';
        });

        // Save settings
        document.getElementById('save-settings-btn').addEventListener('click', () => {
            this.saveSettings();
        });

        // Reset settings
        document.getElementById('reset-settings-btn').addEventListener('click', () => {
            this.resetSettings();
        });

        // Donate button
        document.getElementById('donate-btn').addEventListener('click', () => {
            this.openDonate();
        });

        // Template preview update
        document.getElementById('search-template-input').addEventListener('input', () => {
            this.updateTemplatePreview();
        });

        // Real-time validation
        document.getElementById('search-template-input').addEventListener('input', (e) => {
            this.validateTemplate(e.target.value);
        });

        // Language change listener
        document.getElementById('language-select').addEventListener('change', (e) => {
            i18n.setLanguage(e.target.value);
            i18n.updateDOM();
            this.updateTemplatePreview();
        });
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.local.get(['settings']);
            this.currentSettings = { ...this.defaultSettings, ...result.settings };
        } catch (error) {
            console.error('Error loading settings:', error);
            // Fallback to localStorage for testing
            try {
                const stored = localStorage.getItem('filmosmotr_settings');
                if (stored) {
                    this.currentSettings = { ...this.defaultSettings, ...JSON.parse(stored) };
                }
            } catch (e) {
                console.error('Error loading from localStorage:', e);
            }
        }
    }

    async saveSettings() {
        // Get current values from UI
        this.currentSettings = {
            language: document.getElementById('language-select').value,
            searchEngine: document.getElementById('search-engine-select').value,
            searchTemplate: document.getElementById('search-template-input').value.trim()
        };

        // Validate template
        if (!this.validateTemplate(this.currentSettings.searchTemplate)) {
            this.showToast(i18n.t('templateMustContainName'), 'error');
            return;
        }

        // Apply language change immediately
        i18n.setLanguage(this.currentSettings.language);
        i18n.updateDOM();
        this.updateTemplatePreview();

        try {
            await chrome.storage.local.set({ settings: this.currentSettings });
            this.showToast(i18n.t('settingsSaved'));
        } catch (error) {
            console.error('Error saving settings:', error);
            // Fallback to localStorage for testing
            try {
                localStorage.setItem('filmosmotr_settings', JSON.stringify(this.currentSettings));
                this.showToast(i18n.t('settingsSaved'));
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                this.showToast(i18n.t('saveError'), 'error');
            }
        }
    }

    resetSettings() {
        if (confirm(i18n.t('resetSettingsConfirm'))) {
            this.currentSettings = { ...this.defaultSettings };
            this.updateUI();
            i18n.setLanguage(this.currentSettings.language);
            i18n.updateDOM();
            this.updateTemplatePreview();
            this.showToast(i18n.t('settingsReset'));
        }
    }

    openDonate() {
        window.location.href = 'donate.html';
    }

    updateUI() {
        document.getElementById('language-select').value = this.currentSettings.language;
        document.getElementById('search-engine-select').value = this.currentSettings.searchEngine;
        document.getElementById('search-template-input').value = this.currentSettings.searchTemplate;
        
        // Apply language setting
        i18n.setLanguage(this.currentSettings.language);
        i18n.updateDOM();
    }

    validateTemplate(template) {
        return template && template.includes('*name*');
    }

    updateTemplatePreview() {
        const template = document.getElementById('search-template-input').value;
        const preview = document.getElementById('template-preview');
        
        if (this.validateTemplate(template)) {
            const example = template.replace('*name*', 'Интерстеллар');
            preview.textContent = i18n.t('templatePreviewExample', { example });
            preview.style.color = '#495057';
            preview.style.background = '#f8f9fa';
        } else {
            preview.textContent = i18n.t('templatePreviewError');
            preview.style.color = '#dc3545';
            preview.style.background = '#f8d7da';
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

    // Static method to get settings (for use in other files)
    static async getSettings() {
        const defaultSettings = {
            language: 'ru',
            searchEngine: 'yandex',
            searchTemplate: 'смотреть *name* онлайн'
        };

        try {
            const result = await chrome.storage.local.get(['settings']);
            return { ...defaultSettings, ...result.settings };
        } catch (error) {
            console.error('Error loading settings:', error);
            // Fallback to localStorage for testing
            try {
                const stored = localStorage.getItem('filmosmotr_settings');
                if (stored) {
                    return { ...defaultSettings, ...JSON.parse(stored) };
                }
            } catch (e) {
                console.error('Error loading from localStorage:', e);
            }
            return defaultSettings;
        }
    }

    // Static method to get search URL (for use in other files)
    static getSearchUrl(movieTitle, settings) {
        const searchEngines = {
            yandex: 'https://yandex.ru/search/?text=',
            google: 'https://www.google.com/search?q=',
            bing: 'https://www.bing.com/search?q=',
            duckduckgo: 'https://duckduckgo.com/?q='
        };

        const baseUrl = searchEngines[settings.searchEngine] || searchEngines.yandex;
        const query = settings.searchTemplate.replace('*name*', movieTitle);
        return baseUrl + encodeURIComponent(query);
    }
}

// Initialize settings when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Settings();
});