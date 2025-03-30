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

        // Если на GitHub Pages, используем localStorage для проверки
        if (localStorage.getItem("formData")) {
          $("#loadData").show();
        }
      },
    });
  }

  // Функция отправки данных на сервер для сохранения в XML
  $("#inputForm").submit(function (e) {
    e.preventDefault();

    const formData = {
      datalist: $("#datalist").val(),
      email: $("#email").val(),
      checkbox1: $("#checkbox1").is(":checked"),
      checkbox2: $("#checkbox2").is(":checked"),
    };

    console.log("Сохраняемые данные:", formData);

    // Проверяем, на GitHub Pages или на локальном сервере
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      // Отправка данных на сервер
      $.ajax({
        url: "/save",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
          alert("Данные успешно сохранены");
          checkDataExists();
          $("#inputForm")[0].reset();
        },
        error: function (xhr, status, error) {
          // Если ошибка, используем localStorage
          saveToLocalStorage(formData);
        },
      });
    } else {
      // На GitHub Pages используем localStorage
      saveToLocalStorage(formData);
    }
  });

  // Функция для сохранения в localStorage
  function saveToLocalStorage(formData) {
    // Убедимся, что чекбоксы имеют правильные булевы значения
    formData.checkbox1 = !!formData.checkbox1;
    formData.checkbox2 = !!formData.checkbox2;

    localStorage.setItem("formData", JSON.stringify(formData));
    console.log(
      "Данные сохранены в localStorage:",
      JSON.parse(localStorage.getItem("formData"))
    );
    alert("Данные успешно сохранены");
    $("#loadData").show();
    $("#inputForm")[0].reset();
  }

  // Функция загрузки данных
  $("#loadData").click(function () {
    // Проверяем, на GitHub Pages или на локальном сервере
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      // Загрузка данных с сервера
      $.ajax({
        url: "/load",
        method: "GET",
        success: function (data) {
          if (data) {
            fillDisplayForm(data);
          }
        },
        error: function (xhr, status, error) {
          // Если ошибка, используем localStorage
          loadFromLocalStorage();
        },
      });
    } else {
      // На GitHub Pages используем localStorage
      loadFromLocalStorage();
    }
  });

  // Функция для загрузки из localStorage
  function loadFromLocalStorage() {
    const savedData = localStorage.getItem("formData");

    if (savedData) {
      try {
        const formData = JSON.parse(savedData);
        console.log("Загруженные данные из localStorage:", formData);
        fillDisplayForm(formData);
      } catch (e) {
        console.error("Ошибка при разборе данных из localStorage:", e);
        alert("Ошибка при загрузке данных");
      }
    } else {
      alert("Данные не найдены");
    }
  }

  // Заполнение формы отображения данными
  function fillDisplayForm(data) {
    // Очищаем существующие данные
    $("#displayForm")[0].reset();

    // Заполняем поля формы
    $("#datalist2").val(data.datalist || "");
    $("#email2").val(data.email || "");

    // Строго проверяем значения чекбоксов на true
    const checkbox1Checked = data.checkbox1 === true;
    const checkbox2Checked = data.checkbox2 === true;

    console.log("Checkbox1:", data.checkbox1, "->", checkbox1Checked);
    console.log("Checkbox2:", data.checkbox2, "->", checkbox2Checked);

    // Устанавливаем чекбоксы точно как они были сохранены
    $("#checkbox1_display").prop("checked", checkbox1Checked);
    $("#checkbox2_display").prop("checked", checkbox2Checked);
  }
});
