$(document).ready(function() {
  //Remove article from saved list
  $(document).on("click", ".remove-article", removeArticle);

  //Clear Bookmark articles
  $("#clear-articles-bookmark").on("click", clearBookmark);

  //Show all notes
  $(".show-notes").on("click", showNotes);

  //Save new notes
  $(".save-changes").on("click", addNotes);

  //Delete added note
  $(document).on("click", ".remove-note", deleteNote);

  //Show notes
  function showNotes() {
    var articleId = $(this).data("id");
    //Get notes linked to the Article
    getNotes(articleId);
  }

  //Add new notes for an article
  function addNotes() {
    var articleId = $(this).data("id");
    var noteText = $(".note-input").val();

    //Check if note exists
    if (noteText) {
      $.ajax({
        method: "POST",
        url: "/saved/" + articleId,
        data: {
          noteText: noteText
        }
      }).then(function(data) {
        //Clear input field
        $('input[type="text"]').val("");
        //Get notes linked to the Article
        getNotes(articleId);
      });
    }
  }

  //Get all notes for the article
  function getNotes(articleId) {
    $.ajax({
      method: "GET",
      url: "/saved/" + articleId
    }).then(function(data) {
      //Update modal Notes
      updateNotes(data, articleId);
    });
  }

  //Update/Create modal notes
  function updateNotes(data, articleId) {
    //Clear Modal content
    $(".modal-title").empty();
    $(".modal-body").empty();

    // console.log("notes data", data);
    $(".modal-title").text("Note " + articleId);
    $(".save-changes").attr("data-id", articleId);

    //Check if notes exists
    if (data.note.length === 0) {
      $(".modal-body").append("<h5>No Notes Yet</h5>");
    } else {
      for (var i = 0; i < data.note.length; i++) {
        var note = "<h5>" + data.note[i].noteText + "</h5>";
        var removeBtn =
          "<button type='button' class='btn btn-secondary remove-note' " +
          "data-id=" +
          data.note[i]._id +
          ">Remove</button>";

        var div = $(
          "<div class='d-flex flex-row justify-content-between mb-3'>"
        ).append(note, removeBtn);
        $(".modal-body").append(div);
      }
    }
    $("#article-notes").modal({ focus: true });
  }

  //Delete Note for an article
  function deleteNote() {
    var noteId = $(this).data("id");

    $.ajax({
      method: "GET",
      url: "/note/delete/" + noteId
    }).then(function(data) {
      console.log("Note deleted");
      var articleId = $(".save-changes").attr("data-id");
      //Get all notes for the article
      getNotes(articleId);
    });
  }

  //Delete Bookmarks
  function clearBookmark() {
    $.ajax({
      method: "GET",
      url: "/delete"
    }).then(function(data) {
      console.log("Articles cleared");
      initBookmark();
    });
  }

  //Initialise Bookmark page
  function initBookmark() {
    $.ajax({
      method: "GET",
      url: "/saved"
    }).then(function(data) {
      console.log(data.length);

      $(".news-articles").empty();

      //Check if Bookmark exists
      if (data.length === 0) {
        renderEmptyBookmark();
      } else {
        renderBookmark(data);
      }
    });
  }

  //Render if no bookmark
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

  //Render Bookmark
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

  //Remove article
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
