var gitbook = window.gitbook;
/*
<!-- Start of CuterCounter Code -->
<a href="http://www.cutercounter.com/" target="_blank"><img src="http://www.cutercounter.com/hit.php?id=gmvufxqck&nd=1&style=116" border="0" alt="visitor counter"></a>
<!-- End of CuterCounter Code -->
*/

var iconSVg = '<svg t="1543310294340" \
            class="icon" style="" viewBox="0 0 1024 1024" version="1.1" \
            xmlns="http://www.w3.org/2000/svg" p-id="1104" xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="14"><defs><style type="text/css"></style></defs>\
            <path d="M512 416a96 96 0 1 0 0 192 96 96 0 0 0 0-192z m511.952 102.064c-0.016-0.448-0.064-0.864-0.096-1.296a8.16 8.16 0 0 0-0.08-0.656c0-0.32-0.064-0.624-0.128-0.928-0.032-0.368-0.064-0.736-0.128-1.088-0.032-0.048-0.032-0.096-0.032-0.144a39.488 39.488 0 0 0-10.704-21.536c-32.672-39.616-71.536-74.88-111.04-107.072-85.088-69.392-182.432-127.424-289.856-150.8-62.112-13.504-124.576-14.064-187.008-2.64-56.784 10.384-111.504 32-162.72 58.784-80.176 41.92-153.392 99.696-217.184 164.48-11.808 11.984-23.552 24.224-34.288 37.248-14.288 17.328-14.288 37.872 0 55.216 32.672 39.616 71.52 74.848 111.04 107.056 85.12 69.392 182.448 127.408 289.888 150.784 62.096 13.504 124.608 14.096 187.008 2.656 56.768-10.4 111.488-32 162.736-58.768 80.176-41.936 153.376-99.696 217.184-164.48 11.792-12 23.536-24.224 34.288-37.248 5.712-5.872 9.456-13.44 10.704-21.568l0.032-0.128a12.592 12.592 0 0 0 0.128-1.088c0.064-0.304 0.096-0.624 0.128-0.928l0.08-0.656 0.096-1.28c0.032-0.656 0.048-1.296 0.048-1.952l-0.096-1.968zM512 704c-106.032 0-192-85.952-192-192s85.952-192 192-192 192 85.968 192 192c0 106.048-85.968 192-192 192z"\
            fill="#CCC" p-id="1105"></path></svg>'

require(["gitbook", "jQuery"], function (gitbook, $) {
  var app_url = ''
  var app_key = ''
  var client
  gitbook.events.bind("start", function(e, config) {
    app_url = config.pageview.app_url
    app_key = config.pageview.app_key
    const { createClient } = supabase
    client = createClient(app_url, app_key)
  })
  
  gitbook.events.bind("page.change", function() {
    var url = location.href.replace(/^http:\/\/[^/]+/, "").trim();
    url = decodeURI(url);
    var s = url.split("/").pop();
    var title = s.replace(".html", "");
    var time = 0;

    var bookHeader = $('.book-header')
    var lastChild = bookHeader.children().last()
    var renderWrapper = $('<div class="page-view-wrapper dropdown pull-left">\
        <span class="btn toggle-dropdown">'+ iconSVg + '</span>\
        <span class="page-view-counter" title="阅读数">-</span>\
      </div>')

    if(lastChild.length){
      renderWrapper.insertBefore(lastChild)
    }else{
      bookHeader.append(renderWrapper)
    }

    const AddCounter = async (id, time) => {
      console.log("add counter")
      try {
        var body  = await client.from('counter').update({ time: time }).eq('id', id)
        console.log(body)
        renderWrapper.find('.page-view-counter').html(time)
      } catch (error) {
        console.log('error', error)
      }
    }

    const InsertCounter = async(url, title) => {
      console.log("insert counter")
      try {
        body  = await client
          .from('counter')
          .insert({ url:url, time: 1 , title:title})
          .single()
          console.log(body)
          renderWrapper.find('.page-view-counter').html(1)
      } catch (error) {
        console.log('error', error)
      }
    }
    
    const fetchCounter = async () => {
      let { error, data } = await client.from('counter').select().eq('url', url).single()
      if (error) {
        console.log(error.message)
        InsertCounter(url, title)
        return
      }
      if (data) {
        AddCounter(data.id, data.time+1) 
      } else {
        InsertCounter(url, title)
      }
    }

  fetchCounter();
  })
});
