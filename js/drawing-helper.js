// ============================================================
// DRAWING PLANNER
// ============================================================


// ============================================================
// PRESETS
// ============================================================

const drawingPresets = {
    princess: [
        "A princess or prince",
        "A royal outfit",
        "A castle",
        "A magical object",
        "A companion animal"
    ],

    pirates: [
        "A pirate",
        "A pirate ship",
        "A treasure chest",
        "A mysterious island",
        "A sea creature"
    ],

    superhero: [
        "A superhero",
        "A costume",
        "A special power",
        "A villain",
        "A city skyline"
    ],

    concert: [
        "Your favorite artist",
        "A stage outfit",
        "A microphone or instrument",
        "Stage lights",
        "Something thrown by a fan"
    ],

    cartoon: [
        "Your favorite cartoon character",
        "A new outfit",
        "A different setting",
        "A prop or object",
        "A second character"
    ],

    mermaids: [
        "A mermaid",
        "A detailed tail",
        "Underwater jewelry",
        "A sea companion",
        "An underwater environment"
    ],

    fantasy: [
        "A fantasy character",
        "A weapon",
        "A magical creature",
        "A fantasy location",
        "A magical object"
    ]
};


// ============================================================
// TO-DO LIST STATE
// ============================================================

const TASKS_STORAGE_KEY =
    "funartDrawingPlannerTasks";


let tasks =
    loadTasks();


// ============================================================
// TO-DO LIST ELEMENTS
// ============================================================

const presetSelect =
    document.querySelector(
        "#preset-select"
    );

const loadPresetButton =
    document.querySelector(
        "#load-preset-button"
    );

const taskList =
    document.querySelector(
        "#task-list"
    );

const addTaskForm =
    document.querySelector(
        "#add-task-form"
    );

const newTaskInput =
    document.querySelector(
        "#new-task-input"
    );

const clearTaskListButton =
    document.querySelector(
        "#clear-task-list-button"
    );


// ============================================================
// TO-DO LIST HELPERS
// ============================================================

function loadTasks() {

    const savedTasks =
        localStorage.getItem(
            TASKS_STORAGE_KEY
        );


    if (!savedTasks) {
        return [];
    }


    try {

        const parsedTasks =
            JSON.parse(
                savedTasks
            );


        if (
            Array.isArray(
                parsedTasks
            )
        ) {
            return parsedTasks;
        }

    } catch (error) {

        console.warn(
            "Task-urile salvate nu au putut fi citite.",
            error
        );
    }


    return [];
}


function saveTasks() {

    localStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(
            tasks
        )
    );
}


function createTask(
    text
) {

    return {
        id:
            Date.now().toString()
            + "-"
            + Math.random()
                .toString(16)
                .slice(2),

        text:
            text.trim(),

        completed:
            false
    };
}


function addTask(
    text
) {

    const cleanText =
        text.trim();


    if (!cleanText) {
        return;
    }


    tasks.push(
        createTask(
            cleanText
        )
    );


    saveTasks();
    renderTasks();
}


function removeTask(
    taskId
) {

    tasks =
        tasks.filter(
            (task) =>
                task.id !== taskId
        );


    saveTasks();
    renderTasks();
}


function toggleTask(
    taskId
) {

    const task =
        tasks.find(
            (item) =>
                item.id === taskId
        );


    if (!task) {
        return;
    }


    task.completed =
        !task.completed;


    saveTasks();
    renderTasks();
}


function renderTasks() {

    taskList.innerHTML =
        "";


    if (
        tasks.length === 0
    ) {

        const emptyMessage =
            document.createElement(
                "p"
            );


        emptyMessage.className =
            "task-list-empty";


        emptyMessage.textContent =
            "Lista este goală. Încarcă un preset sau adaugă o idee.";


        taskList.appendChild(
            emptyMessage
        );


        return;
    }


    tasks.forEach(
        (task) => {

            const taskItem =
                document.createElement(
                    "div"
                );


            taskItem.className =
                "task-item";


            if (
                task.completed
            ) {

                taskItem.classList.add(
                    "is-complete"
                );
            }


            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";

            checkbox.checked =
                task.completed;


            checkbox.setAttribute(
                "aria-label",
                "Marchează task-ul ca terminat"
            );


            checkbox.addEventListener(
                "change",
                () => {

                    toggleTask(
                        task.id
                    );
                }
            );


            const taskText =
                document.createElement(
                    "span"
                );


            taskText.className =
                "task-text";

            taskText.textContent =
                task.text;


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";

            deleteButton.className =
                "task-delete-button";

            deleteButton.textContent =
                "×";


            deleteButton.setAttribute(
                "aria-label",
                `Șterge: ${task.text}`
            );


            deleteButton.addEventListener(
                "click",
                () => {

                    removeTask(
                        task.id
                    );
                }
            );


            taskItem.append(
                checkbox,
                taskText,
                deleteButton
            );


            taskList.appendChild(
                taskItem
            );
        }
    );
}


// ============================================================
// PRESET EVENTS
// ============================================================

loadPresetButton.addEventListener(
    "click",
    () => {

        const presetName =
            presetSelect.value;


        if (!presetName) {
            return;
        }


        const presetTasks =
            drawingPresets[
                presetName
            ];


        if (!presetTasks) {
            return;
        }


        presetTasks.forEach(
            (text) => {

                tasks.push(
                    createTask(
                        text
                    )
                );
            }
        );


        saveTasks();
        renderTasks();
    }
);


addTaskForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        addTask(
            newTaskInput.value
        );


        newTaskInput.value =
            "";


        newTaskInput.focus();
    }
);


clearTaskListButton.addEventListener(
    "click",
    () => {

        tasks =
            [];


        saveTasks();
        renderTasks();
    }
);


// ============================================================
// CANVAS ELEMENTS
// ============================================================

const canvas =
    document.querySelector(
        "#drawing-canvas"
    );


const context =
    canvas.getContext(
        "2d"
    );


const toolButtons =
    document.querySelectorAll(
        ".tool-button"
    );


const colorInput =
    document.querySelector(
        "#drawing-color"
    );


const brushSizeInput =
    document.querySelector(
        "#brush-size"
    );


const brushSizeValue =
    document.querySelector(
        "#brush-size-value"
    );


const shapeOptions =
    document.querySelector(
        "#shape-options"
    );


const fillEnabledInput =
    document.querySelector(
        "#shape-fill-enabled"
    );


const fillColorInput =
    document.querySelector(
        "#shape-fill-color"
    );


const rotationInput =
    document.querySelector(
        "#shape-rotation"
    );


const rotationValue =
    document.querySelector(
        "#shape-rotation-value"
    );


const undoButton =
    document.querySelector(
        "#undo-button"
    );


const clearCanvasButton =
    document.querySelector(
        "#clear-canvas-button"
    );


const saveCanvasButton =
    document.querySelector(
        "#save-canvas-button"
    );


// ============================================================
// DRAWING STATE
// ============================================================

const drawingState = {
    tool:
        "pencil",

    color:
        colorInput.value,

    size:
        Number(
            brushSizeInput.value
        ),

    isDrawing:
        false,

    startX:
        0,

    startY:
        0,

    snapshot:
        null,

    fillEnabled:
        false,

    fillColor:
        fillColorInput.value,

    rotation:
        Number(
            rotationInput.value
        )
};


const undoStack =
    [];


const MAX_UNDO_STEPS =
    25;


// ============================================================
// CANVAS INITIALIZATION
// ============================================================

function fillCanvasWhite() {

    context.save();


    context.fillStyle =
        "#ffffff";


    context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    context.restore();
}


fillCanvasWhite();


// ============================================================
// COORDINATES
// ============================================================

function getCanvasCoordinates(
    event
) {

    const rect =
        canvas.getBoundingClientRect();


    const scaleX =
        canvas.width
        / rect.width;


    const scaleY =
        canvas.height
        / rect.height;


    return {
        x:
            (
                event.clientX
                - rect.left
            )
            * scaleX,

        y:
            (
                event.clientY
                - rect.top
            )
            * scaleY
    };
}


// ============================================================
// UNDO
// ============================================================

function saveUndoState() {

    const imageData =
        context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );


    undoStack.push(
        imageData
    );


    if (
        undoStack.length
        > MAX_UNDO_STEPS
    ) {

        undoStack.shift();
    }
}


function undoLastAction() {

    if (
        undoStack.length === 0
    ) {
        return;
    }


    const previousState =
        undoStack.pop();


    context.putImageData(
        previousState,
        0,
        0
    );
}


// ============================================================
// SHAPE HELPERS
// ============================================================

const SHAPE_TOOLS =
    new Set([
        "rectangle",
        "square",
        "ellipse",
        "circle",
        "triangle",
        "right-triangle",
        "diamond",
        "heart",
        "star"
    ]);


function isShapeTool(
    toolName
) {

    return SHAPE_TOOLS.has(
        toolName
    );
}


function updateShapeControls() {

    const shapeActive =
        isShapeTool(
            drawingState.tool
        );


    shapeOptions.disabled =
        !shapeActive;


    fillColorInput.disabled =
        !shapeActive
        || !fillEnabledInput.checked;
}


// ============================================================
// TOOL SELECTION
// ============================================================

function setActiveTool(
    toolName
) {

    drawingState.tool =
        toolName;

    canvas.classList.toggle(
        "bucket-active",
        toolName === "bucket"
    );

    toolButtons.forEach(
        (button) => {

            const isActive =
                button.dataset.tool
                === toolName;


            button.classList.toggle(
                "is-active",
                isActive
            );
        }
    );


    updateShapeControls();
}


toolButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                setActiveTool(
                    button.dataset.tool
                );
            }
        );
    }
);


// ============================================================
// COLOR / SIZE / FILL / ROTATION
// ============================================================

colorInput.addEventListener(
    "input",
    () => {

        drawingState.color =
            colorInput.value;
    }
);


brushSizeInput.addEventListener(
    "input",
    () => {

        drawingState.size =
            Number(
                brushSizeInput.value
            );

        brushSizeValue.textContent =
            drawingState.size;
    }
);


fillEnabledInput.addEventListener(
    "change",
    () => {

        drawingState.fillEnabled =
            fillEnabledInput.checked;


        updateShapeControls();
    }
);


fillColorInput.addEventListener(
    "input",
    () => {

        drawingState.fillColor =
            fillColorInput.value;
    }
);


rotationInput.addEventListener(
    "input",
    () => {

        drawingState.rotation =
            Number(
                rotationInput.value
            );

        const label =
            `${drawingState.rotation}°`;

        rotationValue.textContent =
            label;
    }
);


// ============================================================
// DRAWING HELPERS
// ============================================================

function configureStroke() {

    context.lineWidth =
        drawingState.size;


    context.lineCap =
        "round";


    context.lineJoin =
        "round";


    context.strokeStyle =
        (
            drawingState.tool
            === "eraser"
        )
            ? "#ffffff"
            : drawingState.color;
}


function restoreSnapshot() {

    if (
        !drawingState.snapshot
    ) {
        return;
    }


    context.putImageData(
        drawingState.snapshot,
        0,
        0
    );
}

// ============================================================
// BUCKET FILL
// ============================================================
const BUCKET_TOLERANCE =
    20;

function hexToRgba(
    hex
) {

    return {
        r:
            parseInt(
                hex.slice(
                    1,
                    3
                ),
                16
            ),

        g:
            parseInt(
                hex.slice(
                    3,
                    5
                ),
                16
            ),

        b:
            parseInt(
                hex.slice(
                    5,
                    7
                ),
                16
            ),

        a:
            255
    };
}


function colorsMatch(
    data,
    index,
    color,
    tolerance
) {

    const redDifference =
        Math.abs(
            data[index]
            - color.r
        );

    const greenDifference =
        Math.abs(
            data[index + 1]
            - color.g
        );

    const blueDifference =
        Math.abs(
            data[index + 2]
            - color.b
        );

    const alphaDifference =
        Math.abs(
            data[index + 3]
            - color.a
        );


    return (
        redDifference <= tolerance
        &&
        greenDifference <= tolerance
        &&
        blueDifference <= tolerance
        &&
        alphaDifference <= tolerance
    );
}


function setPixelColor(
    data,
    index,
    color
) {

    data[index] =
        color.r;

    data[index + 1] =
        color.g;

    data[index + 2] =
        color.b;

    data[index + 3] =
        color.a;
}


function floodFill(
    startX,
    startY,
    hexColor
) {

    startX =
        Math.floor(
            startX
        );

    startY =
        Math.floor(
            startY
        );


    if (
        startX < 0
        ||
        startX >= canvas.width
        ||
        startY < 0
        ||
        startY >= canvas.height
    ) {
        return;
    }


    const imageData =
        context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );


    const data =
        imageData.data;


    const startIndex =
        (
            startY
            * canvas.width
            + startX
        )
        * 4;


    const targetColor = {
        r:
            data[startIndex],

        g:
            data[startIndex + 1],

        b:
            data[startIndex + 2],

        a:
            data[startIndex + 3]
    };


    const fillColor =
        hexToRgba(
            hexColor
        );


    // Daca pixelul are deja culoarea dorita,
    // nu avem nimic de facut.
    if (
        targetColor.r
        === fillColor.r
        &&
        targetColor.g
        === fillColor.g
        &&
        targetColor.b
        === fillColor.b
        &&
        targetColor.a
        === fillColor.a
    ) {
        return;
    }


    // Fiecare pozitie din array corespunde unui pixel.
    // 0 = nevizitat
    // 1 = deja verificat
    const visited =
        new Uint8Array(
            canvas.width
            * canvas.height
        );


    const stack = [
        startX,
        startY
    ];


    while (
        stack.length > 0
    ) {

        const y =
            stack.pop();

        const x =
            stack.pop();


        if (
            x < 0
            ||
            x >= canvas.width
            ||
            y < 0
            ||
            y >= canvas.height
        ) {
            continue;
        }


        const pixelPosition =
            y
            * canvas.width
            + x;


        if (
            visited[
                pixelPosition
            ]
        ) {
            continue;
        }


        visited[
            pixelPosition
        ] = 1;


        const index =
            pixelPosition
            * 4;


        if (
            !colorsMatch(
                data,
                index,
                targetColor,
                BUCKET_TOLERANCE
            )
        ) {
            continue;
        }


        setPixelColor(
            data,
            index,
            fillColor
        );


        // 8 directii:
        // sus, jos, stanga, dreapta
        // + cele patru diagonale.
        stack.push(
            x,
            y - 1,

            x,
            y + 1,

            x - 1,
            y,

            x + 1,
            y,

            x - 1,
            y - 1,

            x + 1,
            y - 1,

            x - 1,
            y + 1,

            x + 1,
            y + 1
        );
    }


    context.putImageData(
        imageData,
        0,
        0
    );
}


// ============================================================
// SHAPE DRAWING
// ============================================================

function drawPreviewShape(
    currentX,
    currentY
) {

    restoreSnapshot();

    configureStroke();


    const startX =
        drawingState.startX;


    const startY =
        drawingState.startY;


    const rawWidth =
        currentX
        - startX;


    const rawHeight =
        currentY
        - startY;


    // ========================================================
    // LINE
    // ========================================================

    if (
        drawingState.tool
        === "line"
    ) {

        context.beginPath();


        context.moveTo(
            startX,
            startY
        );


        context.lineTo(
            currentX,
            currentY
        );


        context.stroke();


        return;
    }


    if (
        !isShapeTool(
            drawingState.tool
        )
    ) {
        return;
    }


    let width =
        Math.abs(
            rawWidth
        );


    let height =
        Math.abs(
            rawHeight
        );


    const directionX =
        rawWidth >= 0
            ? 1
            : -1;


    const directionY =
        rawHeight >= 0
            ? 1
            : -1;


    let centerX =
        startX
        + rawWidth / 2;


    let centerY =
        startY
        + rawHeight / 2;


    // Square, Circle si Star trebuie sa ramana proportionate.
    if (
        drawingState.tool
        === "square"
        ||
        drawingState.tool
        === "circle"
        ||
        drawingState.tool
        === "star"
    ) {

        const side =
            Math.min(
                width,
                height
            );


        width =
            side;


        height =
            side;


        centerX =
            startX
            + directionX
            * side / 2;


        centerY =
            startY
            + directionY
            * side / 2;
    }


    if (
        width === 0
        ||
        height === 0
    ) {
        return;
    }


    const rotationRadians =
        drawingState.rotation
        * Math.PI
        / 180;


    context.save();


    context.translate(
        centerX,
        centerY
    );


    context.rotate(
        rotationRadians
    );


    context.beginPath();


    // ========================================================
    // RECTANGLE
    // ========================================================

    if (
        drawingState.tool
        === "rectangle"
    ) {

        context.rect(
            -width / 2,
            -height / 2,
            width,
            height
        );
    }


    // ========================================================
    // SQUARE
    // ========================================================

    else if (
        drawingState.tool
        === "square"
    ) {

        context.rect(
            -width / 2,
            -height / 2,
            width,
            height
        );
    }


    // ========================================================
    // ELLIPSE
    // ========================================================

    else if (
        drawingState.tool
        === "ellipse"
    ) {

        context.ellipse(
            0,
            0,
            width / 2,
            height / 2,
            0,
            0,
            Math.PI * 2
        );
    }


    // ========================================================
    // CIRCLE
    // ========================================================

    else if (
        drawingState.tool
        === "circle"
    ) {

        context.arc(
            0,
            0,
            width / 2,
            0,
            Math.PI * 2
        );
    }


    // ========================================================
    // TRIANGLE
    // ========================================================

    else if (
        drawingState.tool
        === "triangle"
    ) {

        context.moveTo(
            0,
            -height / 2
        );


        context.lineTo(
            -width / 2,
            height / 2
        );


        context.lineTo(
            width / 2,
            height / 2
        );


        context.closePath();
    }


    // ========================================================
    // RIGHT TRIANGLE
    // ========================================================

    else if (
        drawingState.tool
        === "right-triangle"
    ) {

        context.moveTo(
            -width / 2,
            -height / 2
        );


        context.lineTo(
            -width / 2,
            height / 2
        );


        context.lineTo(
            width / 2,
            height / 2
        );


        context.closePath();
    }


    // ========================================================
    // DIAMOND / RHOMBUS
    // ========================================================

    else if (
        drawingState.tool
        === "diamond"
    ) {

        context.moveTo(
            0,
            -height / 2
        );


        context.lineTo(
            width / 2,
            0
        );


        context.lineTo(
            0,
            height / 2
        );


        context.lineTo(
            -width / 2,
            0
        );


        context.closePath();
    }


    // ========================================================
    // HEART
    // ========================================================

    else if (
        drawingState.tool
        === "heart"
    ) {

        context.moveTo(
            0,
            height / 2
        );


        context.bezierCurveTo(
            -width * 0.55,
            height * 0.15,

            -width * 0.55,
            -height * 0.28,

            -width * 0.25,
            -height * 0.28
        );


        context.bezierCurveTo(
            -width * 0.08,
            -height * 0.28,

            0,
            -height * 0.08,

            0,
            -height * 0.08
        );


        context.bezierCurveTo(
            0,
            -height * 0.08,

            width * 0.08,
            -height * 0.28,

            width * 0.25,
            -height * 0.28
        );


        context.bezierCurveTo(
            width * 0.55,
            -height * 0.28,

            width * 0.55,
            height * 0.15,

            0,
            height / 2
        );


        context.closePath();
    }


    // ========================================================
    // STAR
    // ========================================================

    else if (
        drawingState.tool
        === "star"
    ) {

        const outerRadius =
            width / 2;


        const innerRadius =
            outerRadius
            * 0.45;


        const points =
            5;


        let angle =
            -Math.PI / 2;


        const step =
            Math.PI
            / points;


        for (
            let index = 0;
            index < points * 2;
            index++
        ) {

            const radius =
                index % 2 === 0
                    ? outerRadius
                    : innerRadius;


            const x =
                Math.cos(
                    angle
                )
                * radius;


            const y =
                Math.sin(
                    angle
                )
                * radius;


            if (
                index === 0
            ) {

                context.moveTo(
                    x,
                    y
                );

            } else {

                context.lineTo(
                    x,
                    y
                );
            }


            angle +=
                step;
        }


        context.closePath();
    }


    // ========================================================
    // FILL
    // ========================================================

    if (
        drawingState.fillEnabled
    ) {

        context.fillStyle =
            drawingState.fillColor;


        context.fill();
    }


    // Conturul se deseneaza dupa fill,
    // astfel incat sa ramana vizibil.
    context.stroke();


    context.restore();
}


// ============================================================
// POINTER EVENTS
// ============================================================

canvas.addEventListener(
    "pointerdown",
    (event) => {

        event.preventDefault();


        const point =
            getCanvasCoordinates(
                event
            );

        if (
            drawingState.tool
            === "bucket"
        ) {

            saveUndoState();


            floodFill(
                point.x,
                point.y,
                drawingState.color
            );


            return;
        }

        drawingState.isDrawing =
            true;


        drawingState.startX =
            point.x;


        drawingState.startY =
            point.y;


        saveUndoState();


        canvas.setPointerCapture(
            event.pointerId
        );


        if (
            drawingState.tool
            === "pencil"
            ||
            drawingState.tool
            === "eraser"
        ) {
            configureStroke();

            context.fillStyle = context.strokeStyle;

            context.beginPath();
            context.arc(
                point.x,
                point.y,
                drawingState.size / 2,
                0,
                Math.PI * 2
            );
            context.fill();

            context.beginPath();
            context.moveTo(
                point.x,
                point.y
            );
        } else {

            drawingState.snapshot =
                context.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
        }
    }
);


canvas.addEventListener(
    "pointermove",
    (event) => {

        if (
            !drawingState.isDrawing
        ) {
            return;
        }


        event.preventDefault();


        const point =
            getCanvasCoordinates(
                event
            );


        if (
            drawingState.tool
            === "pencil"
            ||
            drawingState.tool
            === "eraser"
        ) {

            configureStroke();


            context.lineTo(
                point.x,
                point.y
            );


            context.stroke();

        } else {

            drawPreviewShape(
                point.x,
                point.y
            );
        }
    }
);


function finishDrawing(
    event
) {

    if (
        !drawingState.isDrawing
    ) {
        return;
    }


    drawingState.isDrawing =
        false;


    if (
        canvas.hasPointerCapture(
            event.pointerId
        )
    ) {

        canvas.releasePointerCapture(
            event.pointerId
        );
    }


    drawingState.snapshot =
        null;
}


canvas.addEventListener(
    "pointerup",
    finishDrawing
);


canvas.addEventListener(
    "pointercancel",
    finishDrawing
);


// ============================================================
// CANVAS ACTIONS
// ============================================================

undoButton.addEventListener(
    "click",
    () => {

        undoLastAction();
    }
);


clearCanvasButton.addEventListener(
    "click",
    () => {

        saveUndoState();


        fillCanvasWhite();
    }
);


saveCanvasButton.addEventListener(
    "click",
    () => {

        const downloadLink =
            document.createElement(
                "a"
            );


        downloadLink.download =
            "funart-drawing.png";


        downloadLink.href =
            canvas.toDataURL(
                "image/png"
            );


        downloadLink.click();
    }
);


// ============================================================
// INITIAL RENDER
// ============================================================

updateShapeControls();

renderTasks();