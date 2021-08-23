## automic-rest (node client)
#
Automic-Rest-Client generated from AE/Swagger
#

```javascript

const  automicrest = require('automic-rest');

(async () => {
    const ar = await automicrest.connect({
            basicauth: "eGSSdhZHlYYSSDDvdTpxYXl12SS3c3gyMQ==",
            url: "https://example.com",
            noproxy: true,
            sslverify: false
    });

    let resp = await ar.listExecutions(client_id=1, query="max_results=100")
    for(a in resp.data){
        console.log(resp.data[a].name)
    }
})()


```