export default function Tooltip({ctx, props}) {
    function showTooltip({x, y, pathList}) {
        pathList.forEach(({path, dataItem}) => {
            if(ctx.isPointInPath(path, x, y, "evenodd")) {
                console.log(dataItem);
            }
        })
    }

    return {
        showTooltip
    }
}
