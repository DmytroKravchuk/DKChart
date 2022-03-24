export function writeText({
                              ctx,
                              color,
                              txt,
                              x,
                              y,
                              fontSize = "12px",
                              fontFamily = "sens-serif",
                              fontWeight = 300
                          }) {
    ctx.font = `${ fontWeight } ${ fontSize } ${ fontFamily }`;
    ctx.fillStyle = color;
    ctx.fillText( txt, x, y );
}