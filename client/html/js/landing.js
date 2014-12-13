Template.landing.rendered = function() {
  Prism.highlightAll();
};

Template.landing.events({
  "click .back-to-top": function() {
    $("html, body").animate({ scrollTop: 0 }, "fast");
    return false;
  }
});
