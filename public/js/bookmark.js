$(document).ready(function() {
  $(document).on("click", ".remove-article", removeArticle);

  $("#clear-articles-bookmark").on("click", clearBookmark);

  function clearBookmark() {
    $.ajax({
      method: "GET",
      url: "/delete"
    }).then(function(data) {
      console.log("Articles cleared");
      initBookmark();
    });
  }

  function initBookmark() {
    $.ajax({
      method: "GET",
      url: "/saved"
    }).then(function(data) {
      console.log(data.length);

      $(".news-articles").empty();

      if (data.length === 0) {
        renderEmptyBookmark();
      } else {
        renderBookmark(data);
      }
    });
  }

  function renderEmptyBookmark() {
    var alertHeading1 = $(
      "<p class='card-text alert-heading'>Oh no!! No saved articles found.</p>"
    );
    var alertHeading2 = $(
      "<p class='card-text alert-heading'>Click Scrape on Home Page to get Articles</p>"
    );

    var alertBody = $(
      "<div class='card-body text-center text-dark font-weight-bold'>"
    ).append(alertHeading1, alertHeading2);

    var alert = $("<div class='card alert-danger'>").append(alertBody);

    $(".news-articles").append(alert);
  }

  function renderBookmark(data) {
    for (var i = 0; i < data.length; i++) {
      var title = "<h5 class='card-title'>" + data[i].title + "</h5>";
      var brief = "<p class='card-text'>" + data[i].brief + "</p>";

      var link = $(
        "<a target='_blank' class='text-dark' href=" + data[i].link + ">"
      ).append(title, brief);
      var button1 =
        "<a class='btn btn-primary text-light mt-3 remove-article' " +
        "data-id=" +
        data[i]._id +
        ">" +
        "Remove Article" +
        "</a>";

      var button2 =
        "<a class='btn btn-primary text-light mt-3 ml-3' " +
        "data-id=" +
        data[i]._id +
        ">" +
        "Article Notes" +
        "</a>";

      var cardBody = $("<div class='card-body'>").append(
        link,
        button1,
        button2
      );
      var card = $("<div class='card mb-4'>").append(cardBody);

      $(".news-articles").append(card);
    }
  }

  function removeArticle() {
    var id = $(this).attr("data-id");
    var data = {
      id: id,
      saved: false
    };

    $.ajax({
      method: "PUT",
      url: "/bookmark/" + data.id,
      data: data
    }).then(function() {
      initBookmark();
    });
  }
});
