Date.prototype.toDateInputValue = function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
};

$(document).on("click", "#add_entity", () => {
    $(".add_entity").modal("show");
});

const addEntity = (data) => {
    var settings = {
        url: `http://${ip}:3000/entity`,
        method: "POST",
        timeout: 0,
        data: data,
    };

    $.ajax(settings).done(function (responseText) {
        Swal.fire({
            title: "Entity added successfully!",
            text: responseText.message,
            icon: "success",
            confirmButtonText: "ok",
        }).then(() => {
            location.reload();
        });
    });
};

$(document).on("click", "#e_add", () => {
    let e_name = $("#e_name").val().toString();
    let e_status = $("#e_status").val().toString();
    let e_add_date = $("#e_add_date").val().toString();
    let e_update_date = $("#e_update_date").val().toString();
    if (
        e_name == "" ||
        e_status == "" ||
        e_add_date == "" ||
        e_update_date == ""
    ) {
        Swal.fire("Please fill all fields");
        return;
    }
    const data = {
        nom: `${e_name}`,
        status: `${e_status}`,
        date_add: `${e_add_date}`,
        date_update: `${e_update_date}`,
    };
    addEntity(data);
    $(".add_entity").modal("hide");
});