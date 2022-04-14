import http from 'http';
import routes from './routes';
// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
    const url = request.url;
    const method = request.method;

    //https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    let [path, ...queryVars] = url.split('?');
   

   if ( typeof queryVars !== 'string' ) {
     queryVars = queryVars.join('?');
   }
    // 
    request.customPathTest = path;
    request.customQueryVars = queryVars?.split('&').reduce((sum, v)=>{
            
            let [key, ...value] = v.split('=');
           
            if (! key){
                return "Error";
            }
            if (  typeof value !== 'string' ) {
                value = value.join('=');
              }
            sum[key] = value;

            return sum;
        }, {});
   
   
    
    if (typeof request.queryVars === 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: 'Query parameters is invalid. Please specify key for all properties.'
        }));
        return;
    }
    
    if (!routes[request.customPathTest] || routes[request.customPathTest].method !== method) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: 'Page is not found'
        }));
        return;
    }   
  
    return routes[request.customPathTest].handler(request, res);
});

server.listen(8000, ()=>{
    console.log('The server had been runned on http://localhost:8000');
});

server.on('error', (e)=>{
    console.log(e);

    //Restart server
})


// Restfull API 
// REST API

//
//test1=test1val
//&
//test2=test2val