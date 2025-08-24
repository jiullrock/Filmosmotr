// Главный скрипт расширения Фильмосмотр
class MovieManager {
    constructor() {
        this.movies = [];
        this.currentGenre = 'all';
        this.nextId = 1; // Уникальный счетчик ID
        this.genres = {
            'action': 'Боевик',
            'adventure': 'Приключения', 
            'comedy': 'Комедия',
            'drama': 'Драма',
            'horror': 'Ужасы',
            'thriller': 'Триллер',
            'fantasy': 'Фэнтези',
            'sci-fi': 'Фантастика',
            'romance': 'Романтика',
            'animation': 'Анимация',
            'documentary': 'Документальный',
            'crime': 'Криминал'
        };
        this.movieTypes = {
            'movie': '🎬',
            'cartoon': '🎨',
            'series': '📺'
        };
        this.init();
    }

    async init() {
        await this.loadMovies();
        this.initializeNextId(); // Инициализация счетчика ID
        await i18n.init(); // Initialize i18n system
        this.bindEvents();
        this.renderMovies();
    }

    // Инициализируем счетчик ID на основе максимального существующего ID
    initializeNextId() {
        if (this.movies.length === 0) {
            this.nextId = 1;
        } else {
            const maxId = Math.max(...this.movies.map(movie => movie.id || 0));
            this.nextId = maxId + 1;
        }
    }

    // Генерируем уникальный ID
    generateUniqueId() {
        return this.nextId++;
    }

    bindEvents() {
        // Кнопки в заголовке
        document.getElementById('add-movie-btn').addEventListener('click', () => this.showAddForm());
        document.getElementById('export-btn').addEventListener('click', () => this.exportMovies());
        document.getElementById('import-btn').addEventListener('click', () => this.importMovies());
        document.getElementById('settings-btn').addEventListener('click', () => this.openSettings());

        // Форма добавления
        document.getElementById('save-movie-btn').addEventListener('click', () => this.saveMovie());
        document.getElementById('cancel-add-btn').addEventListener('click', () => this.hideAddForm());

        // Вкладки жанров (будут обрабатываться через drag-scroll)
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.switchGenre(e.target.dataset.genre);
            });
        });

        // Импорт файла
        document.getElementById('import-file').addEventListener('change', (e) => this.handleFileImport(e));
        
        // Модальные окна
        document.getElementById('import-cancel-btn').addEventListener('click', () => this.hideImportModal());
        document.getElementById('import-selected-btn').addEventListener('click', () => this.importSelectedMovies());
        document.getElementById('import-replace-btn').addEventListener('click', () => this.importReplaceMovies());
        
        // Drag-скролл для вкладок
        this.initDragScroll();
    }

    showAddForm() {
        document.getElementById('add-movie-form').classList.remove('hidden');
        document.getElementById('movie-title').focus();
    }

    hideAddForm() {
        document.getElementById('add-movie-form').classList.add('hidden');
        this.clearForm();
    }

    clearForm() {
        document.getElementById('movie-title').value = '';
        document.getElementById('movie-type').value = '';
        document.getElementById('movie-genre').value = '';
    }

    async saveMovie() {
        const title = document.getElementById('movie-title').value.trim();
        const type = document.getElementById('movie-type').value;
        const genre = document.getElementById('movie-genre').value;

        if (!title || !type || !genre) {
            this.showToast(i18n.t('fillAllFields'), 'error');
            return;
        }

        // Проверяем на дубликаты (без учета регистра)
        const existingMovie = this.movies.find(movie => 
            movie.title.toLowerCase() === title.toLowerCase()
        );
        
        if (existingMovie) {
            this.showToast(i18n.t('movieAlreadyExists'), 'error');
            return;
        }

        const movie = {
            id: this.generateUniqueId(),
            title,
            type,
            genre,
            watched: false,
            favorite: false,
            dateAdded: new Date().toISOString()
        };

        this.movies.push(movie);
        await this.saveMovies();
        this.renderMovies();
        this.hideAddForm();
        this.showToast(i18n.t('movieAdded'));
    }

    switchGenre(genre) {
        this.currentGenre = genre;
        
        // Обновление активной вкладки
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-genre="${genre}"]`).classList.add('active');
        
        this.renderMovies();
    }

    renderMovies() {
        const container = document.getElementById('movies-list');
        const filteredMovies = this.getFilteredMovies();

        if (filteredMovies.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p data-i18n="emptyListTitle">${i18n.t('emptyListTitle')}</p>
                    <p data-i18n="emptyListSubtitle">${i18n.t('emptyListSubtitle')}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredMovies.map(movie => this.createMovieHTML(movie)).join('');
        
        // Привязка событий к элементам фильмов
        this.bindMovieEvents();
    }

    getFilteredMovies() {
        let filtered;
        if (this.currentGenre === 'all') {
            filtered = this.movies;
        } else if (this.currentGenre === 'favorites') {
            filtered = this.movies.filter(movie => movie.favorite);
        } else {
            filtered = this.movies.filter(movie => movie.genre === this.currentGenre);
        }
        
        // Сортируем: сначала непросмотренные, потом просмотренные
        return filtered.sort((a, b) => {
            if (a.watched === b.watched) {
                // Если оба одинакового статуса, сортируем по дате добавления
                return new Date(a.dateAdded || 0) - new Date(b.dateAdded || 0);
            }
            // Непросмотренные (false) вперёд, просмотренные (true) в конец
            return a.watched - b.watched;
        });
    }

    createMovieHTML(movie) {
        const genreName = this.getGenreName(movie.genre);
        
        return `
            <div class="movie-item ${movie.watched ? 'watched' : ''}" data-id="${movie.id}">
                <button class="watch-btn ${movie.watched ? 'watched' : ''}" title="${movie.watched ? i18n.t('markUnwatched') : i18n.t('markWatched')}">
                    ${movie.watched ? '👁️' : '🔲'}
                </button>
                <div class="movie-content">
                    <div class="movie-title">${this.escapeHtml(movie.title)}</div>
                    <div class="movie-info">
                        <span class="movie-type ${movie.type}">${this.getTypeLabel(movie.type)}</span>
                        <span class="genre">${genreName}</span>
                    </div>
                </div>
                <div class="movie-actions">
                    <button class="action-btn copy-btn" title="${i18n.t('copyTitle')}">📋</button>
                    <button class="action-btn favorite-btn ${movie.favorite ? 'active' : ''}" title="${i18n.t('addToFavorites')}">⭐</button>
                    <button class="action-btn delete-btn" title="${i18n.t('deleteMovie')}">🗑️</button>
                </div>
            </div>
        `;
    }

    getGenreName(genre) {
        const genreKeys = {
            'action': 'genreAction',
            'comedy': 'genreComedy',
            'drama': 'genreDrama',
            'horror': 'genreHorror',
            'fantasy': 'genreFantasy',
            'sci-fi': 'genreSciFi',
            'romance': 'genreRomance',
            'thriller': 'genreThriller',
            'animation': 'genreAnimation',
            'documentary': 'genreDocumentary',
            'crime': 'genreCrime',
            'adventure': 'genreAdventure'
        };
        const key = genreKeys[genre];
        return key ? i18n.t(key) : genre;
    }

    getTypeLabel(type) {
        const typeKeys = {
            'movie': 'typeMovie',
            'cartoon': 'typeCartoon',
            'series': 'typeSeries'
        };
        const key = typeKeys[type];
        return key ? i18n.t(key) : type;
    }

    bindMovieEvents() {
        document.querySelectorAll('.movie-item').forEach(item => {
            const movieId = parseInt(item.dataset.id);
            const movie = this.movies.find(m => m.id === movieId);

            // Клик по контенту фильма - поиск в Yandex
            item.querySelector('.movie-content').addEventListener('click', () => {
                this.searchMovie(movie.title);
            });

            // Кнопка просмотра (глаз)
            const watchBtn = item.querySelector('.watch-btn');
            if (watchBtn) {
                watchBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    
                    // Предотвращаем множественные клики
                    if (watchBtn.disabled) return;
                    watchBtn.disabled = true;
                    
                    setTimeout(() => {
                        watchBtn.disabled = false;
                    }, 300);
                    
                    this.toggleWatched(movieId, !movie.watched);
                });
            }

            // Кнопка копирования
            item.querySelector('.copy-btn').addEventListener('click', () => {
                this.copyToClipboard(movie.title);
            });

            // Кнопка избранного
            item.querySelector('.favorite-btn').addEventListener('click', () => {
                this.toggleFavorite(movieId);
            });

            // Кнопка удаления
            item.querySelector('.delete-btn').addEventListener('click', () => {
                this.deleteMovie(movieId);
            });
        });
    }

    openSettings() {
        window.location.href = 'settings.html';
    }

    async searchMovie(title) {
        try {
            // Получаем настройки
            const settings = await this.getSettings();
            
            // Создаем URL для поиска
            const searchUrl = this.getSearchUrl(title, settings);
            
            // Открываем новую вкладку
            chrome.tabs.create({ url: searchUrl });
        } catch (error) {
            console.error('Error opening search:', error);
            // Fallback к стандартному поиску
            const searchQuery = `смотреть ${title} онлайн`;
            const yandexUrl = `https://yandex.ru/search/?text=${encodeURIComponent(searchQuery)}`;
            chrome.tabs.create({ url: yandexUrl });
        }
    }

    async getSettings() {
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
            return defaultSettings;
        }
    }

    getSearchUrl(movieTitle, settings) {
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

    async toggleWatched(movieId, watched) {
        const movie = this.movies.find(m => m.id === movieId);
        if (movie) {
            movie.watched = watched;
            await this.saveMovies();
            this.renderMovies();
        }
    }

    async toggleFavorite(movieId) {
        const movie = this.movies.find(m => m.id === movieId);
        if (movie) {
            movie.favorite = !movie.favorite;
            await this.saveMovies();
            this.renderMovies();
            this.showToast(movie.favorite ? i18n.t('addedToFavorites') : i18n.t('removedFromFavorites'));
        }
    }

    async deleteMovie(movieId) {
        this.movies = this.movies.filter(m => m.id !== movieId);
        await this.saveMovies();
        this.renderMovies();
        this.showToast(i18n.t('movieDeleted'));
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast(i18n.t('copiedToClipboard'));
        } catch (err) {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast(i18n.t('copiedToClipboard'));
        }
    }

    exportMovies() {
        const dataStr = JSON.stringify(this.movies, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `filmosmotr_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showToast(i18n.t('listExported'));
    }

    importMovies() {
        document.getElementById('import-file').click();
    }

    showImportModal(movies) {
        const modal = document.getElementById('import-modal');
        const importList = document.getElementById('import-list');
        
        // Очищаем предыдущий список
        importList.innerHTML = '';
        
        // Фильтруем фильмы, которых еще нет в списке
        const existingTitles = new Set(this.movies.map(m => m.title.toLowerCase()));
        const newMovies = movies.filter(movie => 
            !existingTitles.has(movie.title.toLowerCase())
        );
        
        if (newMovies.length === 0) {
            importList.innerHTML = `<div class="import-item"><span>${i18n.t('allSelectedMoviesExist')}</span></div>`;
            // Скрываем кнопку "Добавить выбранные" если нет новых фильмов
            document.getElementById('import-selected-btn').style.display = 'none';
        } else {
            document.getElementById('import-selected-btn').style.display = 'inline-flex';
            
            newMovies.forEach(movie => {
                const item = document.createElement('div');
                item.className = 'import-item';
                item.innerHTML = `
                    <input type="checkbox" class="import-checkbox" data-movie-id="${movie.id}" checked>
                    <div>
                        <div class="movie-title">${this.escapeHtml(movie.title)}</div>
                        <div class="movie-info">
                            <span class="movie-type ${movie.type}">${this.movieTypes[movie.type]} ${this.getTypeLabel(movie.type)}</span>
                            <span class="genre">${this.getGenreName(movie.genre)}</span>
                        </div>
                    </div>
                `;
                importList.appendChild(item);
            });
        }
        
        // Сохраняем данные для импорта
        this.pendingImportMovies = movies;
        
        // Показываем модальное окно
        modal.classList.remove('hidden');
    }

    hideImportModal() {
        document.getElementById('import-modal').classList.add('hidden');
        this.pendingImportMovies = null;
    }

    async importSelectedMovies() {
        if (!this.pendingImportMovies) return;
        
        // Получаем выбранные фильмы
        const selectedCheckboxes = document.querySelectorAll('.import-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.movieId));
        
        if (selectedIds.length === 0) {
            this.showToast(i18n.t('selectMoviesForImport'), 'error');
            return;
        }
        
        // Фильтруем выбранные фильмы
        const moviesToImport = this.pendingImportMovies.filter(movie => 
            selectedIds.includes(movie.id)
        );
        
        // Проверяем дубликаты еще раз
        const existingTitles = new Set(this.movies.map(m => m.title.toLowerCase()));
        const uniqueMovies = moviesToImport.filter(movie => 
            !existingTitles.has(movie.title.toLowerCase())
        );
        
        if (uniqueMovies.length === 0) {
            this.showToast(i18n.t('allSelectedMoviesExist'), 'error');
            return;
        }
        
        // Присваиваем новые уникальные ID
        uniqueMovies.forEach(movie => {
            movie.id = this.generateUniqueId();
        });
        
        // Добавляем фильмы
        this.movies.push(...uniqueMovies);
        await this.saveMovies();
        this.renderMovies();
        
        this.hideImportModal();
        this.showToast(i18n.t('moviesImported', { count: uniqueMovies.length }));
    }

    async importReplaceMovies() {
        if (!this.pendingImportMovies) return;
        
        if (confirm(i18n.t('replaceListConfirm'))) {
            // Переназначаем ID для всех импортируемых фильмов
            this.nextId = 1;
            this.pendingImportMovies.forEach(movie => {
                movie.id = this.generateUniqueId();
            });
            
            this.movies = [...this.pendingImportMovies];
            await this.saveMovies();
            this.renderMovies();
            
            this.hideImportModal();
            this.showToast(i18n.t('listReplaced', { count: this.pendingImportMovies.length }));
        }
    }

    async handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const importedMovies = JSON.parse(text);
            
            if (!Array.isArray(importedMovies)) {
                throw new Error('Неверный формат файла');
            }

            // Валидация данных
            const validMovies = importedMovies.filter(movie => 
                movie.title && movie.type && movie.genre && typeof movie.id === 'number'
            );

            if (validMovies.length === 0) {
                throw new Error('В файле нет корректных данных');
            }

            // Показываем модальное окно для выбора фильмов
            this.showImportModal(validMovies);

        } catch (error) {
            console.error('Import error:', error);
            this.showToast(i18n.t('importError'), 'error');
        }

        // Очистка input
        event.target.value = '';
    }

    async loadMovies() {
        try {
            const result = await chrome.storage.local.get(['movies']);
            this.movies = result.movies || [];
        } catch (error) {
            console.error('Error loading movies:', error);
            this.movies = [];
        }
    }

    async saveMovies() {
        try {
            await chrome.storage.local.set({ movies: this.movies });
        } catch (error) {
            console.error('Error saving movies:', error);
            this.showToast(i18n.t('saveError'), 'error');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Показать toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Скрыть toast через 3 секунды
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    initDragScroll() {
        const tabsContainer = document.querySelector('.tabs');
        let isDown = false;
        let startX;
        let scrollLeft;
        let hasMoved = false;
        let clickedElement = null;

        tabsContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            hasMoved = false;
            clickedElement = e.target;
            tabsContainer.classList.add('dragging');
            startX = e.pageX - tabsContainer.getBoundingClientRect().left;
            scrollLeft = tabsContainer.scrollLeft;
            e.preventDefault();
        });

        document.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                hasMoved = false;
                tabsContainer.classList.remove('dragging');
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (isDown) {
                isDown = false;
                tabsContainer.classList.remove('dragging');
                
                // Если не двигались и кликнули по кнопке - выполняем клик
                if (!hasMoved && clickedElement && clickedElement.classList.contains('tab-btn')) {
                    clickedElement.click();
                }
                hasMoved = false;
            }
        });

        tabsContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            
            const x = e.pageX - tabsContainer.getBoundingClientRect().left;
            const diffX = Math.abs(x - startX);
            
            // Отмечаем, что двигались, если прошли больше 5 пикселей
            if (diffX > 5) {
                hasMoved = true;
            }
            
            if (hasMoved) {
                const walk = (x - startX) * 1.5;
                tabsContainer.scrollLeft = scrollLeft - walk;
            }
        });

        // Поддержка тач-скролла для мобильных устройств
        let startTouchX;
        let touchScrollLeft;
        let touchHasMoved = false;
        let touchClickedElement = null;

        tabsContainer.addEventListener('touchstart', (e) => {
            touchHasMoved = false;
            touchClickedElement = e.target;
            startTouchX = e.touches[0].pageX - tabsContainer.getBoundingClientRect().left;
            touchScrollLeft = tabsContainer.scrollLeft;
            e.preventDefault();
        });

        tabsContainer.addEventListener('touchmove', (e) => {
            if (!startTouchX) return;
            e.preventDefault();
            
            const x = e.touches[0].pageX - tabsContainer.getBoundingClientRect().left;
            const diffX = Math.abs(x - startTouchX);
            
            if (diffX > 5) {
                touchHasMoved = true;
            }
            
            if (touchHasMoved) {
                const walk = (x - startTouchX) * 1.5;
                tabsContainer.scrollLeft = touchScrollLeft - walk;
            }
        });

        tabsContainer.addEventListener('touchend', (e) => {
            if (!touchHasMoved && touchClickedElement && touchClickedElement.classList.contains('tab-btn')) {
                touchClickedElement.click();
            }
            startTouchX = null;
            touchHasMoved = false;
        });
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new MovieManager();
});