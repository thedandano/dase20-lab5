/**
 * Global $
 */
$(document).ready(function () {
  /**
   * Even when clicking on any favorite icon
   * icon swaps from empty to filled
   *  */
  $(".favoriteIcon").on("click", function () {
    let queryString = window.location.search; // gets the query string from the current url
    let urlParams = new URLSearchParams(queryString); // parses the query string
    let keyword = urlParams.get("keyword"); // extracts specific param.

    let imageUrl = $(this).prev().attr("src");

    if ($(this).attr("src") == "img/favorite.png") {
      $(this).attr("src", "img/favorite_on.png");
      updateFavorite("add", imageUrl, keyword);
    } else {
      $(this).attr("src", "img/favorite.png");
      updateFavorite("delete", imageUrl);
    }
  });

  function updateFavorite(action, imageUrl, keyword) {
    $.ajax({
      method: "get",
      url: "/api/updateFavorites",
      data: {
        action: action,
        imageUrl: imageUrl,
        keyword: keyword,
      },
      success: function (data, status) {},
    }); //ajax
  } //updateFavorite

  //When clicking on any keyword link,
  //all corresponding images are displayed
  $(".keywordLink").on("click", function () {
    let keyword = $(this).html().trim();
    $("a").removeClass("active");
    $(this).addClass("active");
    $("#keywordSelected").val(keyword);
    $.ajax({
      method: "get",
      url: "/api/getFavorites",
      data: {
        keyword: keyword,
      },
      success: function (data, status) {
        $("#favorites").html("");
        let htmlString = "";
        $("#favorites").css("visibility", "visible");
        data.forEach(function (row) {
          htmlString +=
            "<img class='image' src='" +
            row.imageURL +
            "' width='200' height='200'>";
          htmlString +=
            "<img class='favoriteIcon' src='img/favorite_on.png' width='20'>";
        });

        $("#favorites").append(htmlString);
      },
    }); //ajax
  }); //keywordLink

  //Event for dynamic content generated when clicking on a keyword
  $("#favorites").on("click", ".favoriteIcon", function () {
    let favorite = $(this).prev().attr("src");

    if ($(this).attr("src") == "img/favorite.png") {
      $(this).attr("src", "img/favorite_on.png");
      updateFavorite("add", favorite, $("#keywordSelected").val());
    } else {
      $(this).attr("src", "img/favorite.png");
      updateFavorite("delete", favorite);
    }
  }); //.favoriteIcon
}); //ready
