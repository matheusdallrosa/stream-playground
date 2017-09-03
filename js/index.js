var Producer = function(somethings){
  var observer;
  return {
    start : function(_observer){  
      this.observer = _observer;
      for(let i = 0; i < somethings.length; i++)
        this.observer.next(somethings[i]);      
    },
    stop : function(){}    
  };
};

var Stream = function(producer){
  var observers = [];
  this.next = function(something){
    for(let i = 0; i < observers.length; i++)
      observers[i].next(something);
  }
  this.addObserver = function(observer){
    observers.push(observer);
    producer.start(this);
  }
};

var StreamFactory = function(){};

StreamFactory.prototype.createStream = function(config){  
  switch (config.type){
    case "periodic":
      this.producer = null;//this producer is not implemented yet
      break;
    default:
      this.producer = Producer;
  }
  return new Stream(this.producer(config.somethings));
};

var Observer = function(){
  return {
    next : function(args){
      alert(args);
    }
  };
};

var streamFactory = new StreamFactory();
var stream = streamFactory.createStream({somethings : [0,1,2,3,4,5,6,7,8,9]});
stream.addObserver(Observer());