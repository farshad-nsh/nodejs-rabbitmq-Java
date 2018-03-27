#RPC using nodejs-rabbitMQ-Java
This template creates a remote procedure call that sends a function
call using nodejs application server and uses rabbitMQ to pass
it to workers in the third layer that are implemented in Java.
This is a kind of hub-spoke architecture.
## applications
Assume you want to create a machine learning API on the cloud
and it is cpu intensive if running on a single threaded application server
such as nodejs. We create a broker that uses AMQP(advanced message
passing architecure) .The broker that i use here is the most well documented
implementation of AMQP and is called RabbitMQ.
So you distributed time consuming jobs to many Java workstations and you 
can therefore scale up your service horizontally .

### So:
1- in nodejs server order a request such as:
node server.js 9  
<br>
2- in the third layer (Java software: jar files) you do the actual computation
This layer is also great to do concurrency. You can create 100 
threads or you can create a thread pool in java. This scales your API
vertically.
