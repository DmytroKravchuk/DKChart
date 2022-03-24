export default function Tooltip({ctx}) {
    const div = document.createElement('div');
    div.classList.add("dk-chart-tooltip");
    document.body.append(div);

    function showTooltip({x, y, pathList}) {
        const {offsetLeft, offsetTop} = ctx.canvas;
        let isPointInFigure = false;

        pathList.forEach(({path, dataItem, itemIndex}) => {
            if (ctx.isPointInPath(path, x, y, "evenodd")) {
                isPointInFigure = true;
                const top = y + offsetTop + 10;
                const left = x + offsetLeft + 10;
                const {data} = dataItem;
                div.innerText = data[itemIndex];
                div.style.top = `${top}px`;
                div.style.left = `${left}px`;
                div.classList.add("active");
            }
            if (!isPointInFigure) {
                div.classList.remove("active");
            }
        })
    }

    return {
        showTooltip
    }
}
