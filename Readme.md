<b>How to use:</b>
</br>
Example:
</br>
</br>
new DKChart( {

    id: 'dkChart', width: 500, height: 500, 
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
                borderWidth:5,
            }
        ]
    },
    padding: { top: 10, right: 10, bottom: 10, left: 10, },
    circumference: 320,
    cutout: 60,
    labels: { 
        labelPosition: "top",
        labelWidth: 25,
        labelHeight: 15,
        labelFontSize: "14px",
        labelFontWeight: "400",
        labelFontFamily: "Roboto,sens-serif",
        labelTextIndent: 5,
        labelTextColor: "grey"
    }
} );