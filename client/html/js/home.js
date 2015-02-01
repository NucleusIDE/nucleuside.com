Template.home.rendered = function() {
  Prism.highlightAll();
};

Template.home.events({
  "click .back-to-top": function() {
    $("html, body").animate({ scrollTop: 0 }, "fast");
    return false;
  }
});
