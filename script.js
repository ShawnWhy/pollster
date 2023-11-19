var currentPoll = 1;

$(document).ready(()=>{

  getPolls(4);
  settingPollChoices()
}
    
)

function getPolls(pollNumber){
  {
    $.ajax({
      type: "get",
      url: "/api/getpoll/" + pollNumber,

      success: function (response) {
        console.log(response);
        $("#questionContainer").html(response[0].pollquestion);
        $.ajax({
          type: "get",
          url: "/api/getchoices/" + pollNumber,
          success: function (response) {
            console.log("gotten choics");
            $("#choicesContainer").html("");

            var count = 0;

            response.forEach((element) => {
              //                  <input type="radio" id="html" name="fav_language" value="HTML">
              //                  <label for="html">HTML</label><br></br>
              var choice = $("<input>");
              choice.attr("type", "radio");
              choice.attr("name", "choices");
              choice.attr("value", element.id);
              choice.attr("id");
              choice.html(element.choicetext);

              var lable = $("<lable>");
              lable.attr("for", element.id);
              lable.html(element.choicetext);
              $("#choicesContainer").append(choice);
              $("#choicesContainer").append(lable);
              count++;

     
            });
            if(count>=response.length-1){
              console.log("getting votes first")
       $.ajax({
               type: "get",
               url: "/api/getvotes/" + pollNumber,
               data: "data",
               success: function (response) {
                 console.log("gotten votes");
                 console.log(response);
                 var length = response.length;
                 var total = 0;
                 console.log(length);

                 for (i = 0; i < length; i++) {
                  total = total + response[i].count

                 }
                 console.log(total)
                 $('.pollcount').remove();
                  for (i = 0; i < length; i++) {
                    let percentage =
                      (parseInt(response[i].count) / total) * 100;
                    let div = $("<div class='pollcount' style='border-radius:5px; border:1px solid black; padding:5px'>");
                    let p1 = $("<p>")
                    let p2 = $("<p>")
                    let p3 = $("<p>")
                    $(p1).html("vote number: " + response[i].choiceid);
                    $(p2).html("count number: " + response[i].count);
                    $(p3).html("percentage : "+percentage )
                    $(div).append(p1);
                    $(div).append(p2)
                    $(div).append(p3)
                    $(div).css("width",percentage + "%")

                    $("#pollDisplay").append(div);

                    

                    }
                    
                  }
                 
                 
               
             }).catch(function (error) {
          // Error callback
          console.log("Error:", error);
        });

            }

      
                    
          },
        }).catch(function (error) {
          // Error callback
          console.log("Error:", error);
        });
      },
    }).catch(function (error) {
      // Error callback
      console.log("Error:", error);
    });
  }
}
$("#pollAnswers").on("submit",(e)=>{
  e.preventDefault();
  submittingVote()
});
function submittingVote(){
  var choiceId = $("#pollAnswers input:checked").val();
  console.log("checkedis....")
  console.log(choiceId)
  console.log(currentPoll)

  $.ajax({
    type: "post",
          url: "/api/votes/",
          data:{
            choiceid:choiceId,
            pollid:currentPoll
          },
          success: function (response) {
            console.log(response);
           
          }

    
  })

}

function settingPollChoices(){
  $.ajax({
    type: "get",
    url: "/api/getAllPoll/",
    success: function (response) {
      $("#pollSelection").html("");
      for (i = 0; i < response.length; i++) {
        let div = $("<option>");
        $(div).attr("value", response[i].id);
        $(div).html(response[i].pollquestion);
        $("#pollSelection").append(div);
      }
    },
  }).catch(function (error) {
    // Error callback
    console.log("Error:", error);
  });

  
}


$("#selectPolls").on("submit",(e)=>{
  e.preventDefault();
  var choiceNumber = $("#pollSelection").val();
  console.log("the poll number is : ")
  console.log(choiceNumber);
    getPolls(choiceNumber);
    currentPoll = choiceNumber;

  

});

$("#submission").on("submit",(e)=>{
e.preventDefault();
submitNewPoll();
});



function submitNewPoll(){
  var choices = [];
  $.ajax({
    type: "post",
    url: "/api/poll",
    data: { text: $("#question").val() },
    success: function (response) {
      console.log("posted poll");
      console.log(response.insertId);
      if ($("#choice1").val()) {
        choices.push({
          text: $("#choice1").val(),
          pollid: response.insertId,
        });
      }
      if ($("#choice2").val()) {
        choices.push({
          text: $("#choice2").val(),
          pollid: response.insertId,
        });
      }
      if ($("#choice3").val()) {
        choices.push({
          text: $("#choice3").val(),
          pollid: response.insertId,
        });
      }
      if ($("#choice4").val()) {
        choices.push({
          text: $("#choice4").val(),
          pollid: response.insertId,
        });
      }

      console.log(choices);
      if (choices.length > 0) {
        for (i = 0; i < choices.length; i++) {
          $.ajax({
            type: "post",
            url: "/api/choices/",
            data: choices[i],
            success: function (response) {
              console.log("insert choices response")
              console.log(response);
            },
          }).catch(function (error) {
            // Error callback
            console.log("Error:", error);
          });;
        }
      }
    },
  }).catch(function (error) {
    // Error callback
    console.log("Error:", error);
  });


}