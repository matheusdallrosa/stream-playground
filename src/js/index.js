var Producer = function(somethings){
  var observer;
  return {
    start : function(_observer){
      this.observer = _observer;
      for(let i = 0; i < somethings.length; i++)
        this.observer.next(somethings[i]);
    },
    stop : function(){},
    done : function(){},
    error : function(){},
  };
}

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
    },
    done : function(){},
    error : function(){},
  };
}

var Stream = function(producer){
  this.observers = [];
  this.producer = producer;
}

Stream.prototype.addObserver = function(observer){
    this.observers.push(observer);
    if(this.observers.length === 1) this.producer.start(this);
}

Stream.prototype.next = function(something){
  for(let i = 0; i < this.observers.length; i++)
    this.observers[i].next(something);
}

Stream.prototype.stop = function(){
  this.producer.stop();
}

var StreamFactory = {
  from : (somethings) => new Stream(Producer(somethings)),
  periodic : (period,product) => new Stream(PeriodicProducer(period,product)),
};

var stream = StreamFactory.periodic(2000,"bláaaaaaaaaaaaaaa");
stream.addObserver({
  next : function(args){
    console.log("ob1: " + args);
  },
  done : function(){},
  error : function(){},
});

stream.addObserver({
  next : function(args){
    console.log("ob2: " + args);
  },
  done : function(){},
  error : function(){},
});
