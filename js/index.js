var Producer = function(somethings){
  var observer;
  return {
    start : function(_observer){
      this.observer = _observer;
      for(let i = 0; i < somethings.length; i++)
        this.observer.next(somethings[i]);
    },
    stop : function(){},
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
  };
}

var Stream = function(producer){
  this.observers = [];
  this.producer = producer;
}

Stream.prototype.addObserver = function(observer){
    this.observers.push(observer);
    this.producer.start(this);
}

Stream.prototype.next = function(something){
  for(let i = 0; i < this.observers.length; i++)
    this.observers[i].next(something);
}

var StreamFactory = {
  from : (somethings) => new Stream(Producer(somethings)),
  periodic : (period,product) => new Stream(PeriodicProducer(period,product)),
};

var Observer = function(){
  return {
    next : function(args){
      alert(args);
    }
  };
}

var stream = StreamFactory.periodic(2000,"bláaaaaaaaaaaaaaa");
stream.addObserver(Observer());
