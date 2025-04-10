// CONSTANTS
const API_ENDPOINT = '127.0.0.1';
const API_PORT = 5678;
const API_SCHEME = 'http';

const url = new window.URL(`${API_SCHEME}://${API_ENDPOINT}:${API_PORT}`);

const makeRequest = async (url, option) => {
    return await fetch(url, {
        ...option,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
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

const buildWorkElement = (work) => {
    const $figureElement = document.createElement('figure');
    const $imgElement = document.createElement('img');
    const $figcaptionElement = document.createElement('figcaption');

    $imgElement.src = work.imageUrl
    $imgElement.alt = work.title

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

const initIndex = async () => {
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

                defineWorksInHTML(Array.from(works).filter(work => {
                    return category.id === 0 || work.categoryId === parseInt(category.id);
                }))

            })

            $filters.appendChild($aElement);
        })
    }

    const rawWorks = await getWorks();
    const rawCategories = await getCategories();

    rawCategories.unshift({
        id: 0,
        name: 'Tous',
        active: true,
    })

    const works = new Set(rawWorks);
    const categories = new Set(rawCategories.map(({id, name, active = false}) => {
        return {
            id: id,
            name: name,
            active: active,
        };
    }));

    defineWorksInHTML(works);
    defineCategoriesInHTML(categories);
}

const initLogin = async () => {
    if (isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    const $form = document.querySelector('#login form');

    $form.addEventListener('submit', async (e) => {
        e.preventDefault()

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
            })
    })

    const $closeLoginError = document.querySelector('#login .error');
    const $aElement = $closeLoginError.querySelector('a');

    $aElement.addEventListener('click', () => {
        $closeLoginError.classList.remove('error-active');
    })
}

const initAuthentication = async () => {
    if (!isAuthenticated()) {
        displayLoginButton();
        hideLogoutButton();
        return;
    }

    // Display logout button
    displayLogoutButton();
    hideLoginButton();

    const $logoutButton = document.querySelector('#logout-button');

    $logoutButton.addEventListener('click', () => {
        logout();

        window.location.href = 'index.html';
    })

    const token = document.cookie
        .split(';')
        .find(row => row.trim().startsWith('token='))
        .split('=')[1];

    const userId = document.cookie
        .split(';')
        .find(row => row.trim().startsWith('userId='))
        .split('=')[1];

    console.log(token, userId);
}