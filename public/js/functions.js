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
}); //ready
