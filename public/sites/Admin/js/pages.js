let login = new page(
  "login",
  (callback) => {
    //dont needs to be safe cause its just for no misunderstanding
    $("#content")
      .append('<input type="password" id="adminPsw" style="display: none;">')
      .append('<h1 id="pswHeading">Admin Passwort</h1>');
    callback();
  },
  () => {
    $("#adminPsw").keypress((e) => {
      if (e.which == 13) {
        if ($("#adminPsw").val().toLowerCase() == "master") {
          pageHandler.loadPage("Home");
        }
        $("#adminPsw").val("");
      }
    });
  }
);

let home = new page(
  "home",
  (callback) => {
    if (sessionOpt) {
      $("#content").load("./UI/homeWithSession.html");
    } else {
      $("#content").load("./UI/home.html");
    }

    //try to fix this later
    setTimeout(() => {
      callback();
    }, 250);
  },
  () => {
    //check if New Session got clicked
    $("#Session").click(() => {
      //when clicked fade out all UI elements, load new UI elements and fade new UI elements in
      pageHandler.loadPage("Session");
    });
    //check if Ingredients got clicked
    $("#Ingredients").click(() => {
      //when clicked fade out all UI elements, load new UI elements and fade new UI elements in
      pageHandler.loadPage("Ingredients");
    });
    //check if New Options got clicked
    $("#Options").click(() => {
      //when load Options UI page
      pageHandler.loadPage("Options");
    });
    $("#ContinueSession").click(() => {
      pba.show();
      pageHandler.pageHistory = ["Home", "Session"];
      showOrders();
    });
    $("#EndSession").click(() => {
      $.get("https://myst-socket.glitch.me/endSession");
      sessionOpt = 0;
      orders = [];
      pageHandler.loadPage("Home");
    });
  }
);

let options = new page(
  "options",
  (callback) => {
    $.getJSON("../../assets/json/options.json", (data) => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        $("#content").append(`<p style="display: none;">${data[i]}</p>`);
      }
    });
    $("#content").append('<a id="aNO">Add new Option</a>');
    $("#content").append('<a id="rO">Remove Option</a>');
    //try to fix this later
    setTimeout(() => {
      callback();
    }, 250);
  },
  () => {
    $("#aNO").click(() => {
      $("#content").removeClass("options");
      pageHandler.loadPage("addOption");
    });
    $("#rO").click(() => {
      $("#content").removeClass("options");
      pageHandler.loadPage("removeOption");
    });
  }
);

let addOption = new page(
  "addOption",
  (callback) => {
    $("#content").append('<input type="text" id="oI" style="display: none;">');
    setTimeout(() => {
      callback();
    }, 250);
  },
  () => {
    $("#oI").keypress((e) => {
      if (e.which == 13) {
        $.getJSON("../../assets/json/options.json", (data) => {
          data.push($("#oI").val());
          writeToFile("assets/json/options.json", data);
          $("#oI").val("");
          pageHandler.loadPage("Options");
        });
      }
    });
  }
);

let removeOption = new page(
  "removeOption",
  (callback) => {
    $.getJSON("../../assets/json/options.json", (data) => {
      for (let i = 0; i < data.length; i++) {
        $("#content").append(
          `<p class="oTR ${i == 0 ? "tE" : ""}" style="display: none;">${
            data[i]
          }</p>`
        );
      }
      setTimeout(() => {
        callback();
      }, 250);
    });
  },
  () => {
    $("#content p").click((e) => {
      removeElement(e.target.innerHTML, "assets/json/options.json");
      e.target.remove();
    });
  }
);

let ingredients = new page(
  "ingredients",
  (callback) => {
    $.getJSON("../../assets/json/ingredients.json", (data) => {
      for (let i = 0; i < data.length; i++) {
        $("#content").append(`<p style="display: none;">${data[i]}</p>`);
      }
    });
    $("#content").append('<a id="aNI">Add new Ingredient</a>');
    $("#content").append('<a id="rI">Remove Ingredient</a>');
    //try to fix this later
    setTimeout(() => {
      callback();
    }, 250);
  },
  () => {
    $("#aNI").click(() => {
      $("#content").removeClass("ingredients");
      pageHandler.loadPage("addIngredient");
    });
    $("#rI").click(() => {
      $("#content").removeClass("ingredients");
      pageHandler.loadPage("removeIngredient");
    });
  }
);

let addIngredient = new page(
  "addIngredient",
  (callback) => {
    $("#content").append('<input type="text" id="oI" style="display: none;">');
    setTimeout(() => {
      callback();
    }, 250);
  },
  () => {
    $("#oI").keypress((e) => {
      if (e.which == 13) {
        $.getJSON("../../assets/json/ingredients.json", (data) => {
          data.push($("#oI").val());
          writeToFile("assets/json/ingredients.json", data);
          $("#oI").val("");
          pageHandler.loadPage("Ingredients");
        });
      }
    });
  }
);

let removeIngredient = new page(
  "removeIngredient",
  (callback) => {
    $.getJSON("../../assets/json/ingredients.json", (data) => {
      for (let i = 0; i < data.length; i++) {
        $("#content").append(
          `<p class="iTR ${i == 0 ? "tE" : ""}" style="display: none;">${
            data[i]
          }</p>`
        );
      }
      setTimeout(() => {
        callback();
      }, 250);
    });
  },
  () => {
    $("#content p").click((e) => {
      removeElement(e.target.innerHTML, "assets/json/ingredients.json");
      e.target.remove();
    });
  }
);

let session = new page(
  "session",
  (callback) => {
    callback();
  },
  () => {
    selectSessionIngredients();
  }
);

$(document).ready(() => {
  pageHandler.onLoad();
});
