const v_db = require('v_database');

var selected_type = null;

types = async () => {
    const typeList = await v_db.type.view();
    var resp = '';
    typeList.forEach(element => {
        resp += `<type>${element}</type>`;
    });
    document.querySelector('explorer navigation content').innerHTML = resp;
};

items = async (e) => {
    var name = ( typeof e === 'string') ? e :  e.target.innerText;
    selected_type = name;
    
    const resp = await v_db.type.view(name);
    var resp_string = `<header><h2>Location: [root]/${name}/</h2><options><v_btn action='new_item_form' type="success">+</v_btn></options></header><content>`;
    resp.forEach(element => { resp_string += `<item name="${element}"><header><name action="quick_edit_item">${element}</name><actions><v_btn type='warn' action='edit_item'>📑</v_btn><v_btn type='error' action='delete_item'>❌</v_btn></actions></header><content></content></item>`; });
    resp_string += `</content>`;
    document.querySelector('editor > content').innerHTML = resp_string;
};

delete_item = async (e) => {
    var name = e.target.parentNode.parentNode.parentNode.getAttribute('name');
    await v_db.item.del(selected_type, name);
    await items(selected_type);
};

new_item_form = async () => {

    var testElem = document.querySelector('new_type_form');

    if (testElem) {
        testElem.parentNode.remove();
    }

    modal(`<new_item_form>
            <header>
                <h2>New Item</h2>
            </header>
            <content>
                <block>
                    <label for="new_item_content">Content</label>

                    <textarea id="new_item_content" name="new_item_content" rows="8" cols="50">
{
    "name": "new_item",
    "type": "new_type",
    "content": {
        "new_item_content": "new_item_content"
    }
}
                    </textarea>
                </block>
                <block>
                    <label for="new_item_id">Content</label>
                    <input type="text" id="new_item_id" placeholder="new_type_name"/>
                </block>
                <v_btn action="new_item">Create</v_btn>
            </content>
        </new_item_form>`);
};

//? New Type
new_item = async (e) => {
    const id = document.querySelector('#new_item_id').value;
    const resp = await v_db.item.new(selected_type, JSON.parse(document.querySelector('#new_item_content').value), (id)? id : undefined);
    await items(selected_type);
    await remove_modal();
};

//? New Type
new_type = async (e) => {
    const resp = await v_db.type.new(document.querySelector('#new_type').value);
    await types();
    await remove_modal();
};

new_type_form = async (e) => {

    var testElem = document.querySelector('new_type_form');

    if (testElem) {
        testElem.parentNode.remove();
    }

    modal(`<new_type_form>
            <header>
                <h2>New Type</h2>
            </header>
            <content>
                <input type="text" id="new_type" placeholder="new_type_name"/>
                <v_btn action="new_type">Create</v_btn>
            </content>
        </new_type_form>`);
};
//!EOF

remove_quick_edit_item = async (e) => {
    var name = e.target.innerText;
    e.target.setAttribute('action', 'quick_edit_item');
    document.querySelector(`item[name='${name}'] content`).innerHTML = '';
};

quick_edit_item = async (e) => {
        var name = e.target.innerText;
        //console.log(selected_type, name);
        const resp = await v_db.item.view(selected_type, name);
        
        e.target.setAttribute('action', 'remove_quick_edit_item');
        document.querySelector(`item[name='${name}'] content`).innerHTML = `<pre>${JSON.stringify(resp, true, 2)}</pre>`;
};


v_page = async () => {
    document.querySelector("v_page").innerHTML = `${await explorer.render()}`;
    await types();
};

remove_modal = async (e) => {
    document.querySelector('v_modal').remove();
};

modal = async (data, options = {overlay_close: true, close_btn: true, close_btn_pos: "tr"}) => {
    var {overlay_close, close_btn, close_btn_pos} = options;
    document.querySelector("explorer").innerHTML += `<v_modal><overlay ${(overlay_close===true)? "action='remove_modal'" : ''}></overlay><inner>${(close_btn === true)?'<v_btn action="remove_modal" position="'+close_btn_pos+'">X</v_btn>':''}${data}</inner></v_modal>`;
};

const explorer = {
    head: async () => {
        return `<header>
                    <header>
                        <h2>V_DB Explorer</h2>
                    </header>
                    <options>
                        <v_btn action="new_type_form">Create Table</v_btn>
                    </options>
                </header>`;
    },

    nav: async () => {
        return `<navigation>
                    <header>
                        <header >
                            <h2>Tables</h2>
                        </header>
                        <options>
                            <v_btn action="new_type_form">+</v_btn>
                        </options>
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

const actions = {
    new_type_form,
    new_type,
    new_item_form,
    new_item,
    quick_edit_item,
    remove_quick_edit_item,
    remove_modal,
    delete_item
};

window.addEventListener('click', async (e) => {
    var action = e.target.getAttribute('action');
    if (typeof actions[action] === 'function') await actions[action](e);
    if (e.target.tagName === 'TYPE') await items(e);
});

window.addEventListener('DOMContentLoaded', async () => {
    await v_page();
});