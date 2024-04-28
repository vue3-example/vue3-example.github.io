const express = require("express"); // express 웹서버 관련 모듈 불러오기
const history = require("connect-history-api-fallback"); // redirect 에러 해결 모듈. HTML5 History API를 활용하는 단일 페이지 애플리케이션에 유용.지정된 인덱스 페이지를 통해 요청을 프록시하는 미들웨어   $ npm install --save connect-history-api-fallback 설치
//※ 리다이렉트란? : 클라이언트(브라우저)가 서버에 요청함 -> 서버가 일을 처리 -> 클라이언트에게 새로 요청할 곳을 알려줌 ->클라이언트가 다시 요청함.
const app = express(); // express() 함수 호출

const PORT = process.env.PORT || 3000; // 환경 변수 PORT에 있는 것이 무엇이든, 또는 거기에 아무것도 없으면 3000.
//app.listen, 또는 에 전달 app.set('port', ...)하면 서버가 환경에서 "수신할 포트" 매개변수를 수락할 수 있습니다.

app.listen(PORT, () => {
  console.log(`Server Listening on ${PORT}`);
});

const session = require("express-session"); // express-session 로그인 관련 모듈 불러오기
const fs = require("fs"); // filesystem으로 디렉토리에 접근할 수 있게 해주는 모듈 불러오기

const http = require("http"); // http 모듈 불러오기

// heroku sleep mode 방지를 위해 10분 간격으로 트래픽 생성
/* setInterval(() => {
  http.get("127.0.0.1");
}, 600000); */

app.use(
  session({
    // session 처리 방법
    secret: "secret code", // session에 대한 key(secret code)
    resave: false, // resave: request 요청이 왔을 때, session에 수정사항이 생기지 않더라도, 다시 저장하는 기능
    saveUninitialized: false, // saveUninitialied: session에 저장할 내역이 없더라도, session을 항상 재 저장을 하는 기능
    cookie: {
      secure: false, //true(기본값)로 설정하면 HTTP를 통해 검색된 플래시 클라이언트가 HTTPS를 통해 localhost의 데이터에 액세스할 수 없음.
      maxAge: 1000 * 60 * 60, //쿠기 유효시간 1시간
    },
  })
);

app.use(
  express.json({
    // body request 요청을 할 때 파라미터를 json형태의 최대 50mb 파라미터로 전송
    limit: "50mb",
  })
);

//서버 환경에서 "수신할 포트" 매개변수를 수락
const server = app.listen(3000, () => {
  //listen()연결요청 대기
  console.log("Server started. port 3000.");
});

let sql = require("./sql.js"); //sql문서 로드하기

fs.watchFile(__dirname + "/sql.js", (curr, prev) => {
  // file 레파지토리를 감시하다가 변경되는 것을 감지
  console.log("sql 변경시 재시작 없이 반영되도록 함.");
  delete require.cache[require.resolve("./sql.js")]; // 이미 올라가 있는 sql.js의 cache 삭제
  sql = require("./sql.js"); // sql.js 다시 불러오기
});

const db = {
  //데이터베이스 연동
  database: "project01",
  connectionLimit: 10,
  host: "svc.sel5.cloudtype.app:31585", //127.0.0.1   //svc.sel5.cloudtype.app  //31585
  user: "root",
  password: "1234",
};

//데이터베이스에 연결된 Connection을 미리 만들어 둔후 Pool에 보관하였다가 필요할 때 Pool에서 Connection을 가져다 사용한 후, 다시 Pool에 반환하는 기법.
//Connection Pool을 이용하면 여러 Connection을 이용할 수 있기 때문에 더 큰 부하를 견딜 수 있습니다.
const dbPool = require("mysql").createPool(db);

/* async/awiat를 사용할 경우 함수 또는 메서드 앞에 async 키워드를 사용한다.
내부에 async 키워드를 사용해 비동기 통신 요청을 처리하며 async/await는 오류 디버깅을 위해
try..catch를 사용할 수 있다.
async/await는 ES8에 추가된 새로운 방법으로 IE를 포함한 오래된 브라우저는 지원하지 않는다고 한다. */

app.post("/api/kakaoLogin", async (request, res) => {
  // client에서 server쪽으로 axios post방식으로 login api 가져오기
  // request.session['profile'] = 'hj0035kr@gmail.com';
  // res.send('ok');
  try {
    await req.db("signUp", request.body.param); // signUp sql 호출하고, request시 body에 파라미터도 함께 들어오도록 설정
    if (request.body.param.length > 0) {
      for (let key in request.body.param[0]) request.session[key] = request.body.param[0][key]; // 받아온 파리미터의 첫번째 인자를 key값에 넣어줌
      res.send(request.body.param[0]); // 받아왔던 파라미터를 보내줌
    } else {
      // 파라미터 없이 api를 호출했을 시
      res.send({
        error: "Please try again or contact system manager .",
      });
    }
  } catch (err) {
    // DB에 저장 도중 error가 났을 시
    res.send({
      error: "DB access error",
    });
  }
});

app.post("/api/logout", async (request, res) => {
  // client에서 server쪽으로 axios post()방식으로 logout api가져오기
  request.session.destroy();
  res.send("ok");
});

app.post("/upload/:productId/:type/:fileName", async (request, res) => {
  // file 업로드 api
  let { productId, type, fileName } = request.params; // 받아온 파라미터
  const dir = `${__dirname}/uploads/${productId}`; // dir 경로 선언
  const file = `${dir}/${fileName}`; // file 경로 선언
  if (!request.body.data)
    return fs.unlink(file, async (err) =>
      res.send({
        // body에서 받아온 data 이상 시 에러 호출
        err,
      })
    );
  const data = request.body.data.slice(request.body.data.indexOf(";base64,") + 8); // body에서 받아온 data를 base64를 통해 인코딩
  if (!fs.existsSync(dir)) fs.mkdirSync(dir); // dir 파일경로가 없을 시 폴더 만들기
  fs.writeFile(file, data, "base64", async (error) => {
    // file 경로로 data를 base64기반으로 wirteFile
    await req.db("productImageInsert", [
      {
        // sql productImageInsert를 통해 받아온 파라미터를 Insert
        product_id: productId,
        type: type,
        path: fileName, //파일경로
      },
    ]);

    if (error) {
      // 에러 발생 시
      res.send({
        error,
      });
    } else {
      // 에러 없을 시
      res.send("ok");
    }
  });
});

app.get("/download/:productId/:fileName", (request, res) => {
  // upload한 data dawnload
  const { productId, type, fileName } = request.params; // 받아온 파라미터
  const filepath = `${__dirname}/uploads/${productId}/${fileName}`; // file 경로 선언
  res.header("Content-Type", `image/${fileName.substring(fileName.lastIndexOf("."))}`);
  if (!fs.existsSync(filepath))
    res.send(404, {
      error: "Can not found file.", // 받아온 파라미터와 같은 data가 경로에 없을 시 에러 발생
    });
  else fs.createReadStream(filepath).pipe(res); // 에러 없을 시, 해당 경로의 file 읽기
});

app.post("/apirole/:alias", async (request, res) => {
  // 사용자가 서버로 지정되지 않는 데이터 요청을 할 때, 경유하게 만듬
  if (!request.session.email) {
    return res.status(401).send({
      error: "You need to login.",
    });
  }

  try {
    res.send(await req.db(request.params.alias)); // alias에 뭐가 들어올 지 모르기 때문에 경로를 설정
  } catch (err) {
    // err라는 에러문이 뜨도록 예외처리
    res.status(500).send({
      error: err,
    });
  }
});

app.post("/api/:alias", async (request, res) => {
  // 사용자가 서버로 지정되지 않는 데이터 요청을 할 때, 경유하게 만듬
  try {
    res.send(await req.db(request.params.alias, request.body.param, request.body.where)); // alias에 뭐가 들어올 지 모르기 때문에 경로를 설정, request시 body에 파라미터도 함께 들어오도록 설정
  } catch (err) {
    res.status(500).send({
      error: err, // err라는 에러문이 뜨도록 예외처리
    });
  }
});

const req = {
  // 받아온 alias, param, where를 받아 alias와 같은 sql문을 데이터베이스에 query
  async db(alias, param = [], where = "") {
    return new Promise((resolve, reject) =>
      dbPool.query(sql[alias].query + where, param, (error, rows) => {
        if (error) {
          if (error.code != "ER_DUP_ENTRY")
            // 에러 시
            console.log(error);
          resolve({
            error,
          });
        } else resolve(rows); // 에러 없을 시, rows resolve
      })
    );
  },
};

app.use(history()); //연결 기록 API 대체

app.use(express.static(__dirname + "/dist")); // dist에 있는 정적인 file들을 사용
