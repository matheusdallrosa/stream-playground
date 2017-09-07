var Producer = function(_somethings){
  var observer;
  return {
    start : function(_observer){
      this.observer = _observer;
      for(let i = 0; i < somethings.length; i++)
        this.observer.next(_somethings[i]);
    },
    stop : function(){},
  };
}

var PeriodicProducer = function(_period,_product){
  var observer,intervalID;
  return {
    start : function(_observer){
      this.observer = _observer;
      intervalID = setInterval(() => {
        this.observer.next(_product);
      },_period);
    },
    stop : function(){
      clearInterval(intervalID);
    },
  };
}

var Stream = function(_producer){
  this.observers = [];
  this.producer = _producer;
}

Stream.prototype.addObserver = function(_observer){
  this.observers.push(_observer);
  if(this.observers.length === 1) this.producer.start(this);
}

Stream.prototype.next = function(_something){
  for(let i = 0; i < this.observers.length; i++)
    this.observers[i].next(_something);
}

Stream.prototype.stop = function(){
  this.producer.stop();
}

var StreamFactory = {
  from : (_somethings) => new Stream(Producer(_somethings)),
  periodic : (_period,_product) => new Stream(PeriodicProducer(_period,_product)),
};

var stream = StreamFactory.periodic(2000,"bláaaaaaaaaaaaaaa");
stream.addObserver({
  next : function(_args){
    console.log("ob1: " + _args);
  },
  done : function(){},
  error : function(){},
});

stream.addObserver({
  next : function(_args){
    console.log("ob2: " + _args);
  },
  done : function(){},
  error : function(){},
});
