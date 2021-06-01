var defaultOptions = {
    countable: !0,
    position: "top",
    margin: "10px",
    float: "right",
    fontsize: "0.9em",
    color: "rgb(90,90,90)",
    language: "english",
    isExpected: !0
};
var memfire = {
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'test',
  port     : '5433'
};
var pg  = require('pg');
var connerct = "tcp://"+memfire.password+":"+memfire.user+"@"+memfire.host+":"+memfire.port+"/"+memfire.database
var client =  new pg.Client(conString);
client.connect(function(error, results){
  if (error) {
    console.log('clientConnectionReady Error:'+error.message);
    client.end();
    return;
  }
  console.log('connection success...\n');
  client.query('SELECT * FROM account',function(error,results){
    console.log(error);
    console.log(results);
  })
});

function plugin(t, n) {
    if (!defaultOptions.countable)
        return;
    let o;
    t.beforeEach(function(t) {
        return o = t.match(/([\u4e00-\u9fa5]+?|[a-zA-Z0-9]+)/g).length,
        t
    }),
    t.afterEach(function(t, n) {
        let i = o + " words"
          , e = Math.ceil(o / 400) + " min";
        "chinese" === defaultOptions.language && (i = o + " 字",
        e = Math.ceil(o / 400) + " 分钟"),
        n(`\n        ${"bottom" === defaultOptions.position ? t : ""}\n        <div style="margin-${defaultOptions.position ? "bottom" : "top"}: ${defaultOptions.margin};">\n            <span style="\n                  float: ${"right" === defaultOptions.float ? "right" : "left"};\n                  font-size: ${defaultOptions.fontsize};\n                  color:${defaultOptions.color};">\n            ${i}\n            ${defaultOptions.isExpected ? `&nbsp; | &nbsp;${e}` : ""}\n            </span>\n            <div style="clear: both"></div>\n        </div>\n        ${"bottom" !== defaultOptions.position ? t : ""}\n        `)
    })
}
window.$docsify.count = Object.assign(defaultOptions, window.$docsify.count),
window.$docsify.memfire = Object.assign(defaultOptions, window.$docsify.memfire),
window.$docsify.plugins = [].concat(plugin, window.$docsify.plugins);
