$(document).ready(function () {
    let token = sessionStorage.getItem("token");
    var addTask = $("#addTask");
    var addBtn = $("#addBtn");
    var ulTaskList = document.getElementById("taskList");
    var ulCompleted = document.getElementById("taskCompleted");
    var lastTaskId;
    var text = addTask.innerText

    $.ajax({
        url : url + '/api/list',
        method: 'POST',
        async : false,
        headers : {
            'Authorization': 'Bearer ' + token
        },
        success: function (response, status){
            let data = response.data;
            sessionStorage.setItem('taskList', JSON.stringify(data));
            lastTaskId= (data[(data.length)-1].id)+1;
        }
    });
    function firstMakeList(){
        let data = JSON.parse(sessionStorage.getItem("taskList"));

        data.forEach(function (item)
        {
            let li = document.createElement("li");
            li.className="taskListLi list-group-item list-group-item-dark list-group-item-action ";
            let inputCheck= document.createElement("input");
            inputCheck.setAttribute("type", "checkbox");
            let label = document.createElement("label");
            let iElement = document.createElement("i");
            iElement.className = "fa fa-trash float-right fa-2x text-primary";

            li.id= "li-" + item.id;
            inputCheck.id = "check-" + item.id;
            label.setAttribute("for", "check-" + item.id);
            label.innerText = item.task_name;
            iElement.id = "i-" + item.id;
            li.append(inputCheck, label, iElement);
            if (item.task_status == 0){
                ulTaskList.append(li);
            }
            else if (item.task_status == 1){
                ulCompleted.append(li);
            }
        });
    };
    firstMakeList();
    addBtn.click(function () {
        if (addTask.val().trim() == '') {
            Swal.fire({
                icon: 'info',
                title: 'Uyarı',
                text: 'Lütfen Eklenecek Task Name Giriniz..',
                confirmButtonText: 'Tamam',
                confirmButtonColor: '#56b545'
            });
        }
        else {
            $.ajax({
                url : url + '/api/add-task',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                method: 'POST',
                data: {
                    task_name: addTask.val()
                },
                async: false,
                success: function (response, status) {

                    addTaskList();
                }
            });
        }
    });
    function addTaskList(){

        let li = document.createElement("li");
        li.className="taskListLi list-group-item list-group-item-dark list-group-item-action ";
        let inputCheck= document.createElement("input");
        inputCheck.setAttribute("type", "checkbox");
        let label = document.createElement("label");
        let iElement = document.createElement("i");
        iElement.className = "fa fa-trash float-right fa-2x text-primary";

        li.id= "li-" + lastTaskId.id;
        inputCheck.id = "check-" + lastTaskId.id;
        label.setAttribute("for", "check-" + lastTaskId.id);

        label.innerText = text;
        iElement.id = "i-" + lastTaskId.id;
        li.append(inputCheck, label, iElement);
        ulTaskList.append(li);

    };
    $("li label").click(function (){
        var liId= this.htmlFor;
        var result = liId.toString();
        result = result.split('-');
        var id = result[1];
        console.log(id);

         Swal.fire({
            title: 'Güncelleme',
            input: 'text',
            inputPlaceholder: 'Task Name Giriniz..'
        })
             .then(value => {
                 var input=value.value;
                 // console.log(input);
                 $.ajax({
                     url : url + '/api/edit-task/' + id,
                     headers: {
                         'Authorization': 'Bearer ' + token
                     },
                    data: {
                         task_name: input
                    },
                     method: 'POST',
                     async: false,
                     success: function (response, status) {
                         console.log(response);
                         var forId= "check-" + id;
                         forId= forId.toString();
                         var labels= document.getElementsByTagName("LABEL");
                         console.log(labels);
                         for (var i=0; i<labels.length; i++){
                             if(labels[i].htmlFor == forId){
                                 console.log(labels[i].innerHTML=input);
                             }
                         }
                     }
                 });
             });
    });
    $("#taskList li i").click(function (){

        Swal.fire({
            title: 'Silmek istediğinize emin misiniz?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Hayır',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet'
        }).then((result) => {
            if (result.isConfirmed) {

                var list= document.getElementById("taskList");
                var elementId= this.id;
                var result= elementId.toString();
                result= result.split('-');
                var id= result[1];

                var liElementId= "li-" + result[1];

                $.ajax({
                    url : url + '/api/delete-task/' + id,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    method: 'POST',
                    async: false,
                    success: function (response, status){
                        var x= document.getElementById(liElementId);
                        list.removeChild(x);
                    }

                });
            }
        });
    });
    $("#completed").click(function (){

        var selected= new Array();

        $('#taskList :checked').each(function (item) {

            var elementId=this.id;
            var result= elementId.toString();
            result= result.split("-");
            var id= result[1];
            console.log(elementId);
            selected[item]=id;
            console.log(selected);

        });

        $.ajax({
            url : url + '/api/completed-task',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                completedTaskList: selected
            },
            method: 'POST',
            async: false,
            success: function (response, status){

                console.log(response);
            }
        });
    });
    $("#undoTask").click(function (){

        var selected= new Array();
        $('#taskCompleted :checked').each(function (item){
            var elementId=this.id;
            var result= elementId.toString();
            result= result.split("-");
            var id= result[1];
            selected[item]=id;
        });

        $.ajax({

           url : url + '/api/undo-completed-task',
            headers:{
                'Authorization': 'Bearer ' + token
            },
            data :{
                undoCompletedTaskList : selected
            },
            method: 'POST',
            async: false,
            success: function (response, status){
               console.log(response);
            }
        });
    });
    $("#clearTask").click(function (){

        $.ajax({
            url: url + '/api/clear-task-list',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            method: 'POST',
            async: false,
            success: function (response, status){
                console.log(response);
            }
        });
    });
    $("#fullSelect").click(function (){
       $("#taskList input").each(function (item){
           $(this).attr("checked",status);
       });
    });
    $("#listRemove").click(function (){
       $('#taskList :checked').each(function (item){
           var elementId=this.id;
           var result= elementId.toString();
           result= result.split("-");
           var liElementId= "li-" + result[1];
           var x=document.getElementById(liElementId);
           ulTaskList.removeChild(x);
       });
    });

});