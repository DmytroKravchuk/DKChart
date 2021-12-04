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

    function drawPartArc(radius, x, y, thickness, index, background) {
        ctx.beginPath();
        const startDeg = 180;
        radius -= index * thickness;
        ctx.arc( x, y, radius, getRadian( startDeg ), getRadian( startDeg + circumference ) );
        const {pointX, pointY} = getPoint( x, y, radius, getRadian( 360 ) );
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    function drawArcs(radius, x, y) {
        const {datasets} = data;
        const thickness = (radius - (cutout * radius / 100)) / datasets.length;
        datasets.forEach( (dataItem, index) => {
            dataItem.data.forEach( (item, i) => {
                const {background} = dataItem;
                drawPartArc( radius, x, y, thickness, index, background[i] )
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
                data: [ 50, 100 ],
                background: [ 'red', 'green' ]
            },
            {
                data: [ 150, 200 ],
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
    cutout: 80,
} );
