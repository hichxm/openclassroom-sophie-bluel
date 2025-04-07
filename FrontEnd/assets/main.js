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

getWorks().then(works => {
    works.forEach(work => {
        const $figureElement = buildWorkElement(work);

        document.querySelector('.gallery').appendChild($figureElement);
    })
})