class I18n {
    constructor() {
        this.currentLanguage = 'ru';
        this.translations = {
            ru: {
                // Header
                appTitle: '🎬 Фильмосмотр',
                addButton: '➕ Добавить',
                importButton: '📁 Импорт',
                exportButton: '💾 Экспорт',
                donateButton: '💝 Донат',
                settingsButton: '⚙️ Настройки',
                
                // Add form
                addMovieTitle: 'Добавить фильм',
                movieTitlePlaceholder: 'Название фильма',
                selectType: 'Выберите тип',
                selectGenre: 'Выберите жанр',
                typeMovie: '🎬 Фильм',
                typeCartoon: '🎨 Мультфильм',
                typeSeries: '📺 Сериал',
                cancelButton: 'Отмена',
                saveButton: 'Сохранить',
                
                // Genres
                genreAll: 'Все',
                genreFavorites: '⭐',
                genreAction: 'Боевик',
                genreComedy: 'Комедия',
                genreDrama: 'Драма',
                genreHorror: 'Ужасы',
                genreFantasy: 'Фэнтези',
                genreSciFi: 'Фантастика',
                genreRomance: 'Романтика',
                genreThriller: 'Триллер',
                genreAnimation: 'Анимация',
                genreDocumentary: 'Документальный',
                genreCrime: 'Криминал',
                genreAdventure: 'Приключения',
                
                // Movie actions
                markWatched: 'Отметить как просмотренный',
                markUnwatched: 'Отметить как не просмотренный',
                copyTitle: 'Копировать название',
                addToFavorites: 'Избранное',
                deleteMovie: 'Удалить',
                
                // Empty state
                emptyListTitle: '📽️ Список фильмов пуст',
                emptyListSubtitle: 'Добавьте свой первый фильм!',
                
                // Import modal
                importModalTitle: 'Выберите фильмы для импорта',
                addSelectedButton: 'Добавить выбранные',
                replaceAllButton: 'Заменить полностью',
                
                // Settings page
                settingsTitle: '⚙️ Настройки',
                backButton: '← Назад',
                languageLabel: 'Язык интерфейса',
                languageDescription: 'Выберите язык для интерфейса расширения',
                searchEngineLabel: 'Поисковая система',
                searchEngineDescription: 'Выберите поисковую систему для поиска фильмов',
                searchTemplateLabel: 'Шаблон поискового запроса',
                searchTemplateDescription: 'Настройте шаблон для поиска. Используйте *name* для названия фильма',
                searchTemplatePlaceholder: 'смотреть *name* онлайн',
                saveSettingsButton: '💾 Сохранить настройки',
                resetSettingsButton: '🔄 Сбросить к значениям по умолчанию',
                
                // Toast messages
                movieAdded: 'Фильм добавлен!',
                movieDeleted: 'Фильм удален!',
                addedToFavorites: 'Добавлено в избранное!',
                removedFromFavorites: 'Удалено из избранного!',
                copiedToClipboard: 'Скопировано в буфер обмена!',
                fillAllFields: 'Заполните все поля!',
                movieAlreadyExists: 'Фильм с таким названием уже есть в списке!',
                settingsSaved: 'Настройки сохранены!',
                settingsReset: 'Настройки сброшены!',
                templateMustContainName: 'Шаблон должен содержать *name*!',
                selectMoviesForImport: 'Выберите фильмы для импорта!',
                allSelectedMoviesExist: 'Все выбранные фильмы уже есть в списке!',
                moviesImported: 'Импортировано {count} фильмов!',
                listReplaced: 'Список заменен! Загружено {count} фильмов.',
                listExported: 'Список экспортирован!',
                importError: 'Ошибка при импорте файла!',
                saveError: 'Ошибка при сохранении!',
                
                // Search engines
                searchEngineYandex: '🟡 Yandex',
                searchEngineGoogle: '🔍 Google',
                searchEngineBing: '🔷 Bing',
                searchEngineDuckDuckGo: '🦆 DuckDuckGo',
                
                // Languages
                languageRussian: '🇷🇺 Русский',
                languageEnglish: '🇺🇸 English',
                
                // Template preview
                templatePreviewExample: 'Пример: {example}',
                templatePreviewError: 'Ошибка: шаблон должен содержать *name*',
                
                // Confirmation
                resetSettingsConfirm: 'Сбросить все настройки к значениям по умолчанию?',
                replaceListConfirm: 'Заменить весь список фильмов на импортируемый? Текущий список будет удален.',
                
                // Donation page
                donatePageTitle: '💝 Поддержка проекта',
                donatePageSubtitle: 'Если вам нравится Фильмосмотр, вы можете поддержать разработку!',
                cryptoWalletsTitle: 'Криптокошельки',
                evmLabel: 'EVM (Этериум, BSC, Polygon)',
                solLabel: 'Solana (SOL)',
                copyAddress: 'Копировать адрес',
                addressCopied: 'Адрес скопирован!',
                thankYou: 'Спасибо!',
            },
            en: {
                // Header
                appTitle: '🎬 Filmosmotr',
                addButton: '➕ Add',
                importButton: '📁 Import',
                exportButton: '💾 Export',
                donateButton: '💝 Donate',
                settingsButton: '⚙️ Settings',
                
                // Add form
                addMovieTitle: 'Add Movie',
                movieTitlePlaceholder: 'Movie title',
                selectType: 'Select type',
                selectGenre: 'Select genre',
                typeMovie: '🎬 Movie',
                typeCartoon: '🎨 Cartoon',
                typeSeries: '📺 Series',
                cancelButton: 'Cancel',
                saveButton: 'Save',
                
                // Genres
                genreAll: 'All',
                genreFavorites: '⭐',
                genreAction: 'Action',
                genreComedy: 'Comedy',
                genreDrama: 'Drama',
                genreHorror: 'Horror',
                genreFantasy: 'Fantasy',
                genreSciFi: 'Sci-Fi',
                genreRomance: 'Romance',
                genreThriller: 'Thriller',
                genreAnimation: 'Animation',
                genreDocumentary: 'Documentary',
                genreCrime: 'Crime',
                genreAdventure: 'Adventure',
                
                // Movie actions
                markWatched: 'Mark as watched',
                markUnwatched: 'Mark as unwatched',
                copyTitle: 'Copy title',
                addToFavorites: 'Favorites',
                deleteMovie: 'Delete',
                
                // Empty state
                emptyListTitle: '📽️ Movie list is empty',
                emptyListSubtitle: 'Add your first movie!',
                
                // Import modal
                importModalTitle: 'Select movies to import',
                addSelectedButton: 'Add selected',
                replaceAllButton: 'Replace all',
                
                // Settings page
                settingsTitle: '⚙️ Settings',
                backButton: '← Back',
                languageLabel: 'Interface language',
                languageDescription: 'Select language for the extension interface',
                searchEngineLabel: 'Search engine',
                searchEngineDescription: 'Select search engine for movie searches',
                searchTemplateLabel: 'Search query template',
                searchTemplateDescription: 'Customize search template. Use *name* for movie title',
                searchTemplatePlaceholder: 'watch *name* online',
                saveSettingsButton: '💾 Save settings',
                resetSettingsButton: '🔄 Reset to defaults',
                
                // Toast messages
                movieAdded: 'Movie added!',
                movieDeleted: 'Movie deleted!',
                addedToFavorites: 'Added to favorites!',
                removedFromFavorites: 'Removed from favorites!',
                copiedToClipboard: 'Copied to clipboard!',
                fillAllFields: 'Fill all fields!',
                movieAlreadyExists: 'Movie with this title already exists!',
                settingsSaved: 'Settings saved!',
                settingsReset: 'Settings reset!',
                templateMustContainName: 'Template must contain *name*!',
                selectMoviesForImport: 'Select movies to import!',
                allSelectedMoviesExist: 'All selected movies already exist!',
                moviesImported: 'Imported {count} movies!',
                listReplaced: 'List replaced! Loaded {count} movies.',
                listExported: 'List exported!',
                importError: 'Error importing file!',
                saveError: 'Error saving!',
                
                // Search engines
                searchEngineYandex: '🟡 Yandex',
                searchEngineGoogle: '🔍 Google',
                searchEngineBing: '🔷 Bing',
                searchEngineDuckDuckGo: '🦆 DuckDuckGo',
                
                // Languages
                languageRussian: '🇷🇺 Русский',
                languageEnglish: '🇺🇸 English',
                
                // Template preview
                templatePreviewExample: 'Example: {example}',
                templatePreviewError: 'Error: template must contain *name*',
                
                // Confirmation
                resetSettingsConfirm: 'Reset all settings to defaults?',
                replaceListConfirm: 'Replace entire movie list with imported one? Current list will be deleted.',
                
                // Donation page
                donatePageTitle: '💝 Support the Project',
                donatePageSubtitle: 'If you like Filmosmotr, you can support the development!',
                cryptoWalletsTitle: 'Crypto Wallets',
                evmLabel: 'EVM (Ethereum, BSC, Polygon)',
                solLabel: 'Solana (SOL)',
                copyAddress: 'Copy address',
                addressCopied: 'Address copied!',
                thankYou: 'Thank you!',
            }
        };
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
        }
    }

    t(key, params = {}) {
        let text = this.translations[this.currentLanguage][key] || this.translations['ru'][key] || key;
        
        // Replace parameters in text
        for (const [param, value] of Object.entries(params)) {
            text = text.replace(`{${param}}`, value);
        }
        
        return text;
    }

    // Update all translatable elements in the DOM
    updateDOM() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) {
                element.placeholder = this.t(key);
            } else {
                element.textContent = this.t(key);
            }
        });

        // Update elements with data-i18n-title attribute (tooltips)
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // Update page title
        const titleElement = document.querySelector('title');
        if (titleElement && titleElement.hasAttribute('data-i18n')) {
            titleElement.textContent = this.t(titleElement.getAttribute('data-i18n'));
        }
    }

    // Initialize i18n system
    async init() {
        try {
            // Load language from settings
            const result = await chrome.storage.local.get(['settings']);
            const settings = result.settings || {};
            this.setLanguage(settings.language || 'ru');
        } catch (error) {
            // Fallback to localStorage for testing
            try {
                const stored = localStorage.getItem('filmosmotr_settings');
                if (stored) {
                    const settings = JSON.parse(stored);
                    this.setLanguage(settings.language || 'ru');
                }
            } catch (e) {
                console.error('Error loading language settings:', e);
                this.setLanguage('ru');
            }
        }
        
        this.updateDOM();
    }
}

// Create global i18n instance
const i18n = new I18n();
