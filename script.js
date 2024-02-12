// JavaScript for color scheme changer
document.getElementById('colorSelector').addEventListener('change', function() {
    const color = this.value;
    changeColorScheme(color);
});

function changeColorScheme(color) {
    const body = document.body;
    const oldColor = body.className;
    body.classList.remove(oldColor);
    body.classList.add(color);

    // Change button and slider colors
    const primaryBtn = document.getElementById('primaryBtn');
    const secondaryBtn = document.getElementById('secondaryBtn');
    const formRange = document.getElementById('formRange');

    primaryBtn.classList.remove('btn-' + oldColor);
    primaryBtn.classList.add('btn-' + color);

    secondaryBtn.classList.remove('btn-' + oldColor);
    secondaryBtn.classList.add('btn-' + color);

    formRange.classList.remove('range-' + oldColor);
    formRange.classList.add('range-' + color);
}
