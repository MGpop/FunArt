const aestheticGameState = {
    status: "ready",

    targetAesthetic: null,

    categories: [],
    currentCategory: null,
    currentRound: 0,

    selectedImage: null,
    currentImages: [],

    score: 0,

    timedMode: false,
    elapsedTime: 0,
    timedScore: null
};


function resetAestheticGameState() {
    aestheticGameState.status = "ready";

    aestheticGameState.targetAesthetic = null;

    aestheticGameState.categories = [];
    aestheticGameState.currentCategory = null;
    aestheticGameState.currentRound = 0;

    aestheticGameState.selectedImage = null;
    aestheticGameState.currentImages = [];

    aestheticGameState.score = 0;

    aestheticGameState.timedMode = false;
    aestheticGameState.elapsedTime = 0;
    aestheticGameState.timedScore = null;
}
