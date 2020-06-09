import(/* webpackChunkName: "game" */'./ol-game')
    .then((mod): void => {
        const bodyElement: HTMLElement = document.body;
        bodyElement.innerHTML = '';
        new mod.LaboeGame(bodyElement).start();
    })
    .catch((err: any): void => {
        console.error(err);
    });
