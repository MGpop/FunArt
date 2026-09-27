const AESTHETIC_KEYS = Object.keys(aestheticInfo);

const GAME_CATEGORIES = [
    "exterior",
    "interior",
    "object",
    "outfit",
    "color"
];

const CATEGORY_LABELS = {
    exterior: "Exterior",
    interior: "Interior",
    object: "Object",
    outfit: "Outfit",
    color: "Color Palette"
};

const TOTAL_ROUNDS = GAME_CATEGORIES.length;
const ROUND_INTRO_DURATION = 3000;
const HOLD_DURATION = 350;

const SCORE_STORAGE_KEY = "funartAestheticScores";
const USERNAME_STORAGE_KEY = "funartLastUsername";


const targetAestheticElement = document.getElementById("target-aesthetic");
const hintButton = document.getElementById("hint-button");

const scoreValue = document.getElementById("score-value");
const timedModeToggle = document.getElementById("timed-mode-toggle");
const timerValue = document.getElementById("timer-value");
const timedScoreValue = document.getElementById("timed-score-value");

const imageOptions = Array.from(
    document.querySelectorAll(".aesthetic-option")
);

const startOverlay = document.getElementById("start-overlay");
const startGameButton = document.getElementById("start-game-button");

const roundOverlay = document.getElementById("round-overlay");
const roundNumber = document.getElementById("round-number");
const roundCategory = document.getElementById("round-category");

const resultOverlay = document.getElementById("result-overlay");
const overlayScoreValue = document.getElementById("overlay-score-value");
const scoreMessageTitle = document.getElementById("score-message-title");
const scoreMessageText = document.getElementById("score-message-text");
const speedMessageBlock = document.getElementById("speed-message-block");
const overlayTimedScoreValue = document.getElementById(
    "overlay-timed-score-value"
);
const overlayTimeValue = document.getElementById("overlay-time-value");
const speedMessageTitle = document.getElementById("speed-message-title");
const speedMessageText = document.getElementById("speed-message-text");

const nextButton = document.getElementById("next-button");
const newGameButton = document.getElementById("new-game-button");

const finalResults = document.getElementById("final-results");
const finalScoreValue = document.getElementById("final-score-value");
const finalTimedScoreValue = document.getElementById(
    "final-timed-score-value"
);
const finalTimeValue = document.getElementById("final-time-value");
const resultsNewGameButton = document.getElementById(
    "results-new-game-button"
);

const hintModal = document.getElementById("hint-modal");
const hintModalTitle = document.getElementById("hint-modal-title");
const hintDescription = document.getElementById("hint-description");
const hintList = document.getElementById("hint-list");
const closeHintButton = document.getElementById("close-hint-button");

const imagePreview = document.getElementById("image-preview");
const previewImage = document.getElementById("preview-image");

const cursorMessage = document.getElementById("cursor-message");

const saveScoreButton = document.getElementById("save-score-button");
const saveScoreModal = document.getElementById("save-score-modal");
const scoreUsernameInput = document.getElementById("score-username");
const saveScoreError = document.getElementById("save-score-error");
const confirmSaveScoreButton = document.getElementById(
    "confirm-save-score-button"
);
const closeSaveScoreButton = document.getElementById(
    "close-save-score-button"
);

const downloadScoresButton = document.getElementById(
    "download-scores-button"
);
const importScoresInput = document.getElementById("import-scores-input");
const clearScoresButton = document.getElementById("clear-scores-button");

const importScoresModal = document.getElementById("import-scores-modal");
const mergeScoresButton = document.getElementById("merge-scores-button");
const replaceScoresButton = document.getElementById(
    "replace-scores-button"
);
const closeImportScoresButton = document.getElementById(
    "close-import-scores-button"
);

const scoreTableBody = document.getElementById("score-table-body");
const sortButtons = Array.from(document.querySelectorAll(".sort-button"));


let timerInterval = null;
let timerStartedAt = null;
let roundIntroTimeout = null;
let pendingImportedScores = null;

let holdTimer = null;
let holdTriggered = false;

let cursorMessageTimer = null;

let scoreSort = {
    field: "timedScore",
    direction: "desc"
};


function shuffleArray(items) {
    const copy = [...items];

    for (let i = copy.length - 1; i > 0; i -= 1) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [copy[i], copy[randomIndex]] = [
            copy[randomIndex],
            copy[i]
        ];
    }

    return copy;
}


function chooseRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
}


function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


function updateTimerDisplay() {
    if (!aestheticGameState.timedMode) {
        timerValue.textContent = "--:--";
        return;
    }

    timerValue.textContent = formatTime(
        aestheticGameState.elapsedTime
    );
}


function startTimer() {
    if (!aestheticGameState.timedMode || timerInterval !== null) {
        return;
    }

    timerStartedAt = Date.now() - aestheticGameState.elapsedTime;

    timerInterval = window.setInterval(() => {
        aestheticGameState.elapsedTime =
            Date.now() - timerStartedAt;

        updateTimerDisplay();
    }, 100);
}


function pauseTimer() {
    if (timerInterval === null) {
        return;
    }

    aestheticGameState.elapsedTime =
        Date.now() - timerStartedAt;

    window.clearInterval(timerInterval);
    timerInterval = null;
    timerStartedAt = null;

    updateTimerDisplay();
}


function stopTimer() {
    pauseTimer();
}


function resetTimer() {
    if (timerInterval !== null) {
        window.clearInterval(timerInterval);
    }

    timerInterval = null;
    timerStartedAt = null;

    aestheticGameState.elapsedTime = 0;

    updateTimerDisplay();
}


function setTimedMode(enabled) {
    if (aestheticGameState.status !== "ready") {
        return;
    }

    aestheticGameState.timedMode = enabled;

    timedModeToggle.setAttribute(
        "aria-checked",
        String(enabled)
    );

    timedModeToggle.textContent = enabled ? "On" : "Off";

    timerValue.textContent = enabled ? "00:00" : "--:--";
    timedScoreValue.textContent = "—";
}


function updateTargetAesthetic() {
    if (!aestheticGameState.targetAesthetic) {
        targetAestheticElement.textContent = "—";
        targetAestheticElement.style.fontFamily = "";
        return;
    }

    const info =
        aestheticInfo[aestheticGameState.targetAesthetic];

    targetAestheticElement.textContent = info.name;
    targetAestheticElement.style.fontFamily =
        `"${info.font}", serif`;
}


function updateScoreDisplay() {
    scoreValue.textContent =
        `${aestheticGameState.score} / 100`;
}


function calculateTimedScore() {
    if (!aestheticGameState.timedMode) {
        return null;
    }

    const elapsedSeconds = Math.max(
        aestheticGameState.elapsedTime / 1000,
        1
    );

    return Math.round(
        (
            aestheticGameState.score ** 2 *
            10
        ) / elapsedSeconds
    );
}


function getScoreMessage(score) {
    return [...scoreMessages]
        .sort((a, b) => b.min - a.min)
        .find((item) => score >= item.min) || null;
}


function getSpeedMessage(elapsedMilliseconds) {
    const elapsedSeconds =
        elapsedMilliseconds / 1000;

    return [...speedMessages]
        .sort((a, b) => a.maxSeconds - b.maxSeconds)
        .find(
            (item) =>
                elapsedSeconds <= item.maxSeconds
        ) || null;
}


function showResultOverlay() {
    const scoreMessage =
        getScoreMessage(aestheticGameState.score);

    overlayScoreValue.textContent =
        `${aestheticGameState.score} / 100`;

    if (scoreMessage) {
        scoreMessageTitle.textContent =
            scoreMessage.title;

        scoreMessageText.textContent =
            scoreMessage.message;
    } else {
        scoreMessageTitle.textContent = "";
        scoreMessageText.textContent = "";
    }

    if (aestheticGameState.timedMode) {
        const speedMessage =
            getSpeedMessage(
                aestheticGameState.elapsedTime
            );

        speedMessageBlock.hidden = false;

        overlayTimedScoreValue.textContent =
            aestheticGameState.timedScore;

        overlayTimeValue.textContent =
            formatTime(
                aestheticGameState.elapsedTime
            );

        if (speedMessage) {
            speedMessageTitle.textContent =
                speedMessage.title;

            speedMessageText.textContent =
                speedMessage.message;
        } else {
            speedMessageTitle.textContent = "";
            speedMessageText.textContent = "";
        }
    } else {
        speedMessageBlock.hidden = true;
    }

    resultOverlay.hidden = false;
}


function hideResultOverlay() {
    resultOverlay.hidden = true;
}


function setImageOptionsEnabled(enabled) {
    imageOptions.forEach((option) => {
        option.disabled = !enabled;
    });
}


function clearImageGrid() {
    imageOptions.forEach((option) => {
        const image = option.querySelector("img");

        image.src = "";
        image.alt = "";

        option.dataset.imageId = "";
        option.classList.remove("is-selected");
        option.setAttribute("aria-pressed", "false");
        option.disabled = true;
    });
}


function getRoundImages(category) {
    const imagesForCategory = aestheticImages.filter(
        (item) => item.category === category
    );

    const selectedImages = AESTHETIC_KEYS.map(
        (aestheticKey) => {
            const aestheticChoices = imagesForCategory.filter(
                (item) =>
                    item.primaryAesthetic === aestheticKey
            );

            return chooseRandom(aestheticChoices);
        }
    );

    return shuffleArray(selectedImages);
}


function renderCurrentImages() {
    imageOptions.forEach((option, index) => {
        const imageData =
            aestheticGameState.currentImages[index];

        const image = option.querySelector("img");

        option.classList.remove("is-selected");
        option.setAttribute("aria-pressed", "false");

        if (!imageData) {
            option.disabled = true;
            image.src = "";
            image.alt = "";
            option.dataset.imageId = "";
            return;
        }

        option.dataset.imageId = imageData.id;
        option.disabled = false;

        image.src = imageData.image;
        image.alt = `Aesthetic choice ${index + 1}`;
    });
}


function showRoundIntro() {
    aestheticGameState.status = "round-intro";
    pauseTimer();

    setImageOptionsEnabled(false);
    nextButton.disabled = true;

    roundNumber.textContent =
        `Round ${aestheticGameState.currentRound + 1} / ${TOTAL_ROUNDS}`;

    roundCategory.textContent =
        CATEGORY_LABELS[aestheticGameState.currentCategory];

    roundOverlay.hidden = false;

    if (roundIntroTimeout !== null) {
        window.clearTimeout(roundIntroTimeout);
    }

    roundIntroTimeout = window.setTimeout(() => {
        roundIntroTimeout = null;
        roundOverlay.hidden = true;

        aestheticGameState.status = "playing";

        setImageOptionsEnabled(true);
        nextButton.disabled = false;

        startTimer();
    }, ROUND_INTRO_DURATION);
}


function prepareRound() {
    aestheticGameState.currentCategory =
        aestheticGameState.categories[
            aestheticGameState.currentRound
        ];

    aestheticGameState.selectedImage = null;

    aestheticGameState.currentImages =
        getRoundImages(
            aestheticGameState.currentCategory
        );

    renderCurrentImages();
    showRoundIntro();
}


function startGame() {
    resetTimer();

    aestheticGameState.status = "starting";
    aestheticGameState.targetAesthetic =
        chooseRandom(AESTHETIC_KEYS);

    aestheticGameState.categories =
        shuffleArray(GAME_CATEGORIES);

    aestheticGameState.currentRound = 0;
    aestheticGameState.currentCategory = null;
    aestheticGameState.selectedImage = null;
    aestheticGameState.currentImages = [];
    aestheticGameState.score = 0;
    aestheticGameState.timedScore = null;

    updateTargetAesthetic();
    updateScoreDisplay();

    hintButton.disabled = false;
    timedModeToggle.disabled = true;

    startOverlay.hidden = true;
    hideResultOverlay();
    finalResults.hidden = true;

    prepareRound();
}


function getImageById(imageId) {
    return aestheticGameState.currentImages.find(
        (item) => item.id === imageId
    );
}


function selectImage(option) {
    if (aestheticGameState.status !== "playing") {
        return;
    }

    const imageId = option.dataset.imageId;

    if (!imageId) {
        return;
    }

    if (aestheticGameState.selectedImage === imageId) {
        aestheticGameState.selectedImage = null;

        option.classList.remove("is-selected");
        option.setAttribute("aria-pressed", "false");

        return;
    }

    if (aestheticGameState.selectedImage !== null) {
        showCursorMessage(
            "Only one image can be selected."
        );
        return;
    }

    aestheticGameState.selectedImage = imageId;

    option.classList.add("is-selected");
    option.setAttribute("aria-pressed", "true");
}


function finishCurrentRound() {
    const selectedImage =
        getImageById(aestheticGameState.selectedImage);

    if (!selectedImage) {
        showCursorMessage(
            "Please select an image first."
        );
        return;
    }

    pauseTimer();

    const roundScore =
        selectedImage.scores[
            aestheticGameState.targetAesthetic
        ];

    aestheticGameState.score += roundScore * 2;

    updateScoreDisplay();

    if (
        aestheticGameState.currentRound >=
        TOTAL_ROUNDS - 1
    ) {
        finishGame();
        return;
    }

    aestheticGameState.currentRound += 1;
    prepareRound();
}


function finishGame() {
    stopTimer();

    aestheticGameState.status = "results";
    aestheticGameState.selectedImage = null;
    aestheticGameState.currentImages = [];

    // Remove the visual selection from the last round before
    // the final-result overlay is displayed.
    imageOptions.forEach((option) => {
        option.classList.remove("is-selected");
        option.setAttribute("aria-pressed", "false");
    });

    setImageOptionsEnabled(false);
    nextButton.disabled = true;
    hintButton.disabled = true;

    aestheticGameState.timedScore =
        calculateTimedScore();

    finalScoreValue.textContent =
        `${aestheticGameState.score} / 100`;

    finalTimedScoreValue.textContent =
        aestheticGameState.timedMode
            ? aestheticGameState.timedScore
            : "—";

    finalTimeValue.textContent =
        aestheticGameState.timedMode
            ? formatTime(aestheticGameState.elapsedTime)
            : "—";

    timedScoreValue.textContent =
        aestheticGameState.timedMode
            ? aestheticGameState.timedScore
            : "—";

    showResultOverlay();

    finalResults.hidden = false;

    renderScoreTable();
}

function resetGame() {
    stopTimer();

    if (roundIntroTimeout !== null) {
        window.clearTimeout(roundIntroTimeout);
        roundIntroTimeout = null;
    }

    resetAestheticGameState();

    updateTargetAesthetic();
    updateScoreDisplay();

    timedModeToggle.disabled = false;
    setTimedMode(false);

    hintButton.disabled = true;
    nextButton.disabled = true;

    roundOverlay.hidden = true;
    hideResultOverlay();
    startOverlay.hidden = false;
    finalResults.hidden = true;

    clearImageGrid();
    closeHintModal();
    closeSaveScoreModal();
    closeImportScoresModal();
    hideImagePreview();
}


function openHintModal() {
    if (!aestheticGameState.targetAesthetic) {
        return;
    }

    const info =
        aestheticInfo[aestheticGameState.targetAesthetic];

    hintModalTitle.textContent = info.name;
    hintModalTitle.style.fontFamily =
        `"${info.font}", serif`;

    hintDescription.textContent = info.description;

    hintList.innerHTML = "";

    info.hints.forEach((hint) => {
        const item = document.createElement("li");
        item.textContent = hint;
        hintList.appendChild(item);
    });

    hintModal.hidden = false;
    hintModal.setAttribute("aria-hidden", "false");
}


function closeHintModal() {
    hintModal.hidden = true;
    hintModal.setAttribute("aria-hidden", "true");
}


function showImagePreview(imageData) {
    if (!imageData) {
        return;
    }

    previewImage.src = imageData.image;
    previewImage.alt = "Full image preview";

    imagePreview.hidden = false;
    imagePreview.setAttribute("aria-hidden", "false");
}


function hideImagePreview() {
    imagePreview.hidden = true;
    imagePreview.setAttribute("aria-hidden", "true");

    previewImage.src = "";
    previewImage.alt = "";
}


function beginImageHold(option) {
    if (aestheticGameState.status !== "playing") {
        return;
    }

    holdTriggered = false;

    holdTimer = window.setTimeout(() => {
        holdTriggered = true;

        const imageData =
            getImageById(option.dataset.imageId);

        showImagePreview(imageData);
    }, HOLD_DURATION);
}


function endImageHold() {
    if (holdTimer !== null) {
        window.clearTimeout(holdTimer);
        holdTimer = null;
    }

    if (holdTriggered) {
        hideImagePreview();
    }
}


function showCursorMessage(message, event = null) {
    if (cursorMessageTimer !== null) {
        window.clearTimeout(cursorMessageTimer);
    }

    cursorMessage.textContent = message;
    cursorMessage.hidden = false;

    if (event) {
        positionCursorMessage(
            event.clientX,
            event.clientY
        );
    }

    cursorMessageTimer = window.setTimeout(() => {
        cursorMessage.hidden = true;
    }, 1500);
}


function positionCursorMessage(x, y) {
    const margin = 16;

    cursorMessage.style.left = `${x}px`;
    cursorMessage.style.top = `${y}px`;

    const rect = cursorMessage.getBoundingClientRect();

    if (rect.right > window.innerWidth - margin) {
        cursorMessage.style.left =
            `${Math.max(
                margin,
                x - rect.width - 24
            )}px`;
    }

    if (rect.bottom > window.innerHeight - margin) {
        cursorMessage.style.top =
            `${Math.max(
                margin,
                y - rect.height - 24
            )}px`;
    }
}


function getSavedScores() {
    try {
        const stored =
            localStorage.getItem(SCORE_STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}


function saveScores(scores) {
    localStorage.setItem(
        SCORE_STORAGE_KEY,
        JSON.stringify(scores)
    );
}


function openSaveScoreModal() {
    const previousUsername =
        localStorage.getItem(USERNAME_STORAGE_KEY) || "";

    scoreUsernameInput.value = previousUsername;
    saveScoreError.textContent = "";

    saveScoreModal.hidden = false;
    saveScoreModal.setAttribute("aria-hidden", "false");

    scoreUsernameInput.focus();
    scoreUsernameInput.select();
}


function closeSaveScoreModal() {
    saveScoreModal.hidden = true;
    saveScoreModal.setAttribute("aria-hidden", "true");

    saveScoreError.textContent = "";
}


function saveCurrentScore() {
    const username =
        scoreUsernameInput.value.trim();

    if (!username) {
        saveScoreError.textContent =
            "Please enter a username.";
        return;
    }

    const scores = getSavedScores();

    scores.push({
        username,
        score: aestheticGameState.score,
        timedScore: aestheticGameState.timedScore,
        date: new Date().toISOString()
    });

    saveScores(scores);

    localStorage.setItem(
        USERNAME_STORAGE_KEY,
        username
    );

    closeSaveScoreModal();
    renderScoreTable();
}


function compareText(a, b, direction) {
    const result = String(a).localeCompare(
        String(b),
        undefined,
        {
            sensitivity: "base"
        }
    );

    return direction === "asc" ? result : -result;
}


function compareNumber(a, b, direction) {
    const first = Number(a);
    const second = Number(b);

    return direction === "asc"
        ? first - second
        : second - first;
}


function compareDate(a, b, direction) {
    const first = new Date(a).getTime();
    const second = new Date(b).getTime();

    return direction === "asc"
        ? first - second
        : second - first;
}


function compareTimedScore(a, b, direction) {
    const aMissing =
        a === null || a === undefined;
    const bMissing =
        b === null || b === undefined;

    if (aMissing && bMissing) {
        return 0;
    }

    if (aMissing) {
        return 1;
    }

    if (bMissing) {
        return -1;
    }

    return compareNumber(a, b, direction);
}


function sortSavedScores(scores) {
    const sorted = [...scores];
    const direction = scoreSort.direction;

    sorted.sort((a, b) => {
        let result = 0;

        if (scoreSort.field === "username") {
            result = compareText(
                a.username,
                b.username,
                direction
            );

            if (result !== 0) return result;

            result = compareTimedScore(
                a.timedScore,
                b.timedScore,
                "desc"
            );

            if (result !== 0) return result;

            result = compareNumber(
                a.score,
                b.score,
                "desc"
            );

            if (result !== 0) return result;

            return compareDate(
                a.date,
                b.date,
                "desc"
            );
        }

        if (scoreSort.field === "timedScore") {
            result = compareTimedScore(
                a.timedScore,
                b.timedScore,
                direction
            );

            if (result !== 0) return result;

            result = compareNumber(
                a.score,
                b.score,
                direction
            );

            if (result !== 0) return result;

            result = compareText(
                a.username,
                b.username,
                "asc"
            );

            if (result !== 0) return result;

            return compareDate(
                a.date,
                b.date,
                "desc"
            );
        }

        if (scoreSort.field === "score") {
            result = compareNumber(
                a.score,
                b.score,
                direction
            );

            if (result !== 0) return result;

            result = compareTimedScore(
                a.timedScore,
                b.timedScore,
                direction
            );

            if (result !== 0) return result;

            result = compareText(
                a.username,
                b.username,
                "asc"
            );

            if (result !== 0) return result;

            return compareDate(
                a.date,
                b.date,
                "desc"
            );
        }

        result = compareDate(
            a.date,
            b.date,
            direction
        );

        if (result !== 0) return result;

        result = compareTimedScore(
            a.timedScore,
            b.timedScore,
            "desc"
        );

        if (result !== 0) return result;

        result = compareNumber(
            a.score,
            b.score,
            "desc"
        );

        if (result !== 0) return result;

        return compareText(
            a.username,
            b.username,
            "asc"
        );
    });

    return sorted;
}


function formatSavedDate(isoDate) {
    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleString();
}


function updateSortIndicators() {
    sortButtons.forEach((button) => {
        const indicator =
            button.querySelector(".sort-indicator");

        if (!indicator) {
            return;
        }

        if (button.dataset.sort !== scoreSort.field) {
            indicator.textContent = "";
            return;
        }

        indicator.textContent =
            scoreSort.direction === "asc"
                ? "↑"
                : "↓";
    });
}


function renderScoreTable() {
    const scores =
        sortSavedScores(getSavedScores());

    scoreTableBody.innerHTML = "";

    if (scores.length === 0) {
        const row = document.createElement("tr");
        row.className = "empty-score-row";

        const cell = document.createElement("td");
        cell.colSpan = 4;
        cell.textContent = "No saved scores yet.";

        row.appendChild(cell);
        scoreTableBody.appendChild(row);

        updateSortIndicators();
        return;
    }

    scores.forEach((entry) => {
        const row = document.createElement("tr");

        const usernameCell =
            document.createElement("td");
        usernameCell.textContent = entry.username;

        const scoreCell =
            document.createElement("td");
        scoreCell.textContent = entry.score;

        const timedScoreCell =
            document.createElement("td");
        timedScoreCell.textContent =
            entry.timedScore === null ||
            entry.timedScore === undefined
                ? "—"
                : entry.timedScore;

        const dateCell =
            document.createElement("td");
        dateCell.textContent =
            formatSavedDate(entry.date);

        row.append(
            usernameCell,
            scoreCell,
            timedScoreCell,
            dateCell
        );

        scoreTableBody.appendChild(row);
    });

    updateSortIndicators();
}


function changeScoreSort(field) {
    if (scoreSort.field === field) {
        scoreSort.direction =
            scoreSort.direction === "asc"
                ? "desc"
                : "asc";
    } else {
        scoreSort.field = field;

        if (field === "username") {
            scoreSort.direction = "asc";
        } else {
            scoreSort.direction = "desc";
        }
    }

    renderScoreTable();
}


function downloadScores() {
    const scores = getSavedScores();

    const blob = new Blob(
        [JSON.stringify(scores, null, 4)],
        {
            type: "application/json"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "funart-scores.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}


function isValidScoreEntry(entry) {
    if (
        !entry ||
        typeof entry !== "object" ||
        Array.isArray(entry)
    ) {
        return false;
    }

    if (
        typeof entry.username !== "string" ||
        !entry.username.trim()
    ) {
        return false;
    }

    if (
        typeof entry.score !== "number" ||
        !Number.isFinite(entry.score)
    ) {
        return false;
    }

    if (
        entry.timedScore !== null &&
        entry.timedScore !== undefined &&
        (
            typeof entry.timedScore !== "number" ||
            !Number.isFinite(entry.timedScore)
        )
    ) {
        return false;
    }

    const date = new Date(entry.date);

    return !Number.isNaN(date.getTime());
}


function normalizeImportedScore(entry) {
    return {
        username: entry.username.trim(),
        score: entry.score,
        timedScore:
            entry.timedScore === undefined
                ? null
                : entry.timedScore,
        date: new Date(entry.date).toISOString()
    };
}


function readImportedScores(file) {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        try {
            const parsed = JSON.parse(reader.result);

            if (
                !Array.isArray(parsed) ||
                !parsed.every(isValidScoreEntry)
            ) {
                throw new Error("Invalid score file");
            }

            pendingImportedScores =
                parsed.map(normalizeImportedScore);

            importScoresModal.hidden = false;
            importScoresModal.setAttribute(
                "aria-hidden",
                "false"
            );
        } catch {
            window.alert(
                "The selected file is not a valid FunArt score file."
            );
        } finally {
            importScoresInput.value = "";
        }
    });

    reader.readAsText(file);
}


function closeImportScoresModal() {
    importScoresModal.hidden = true;
    importScoresModal.setAttribute(
        "aria-hidden",
        "true"
    );

    pendingImportedScores = null;
}


function scoresAreIdentical(first, second) {
    return (
        first.date === second.date &&
        first.username === second.username &&
        first.timedScore === second.timedScore &&
        first.score === second.score
    );
}


function mergeImportedScores() {
    if (!pendingImportedScores) {
        return;
    }

    const mergedScores = [...getSavedScores()];

    pendingImportedScores.forEach(
        (importedScore) => {
            const alreadyExists =
                mergedScores.some(
                    (existingScore) =>
                        scoresAreIdentical(
                            existingScore,
                            importedScore
                        )
                );

            if (!alreadyExists) {
                mergedScores.push(importedScore);
            }
        }
    );

    saveScores(mergedScores);

    closeImportScoresModal();
    renderScoreTable();
}


function replaceImportedScores() {
    if (!pendingImportedScores) {
        return;
    }

    const confirmed = window.confirm(
        "Replace all locally saved scores with the imported scores?"
    );

    if (!confirmed) {
        return;
    }

    saveScores(pendingImportedScores);

    closeImportScoresModal();
    renderScoreTable();
}


function clearSavedScores() {
    const scores = getSavedScores();

    if (scores.length === 0) {
        return;
    }

    const confirmed = window.confirm(
        "Delete all locally saved scores?"
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(SCORE_STORAGE_KEY);
    renderScoreTable();
}


timedModeToggle.addEventListener("click", () => {
    const enabled =
        timedModeToggle.getAttribute("aria-checked") !==
        "true";

    setTimedMode(enabled);
});


startGameButton.addEventListener(
    "click",
    startGame
);


nextButton.addEventListener(
    "click",
    finishCurrentRound
);


newGameButton.addEventListener(
    "click",
    resetGame
);


resultsNewGameButton.addEventListener(
    "click",
    resetGame
);


hintButton.addEventListener(
    "click",
    openHintModal
);


closeHintButton.addEventListener(
    "click",
    closeHintModal
);


hintModal.addEventListener("click", (event) => {
    if (event.target === hintModal) {
        closeHintModal();
    }
});


saveScoreButton.addEventListener(
    "click",
    openSaveScoreModal
);


closeSaveScoreButton.addEventListener(
    "click",
    closeSaveScoreModal
);


confirmSaveScoreButton.addEventListener(
    "click",
    saveCurrentScore
);


scoreUsernameInput.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Enter") {
            saveCurrentScore();
        }
    }
);


saveScoreModal.addEventListener(
    "click",
    (event) => {
        if (event.target === saveScoreModal) {
            closeSaveScoreModal();
        }
    }
);


downloadScoresButton.addEventListener(
    "click",
    downloadScores
);


importScoresInput.addEventListener(
    "change",
    () => {
        const file = importScoresInput.files[0];

        if (file) {
            readImportedScores(file);
        }
    }
);


mergeScoresButton.addEventListener(
    "click",
    mergeImportedScores
);


replaceScoresButton.addEventListener(
    "click",
    replaceImportedScores
);


closeImportScoresButton.addEventListener(
    "click",
    closeImportScoresModal
);


importScoresModal.addEventListener(
    "click",
    (event) => {
        if (event.target === importScoresModal) {
            closeImportScoresModal();
        }
    }
);


clearScoresButton.addEventListener(
    "click",
    clearSavedScores
);


sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
        changeScoreSort(button.dataset.sort);
    });
});


imageOptions.forEach((option) => {
    option.addEventListener(
        "pointerdown",
        (event) => {
            if (event.button !== undefined && event.button !== 0) {
                return;
            }

            beginImageHold(option);
        }
    );

    option.addEventListener(
        "pointerup",
        (event) => {
            if (holdTriggered) {
                event.preventDefault();
                return;
            }

            selectImage(option);
        }
    );

    option.addEventListener(
        "pointercancel",
        endImageHold
    );

    option.addEventListener(
        "contextmenu",
        (event) => {
            event.preventDefault();
        }
    );
});


window.addEventListener("pointerup", () => {
    endImageHold();
});


window.addEventListener("pointercancel", () => {
    endImageHold();
});


window.addEventListener("pointermove", (event) => {
    if (!cursorMessage.hidden) {
        positionCursorMessage(
            event.clientX,
            event.clientY
        );
    }
});


document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
        return;
    }

    if (!hintModal.hidden) {
        closeHintModal();
    }

    if (!saveScoreModal.hidden) {
        closeSaveScoreModal();
    }

    if (!importScoresModal.hidden) {
        closeImportScoresModal();
    }
});


resetGame();
renderScoreTable();
