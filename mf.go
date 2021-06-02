package main

import (
  "database/sql"
  "fmt"
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
  _ "github.com/lib/pq"
)

const (
  host     = "192.168.0.82"
  port     = 5432
  user     = "postgres"
  password = "postgres"
  dbname   = "postgres"
)

func Cors() gin.HandlerFunc {
    return func(c *gin.Context) {
        method := c.Request.Method
        origin := c.Request.Header.Get("Origin") //请求头部
        if origin != "" {
            //接收客户端发送的origin （重要！）
            c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
            //服务器支持的所有跨域请求的方法
            c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE,UPDATE")
            //允许跨域设置可以返回其他子段，可以自定义字段
            c.Header("Access-Control-Allow-Headers", "Authorization, Content-Length, X-CSRF-Token, Token,session")
            // 允许浏览器（客户端）可以解析的头部 （重要）
            c.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers")
            //设置缓存时间
            c.Header("Access-Control-Max-Age", "172800")
            //允许客户端传递校验信息比如 cookie (重要)
            c.Header("Access-Control-Allow-Credentials", "true")
        }

        //允许类型校验
        if method == "OPTIONS" {
            c.JSON(http.StatusOK, "ok!")
        }

        defer func() {
            if err := recover(); err != nil {
                log.Printf("Panic info is: %v", err)
            }
        }()

        c.Next()
    }
}

func GetCount(c *gin.Context) {
    url := c.Query("url")
    if url == "" {
        url = "#"
    }

    psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
                            "password=%s dbname=%s sslmode=disable",
                            host, port, user, password, dbname)
    db, err := sql.Open("postgres", psqlInfo)
    if err != nil {
        log.Fatal(err)
    }
    rows, err := db.Query("SELECT time FROM counter WHERE url = $1", url)
    if err != nil {
        log.Fatal(err)
    }
    defer rows.Close()
    var time int
    for rows.Next() {
        err := rows.Scan(&time)
        if err != nil {
           log.Fatal(err)
        }
        fmt.Printf("Row[%d]\n", time)
    }
    err = rows.Err()
    if err != nil {
        log.Fatal(err)
    }

    defer db.Close()
    c.JSON(200, gin.H{
        "time":time,
        })
    return
}

func AddCount(c *gin.Context) {
    url := c.PostForm("url")
    if url == "" {
        url = "#"
    }

    psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
                            "password=%s dbname=%s sslmode=disable",
                            host, port, user, password, dbname)
    db, err := sql.Open("postgres", psqlInfo)
    if err != nil {
        log.Fatal(err)
    }

    insert := "INSERT INTO counter(url, time) VALUES ("
    insert += "'" + url + "', 1)"
    fmt.Println("insert statement: ", insert)

    if _, err := db.Exec(insert); err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Inserted data: %s\n", insert)
    defer db.Close()
    return
}

func UpdateCount(c *gin.Context) {
    url := c.PostForm("url")
    if url == "" {
        url = "#"
    }
    time := c.PostForm("time")
    
    psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
                            "password=%s dbname=%s sslmode=disable",
                            host, port, user, password, dbname)
    db, err := sql.Open("postgres", psqlInfo)
    if err != nil {
        log.Fatal(err)
    }
    update := "UPDATE counter SET time=" + time + " Where url= '" + url + "'"

    if _, err := db.Exec(update); err != nil {
        log.Fatal(err)
    }
    fmt.Printf("update data: %s\n", update)
    defer db.Close()
    return
}

func main() {
    r := gin.Default()
    r.Use(Cors()) //开启中间件 允许使用跨域请求
    r.GET("/counter", GetCount)
    r.POST("/counter", AddCount)
    r.PUT("/counter", UpdateCount)
    r.Run() // 监听并在 0.0.0.0:8080 上启动服务
}

