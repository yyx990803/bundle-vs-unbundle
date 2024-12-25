import http2 from "node:http2";
import { createReadStream, existsSync, statSync } from "node:fs";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Load self-signed certificate and private key
const options = {
  key: readFileSync("cert/key.pem"),
  cert: readFileSync("cert/cert.pem"),
  peerMaxConcurrentStreams: 1000
};

const server = http2.createSecureServer(options);

server.on("stream", (stream, headers) => {
  const path = headers[":path"] === "/" ? "index.html" : headers[":path"].slice(1);
  const filePath = join(process.cwd(), path);

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    stream.respond({ ":status": 404, "content-type": "text/plain" });
    stream.end("404 Not Found");
    return;
  }

  const contentType = getContentType(path);
  stream.respond({
    "content-type": contentType,
    ":status": 200,
  });

  const fileStream = createReadStream(filePath);
  fileStream.pipe(stream);

  fileStream.on("error", (err) => {
    console.error("File stream error:", err);
    stream.respond({ ":status": 500 });
    stream.end("Internal Server Error");
  });
});

server.listen(4000, () => {
  console.log("HTTP/2 server running at https://localhost:4000");
});

// Utility function to determine the content type
function getContentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".js")) return "text/javascript";
  return "application/octet-stream"; // Default for unknown file types
}
