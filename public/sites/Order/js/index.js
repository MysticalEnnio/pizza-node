/*******************************************************************************
Copyright © 2021 Ennio Marke
socket.io
*******************************************************************************/
$(document).ready(function () {
  var socket = io("https://myst-socket.glitch.me/", {
    reconnection: false,
  });

  var pizzaI = [],
    pizzaO = [],
    pizzaN = "",
    pizzaC = "",
    options = {};

  function checkForSession() {
    if (options == 0) {
      $("#content").css("justify-content", "center");
      $("#content").append(
        `<p style="margin-bottom: 8vh;">There is currently no session</p>`
      );
      return false;
    }
    return true;
  }

  function getPizzaIngredients() {
    $("#content").css("justify-content", "flex-start");
    for (let i = 0; i < options.I.length; i++) {
      $("#content").append(
        `<p class="ingredient used" style="display: none;">${options.I[i]}</p>`
      );
    }
    $("#content").append(`<button id="next">Next</button>`);
    setTimeout(() => {
      $("#content *").fadeIn();
      $(".ingredient").click(function (e) {
        $(this).toggleClass("used");
      });
      $("#next").click(function (e) {
        $("#content > p").each(function () {
          if (!$(this).hasClass("used")) {
            pizzaI.push($(this).text());
          }
        });
        console.log(`Pizza Ingredients: ${JSON.stringify(pizzaI)}`);
        getPizzaOptions();
      });
    }, 100);
  }

  function getPizzaOptions() {
    $("#content").empty();
    for (let i = 0; i < options.O.length; i++) {
      $("#content").append(
        `<p class="option used" style="display: none;">${
          options.O[i] != undefined ? options.O[i] : "No options"
        }</p>`
      );
    }
    $("#content").append(`<button id="next">Next</button>`);
    setTimeout(() => {
      $("#content *").fadeIn();
      $(".option").click(function (e) {
        //$("#nSI").append(getDomString(e.target));
        //e.target.remove();
        //$("#content *").off();
        $(this).toggleClass("used");
      });
      $("#next").click(function (e) {
        $("#content > p").each(function () {
          if (!$(this).hasClass("used")) {
            pizzaO.push($(this).text());
          }
        });
        console.log(`Pizza Options: ${JSON.stringify(pizzaO)}`);
        getPizzaName();
      });
    }, 100);
  }

  function getPizzaName() {
    $("#content").css("justify-content", "center");
    $("#content")
      .empty()
      .append('<input type="text" id="name" style="display: none;">')
      .append('<h1 id="nameHeading" style="display: none;">Name</h1>');
    $("#content *").fadeIn();
    $("#name").keypress((e) => {
      if (e.which == 13) {
        pizzaN = $("#name").val();
        console.log(`Pizza Name: ${JSON.stringify(pizzaN)}`);
        getPizzaComments();
      }
    });
  }

  function getPizzaComments() {
    $("#content").css("justify-content", "center");
    $("#content")
      .empty()
      .append('<input type="text" id="comment" style="display: none;">')
      .append(
        '<h1 id="commentHeading" style="display: none;">Anmerkungen</h1>'
      );
    $("#content *").fadeIn();
    $("#comment").keypress((e) => {
      if (e.which == 13) {
        pizzaC = $("#comment").val();
        console.log(`Pizza Comments: ${JSON.stringify(pizzaC)}`);
        sendPizzaOrder();
      }
    });
  }

  function sendPizzaOrder() {
    $.getJSON("./assets/options.json", (data) => {
      $("#content")
        .empty()
        .append(
          '<p style="margin-bottom: 8vh;">Your order will arrive soon!</p>'
        );
      socket.emit("newPizzaOrder", {
        I: pizzaI,
        O: pizzaO,
        N: pizzaN,
        C: pizzaC,
      });
    });
  }

  socket.on("pizzaOptions", (opt) => {
    console.log(`Session Options: \n${JSON.stringify(opt)}`);
    options = opt;
    if (checkForSession()) {
      getPizzaIngredients();
    }
  });

  $.ajaxSetup({
    cache: false,
  });
});
