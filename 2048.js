(function () {
    Array(16).fill(0).forEach(_ => $("#game-grid").append("<div></div>"))

    const values = new Array(16).fill(0).map((_, index) => ({ value: undefined, index }));
    const width = $("#items").width() / 4;

    function render() {
        $("#items").html("");
        values.forEach(({ value }, index) => {
            if (value) {
                $("#items").append(`<div class="tile-${value > 2048 ? 'large' : value}" 
                style="top:${Math.floor(index / 4) * width}px;left:${(index % 4) * width}px">${value}</div>`)
            }
        })
    }

    function append(count = 1) {
        let empty = values.filter(({ value }) => !value);
        for (let i = 0; empty.length > 0 && i < count; i++) {
            let r = Math.floor(Math.random() * empty.length);
            let [{ index }] = empty.splice(r, 1);
            values[index].value = 2;
        }
        render();
        if (gameOver()) {
            alert("游戏结束~")
            init();
        }
    }

    function gameOver() {
        if (values.find(it => !it.value)) return false;
        let copy = $.extend(true, [], values);
        return merge(0, 1, 4, copy) === 0 && merge(0, 4, 1, copy) === 0;
    }

    function merge(start, step1, step2, arr = values) {
        let changed = 0;
        for (let i = 0; i < 4; i++) {
            let head = start + i * step2;
            for (let j = 0; j < 4; j++) {
                let index = start + i * step2 + j * step1;
                if (arr[index].value) {
                    if (head === index) continue;
                    if (!arr[head].value) {
                        arr[head].value = arr[index].value;
                        arr[index].value = undefined;
                    } else if (arr[head].value === arr[index].value) {
                        arr[head].value *= 2;
                        arr[index].value = undefined;
                        head += step1;
                    } else {
                        head += step1;
                        if (head !== index) {
                            arr[head].value = arr[index].value;
                            arr[index].value = undefined;
                        } else {
                            continue;
                        }
                    }
                    changed++;
                }
            }
        }
        return changed;
    }

    function handleEvent(e) {
        let changed = 0;
        switch (e.keyCode) {
            case 37: // Left
                changed = merge(0, 1, 4);
                break;
            case 38: // Up
                changed = merge(0, 4, 1);
                break;
            case 39: // Right
                changed = merge(15, -1, -4);
                break;
            case 40: // Down
                changed = merge(15, -4, -1);
                break;
            default:
                return;
        }
        changed && append();
    }
    function init() {
        values.forEach(item => item.value = undefined);
        append(2);
    }

    window.addEventListener("keyup", handleEvent);
    $("#restart").on("click", init);

    init();

})();