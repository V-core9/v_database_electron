const v_db = require('v_database');

types = async () => {
    const typeList = await v_db.type.view();
    var resp = '';
    typeList.forEach(element => {
        resp += `<type>${element}</type>`;
    });
    document.querySelector('explorer navigation content').innerHTML = resp;
};

items = async (e) => {
    var name = e.target.innerText;
    const resp = await v_db.type.view(name);
    console.log(resp);
    var resp_string = `<header><h2>Location: [root]/${name}/</h2></header><content>`;
    resp.forEach(element => { resp_string += `<item><name>${element}</name><actions><v_btn type='warn'>📑</v_btn><v_btn type='error'>❌</v_btn></actions></item>`; });
    resp_string += `</content>`;
    document.querySelector('editor > content').innerHTML = resp_string;
};

new_type = async () => {
    const resp = await v_db.type.new(document.querySelector('#new_type').value);
    await types();
};

v_page = async () => {
    document.querySelector("v_page").innerHTML = `${await explorer.render()}`;
    await types();
};

newModal = async (data) => {
    document.querySelector("explorer").innerHTML += `<v_modal>${data}</v_modal>`;
};

newTypeForm = async () => {

    var testElem = document.querySelector('new_type_form');

    if (testElem) {
        testElem.parentNode.remove();
    }

    newModal(`<new_type_form>
            <header>
                <h2>New Type</h2>
            </header>
            <content>
                <input type="text" id="new_type" placeholder="new_type_name"/>
                <v_btn action="new_type">Create</v_btn>
            </content>
        </new_type_form>`);
};

const explorer = {
    head: async () => {
        return `<header>
        <title>
            V_DB Explorer
        </title>
        <options>
            <v_btn action="new_type_form">New Type</v_btn>
        </options>
    </header>`;
    },

    nav: async () => {
        return `<navigation>
    <header>
        <h2>Navigation [types]</h2>
    </header>
    <content>
    </content>
</navigation>`;
    },

    content: async () => {
        return `<content></content>`;
    },

    footer: async () => {
        return `<footer></footer>`;
    },
    
    render: async () => {
        return `
        <explorer>
            ${await explorer.head()}
            <editor>
            ${await explorer.nav()}
            ${await explorer.content()}
            </editor>
            ${await explorer.footer()}
        </explorer>`;
    }
};


window.addEventListener('DOMContentLoaded', async () => {
    await v_page();
});

window.addEventListener('click', async (e) => {
    if (e.target.getAttribute('action') === 'new_type_form') await newTypeForm();
    if (e.target.getAttribute('action') === 'new_type') await newType();
    if (e.target.tagName === 'TYPE') await items(e);
});