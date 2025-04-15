// CONSTANTS
const API_ENDPOINT = '127.0.0.1';
const API_PORT = 5678;
const API_SCHEME = 'http';

const url = new window.URL(`${API_SCHEME}://${API_ENDPOINT}:${API_PORT}`);

const DELETE_BUTTON_SVG = '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
    '    <rect width="17" height="17" rx="2" fill="black"/>\n' +
    '    <path d="M6.71607 3.35558C6.82455 3.13661 7.04754 3 7.29063 3H9.70938C9.95246 3 10.1754 3.13661 10.2839 3.35558L10.4286 3.64286H12.3571C12.7127 3.64286 13 3.93013 13 4.28571C13 4.64129 12.7127 4.92857 12.3571 4.92857H4.64286C4.28728 4.92857 4 4.64129 4 4.28571C4 3.93013 4.28728 3.64286 4.64286 3.64286H6.57143L6.71607 3.35558ZM4.64286 5.57143H12.3571V12C12.3571 12.7092 11.7806 13.2857 11.0714 13.2857H5.92857C5.21942 13.2857 4.64286 12.7092 4.64286 12V5.57143ZM6.57143 6.85714C6.39464 6.85714 6.25 7.00179 6.25 7.17857V11.6786C6.25 11.8554 6.39464 12 6.57143 12C6.74821 12 6.89286 11.8554 6.89286 11.6786V7.17857C6.89286 7.00179 6.74821 6.85714 6.57143 6.85714ZM8.5 6.85714C8.32321 6.85714 8.17857 7.00179 8.17857 7.17857V11.6786C8.17857 11.8554 8.32321 12 8.5 12C8.67679 12 8.82143 11.8554 8.82143 11.6786V7.17857C8.82143 7.00179 8.67679 6.85714 8.5 6.85714ZM10.4286 6.85714C10.2518 6.85714 10.1071 7.00179 10.1071 7.17857V11.6786C10.1071 11.8554 10.2518 12 10.4286 12C10.6054 12 10.75 11.8554 10.75 11.6786V7.17857C10.75 7.00179 10.6054 6.85714 10.4286 6.85714Z" fill="white"/>\n' +
    '</svg>';

const makeRequest = async (url, option) => {
    return await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        ...option,
    });
}

const getWorks = async () => {
    return await makeRequest(new URL('/api/works', url))
        .then(res => res.json());
}

const getCategories = async () => {
    return await makeRequest(new URL('/api/categories', url))
        .then(res => res.json());
}

const buildWorkModalElement = (work) => {
    const $divElement = document.createElement('div');
    const $imgElement = document.createElement('img');
    const $deleteButtonElement = document.createElement('a');

    $deleteButtonElement.innerHTML = DELETE_BUTTON_SVG;
    $deleteButtonElement.href = '#';

    $imgElement.src = work.imageUrl;
    $imgElement.alt = work.title;

    $divElement.appendChild($deleteButtonElement);
    $divElement.appendChild($imgElement);

    return $divElement;
}

const buildWorkElement = (work) => {
    const $figureElement = document.createElement('figure');
    const $imgElement = document.createElement('img');
    const $figcaptionElement = document.createElement('figcaption');

    $imgElement.src = work.imageUrl;
    $imgElement.alt = work.title;

    $figcaptionElement.innerText = work.title;

    $figureElement.appendChild($imgElement);
    $figureElement.appendChild($figcaptionElement);

    return $figureElement;
}

const buildCategoryElement = (category) => {
    const $aElement = document.createElement('a');

    $aElement.href = '#';
    $aElement.classList.add('filter');
    $aElement.dataset.categoryId = category.id;
    $aElement.innerText = category.name;

    return $aElement;
}

const loginError = (error) => {
    const $errorElement = document.querySelector('#login .error');
    const $pElement = $errorElement.querySelector('p');

    $errorElement.classList.add('error-active');

    $pElement.innerText = error;
}

const isAuthenticated = () => {
    return localStorage.getItem('token')
        && localStorage.getItem('userId');
}

const authenticateUser = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
}

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
}

const getFromStorage = (key) => {
    return localStorage.getItem(key);
}

const getToken = () => {
    return getFromStorage('token');
}

const getUserId = () => {
    return getFromStorage('userId');
}

const displayLogoutButton = () => {
    const $logoutButton = document.querySelector('#logout-button');

    $logoutButton.classList.remove('d-none');
}

const displayLoginButton = () => {
    const $loginButton = document.querySelector('#login-button');

    $loginButton.classList.remove('d-none');
}

const hideLoginButton = () => {
    const $loginButton = document.querySelector('#login-button');

    $loginButton.classList.add('d-none');
}

const hideLogoutButton = () => {
    const $logoutButton = document.querySelector('#logout-button');

    $logoutButton.classList.add('d-none');
}

const getShowEditButton = () => {
    return document.querySelector('#portfolio h2 a');
}

const showEditButton = () => {
    const $editButton = getShowEditButton();

    $editButton.classList.remove('d-none');
}

const hideEditButton = () => {
    const $editButton = document.querySelector('#portfolio h2 a');

    $editButton.classList.add('d-none');
}

const getEditorMode = () => {
    return document.querySelector('.editor-mode');
}

const showEditorMode = () => {
    getEditorMode().classList.remove('d-none');
}

const getModal = () => {
    return document.querySelector('.modal');
}

const getModalContent = () => {
    return getModal().querySelector('.modal-content');
}

const getModalCloseButton = () => {
    return getModalContent().querySelector('.modal-close-button');
}

const getModalBackButton = () => {
    return getModalContent().querySelector('.modal-back-button');
}

const getModalGallery = () => {
    return getModalContent().querySelector('#modal-gallery');
}

const getModalAddWork = () => {
    return getModalContent().querySelector('#modal-add-work');
}

const getModalAddWorkCategorySelect = () => {
    return getModalAddWork().querySelector('select[name="category"]');
}

const getModalGalleryContent = () => {
    return getModalGallery().querySelector('.modal-gallery-content');
}

const getModalGalleryError = () => {
    return getModalGallery().querySelector('.modal-error');
}

const showModal = (view = 'gallery') => {
    getModal().classList.remove('d-none');

    getModalGallery().classList.add('d-none');
    getModalAddWork().classList.add('d-none');

    if (view === 'gallery') {
        getModalGallery().classList.remove('d-none');
    } else if (view === 'add') {
        getModalAddWork().classList.remove('d-none');
    }
}

const hideModal = () => {
    getModal().classList.add('d-none');
}

const changeGalleryTitleText = (text) => {
    document.querySelector('#gallery-title').innerText = text;
}

const deleteWork = async (workId) => {
    const response = await makeRequest(new URL(`/api/works/${workId}`, url), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
        },
    })

    if (!(response.status >= 200 && response.status < 300)) {
        throw Error('Une erreur est survenue lors de la suppression du projet');
    }

    return true;
}

const showGalleryModalError = () => {
    getModalGallery().querySelector('.modal-error').classList.remove('d-none');
}

const hideGalleryModalError = () => {
    getModalGallery().querySelector('.modal-error').classList.add('d-none');
}

const defineGalleryModalError = (error) => {
    const $pElement = getModalGalleryError().querySelector('p');

    $pElement.innerText = error;
}

const initIndex = async () => {
    const setDefaultWorks = (newWorks) => {
        defaultWorks.clear();

        newWorks.forEach(work => defaultWorks.add(work));
    }

    const defineCategoriesAddWorkModalInHTML = (categories) => {
        const $selectElement = getModalAddWorkCategorySelect();

        $selectElement.innerHTML = '';

        categories.unshift({ id: '', name: '' });

        categories.forEach(category => {
            const $optionElement = document.createElement('option');

            $optionElement.value = category.id;
            $optionElement.innerText = category.name;

            $selectElement.appendChild($optionElement);
        });
    }

    const defineWorksModalInHTML = (works) => {
        const $modalGallery = getModalGalleryContent();

        $modalGallery.innerHTML = '';

        works.forEach(work => {
            const $divElement = buildWorkModalElement(work);

            $modalGallery.appendChild($divElement);

            $divElement.querySelector('a').addEventListener('click', async (e) => {
                hideGalleryModalError();

                // Delete work using workId
                try {
                    await deleteWork(work.id);

                    const newWorks = Array.from(defaultWorks)
                        .filter(defaultWork => defaultWork.id !== work.id);

                    setDefaultWorks(newWorks);

                    // define works in html
                    defineWorksInHTML(newWorks);

                    // define works in modal gallery
                    defineWorksModalInHTML(newWorks);
                } catch (e) {
                    defineGalleryModalError(e.message);
                    showGalleryModalError();
                }
            });
        });
    }

    const defineWorksInHTML = (works) => {
        const $works = document.querySelector('.gallery');

        $works.innerHTML = '';

        works.forEach(work => {
            const $figureElement = buildWorkElement(work);

            $works.appendChild($figureElement);
        })
    }

    const defineCategoriesInHTML = (categories) => {
        const $filters = document.querySelector('.filters');

        $filters.innerHTML = '';

        categories.forEach(category => {
            const $aElement = buildCategoryElement(category);

            if (category.active) {
                $aElement.classList.add('filter-active');
            }

            $aElement.addEventListener('click', (e) => {
                e.preventDefault();

                defineCategoriesInHTML(Array.from(categories).map(cat => {
                    return {
                        ...cat,
                        active: cat.id === parseInt(category.id),
                    }
                }));

                defineWorksInHTML(Array.from(defaultWorks).filter(work => {
                    return category.id === 0 || work.categoryId === parseInt(category.id);
                }));

            });

            $filters.appendChild($aElement);
        });
    }

    hideEditButton();

    const rawWorks = await getWorks();
    const rawCategories = await getCategories();

    rawCategories.unshift({
        id: 0,
        name: 'Tous',
        active: true,
    });

    const defaultWorks = new Set(rawWorks);
    const defaultCategories = new Set(rawCategories.map(({id, name, active = false}) => {
        return {
            id: id,
            name: name,
            active: active,
        };
    }));

    defineWorksInHTML(defaultWorks);
    defineCategoriesInHTML(defaultCategories);

    if (isAuthenticated()) {
        // Display editor mode in the top of website
        showEditorMode();

        defineCategoriesAddWorkModalInHTML(Array.from(defaultCategories).filter(category => category.id !== 0));

        // Change works title
        changeGalleryTitleText('Mes projets');

        showEditButton();

        // Hide modal when click outside (background)
        getModal().addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                hideModal();
            }
        });

        // Show modal when click edit button
        getShowEditButton().addEventListener('click', () => {
            showModal('gallery');

            defineWorksModalInHTML(defaultWorks);

            // When click on add project, switch to add view
            getModalGallery().querySelector('.modal-add-button').addEventListener('click', () => {
                showModal('add');

                // When click on back switch to gallery view
                getModalBackButton().addEventListener('click', () => {
                    showModal('gallery')
                });
            });
        });

        // When click on closing, hide modal
        getModalCloseButton().addEventListener('click', hideModal);
    }
}

const initLogin = async () => {
    if (isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    const $form = document.querySelector('#login form');

    $form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = $form.querySelector('#email').value;
        const password = $form.querySelector('#password').value;

        makeRequest(new URL('/api/users/login', url), {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            })
        })
            .then(async res => {
                if (res.status >= 400 && res.status < 500) {
                    loginError('Email ou mot de passe incorrect');
                } else {
                    const response = await res.json();

                    const token = response.token;
                    const userId = response.userId;

                    authenticateUser(token, userId);

                    window.location.href = 'index.html';
                }
            });
    });

    const $closeLoginError = document.querySelector('#login .error');
    const $aElement = $closeLoginError.querySelector('a');

    $aElement.addEventListener('click', () => {
        $closeLoginError.classList.remove('error-active');
    });
}

const initAuthentication = async () => {
    if (!isAuthenticated()) {
        displayLoginButton();
        hideLogoutButton();
        return;
    }

    displayLogoutButton();
    hideLoginButton();

    const $logoutButton = document.querySelector('#logout-button');

    $logoutButton.addEventListener('click', () => {
        logout();

        window.location.href = 'index.html';
    });
}