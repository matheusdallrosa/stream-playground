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

var PeriodicProducer = function(period,product){
  var observer,intervalID;
  return {
    start : function(_observer){
      this.observer = _observer;
      intervalID = setInterval(() => {
        this.observer.next(product);
      },period);
    },
    stop : function(){
      clearInterval(intervalID);
    }
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
      this.producer = PeriodicProducer(config.period,config.product);
      break;
    default:
      this.producer = Producer(config.somethings);
  }
  return new Stream(this.producer);
};

var Observer = function(){
  return {
    next : function(args){
      alert(args);
    }
  };
};

var streamFactory = new StreamFactory();
var stream = streamFactory.createStream({type:"periodic",period:2000,product:"bláaaaaaaaaaaaaaa"});
stream.addObserver(Observer());