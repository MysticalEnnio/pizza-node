/*******************************************************************************
Copyright © 2021 Ennio Marke
socket.io
*******************************************************************************/

document.addEventListener("DOMContentLoaded", () => {
    
    //#region elements
    var output = document.getElementById("output")
    var input = document.getElementById("input")
    //#endregion
  
    function logOutput(text) {
      var ul = document.getElementById("output");
      var li = document.createElement("li");
      li.appendChild(document.createTextNode("Four"));
      ul.appendChild(li);
    }
  
    /*$("textarea").keydown(function(e){
      // Enter was pressed without shift key
      if (e.keyCode == 13 && !e.shiftKey)
      {
        // prevent default behavior
        e.preventDefault();
        if(input.value=="") return
        logOutput(input.value)
          $.ajax({
            url: `https://url-req.glitch.me/http://api.brainshop.ai/get?bid=156779&key=0ErJYSb1ZlZmOcel&uid=${userName}&msg=${input.value}`,
            type: "GET",
            withCredentials: true,
            success: function (data) {
              logOutput(data.cnt, 1)
              output.scrollTop = output.scrollHeight;
                console.log(data)
            },
            error: function (xhr, status) {
              alert("error");
            }
          });
          input.value = "";
          output.scrollTop = output.scrollHeight;
      }
    })*/
  })