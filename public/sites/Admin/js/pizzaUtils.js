var sessionO = [];
var sessionI = [];

var orders = [];
var currentPizza = 0;
var sessionOpt = 0;

function writeToFile(path, input) {
  console.log(path + " " + input);
  $.ajax({
    url: "../../api/wtf",
    data: {
      input: JSON.stringify(input),
      path: path,
    },
    type: "post",
  });
}

function removeElement(Element, path) {
  $.getJSON("../../" + path, (data) => {
    data.splice(data.indexOf(Element), 1);
    writeToFile(path, data);
  });
}

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
        showOrders(1);
      });
    }, 100);
  });
}

function showOrders(sendOpt) {
  $("#content").empty();
  $("#content").css("justify-content", "center");
  -$("#content").load("./UI/orders.html", () => {
    var options = {
      I: sessionI,
      O: sessionO,
      time: Date.now(),
    };
    if (sendOpt) {
      var socket = io("https://myst-socket.glitch.me/", {
        query: {
          type: "admin",
          opt: JSON.stringify(options),
        },
      });
    } else {
      var socket = io("https://myst-socket.glitch.me/", {
        query: {
          type: "admin",
        },
      });
    }

    socket.on("pizzaOrders", (ordersArr) => {
      orders = ordersArr;
      loadOrder(orders[0]);
      updateFooter();
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
  console.log(
    `orders.length: ${
      orders.length
    }, currentpizza: ${currentPizza} \n orders: ${JSON.stringify(
      orders,
      null,
      2
    )}`
  );
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
  if (pizza.C != "") {
    $("#iAO").append(`
    <tr>
      <td style="4color: #ff0000;">${pizza.C}</td>
    </tr>
  `);
  }
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
