import { Router } from 'express';
import url from 'url';
import http from 'http';
import https from 'https';

const mainRouter = Router();


mainRouter.get('/', async (_, res) => {
    return res.send('Connected');
  }
);

mainRouter.get('/images', async (req, res) => {
  const requestUrl = new URL(req.url, req.protocol + '://' + req.headers.host + '/');
  var imageUrl = requestUrl.searchParams.get('url')
  if(imageUrl){

      const parts = new URL(imageUrl);
      if(parts && parts.pathname) {

        var filename = parts.pathname.split("/").pop();
    
        var options = {
            port: (parts.protocol === "https:" ? 443 : 80),
            host: parts.hostname,
            method: 'GET',
            path: parts.pathname + parts.search,
            accept: '*/*'
        };
    
        var request = (options.port === 443 ? https.request(options) : http.request(options));
    
        request.addListener('response', function (proxyResponse) {
            var offset = 0;
            if(proxyResponse.headers["content-length"]) {
              
              var contentLength = parseInt(proxyResponse.headers["content-length"], 10);
              var body = Buffer.alloc(contentLength);
      
              proxyResponse.setEncoding('binary');
              proxyResponse.addListener('data', function(chunk) {
                  body.write(chunk, offset, "binary");
                  offset += chunk.length;
              });

              proxyResponse.addListener('end', function() {
                if(filename){
                  res.contentType(filename);
                  res.write(body);
                  res.end();            
                }
              });
            }
        });
    
        request.end();
    
      }
    }
  }
);


export default mainRouter;