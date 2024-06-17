import { Hono } from 'hono';
import { IncomingMessage, ServerResponse, createServer } from 'http';
import { URL } from 'url';
import { once } from 'events';

const app = new Hono();

const homepageHTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
    header { background: #4CAF50; color: white; padding: 1em 0; text-align: center; }
    nav { margin: 0; padding: 0; display: flex; justify-content: center; background: #333; }
    nav a { color: white; padding: 14px 20px; text-decoration: none; text-align: center; }
    nav a:hover { background-color: #ddd; color: black; }
    section { padding: 2em; }
    form { max-width: 600px; margin: auto; }
    label { display: block; margin: 0.5em 0 0.2em; }
    input, textarea { width: 100%; padding: 0.5em; margin-bottom: 1em; }
  </style>
</head>
<body>
  <header>
    <h1>Honoを使ったwebページへようこそ</h1>
  </header>
  <nav>
    <a href="/">ホーム</a>
    <a href="/about">ここはなに？</a>
    <a href="/contact">問い合わせ</a>
  </nav>
  <section id="content">
    <h2>Home</h2>
    <p>ここはホームページです。</p>
    <p>YamadaUIわからないよおお</p>
  </section>
</body>
</html>
`;

const aboutHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
    header { background: #4CAF50; color: white; padding: 1em 0; text-align: center; }
    nav { margin: 0; padding: 0; display: flex; justify-content: center; background: #333; }
    nav a { color: white; padding: 14px 20px; text-decoration: none; text-align: center; }
    nav a:hover { background-color: #ddd; color: black; }
    section { padding: 2em; }
  </style>
</head>
<body>
  <header>
    <h1>ここはなに？</h1>
  </header>
  <nav>
    <a href="/">ホーム</a>
    <a href="/about">ここはなに？</a>
    <a href="/contact">問い合わせ</a>
  </nav>
  <section id="content">
    <h2>About</h2>
    <p>This is the about page. Here you can learn more about us.</p>
  </section>
</body>
</html>
`;

const contactHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
    header { background: #4CAF50; color: white; padding: 1em 0; text-align: center; }
    nav { margin: 0; padding: 0; display: flex; justify-content: center; background: #333; }
    nav a { color: white; padding: 14px 20px; text-decoration: none; text-align: center; }
    nav a:hover { background-color: #ddd; color: black; }
    section { padding: 2em; }
    form { max-width: 600px; margin: auto; }
    label { display: block; margin: 0.5em 0 0.2em; }
    input, textarea { width: 100%; padding: 0.5em; margin-bottom: 1em; }
  </style>
</head>
<body>
  <header>
    <h1>Contact Us</h1>
  </header>
  <nav>
    <a href="/">ホーム</a>
    <a href="/about">ここはなに？</a>
    <a href="/contact">問い合わせ</a>
  </nav>
  <section id="content">
    <h2>Contact</h2>
    <form>
      <label for="name">Name:</label>
      <input type="text" id="name" name="name">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email">
      <label for="message">Message:</label>
      <textarea id="message" name="message" rows="4"></textarea>
      <input type="submit" value="Submit">
    </form>
  </section>
</body>
</html>
`;

app.get('/', (c) => c.html(homepageHTML));
app.get('/about', (c) => c.html(aboutHTML));
app.get('/contact', (c) => c.html(contactHTML));

// Node.jsのhttpサーバーを作成し、Honoアプリを使用する
const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const request = new Request(url.toString(), {
    method: req.method,
    headers: req.headers as HeadersInit,
    body: req.method === 'GET' || req.method === 'HEAD' ? null : await once(req, 'data').then(data => data.toString()),
  });

  const response = await app.fetch(request);

  // HeadersオブジェクトをRecord<string, string>に変換
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  res.writeHead(response.status, headers);
  res.end(await response.text());
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
