/*******************************************************************************
Copyright © 2021 Ennio Marke
socket.io
*******************************************************************************/
$(document).ready(function () {
  //var socket = io();

  var arrowBackType = 0; // 1 == slide, 0 == easeInOut

  $.ajaxSetup({
    cache: false,
  });

  function loadUIPage(page) {
    var cases = [
      "Home",
      "Options",
      "addOption",
      "removeOption",
      "Ingredients",
      "addIngredient",
      "removeIngredient",
      "Session",
    ];
    if (!cases.indexOf(page >= 0)) return;
    pageStandardMethods(page);
    switch (page) {
      case "Home":
        $("#content")
          .empty()
          .load("./UI/home.html", () => {
            //check if New Session got clicked
            $("#Session").click(() => {
              //when clicked fade out all UI elements, load new UI elements and fade new UI elements in
              loadUIPage("Session");
            });
            //check if Ingredients got clicked
            $("#Ingredients").click(() => {
              //when clicked fade out all UI elements, load new UI elements and fade new UI elements in
              loadUIPage("Ingredients");
            });
            //check if New Options got clicked
            $("#Options").click(() => {
              //when load Options UI page
              loadUIPage("Options");
            });
            $("#content *").fadeIn();
          });
        break;
      case "Options":
        $("#content").empty().addClass("options");
        $.getJSON("../../assets/json/options.json", (data) => {
          for (let i = 0; i < data.length; i++) {
            $("#content").append(`<p style="display: none;">${data[i]}</p>`);
          }
        });
        $("#content").append('<a id="aNO" class="tE">Add new Option</a>');
        $("#content").append('<a id="rO">Remove Option</a>');
        setTimeout(() => {
          $("#content *").fadeIn();
          $("#aNO").click(() => {
            $("#content").removeClass("options");
            loadUIPage("addOption");
          });
          $("#rO").click(() => {
            $("#content").removeClass("options");
            loadUIPage("removeOption");
          });
        }, 250);
        break;

      case "addOption":
        $("#content")
          .empty()
          .append('<input type="text" id="oI" style="display: none;">');
        $("#oI").fadeIn();
        $("#oI").keypress((e) => {
          if (e.which == 13) {
            $.getJSON("../../assets/json/options.json", (data) => {
              data.push($("#oI").val());
              writeToFile("../assets/json/options.json", data);
              $("#oI").val("");
              loadUIPage("Options");
            });
          }
        });
        break;

      case "removeOption":
        $("#content").empty();
        $.getJSON("../../assets/json/options.json", (data) => {
          for (let i = 0; i < data.length; i++) {
            $("#content").append(
              `<p class="oTR ${i == 0 ? "tE" : ""}" style="display: none;">${
                data[i]
              }</p>`
            );
          }
        });
        setTimeout(() => {
          $("#content *").fadeIn();
          $("#content p").click((e) => {
            removeElement(e.target.innerHTML, "../assets/json/options.json");
            e.target.remove();
            setTimeout(() => {
              loadUIPage("Options");
            }, 250);
          });
        }, 100);
        break;

      case "Session":
        $("#content").empty();
        setTimeout(() => {
          selectSessionIngredients();
        }, 100);
        break;

      case "Ingredients":
        $("#content").empty().addClass("ingredients");
        $.getJSON("../../assets/json/ingredients.json", (data) => {
          for (let i = 0; i < data.length; i++) {
            $("#content").append(`<p style="display: none;">${data[i]}</p>`);
          }
        });
        $("#content").append(
          '<a id="aNI" class="tE" style="display: none;">Add new Ingredient</a>'
        );
        $("#content").append(
          '<a id="rI" style="display: none;">Remove Ingredient</a>'
        );
        setTimeout(() => {
          $("#content *").fadeIn();
          $("#aNI").click(() => {
            $("#content").removeClass("ingredients");
            loadUIPage("addIngredient");
          });
          $("#rI").click(() => {
            $("#content").removeClass("ingredients");
            loadUIPage("removeIngredient");
          });
        }, 250);
        break;

      case "addIngredient":
        $("#content")
          .empty()
          .append('<input type="text" id="iI" style="display: none;">');
        $("#content *").fadeIn();
        $("#iI").keypress((e) => {
          if (e.which == 13) {
            $.getJSON("../../assets/json/ingredients.json", (data) => {
              data.push($("#iI").val());
              writeToFile("../assets/json/ingredients.json", data);
              $("#iI").val("");
              loadUIPage("Ingredients");
            });
          }
        });
        break;

      case "removeIngredient":
        $("#content").empty();
        $.getJSON("../../assets/json/ingredients.json", (data) => {
          for (let i = 0; i < data.length; i++) {
            $("#content").append(
              `<p class="iTR ${i == 0 ? "tE" : ""}" style="display: none;">${
                data[i]
              }</p>`
            ); //iTR = ingredient to remove; tE = top element
          }
        });
        setTimeout(() => {
          $("#content *").fadeIn();
          $("#content p").click((e) => {
            removeElement(
              e.target.innerHTML,
              "../assets/json/ingredients.json"
            );
            e.target.remove();
            setTimeout(() => {
              loadUIPage("Ingredients");
            }, 250);
          });
        }, 100);
        break;
    }
  }

  if (arrowBackType) {
    $(".icon-back-div").click(() => {
      $(".icon-back-div").animate(
        {
          left: "-=75",
        },
        100,
        $.easie(0.5, 0.5, 1, 1.5),
        () => {
          $(".icon-back-div").hide();
          $(".icon-back-div").animate(
            {
              left: "+=75",
            },
            1
          );
          loadUIPage(pageBefore.get(currentPage));
        }
      );
    });
  } else {
    $(".icon-back-div").click(() => {
      $(".icon-back-div").animate(
        {
          left: "-=25",
        },
        100,
        $.easie(0.5, 0.5, 1, 1.5)
      );
      $(".icon-back-div").animate(
        {
          left: "+=25",
        },
        100,
        $.easie(0.5, 0.5, 1, 1.5)
      );
      loadUIPage(pageBefore.get(currentPage));
    });
  }

  loadUIPage("Home");
});

function pageStandardMethods(page) {
  $("#content *").fadeOut();
  currentPage = page;
  if (page == "Home") pba.hide();
  else pba.show();
  if (page == "Home") {
    $("#content").css("justify-content", "center");
  } else {
    $("#content").css("justify-content", "flex-start");
  }
}

var currentPage = "Home";
var pageBefore = new Map();
pageBefore.set("Home", "Home");
pageBefore.set("Options", "Home");
pageBefore.set("Session", "Home");
pageBefore.set("Ingredients", "Home");
pageBefore.set("addOption", "Options");
pageBefore.set("addIngredient", "Ingredients");
pageBefore.set("removeOption", "Options");
pageBefore.set("removeIngredient", "Ingredients");

var sessionO = [];
var sessionI = [];

var orders = [];
var currentPizza = 0;

function writeToFile(path, input) {
  $.ajax({
    url: "../../libs/wtf.php",
    data: {
      input: JSON.stringify(input),
      path: path,
    },
    type: "post",
  });
}

var pba = {
  show: () => $(".icon-back-div").fadeIn(),
  hide: () => $(".icon-back-div").fadeOut(),
}; //pba = page back arrow

var getDomString = (function () {
  var DIV = document.createElement("div");

  if ("outerHTML" in DIV)
    return function (node) {
      return node.outerHTML;
    };

  return function (node) {
    var div = DIV.cloneNode();
    div.appendChild(node.cloneNode(true));
    return div.innerHTML;
  };
})();

function selectSessionIngredients() {
  $.getJSON("../../assets/json/ingredients.json", (data) => {
    console.log(data);
    $("#content").append(
      `<p class="ingredient used tES" style="display: none;">${data[0]}</p>`
    );
    for (let i = 1; i < data.length; i++) {
      $("#content").append(
        `<p class="ingredient used" style="display: none;">${data[i]}</p>`
      );
    }
    $("#content").append(`<button id="next">Next</button>`);
    setTimeout(() => {
      $("#content *").fadeIn();
      $(".ingredient").click(function (e) {
        //$("#nSI").append(getDomString(e.target));
        //e.target.remove();
        //$("#content *").off();
        $(this).toggleClass("used");
      });
      $("#next").click(function (e) {
        $("#content > p").each(function () {
          if (!$(this).hasClass("used")) {
            sessionI.push($(this).text());
          }
        });
        console.log(sessionI);
        selectSessionO();
      });
    }, 100);
  });
}

function selectSessionO() {
  $("#content").empty();
  $.getJSON("../../assets/json/options.json", (data) => {
    for (let i = 0; i < data.length; i++) {
      $("#content").append(
        `<p class="option used" style="display: none;">${data[i]}</p>`
      );
    }
    $("#content").append(`<button id="next">Next</button>`);
    setTimeout(() => {
      $("#content *").fadeIn();
      $(".option").click(function (e) {
        $(this).toggleClass("used");
      });
      $("#next").click(function (e) {
        //^ maybe 2 because ingredient same button ^

        $("#content > p").each(function () {
          if (!$(this).hasClass("used")) {
            sessionO.push($(this).text());
          }
        });
        console.log(sessionO);
        showOrders();
      });
    }, 100);
  });
}

function showOrders() {
  $("#content").empty();
  $("#content").css("justify-content", "center");
  -$("#content").load("./UI/orders.html", () => {
    var options = {
      I: sessionI,
      O: sessionO,
      time: Date.now(),
    };
    var socket = io("https://myst-socket.glitch.me/", {
      query: {
        type: "admin",
        opt: JSON.stringify(options),
      },
    });

    socket.on("newPizza", (pizza) => {
      console.log(pizza);
      orders.push(pizza);
      if (orders.length == 1) {
        loadOrder(orders[0]);
      }
      updateFooter();
    });
  });
}

function updateFooter() {
  console.log(`orders.length: ${orders.length}, currentpizza: ${currentPizza}`);
  var elemsToAdd = [];
  $("#footerWrapper").empty();
  if (orders.length > currentPizza + 1) {
    elemsToAdd.push(1);
  }
  if (currentPizza > 0) {
    elemsToAdd.push(2);
  }
  elemsToAdd
    .sort((a, b) => b - a)
    .forEach((e) => {
      if (e == 1) {
        $("#footerWrapper").append('<button id="nextPizza">Next</button>');
        $("#nextPizza").click(() => {
          currentPizza++;
          $("#iAO").empty();
          updateFooter();
          loadOrder(orders[currentPizza]);
        });
      }
      if (e == 2) {
        $("#footerWrapper").append('<button id="beforePizza">Back</button>');
        $("#beforePizza").click(() => {
          currentPizza--;
          $("#iAO").empty();
          updateFooter();
          loadOrder(orders[currentPizza]);
        });
      }
    });
}

function loadOrder(pizza) {
  $("#tName").text(pizza.N);
  for (let i = 0; i < pizza.O.length; i++) {
    $("#iAO").append(`
      <tr>
        <td>${pizza.O[i]}</td>
      </tr>
  `);
  }
  for (let i = 0; i < pizza.I.length; i++) {
    $("#iAO").append(`
      <tr>
        <td>${pizza.I[i]}</td>
      </tr>
  `);
  }
}

function removeElement(Element, path) {
  $.getJSON("../" + path, (data) => {
    data.splice(data.indexOf(Element), 1);
    writeToFile(path, data);
  });
}
