function DKChart(props) {
    const {id, width = 200, height = 200, padding, data, circumference = 360, cutout = 50} = props;
    const canvas = document.getElementById( id );
    const ctx = canvas.getContext( '2d' );
    canvas.setAttribute( 'width', width );
    canvas.setAttribute( 'height', height );

    function validation(data) {
        return true;
    }

    const isValid = validation( data );

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

    function drawPartArc(radius, x, y, thickness, indexDataset, dataItem, itemIndex, startDeg, circumference) {
        const {background = [], borderWidth = [], borderColor = []} = dataItem;
        radius -= indexDataset * thickness;
        const radius2 = radius - thickness;
        const {x: arc1X1, y: arc1Y1} = getPoint( x, y, radius, getRadian( startDeg ) );
        const {x: arc2X2, y: arc2Y2} = getPoint( x, y, radius2, getRadian( startDeg + circumference ) );
        ctx.lineWidth = borderWidth[itemIndex] || 0;
        ctx.strokeStyle = borderColor[itemIndex] || background[itemIndex] || "#000";
        ctx.fillStyle = background[itemIndex] || "#ccc";
        ctx.beginPath();
        ctx.arc( x, y, radius, getRadian( startDeg ), getRadian( startDeg + circumference ) );
        ctx.lineTo(arc2X2, arc2Y2);
        ctx.arc( x, y, radius2, getRadian( startDeg + circumference ), getRadian( startDeg ), true );
        ctx.lineTo(arc1X1, arc1Y1);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }

    function drawArcs(radius, x, y) {
        const {datasets} = data;
        const thickness = (radius - (cutout * radius / 100)) / datasets.length;
        datasets.forEach( (dataItem, indexDataset) => {
            const sumDataItem = dataItem.data.reduce((acc, current) => acc + current, 0);
            let currentCircumference = 0;
            let startDeg = 180;
            dataItem.data.forEach( (item, itemIndex) => {
                startDeg += itemIndex > 0 ? (dataItem.data[itemIndex - 1] * circumference / sumDataItem) : 0;
                currentCircumference = item * circumference / sumDataItem;
                drawPartArc( radius, x, y, thickness, indexDataset, dataItem, itemIndex, startDeg, currentCircumference )
            } )
        } );

    }

    if (!isValid) {
        writeEmptyText( 'Incorrect data!' );
    } else {
        function draw() {
            const {top, right, bottom, left} = padding;
            const arcWidth = width - right - left;
            const arcHeight = height - bottom - top;
            const x = left + arcWidth / 2;
            const y = top + arcHeight / 2;
            const radius = Math.min( arcWidth, arcHeight ) / 2;
            drawArcs( radius, x, y )
        }
        draw();
    }
}

const chart = new DKChart( {
    id: 'dkChart',
    width: 500,
    height: 500,
    data: {
        datasets: [
            {
                data: [ 50, 100, 50, 50, 100, 200, 10 ],
                background: [ 'red', 'green', "#ccc", "pink", "orange", "yellow", "purple" ],
            },
            {
                data: [ 150, 200 ],
                background: [ 'red', 'green' ],
                borderWidth: [5,5],
                borderColor: ["black", "brown"]
            },
            {
                data: [ 10, 200 ],
                background: [ 'red', 'green' ]
            }
        ]
    },
    padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
    },
    circumference: 150,
    cutout: 60,
} );
