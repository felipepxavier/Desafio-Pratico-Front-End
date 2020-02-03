

    const form = document.querySelector("#form");
    const formUp = document.querySelector("#form-update");
    const allFields = document.querySelectorAll('#form input, #form select');
    const resDelete = document.querySelector('.res-yes');
    let data = {};
    const table = document.querySelector('table');

    /**executar funcao de estilização após o carregamento da página */
    window.addEventListener("load", function() {
            loadStyles();
        }
    );


    /** função necessária para estilizar as rows inseridas via javascript */
    function loadStyles() {
        const btns = document.querySelectorAll('.btn-danger');
        const btnsUp = document.querySelectorAll('.btn-secondary');

        let btnDel = Array.from(btns);
        let btnUp = Array.from(btnsUp);

        btnDel.forEach(btn => {
            btn.parentNode.style.backgroundColor="#f56161"
        });

        btnUp.forEach(btn => {
            btn.parentNode.style.backgroundColor="#fd9f69"
        });
    }


    /* personaliza a validação padrão dos campos[inputs] obrigatórios */
    allFields.forEach(field => {
        field.oninvalid = function(event) {  
            event.preventDefault();
            const target = event.target;

            if (!this.validity.valid) {
                target.classList.add('invalid');
                target.nextElementSibling.innerText = target.validationMessage;
            }
        };
    });


    /** remove todas as linhas da tabela */
    function removeAll() {
        var rowCount = table.rows.length;
        for (var i = rowCount - 1; i > 0; i--) {
            table.deleteRow(i);
        }
    }


    /** salva os dados modificados dos inputs na variável 'data' e valida/personaliza os campos obrigatórios */
    function handleChange(event) {
        event.preventDefault();

        const target = event.target;
        data[target.name] = target.value;

        if (!target.checkValidity()) {
            target.classList.add('invalid');
            target.nextElementSibling.innerText = target.validationMessage;
        }
    }

    form.addEventListener('change', handleChange);


    /** salva os dados modificados dos inputs na variável 'data' e valida os campos obrigatórios */
    function handleChangeUp(event) {
        event.preventDefault();

        const target = event.target;
        const nameField = target.name;
        const renameField = nameField.replace(/-up/, '');
    
        data[renameField] = target.value;
    
        if (!target.checkValidity()) {
            target.classList.add('invalid');
            target.nextElementSibling.innerText = target.validationMessage;
        }
    }

    formUp.addEventListener('change', handleChangeUp);


    /** altera a row corrente */
    function alterValueStorage(data) {

        const newIndex = data.index;
        let items = [];
        let listStorage = localStorage.getItem('LIST_PROD');
    
        items = JSON.parse(listStorage);
        items.splice(newIndex, 1);
        items.push(data);
        
        localStorage.setItem('LIST_PROD', JSON.stringify(items));
    
        removeAll();
        setValuesTable();    
    }

    /** insere os dados no array de objetos no localStorage */
    function setValueStorage(data) {
   
        //busca o array de objectos anterior
        let list = localStorage.getItem('LIST_PROD');

        if (!data.index){
            if (list) {
                list = JSON.parse(list)
            } else {
                list = [];
            }
        
            list.push(data);
            localStorage.setItem('LIST_PROD', JSON.stringify(list));
        }  
    }


     /** seta os dados da row corrente nos campos do formulário de atualização */
     function setValueUpdate(index) {
        let items = [];

        let list = localStorage.getItem('LIST_PROD');
        items = JSON.parse(list)
        let newIndex = index;
    
        const itemUpdate = items.find((element, index) => index === newIndex);
        data = { ...itemUpdate, index: newIndex };
        console.log(itemUpdate)
        
       if (itemUpdate) {
            document.querySelector('#code-up').value = itemUpdate.code;
            document.querySelector('#category-up').value = itemUpdate.category;
            document.querySelector('#name-up').value = itemUpdate.name;
            document.querySelector('#provider-up').value = itemUpdate.provider;
            document.querySelector('#price-up').value = itemUpdate.price;
       }
    }
   

    /** insere os dados do localStorage nas rows da tabela e insere os botões de ações*/
    function setValuesTable() {
        let listProd = localStorage.getItem('LIST_PROD');
    
        if (listProd) {
            listProd = JSON.parse(listProd)
        } else {
            listProd = [];
        }

        listProd.map((item, index) => {
            const row = table.insertRow(1);
    
            const cellObject = {
                code: row.insertCell(0),
                category: row.insertCell(1),
                name: row.insertCell(2),
                provider: row.insertCell(3),
                price: row.insertCell(4),
                actionDel: row.insertCell(5),
                actionUp: row.insertCell(6)
            }

            const btnRemove = document.createElement("button");
            btnRemove.textContent = 'Deletar';
            btnRemove.className = 'btn btn-danger';

            btnRemove.setAttribute("data-toggle", "modal");
            btnRemove.setAttribute("data-target", "#modalDelete");

            let getActionDel = `removeValue(${index})`;
            btnRemove.setAttribute("onClick", getActionDel);
            cellObject.actionDel.innerHTML = btnRemove.outerHTML;

            const btnUpdate = document.createElement("button");
            btnUpdate.textContent = 'Editar';
            btnUpdate.className = 'btn btn-secondary';

            btnUpdate.setAttribute("data-toggle", "modal");
            btnUpdate.setAttribute("data-target", "#modalUpdate");

            let getActionUp = `setValueUpdate(${index})`;
            btnUpdate.setAttribute("onClick", getActionUp);
            cellObject.actionUp.innerHTML = btnUpdate.outerHTML;
            
            for (let [key, value] of Object.entries(item)) {
                if(cellObject[key]){
                    cellObject[key].innerHTML = `${value}`;
                }
            }
        });
    }
    setValuesTable();


    /** insere os dados na função setValueStorage e atualiza os dados do localStorage na tabela  */
    function handleSubmit(event) {
        event.preventDefault();

        setValueStorage(data);
        removeAll();
        setValuesTable();
        loadStyles();
    }

    form.addEventListener('submit', handleSubmit);


    /** insere os dados na função alterValueStorage e atualiza os dados do localStorage na tabela */
    function handleSubmitUp(event) {
        alterValueStorage(data);
        loadStyles();
    }


    /** remove a row corrente */
    function removeValue(index) {
        resDelete.onclick = function() {
            let items = [];
            let listProd = localStorage.getItem('LIST_PROD');
        
            items = JSON.parse(listProd);
            items.splice(index, 1);
            localStorage.setItem('LIST_PROD', JSON.stringify(items));
        
            removeAll();
            setValuesTable();
            loadStyles();
        }
    }