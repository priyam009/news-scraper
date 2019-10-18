$(document).ready(function() {
  $(document).on("click", ".save-article", saveArticle);

  $(document).on("click", ".remove-article", removeArticle);

  $(document).on("click", "#scrape-new-articles", scrapeArticles);

  $("#clear-articles").on("click", clearArticles);

  function scrapeArticles() {
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function(data) {
      console.log("Articles Scraped");
      initPage();
    });
  }

  function clearArticles() {
    $.ajax({
      method: "GET",
      url: "/delete"
    }).then(function(data) {
      console.log("Articles cleared");
      initPage();
    });
  }

  function initPage() {
    $.ajax({
      method: "GET",
      url: "/articles"
    }).then(function(data) {
      console.log(data);

        $(".news-articles").empty();

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
    });
  }

  function saveArticle() {
    var id = $(this).attr("data-id");
    console.log("id", id);

    $.ajax({
      method: "PUT",
      url: "/bookmark/" + id
    }).then(function() {
      initPage();
    })
  }
});
