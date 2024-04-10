(function() {
    let arr = [],
        listName = ''

    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let button = document.createElement('button');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let form = document.createElement('form');

        button.classList.add('btn', 'btn-primary');
        input.classList.add('form-control');
        buttonWrapper.classList.add('input-group-append');
        form.classList.add('input-group', 'mb-3');
        button.textContent = 'Добавить дело';
        button.disabled = true;
        input.placeholder = 'Введите название дела';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener('input', function() {
            if (input.value !== '') {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(obj) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let deleteButton = document.createElement('button');
        let doneButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        buttonGroup.classList.add('btn-group', "btn-group-sm");
        deleteButton.classList.add('btn', "btn-danger");
        doneButton.classList.add('btn', "btn-success");

        item.textContent = obj.name;
        doneButton.textContent = 'Готово';
        deleteButton.textContent = 'Удалить';
        //Некоторые условия и обработчики
        if (obj.done == true) item.classList.add('list-group-item-success')

        deleteButton.addEventListener('click', function() {
            if (confirm('Are you sure 100%?')) {
                item.remove()

                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].id == obj.id) arr.splice(i, 1);
                }

                saveList(arr, listName)
            };
        });

        doneButton.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success');

            for (const listItem of arr) {
                if (listItem.id == obj.id) listItem.done = !listItem.done //на противоположный
            }

            saveList(arr, listName)
        });

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            doneButton,
            deleteButton,
            item,
        };
    };

    function getNewID(arr) {
        let max = 0;
        for (const item of arr) {
            if (item.id > max) max = item.id
        }
        return max + 1
    }

    function saveList(arr, keyName) {
        localStorage.setItem(keyName, JSON.stringify(arr))
    }

    function createTodoApp(container, title = 'Наши заметочки', keyName) {
        //Создаем событие по нажатию кнопок
        let todoAppTitle = createAppTitle(title);
        let todoList = createTodoList();
        let todoItemForm = createTodoItemForm();

        //Делаем наш keyName глобальной переменной
        listName = keyName; // Используем как ключ для определённой страницы

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        let localData = localStorage.getItem(listName)

        //Если не пустой, пробегаемся по массиву и реализуем его при обновлении

        if (localData !== null && localData !== '') arr = JSON.parse(localData)

        for (const itemList of arr) {
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);
        }

        todoItemForm.form.addEventListener('submit', function(e) {
            //Предотвращаем перезагрузку страницы браузера
            e.preventDefault();

            //Игнорируем если поле ввода пустое
            if (!todoItemForm.input.value) {
                return;
            }

            //Создаём объект
            let newItem = {
                id: getNewID(arr),
                name: todoItemForm.input.value,
                done: false,
            }

            //Создаём элемент списка
            let todoItem = createTodoItem(newItem);

            todoList.append(todoItem.item);

            arr.push(newItem);
            saveList(arr, listName);

            //Clean our input field
            todoItemForm.input.value = '';

            //Первоначальное значение для кнопки
            todoItemForm.button.disabled = true;
        });
    }

    window.createTodoApp = createTodoApp;
})();