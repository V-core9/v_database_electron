const fs = require('fs');

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type]);
    }

    document.querySelector('v_page').innerHTML += `<pre>${JSON.stringify(process, true, 4)}</pre>`;
});

window.addEventListener('click',(e)=>{

    fs.writeFileSync('test.txt',document.querySelector('v_page').innerHTML);
    console.log(e);
});