const homeMenu = document.querySelector(
    ".home-menu"
);

const homeMenuButton = document.querySelector(
    ".home-menu-button"
);


const desktopPointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
);


function setHomeMenuState(isOpen) {

    homeMenu.classList.toggle(
        "is-open",
        isOpen
    );

    homeMenuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
}


homeMenuButton.addEventListener(
    "click",
    () => {

        /*
        Desktop:
        click pe Home duce direct la pagina principala.
        Dropdown-ul ramane controlat prin hover.
        */

        if (
            desktopPointer.matches
        ) {

            window.location.href =
                "index.html";

            return;
        }


        /*
        Touch:
        tap pe Home deschide/inchide dropdown-ul.
        */

        const isOpen =
            homeMenu.classList.contains(
                "is-open"
            );

        setHomeMenuState(
            !isOpen
        );
    }
);


document.addEventListener(
    "click",
    (event) => {

        if (
            desktopPointer.matches
        ) {
            return;
        }


        if (
            !homeMenu.contains(
                event.target
            )
        ) {

            setHomeMenuState(
                false
            );
        }
    }
);


document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            setHomeMenuState(
                false
            );

            homeMenuButton.focus();
        }
    }
);


desktopPointer.addEventListener(
    "change",
    () => {

        setHomeMenuState(
            false
        );
    }
);