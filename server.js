const fs = require("fs");
const http = require("http");
const formidable = require("formidable");
const path = require("path");

const users = [
  {
    name: "Phone Htet Aung",
    email: "phonehtetaung1993@gmail.com",
    password: "helloWorld",
  },
  {
    name: "Nara Hiromichi",
    email: "hiromichi321@gmail.com",
    password: "welcomeNode",
  },
  {
    name: "Myo Thi Ha",
    email: "thiha123@gmail.com",
    password: "greatBootstrap",
  },
];

const server = http.createServer((req, res) => {
  const emailValidRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const isRootUrl = req.url === "/";
  if (isRootUrl) {
    fs.readFile("index.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  } else if (req.url === "/script.js") {
    fs.readFile("script.js", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.write(data);
      res.end();
    });
  } else if (req.url === "/style.css") {
    fs.readFile("style.css", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/css" });
      res.write(data);
      res.end();
    });
  } else if (req.url === "/users") {
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(users));
      res.end();
    } else if (req.method === "POST") {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        const newUser = JSON.parse(data);
        // to check already register or not

        let exist;
        users.forEach((user) => {
          if (user.email === newUser.email) {
            exist = true;
          }
        });

        //
        if (exist) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify("existed"));
          res.end();
        } else {
          users.push(newUser);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify(users));
          res.end();
        }
      });
    } else if (req.method === "DELETE") {
      console.log("Delete");
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        // console.log(data);
        const emailValid = data.match(emailValidRegex);
        if (emailValid !== null) {
          users.splice(
            users.findIndex((user) => user.email === data),
            1
          );
          // newUsers = users.filter((user) => {
          //   return user.email !== data;
          // });
        }

        res.write(JSON.stringify(users));
        res.end();
      });
    } else if (req.method === "PUT") {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        const newData = JSON.parse(data);
        console.log(data);
        const foundUser = users.find((user) => user.email === newData.newEmail);
        console.log(foundUser);
        const newPassword = newData.newPassword;
        const newName = newData.newName;
        if (foundUser) {
          foundUser.name = newName;
          foundUser.password = newPassword;
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify(users));
        }
        res.end();
      });
      // req.on("end", () => {
      //   let updateUser;
      //   const emailValid = data.match(emailValidRegex);
      //   if (emailValid !== null) {
      //     updateUser = users.find((user) => {
      //       return user.email === data.email;
      //     });
      //   }

      //   if (updateUser) {
      //     console.log(updateUser);
      //   }
      // });
    }
  } else if (req.url === "/fileUpload") {
    let form = new formidable.IncomingForm();
    form.parse(req);
    form.on("fileBegin", (name, file) => {
      console.log(file);
      file.filepath = __dirname + "/upload/" + file.originalFilename;
    });
    form.on("file", () => {
      res.write(JSON.stringify("file uploaded"));
      console.log("File upload");
      res.end();
    });
  } else {
    res.writeHead(404);
    res.write("<h1>page not found</h1>");
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server started: Listening on port 3000");
});

// else if (method === "PUT") {
//   let data = "";
//   req.on("data", (chunk) => {
//     data += chunk;
//   });
//   req.on("end", () => {
//     const newData = JSON.parse(data);
//     const foundUser = users.find((user) => user.email === newData.email);
//     const newName = newData.newName;
//     if (foundUser) {
//       foundUser.name = newName;
//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.write(JSON.stringify(users));
//     }
//     res.end();
//   });
// }

/*users.push(newUser);
res.writeHead(200, { "Content-Type": "application/json" });
res.write(JSON.stringify(users));*/
