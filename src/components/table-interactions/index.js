
window.addEventListener("pagereveal", async (e) => {
    if (e.viewTransition) {
        const path = new URL(location.href).pathname;
        const direction = path === '/index.html' ? 'back' : 'forward';

        e.viewTransition.types.add(direction);

        if (direction === 'back') {
            const fromPath = new URL(navigation.activation.from.url).pathname;
            const match = fromPath.match('\/detail\-([1-9])\.html');
            const id = match ? match[1] : null;

            if (id) {
                const row = document.querySelector(`tbody tr:nth-of-type(${id})`);
                row.classList.add('active-row');

                await e.viewTransition.finished;

                row.classList.remove('active-row');
            }
        }
    }
});


const navigateToDetail = (id) => {
    const row = document.querySelector(`tbody tr:nth-of-type(${id})`);
    row.classList.add('active-row');

    location.href = `detail-${id}.html`;
}

const goBack = () => {
    window.location.href = 'index.html';
}
