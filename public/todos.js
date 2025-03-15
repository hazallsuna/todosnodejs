
$(document).ready(function () {
    const API_URL = "http://localhost:3000/todos"; //json-server api
    let editingId = null; //editlenecek taskın idsini tutuyor

    //tüm todoları yükle
    function fetchTodos(filter = "all") {
        $.get(API_URL, function (data) {
            $(".todo-list").empty();
            data.forEach(todo => {
                if (filter === "done" && !todo.completed) return;
                if (filter === "todo" && todo.completed) return;

                $(".todo-list").append(`
                    <li data-id="${todo.id}" class="${todo.completed ? 'completed' : ''}">
                        <input type="checkbox" class="toggle-status" ${todo.completed ? 'checked' : ''}>
                        <span class="task-text">${todo.task}</span>
                        <div class="actions">
                            <button class="edit-task"><img src="/images/edit.png" alt="Edit"></button>
                            <button class="delete-task"><img src="/images/delete.png" alt="Delete"></button>
                        </div>
                    </li>
                `);
            });
        });
    }

    //add task için popup
    $("#show-add-task").click(function () {
        $("#task-popup input").val("");
        $("#task-popup").fadeIn();
        editingId = null;//yeni task ekleme
    });

    //popup kapat
    $(".cancel-popup-task").click(function () {
        $("#task-popup, #edit-popup").fadeOut();
    });

    //yeni task ekle
    $("#add-popup-task").click(function () {
        const task = $("#popup-task-input").val().trim();
        if (task) {
            $.ajax({
                url: API_URL,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ task: task, completed: false }),
                success: function () {
                    fetchTodos();
                    $("#popup-task-input").val(""); 
                    $("#task-popup").fadeOut(); 
                }
            });
        } else {
            alert("Task cannot be added!");
        }
    });

    //task silme
    $(document).on("click", ".delete-task", function () {
        const id = $(this).closest("li").data("id");
        $.ajax({
            url: `${API_URL}/${id}`,
            type: "DELETE",
            success: function () {
                fetchTodos();
            }
        });
    });

    //edit buton popup 
    $(document).on("click", ".edit-task", function () {
        editingId = $(this).closest("li").data("id");
        const currentText = $(this).closest("li").find(".task-text").text().trim();
        $("#edit-popup input").val(currentText);
        $("#edit-popup").fadeIn();
    });

    
    $("#edit-popup-task").click(function () {
        const updatedTask = $("#edit-popup-input").val().trim();
        if (updatedTask && editingId) {
            $.ajax({
                url: `${API_URL}/${editingId}`,
                type: "PATCH",
                contentType: "application/json",
                data: JSON.stringify({ task: updatedTask }),
                success: function () {
                    $("#edit-popup").fadeOut();
                    setTimeout(() => { 
                       alert("Task successfully updated!"); 
                    }, 100);  
                    fetchTodos();
                }           
            });
        }
    });

    //tik olanları güncelle
    $(document).on("change", ".toggle-status", function () {
        const id = $(this).closest("li").data("id");
        const completed = $(this).prop("checked");
    
        $.get(`${API_URL}/${id}`, function (todo) {
            todo.completed = completed; //sadece completed değerini değiştir
    
            $.ajax({
                url: `${API_URL}/${id}`,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(todo), 
                success: function () {
                    fetchTodos();
                }
            });
        });
    });
    
    //dropdown ile filtreleme
    $("#filter-tasks").change(function () {
        const filter = $(this).val();
        fetchTodos(filter);
    });

    //sayfa açıldıgında todolar yüklenir
    fetchTodos();
});
