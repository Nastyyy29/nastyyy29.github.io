$(document).ready(function () {
  // Изначально скрываем кнопку загрузки
  $("#loadData").hide();

  // Проверяем наличие данных при загрузке страницы
  checkDataExists();

  // Функция проверки наличия данных
  function checkDataExists() {
    $.ajax({
      url: "/check",
      method: "GET",
      success: function (response) {
        if (response.exists) {
          $("#loadData").show();
        } else {
          $("#loadData").hide();
        }
      },
      error: function () {
        $("#loadData").hide();
      },
    });
  }

  // Функция для сохранения данных в localStorage вместо XML
  $("#inputForm").submit(function (e) {
    e.preventDefault();

    const formData = {
      datalist: $("#datalist").val(),
      email: $("#email").val(),
      checkbox1: $("input[name=checkbox1]").is(":checked"),
      checkbox2: $("input[name=checkbox2]").is(":checked"),
    };

    // Сохраняем в localStorage
    localStorage.setItem("formData", JSON.stringify(formData));
    alert("Данные успешно сохранены");
  });

  // Функция для загрузки данных из localStorage
  $("#loadData").click(function () {
    const savedData = localStorage.getItem("formData");

    if (savedData) {
      const formData = JSON.parse(savedData);

      // Заполняем форму отображения
      $("#datalist2").val(formData.datalist);
      $("#email2").val(formData.email);
      $("input[name=checkbox1]").prop("checked", formData.checkbox1);
      $("input[name=checkbox2]").prop("checked", formData.checkbox2);
    } else {
      alert("Данные не найдены. Сначала сохраните данные.");
    }
  });

  // Проверяем, есть ли сохраненные данные при загрузке страницы
  if (localStorage.getItem("formData")) {
    $("#loadData").removeAttr("disabled");
  } else {
    $("#loadData").attr("disabled", true);
  }
});
