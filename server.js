const data = require("./db.js");

const jsonServer = require("json-server");
const auth = require("json-server-auth");
const server = jsonServer.create();
const router = jsonServer.router(data);
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3005;

server.use(middlewares);
server.use(router);
server.use(auth);

// Add custom routes before JSON Server router
server.get("/echo", (req, res) => {
  res.jsonp(req.query);
});

// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now(); //chổ này là tự động tạo ngày tạo đối với phương thức post
    req.body.updateAt = Date.now(); // chổ này tự động tạo ngày update vào đối tượng khi có sự thay đổi
  }
  // Continue to JSON Server router
  next();
});

server.use("/api/auth", auth); // chổ này là cấu hình đường dẫn cho phần auth vd đường dẫn base là http://localhost:3001/
//thì đường dẫn vào trang đăng kí sẽ là http://localhost:3001/api/auth/resgister
server.use("/api", router); // chổ này là cấu hình đường dẫn vào api chính

server.listen(port);
