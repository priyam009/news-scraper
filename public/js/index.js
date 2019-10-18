$(document).ready(function() {
  $(document).on("click", ".save-article", saveArticle);

  $(document).on("click", "#scrape-new-articles", scrapeArticles);

  $("#clear-articles-index").on("click", clearArticles);

  function scrapeArticles() {
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function(data) {
      console.log("Articles Scraped");
      initIndex();
    });
  }

  function clearArticles() {
    $.ajax({
      method: "GET",
      url: "/delete"
    }).then(function(data) {
      console.log("Articles cleared");
      initIndex();
    });
  }

  function initIndex() {
    $.ajax({
      method: "GET",
      url: "/articles"
    }).then(function(data) {
      console.log(data.length);

      $(".news-articles").empty();

      if (data.length === 0) {
        renderEmptyIndex();
      } else {
        renderIndex(data);
      }
    });
  }

  function renderEmptyIndex() {
    var alertHeading1 = $(
      "<p class='card-text alert-heading'>Oh no!! No new articles found.</p>"
    );
    var alertHeading2 = $(
      "<p class='card-text alert-heading'>Click Scrape to get Articles</p>"
    );

    var alertBody = $(
      "<div class='card-body text-center text-dark font-weight-bold'>"
    ).append(alertHeading1, alertHeading2);

    var alert = $("<div class='card alert-danger'>").append(alertBody);

    $(".news-articles").append(alert);
  }

  function renderIndex(data) {
    for (var i = 0; i < data.length; i++) {
      var title = "<h5 class='card-title'>" + data[i].title + "</h5>";
      var brief = "<p class='card-text'>" + data[i].brief + "</p>";

      var link = $(
        "<a target='_blank' class='text-dark' href=" + data[i].link + ">"
      ).append(title, brief);

      var button =
        "<a class='btn btn-primary text-light mt-3 save-article' " +
        "data-id=" +
        data[i]._id +
        ">" +
        "Save Article" +
        "</a>";

      var cardBody = $("<div class='card-body'>").append(link, button);
      var card = $("<div class='card mb-4'>").append(cardBody);

      $(".news-articles").append(card);

    }
  }

  function saveArticle() {
    var id = $(this).attr("data-id");
    var data = {
      id: id,
      saved: true
    };
    $.ajax({
      method: "PUT",
      url: "/bookmark/" + data.id,
      data: data
    }).then(function() {
      initIndex();
    });
  }
});
