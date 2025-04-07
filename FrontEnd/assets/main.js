// CONSTANTS
const API_ENDPOINT = '127.0.0.1';
const API_PORT = 5678;
const API_SCHEME = 'http';

const url = new window.URL(`${API_SCHEME}://${API_ENDPOINT}:${API_PORT}`);

const makeRequest = async (url) => {
    return await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    }).then(res => res.json());
}

const getWorks = async () => {
    return await makeRequest(new URL('/api/works', url));
}

const getCategories = async () => {
    return await makeRequest(new URL('/api/categories', url));
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

const init = async () => {
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

            if(category.active) {
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

(async () => {
    await init();
})();

