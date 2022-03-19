import '@styles/style.scss';

import Label from "./js/labels";
import Tooltip from "./js/tooltip";

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
            labelPosition = "right",
        }
    } = props;

    const canvas = document.getElementById( id );
    const ctx = canvas.getContext( '2d' );
    const pathList = [];

    canvas.setAttribute( 'width', width );
    canvas.setAttribute( 'height', height );

    const label = new Label( {ctx, props} );
    const tooltip = new Tooltip( {ctx, props} );

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

    canvas.addEventListener( "mousemove", e => {
        const rect = canvas.getBoundingClientRect();
        const eventX = e.clientX - rect.left;
        const eventY = e.clientY - rect.top;

        tooltip.showTooltip( {x: eventX, y: eventY, pathList} );
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
        const path = new Path2D();
        path.arc( x, y, radius, getRadian( startDeg ), getRadian( startDeg + circumference ) );
        path.lineTo( arc2X2, arc2Y2 );
        path.arc( x, y, radius2, getRadian( startDeg + circumference ), getRadian( startDeg ), true );
        path.lineTo( arc1X1, arc1Y1 );
        path.closePath();
        ctx.stroke( path );
        ctx.fill( path );
        ctx.restore();
        pathList.push( {path, dataItem, itemIndex} );
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
                drawPartArc( radius, x, y, thickness, indexDataset, dataItem, itemIndex, startDeg, currentCircumference );
            } )
        } );
    }

    function getCalculateArcRadiusAndCoordinates() {
        const {top, right, bottom, left} = padding;
        const arcWidth = width - right - left;
        const arcHeight = height - bottom - top;
        const {spaceSize} = label.getLabelParams( {} );
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
        label.setLabels();
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
