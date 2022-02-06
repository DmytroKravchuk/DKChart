import { LABELS_BLOCK_SIZE_COEFFICIENT } from "./constants";
import { writeText } from "./utils";

function Label({ctx, props}) {
    const {
        width = 200,
        height = 200,
        padding,
        data = {
            labels: [],
            datasets: []
        },
        labels: {
            labelWidth = 15,
            labelHeight = 15,
            labelPosition = "right",
            labelFontSize = "12px",
            labelFontWeight = 400,
            labelFontFamily = "sens-serif",
            labelTextIndent = 5,
            labelTextColor = "grey",
        }
    } = props;

    function _calcLabelsPosition({labels, axis}) {
        ctx.font = `${ labelFontWeight } ${ labelFontSize } ${ labelFontFamily }`;

        const xLabelsSum = labels.reduce( (acc, current) => {
            return acc + ctx.measureText( current ).width + labelWidth + labelTextIndent;
        }, 0 );

        switch (axis) {
            case "y":
                return width / 2 - (labels.length * (labelHeight + labelTextIndent) / 2);
            case "x":
                return height / 2 - (xLabelsSum / 2);
            default:
                return 0;
        }
    }

    function _drawLabel({label, color, x, y}) {
        ctx.fillStyle = color;
        ctx.fillRect( x, y, labelWidth, labelHeight );
        const txtX = x + labelWidth + labelTextIndent;
        const txtY = y + labelHeight / 2 + parseFloat( labelFontSize ) / 2 / 2;
        writeText( {
            ctx,
            color: labelTextColor,
            txt: label,
            x: txtX,
            y: txtY,
        } );
    }

    function getLabelParams({labels = []}) {
        const labelsParams = {
            spaceSize: 0,
            x: 0,
            y: 0,
        };

        switch (labelPosition) {
            case "left":
                labelsParams.spaceSize = width * LABELS_BLOCK_SIZE_COEFFICIENT;
                labelsParams.x += padding.left;
                labelsParams.y = _calcLabelsPosition( {labels, axis: "y"} );
                break;
            case "right":
                labelsParams.spaceSize = width * LABELS_BLOCK_SIZE_COEFFICIENT;
                labelsParams.x += width - width * LABELS_BLOCK_SIZE_COEFFICIENT;
                labelsParams.y = _calcLabelsPosition( {labels, axis: "y"} );
                break;
            case "top":
                labelsParams.spaceSize = height * LABELS_BLOCK_SIZE_COEFFICIENT;
                labelsParams.y += padding.top;
                labelsParams.x = _calcLabelsPosition( {labels, axis: "x"} );
                break;
            case "bottom":
                labelsParams.spaceSize = height * LABELS_BLOCK_SIZE_COEFFICIENT;
                labelsParams.y += padding.top + width - width * LABELS_BLOCK_SIZE_COEFFICIENT;
                labelsParams.x = _calcLabelsPosition( {labels, axis: "x"} );
                break;
            default:
                labelsParams.spaceSize = width * LABELS_BLOCK_SIZE_COEFFICIENT;
                break;
        }
        return labelsParams;
    }

    function setLabels() {
        const {labels, datasets} = data;
        let {x, y} = getLabelParams( {labels} );
        labels.forEach( (label, index) => {
            const color = datasets[0]?.background[index];
            if ((labelPosition === "left" || labelPosition === "right") && index !== 0) {
                y += (labelHeight + labelTextIndent);
            }
            if ((labelPosition === "top" || labelPosition === "bottom") && index !== 0) {
                x += (labelWidth + labelTextIndent);
                if (index > 0) {
                    x += ctx.measureText( labels[index - 1] ).width + labelTextIndent;
                }

            }
            _drawLabel( {label, color, x, y} );
        } )
    }

    return {
        getLabelParams,
        setLabels
    }
}

export default Label;