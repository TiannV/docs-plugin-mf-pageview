module.exports = {
    book: {
        assets: "./book",
        js: [
            "plugin.js"
        ],
        css: [
            "plugin.css"
        ]
    },
    hooks: {
      'page:before': function(page) {
        var str = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>'
        page.content += str
        return page
      }
    }
};
