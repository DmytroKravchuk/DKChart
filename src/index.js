// import Labels from "./js/labels";
import '@styles/style.scss';

const LABELS_BLOCK_SIZE_COEFFICIENT = 0.2;

function DKChart(props) {
    const {
        id,
        width = 200,
        height = 200,
        padding,
        data = {
            labels: [],
            datasets: []
        },
        circumference = 360,
        cutout = 50,
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
    const canvas = document.getElementById( id );
    const ctx = canvas.getContext( '2d' );
    canvas.setAttribute( 'width', width );
    canvas.setAttribute( 'height', height );

    function validation() {
        return true;
    }

    const isValid = validation();

    function writeEmptyText(txt) {
        ctx.font = '18px Arial, sens-serif';
        const measureText = ctx.measureText( txt );
        const textX = width / 2 - measureText.width / 2;
        ctx.fillText( txt, textX, height / 2 );
    }

    function writeText(txt, x, y, fontSize = "12px", fontFamily = "sens-serif", fontWeight = 300) {
        ctx.font = `${ fontWeight } ${ fontSize } ${ fontFamily }`;
        ctx.fillStyle = labelTextColor;
        ctx.fillText( txt, x, y );
    }

    function getPoint(c1, c2, radius, angle) {
        // c1 and c2 are the coordinates of the center of the arc
        // radius is the arc's radius
        // angle is the last point's angle in radians.
        return {
            x: c1 + Math.cos( angle ) * radius,
            y: c2 + Math.sin( angle ) * radius
        };
    }

    function getRadian(degrees) {
        return degrees * (Math.PI / 180)
    }

    canvas.addEventListener( "click", e => {
        const rect = canvas.getBoundingClientRect();
        const eventX = e.clientX - rect.left;
        const eventY = e.clientY - rect.top;
    } );

    function drawPartArc(radius, x, y, thickness, indexDataset, dataItem, itemIndex, startDeg, circumference) {
        const {background = [], borderWidth = 1, borderColor = []} = dataItem;
        radius -= indexDataset * thickness + borderWidth / 2;
        const radius2 = radius - thickness;
        const {x: arc1X1, y: arc1Y1} = getPoint( x, y, radius, getRadian( startDeg ) );
        const {x: arc2X2, y: arc2Y2} = getPoint( x, y, radius2, getRadian( startDeg + circumference ) );
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor[itemIndex] || "#000";
        ctx.fillStyle = background[itemIndex] || "#ccc";
        ctx.beginPath();
        ctx.arc( x, y, radius, getRadian( startDeg ), getRadian( startDeg + circumference ) );
        ctx.lineTo( arc2X2, arc2Y2 );
        ctx.arc( x, y, radius2, getRadian( startDeg + circumference ), getRadian( startDeg ), true );
        ctx.lineTo( arc1X1, arc1Y1 );
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }

    function drawArcs(radius, x, y) {
        const {datasets} = data;
        const thickness = (radius - (cutout * radius / 100)) / datasets.length;
        datasets.forEach( (dataItem, indexDataset) => {
            const sumDataItem = dataItem.data.reduce( (acc, current) => acc + current, 0 );
            let currentCircumference = 0;
            let startDeg = 180;
            dataItem.data.forEach( (item, itemIndex) => {
                startDeg += itemIndex > 0 ? (dataItem.data[itemIndex - 1] * circumference / sumDataItem) : 0;
                currentCircumference = item * circumference / sumDataItem;
                drawPartArc( radius, x, y, thickness, indexDataset, dataItem, itemIndex, startDeg, currentCircumference )
            } )
        } );
    }

    function _calcLabelsPosition(labels, axis) {
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

    function getLabelParams(labels = []) {
        const labelsParams = {
            spaceSize: 0,
            x: 0,
            y: 0,
        };
        switch (labelPosition) {
            case "left":
                labelsParams.spaceSize = width * LABELS_BLOCK_SIZE_COEFFICIENT;
                labelsParams.x += padding.left;
                labelsParams.y = _calcLabelsPosition( labels, "y" );
                break;
            case "right":
                labelsParams.spaceSize = width * LABELS_BLOCK_SIZE_COEFFICIENT;
                labelsParams.x += width - width * LABELS_BLOCK_SIZE_COEFFICIENT;
                labelsParams.y = _calcLabelsPosition( labels, "y" );
                break;
            case "top":
                labelsParams.spaceSize = height * LABELS_BLOCK_SIZE_COEFFICIENT;
                labelsParams.y += padding.top;
                labelsParams.x = _calcLabelsPosition( labels, "x" );
                break;
            case "bottom":
                labelsParams.spaceSize = height * LABELS_BLOCK_SIZE_COEFFICIENT;
                labelsParams.y += padding.top + width - width * LABELS_BLOCK_SIZE_COEFFICIENT;
                labelsParams.x = _calcLabelsPosition( labels, "x" );
                break;
            default:
                labelsParams.spaceSize = width * LABELS_BLOCK_SIZE_COEFFICIENT;
                break;
        }
        return labelsParams;
    }

    function drawLabel(label, color, x, y) {
        ctx.fillStyle = color;
        ctx.fillRect( x, y, labelWidth, labelHeight );
        const txtX = x + labelWidth + labelTextIndent;
        const txtY = y + labelHeight / 2 + parseFloat( labelFontSize ) / 2 / 2;
        writeText( label, txtX, txtY );
    }

    function setLabels() {
        const {labels, datasets} = data;
        let {x, y} = getLabelParams( labels );
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
            drawLabel( label, color, x, y );
        } )
    }

    function getCalculateArcRadiusAndCoordinates() {
        const {top, right, bottom, left} = padding;
        const arcWidth = width - right - left;
        const arcHeight = height - bottom - top;
        const {spaceSize} = getLabelParams();
        let x;
        let y;
        switch (labelPosition) {
            case "left":
                x = left + (arcWidth + spaceSize) / 2;
                y = top + arcHeight / 2;
                break;
            case "right":
                x = left + (arcWidth - spaceSize) / 2;
                y = top + arcHeight / 2;
                break;
            case "top":
                x = left + arcWidth / 2;
                y = top + (arcHeight + spaceSize) / 2;
                break;
            case "bottom":
                x = left + arcWidth / 2;
                y = top + (arcHeight - spaceSize) / 2;
                break;
            default:
                x = 0;
                y = 0;
        }
        const radius = (Math.min( arcWidth, arcHeight ) - spaceSize) / 2;
        return {
            radius,
            x,
            y
        }
    }

    function draw() {
        const {x, y, radius} = getCalculateArcRadiusAndCoordinates();
        setLabels();
        drawArcs( radius, x, y );
    }

    if (!isValid) {
        writeEmptyText( 'Incorrect data!' );
    } else {
        draw();
    }
}

new DKChart( {
    id: 'dkChart',
    width: 500,
    height: 500,
    data: {
        labels: [ "label1", "label2", "label3", "label4", "5" ],
        datasets: [
            {
                data: [ 50, 100 ],
                background: [ "pink", "orange" ],
                borderWidth: 5,
            },
            {
                data: [ 150, 200 ],
                background: [ "yellow", "purple" ],
                borderWidth: 5,
            },
            {
                data: [ 10, 200 ],
                background: [ 'red', 'green' ],
                borderWidth: 5,
            }
        ]
    },
    padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
    },
    circumference: 320,
    cutout: 60,
    labels: {
        labelPosition: "top",
        labelWidth: 25,
        labelHeight: 15,
        labelFontSize: "14px",
        labelFontWeight: "400",
        labelFontFamily: "Roboto, sens-serif",
        labelTextIndent: 5,
        labelTextColor: "grey"
    }
} );
