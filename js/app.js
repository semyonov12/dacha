document.addEventListener("DOMContentLoaded", function (event) {
    /* Проверка поддержки webp, добавление класса webp или no-webp для HTML */
    function testWebP(callback) {
        let webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height == 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
    // Добавление класса _webp или _no-webp для HTML
    testWebP(function (support) {
        let className = support === true ? 'webp' : 'no-webp';
        document.documentElement.classList.add(className);
    });


    const copyButton = document.getElementById('copy-button');
    const textToCopy = document.getElementById('text-to-copy');

    const textUp = document.querySelector('.popup__value');


	if (copyButton) {
		copyButton.addEventListener('click', function () {
		  const text = textToCopy.innerText;
		  const tempInput = document.createElement('input');
		  tempInput.value = text;
		  document.body.appendChild(tempInput);
		  tempInput.select();
		  document.execCommand('copy');
		  document.body.removeChild(tempInput);
	  
		  textUp.classList.add('popup__value-act');
		  setTimeout(() => {
			textUp.classList.remove('popup__value-act');
		  }, 1000);
		});
	  }


    // слайдеры
    let mySwip;

    if (document.querySelector('.main-block__slider')) {
        const progressContent = document.querySelectorAll(".main-block__progress span");
        // Создаем слайдер
        mySwip = new Swiper('.main-block__slider', {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            effect: 'fade',
            speed: 10,
            allowTouchMove: false,
            spaceBetween: 0,
            navigation: {
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next',
            },
            loop: false,
            autoplay: {
                delay: 5000, // общее время автопрокрутки для всех слайдов
                disableOnInteraction: false, // автопрокрутка не останавливается при взаимодействии пользователя
                waitForTransition: true, // автопрокрутка ждет окончания перехода между слайдами
            },
            autoplayDisableOnInteraction: true,

            on: {
                autoplayTimeLeft(s, time, progress) {

                    let slideAct = this.activeIndex;
                    progressContent[slideAct].style.setProperty("--progress", 1 - progress);
                    if (slideAct === 0) {
                        progressContent.forEach(elem => {
                            elem.style.width = 0 + '%';
                        });
                    }

                    progressContent[slideAct].style.width = 'calc(100% * var(--progress))';
                },

                slideChange: function () {

                    if (document.querySelector('.main-block__button-replay')) {

                        if (this.activeIndex === this.slides.length - 1) {
                            document.querySelector('.main-block__button-replay').classList.add('main-block__button-replay-act');
                        } else {
                            document.querySelector('.main-block__button-replay').classList.remove('main-block__button-replay-act');
                        }
                    }

                },

                slideNextTransitionStart: function () {
                    let slideAct = this.activeIndex - 1;
                    progressContent[slideAct].style.width = '100%';


                    if (slideAct == -1) {
                        mySwip.slideTo(0);
                    }
                },

                slidePrevTransitionStart: function () {
                    let slideAct = this.activeIndex + 1;
                    progressContent[slideAct].style.width = '0%';
                },

            }

        });

        const btnReplay = document.querySelector('.main-block__button-replay');

        if (btnReplay) {
            btnReplay.addEventListener("click", function (e) {
                mySwip.slideTo(0);
            });
        }

    }

    
	if (document.querySelector('.photo-slider')) {
		new Swiper('.photo-slider', {
			observer: true,
			observeParents: true,
			slidesPerView: 4,
			spaceBetween: 0,
			autoHeight: false,
			speed: 500,

			breakpoints: {

				320: {
					slidesPerView: 1.3,
				},
				768: {
					slidesPerView: 2.3,
				},
                992: {
					slidesPerView: 4,
				},
			},
		});
	}



    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function () {
        const _this = this;
        // массив объектов
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        // массив DOM-элементов
        this.nodes = document.querySelectorAll("[data-da]");
        // наполнение оbjects объктами
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        // массив уникальных медиа-запросов
        this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
            return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }, this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        });
        // навешивание слушателя на медиа-запрос
        // и вызов обработчика при первом запуске
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ',');
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            // массив объектов с подходящим брейкпоинтом
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
                return item.breakpoint === mediaBreakpoint;
            });
            matchMedia.addListener(function () {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            });
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
        if (matchMedia.matches) {
            for (let i = 0; i < оbjects.length; i++) {
                const оbject = оbjects[i];
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            }
        } else {
            //for (let i = 0; i < оbjects.length; i++) {
            for (let i = оbjects.length - 1; i >= 0; i--) {
                const оbject = оbjects[i];
                if (оbject.element.classList.contains(this.daClassname)) {
                    this.moveBack(оbject.parent, оbject.element, оbject.index);
                }
            }
        }
    };
    // Функция перемещения
    DynamicAdapt.prototype.moveTo = function (place, element, destination) {
        element.classList.add(this.daClassname);
        if (place === 'last' || place >= destination.children.length) {
            destination.insertAdjacentElement('beforeend', element);
            return;
        }
        if (place === 'first') {
            destination.insertAdjacentElement('afterbegin', element);
            return;
        }
        destination.children[place].insertAdjacentElement('beforebegin', element);
    }
    // Функция возврата
    DynamicAdapt.prototype.moveBack = function (parent, element, index) {
        element.classList.remove(this.daClassname);
        if (parent.children[index] !== undefined) {
            parent.children[index].insertAdjacentElement('beforebegin', element);
        } else {
            parent.insertAdjacentElement('beforeend', element);
        }
    }
    // Функция получения индекса внутри родителя
    DynamicAdapt.prototype.indexInParent = function (parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    // Функция сортировки массива по breakpoint и place 
    // по возрастанию для this.type = min
    // по убыванию для this.type = max
    DynamicAdapt.prototype.arraySort = function (arr) {
        if (this.type === "min") {
            Array.prototype.sort.call(arr, function (a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }
    
                    if (a.place === "first" || b.place === "last") {
                        return -1;
                    }
    
                    if (a.place === "last" || b.place === "first") {
                        return 1;
                    }
    
                    return a.place - b.place;
                }
    
                return a.breakpoint - b.breakpoint;
            });
        } else {
            Array.prototype.sort.call(arr, function (a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }
    
                    if (a.place === "first" || b.place === "last") {
                        return 1;
                    }
    
                    if (a.place === "last" || b.place === "first") {
                        return -1;
                    }
    
                    return b.place - a.place;
                }
    
                return b.breakpoint - a.breakpoint;
            });
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();

    let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
	if (document.documentElement.classList.contains('lock')) {
		bodyUnlock(delay);
	} else {
		bodyLock(delay);
	}
}
let bodyUnlock = (delay = 500) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			document.documentElement.classList.remove("lock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}
let bodyLock = (delay = 500) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		document.documentElement.classList.add("lock");

		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}

let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };



// Класс Popup
class Popup {
	constructor(options) {
		let config = {
			logging: true,
			init: true,
			// Для кнопок 
			attributeOpenButton: 'data-popup', // Атрибут для кнопки, которая вызывает попап
			attributeCloseButton: 'data-close', // Атрибут для кнопки, которая закрывает попап
			// Для сторонних объектов
			fixElementSelector: '[data-lp]', // Атрибут для элементов с левым паддингом (которые fixed)
			// Для объекта попапа
			youtubeAttribute: 'data-popup-youtube', // Атрибут для кода youtube
			youtubePlaceAttribute: 'data-popup-youtube-place', // Атрибут для вставки ролика youtube
			setAutoplayYoutube: true,
			// Изменение классов
			classes: {
				popup: 'popup',
				// popupWrapper: 'popup__wrapper',
				popupContent: 'popup__content',
				popupActive: 'popup_show', // Добавляется для попапа, когда он открывается
				bodyActive: 'popup-show', // Добавляется для боди, когда попап открыт
			},
			focusCatch: true, // Фокус внутри попапа зациклен
			closeEsc: true, // Закрытие по ESC
			bodyLock: true, // Блокировка скролла
			hashSettings: {
				location: true, // Хэш в адресной строке
				goHash: true, // Переход по наличию в адресной строке
			},
			on: { // События
				beforeOpen: function () { },
				afterOpen: function () { },
				beforeClose: function () { },
				afterClose: function () { },
			},
		}
		this.youTubeCode;
		this.isOpen = false;
		// Текущее окно
		this.targetOpen = {
			selector: false,
			element: false,
		}
		// Предыдущее открытое
		this.previousOpen = {
			selector: false,
			element: false,
		}
		// Последнее закрытое
		this.lastClosed = {
			selector: false,
			element: false,
		}
		this._dataValue = false;
		this.hash = false;

		this._reopen = false;
		this._selectorOpen = false;

		this.lastFocusEl = false;
		this._focusEl = [
			'a[href]',
			'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
			'button:not([disabled]):not([aria-hidden])',
			'select:not([disabled]):not([aria-hidden])',
			'textarea:not([disabled]):not([aria-hidden])',
			'area[href]',
			'iframe',
			'object',
			'embed',
			'[contenteditable]',
			'[tabindex]:not([tabindex^="-"])'
		];
		//this.options = Object.assign(config, options);
		this.options = {
			...config,
			...options,
			classes: {
				...config.classes,
				...options?.classes,
			},
			hashSettings: {
				...config.hashSettings,
				...options?.hashSettings,
			},
			on: {
				...config.on,
				...options?.on,
			}
		}
		this.bodyLock = false;
		this.options.init ? this.initPopups() : null
	}
	initPopups() {
		this.eventsPopup();
	}
	eventsPopup() {
		// Клик на всем документе
		document.addEventListener("click", function (e) {
			// Клик по кнопке "открыть"
			const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
			if (buttonOpen) {
				e.preventDefault();
				this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ?
					buttonOpen.getAttribute(this.options.attributeOpenButton) :
					'error';
				this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ?
					buttonOpen.getAttribute(this.options.youtubeAttribute) :
					null;
				if (this._dataValue !== 'error') {
					if (!this.isOpen) this.lastFocusEl = buttonOpen;
					this.targetOpen.selector = `${this._dataValue}`;
					this._selectorOpen = true;
					this.open();
					return;

				}

				return;
			}
			// Закрытие на пустом месте (popup__wrapper) и кнопки закрытия (popup__close) для закрытия
			const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
			if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
				e.preventDefault();
				this.close();
				return;
			}
		}.bind(this));
		// Закрытие по ESC
		document.addEventListener("keydown", function (e) {
			if (this.options.closeEsc && e.which == 27 && e.code === 'Escape' && this.isOpen) {
				e.preventDefault();
				this.close();
				return;
			}
			if (this.options.focusCatch && e.which == 9 && this.isOpen) {
				this._focusCatch(e);
				return;
			}
		}.bind(this))

		// Открытие по хешу
		if (this.options.hashSettings.goHash) {
			// Проверка изменения адресной строки
			window.addEventListener('hashchange', function () {
				if (window.location.hash) {
					this._openToHash();
				} else {
					this.close(this.targetOpen.selector);
				}
			}.bind(this))

			window.addEventListener('load', function () {
				if (window.location.hash) {
					this._openToHash();
				}
			}.bind(this))
		}
	}
	open(selectorValue) {
		if (bodyLockStatus) {
			// Если перед открытием попапа был режим lock
			this.bodyLock = document.documentElement.classList.contains('lock') ? true : false;

			// Если ввести значение селектора (селектор настраивается в options)
			if (selectorValue && typeof (selectorValue) === "string" && selectorValue.trim() !== "") {
				this.targetOpen.selector = selectorValue;
				this._selectorOpen = true;
			}
			if (this.isOpen) {
				this._reopen = true;
				this.close();
			}
			if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
			if (!this._reopen) this.previousActiveElement = document.activeElement;

			this.targetOpen.element = document.querySelector(this.targetOpen.selector);

			if (this.targetOpen.element) {
				// YouTube
				if (this.youTubeCode) {
					const codeVideo = this.youTubeCode;
					const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`
					const iframe = document.createElement('iframe');
					iframe.setAttribute('allowfullscreen', '');

					const autoplay = this.options.setAutoplayYoutube ? 'autoplay;' : '';
					iframe.setAttribute('allow', `${autoplay}; encrypted-media`);

					iframe.setAttribute('src', urlVideo);

					if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
						const youtubePlace = this.targetOpen.element.querySelector('.popup__text').setAttribute(`${this.options.youtubePlaceAttribute}`, '');
					}
					this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
				}
				if (this.options.hashSettings.location) {
					// Получение хэша и его выставление 
					this._getHash();
					this._setHash();
				}

				// До открытия
				this.options.on.beforeOpen(this);
				// Создаем свое событие после открытия попапа
				document.dispatchEvent(new CustomEvent("beforePopupOpen", {
					detail: {
						popup: this
					}
				}));

				this.targetOpen.element.classList.add(this.options.classes.popupActive);
				document.documentElement.classList.add(this.options.classes.bodyActive);

				if (!this._reopen) {
					!this.bodyLock ? bodyLock() : null;
				}
				else this._reopen = false;

				this.targetOpen.element.setAttribute('aria-hidden', 'false');

				// Запоминаю это открытое окно. Оно будет последним открытым
				this.previousOpen.selector = this.targetOpen.selector;
				this.previousOpen.element = this.targetOpen.element;

				this._selectorOpen = false;

				this.isOpen = true;

				setTimeout(() => {
					this._focusTrap();
				}, 50);

				// После открытия
				this.options.on.afterOpen(this);
				// Создаем свое событие после открытия попапа
				document.dispatchEvent(new CustomEvent("afterPopupOpen", {
					detail: {
						popup: this
					}
				}));

			}
		}
	}
	close(selectorValue) {
		if (selectorValue && typeof (selectorValue) === "string" && selectorValue.trim() !== "") {
			this.previousOpen.selector = selectorValue;
		}
		if (!this.isOpen || !bodyLockStatus) {
			return;
		}
		// До закрытия
		this.options.on.beforeClose(this);
		// Создаем свое событие перед закрытием попапа
		document.dispatchEvent(new CustomEvent("beforePopupClose", {
			detail: {
				popup: this
			}
		}));

		// YouTube
		if (this.youTubeCode) {
			if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`))
				this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = '';
		}
		this.previousOpen.element.classList.remove(this.options.classes.popupActive);
		// aria-hidden
		this.previousOpen.element.setAttribute('aria-hidden', 'true');
		if (!this._reopen) {
			document.documentElement.classList.remove(this.options.classes.bodyActive);
			!this.bodyLock ? bodyUnlock() : null;
			this.isOpen = false;
		}
		// Очищение адресной строки
		this._removeHash();
		if (this._selectorOpen) {
			this.lastClosed.selector = this.previousOpen.selector;
			this.lastClosed.element = this.previousOpen.element;

		}
		// После закрытия
		this.options.on.afterClose(this);
		// Создаем свое событие после закрытия попапа
		document.dispatchEvent(new CustomEvent("afterPopupClose", {
			detail: {
				popup: this
			}
		}));

		setTimeout(() => {
			this._focusTrap();
		}, 50);
	}
	// Получение хэша 
	_getHash() {
		if (this.options.hashSettings.location) {
			this.hash = this.targetOpen.selector.includes('#') ?
				this.targetOpen.selector : this.targetOpen.selector.replace('.', '#')
		}
	}
	_openToHash() {
		let classInHash = document.querySelector(`.${window.location.hash.replace('#', '')}`) ? `.${window.location.hash.replace('#', '')}` :
			document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` :
				null;

		const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace('.', "#")}"]`);
		if (buttons && classInHash) this.open(classInHash);
	}
	// Утсановка хэша
	_setHash() {
		history.pushState('', '', this.hash);
	}
	_removeHash() {
		history.pushState('', '', window.location.href.split('#')[0])
	}
	_focusCatch(e) {
		const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
		const focusArray = Array.prototype.slice.call(focusable);
		const focusedIndex = focusArray.indexOf(document.activeElement);

		if (e.shiftKey && focusedIndex === 0) {
			focusArray[focusArray.length - 1].focus();
			e.preventDefault();
		}
		if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
			focusArray[0].focus();
			e.preventDefault();
		}
	}
	_focusTrap() {
		const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
		if (!this.isOpen && this.lastFocusEl) {
			this.lastFocusEl.focus();
		} else {
			focusable[0].focus();
		}
	}

}

// Запускаем и добавляем в переменную
let popupItem = new Popup({});

});



