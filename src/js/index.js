var Producer = function(_somethings){
  var observer;
  return {
    start : function(_observer){
      this.observer = _observer;
      for(let i = 0; i < _somethings.length; i++)
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

var AbstractStream = function(){}

AbstractStream.prototype.addObserver = function(_observer){
  this.observers.push(_observer);
  this.start();
}

AbstractStream.prototype.next = function(_something){
  for(let i = 0; i < this.observers.length; i++)
    this.observers[i].next(_something);
}

AbstractStream.prototype.map = function(f){
  return new Mapper(this,f);
}

AbstractStream.prototype.filter = function(f){
  return new Filter(this,f);
}

var Stream = function(_producer){
  this.observers = [];
  this.producer = _producer;
}

Stream.prototype = Object.create(AbstractStream.prototype);
Stream.constructor = Stream;

Stream.prototype.start = function(){
  if(this.observers.length === 1) this.producer.start(this);
};

Stream.prototype.stop = function(){
  this.producer.stop();
}

var AbstractOperator = function(_in,_f){
  this.in = _in;
  this.f = _f;
  this.observers = [];
}

AbstractOperator.prototype = Object.create(AbstractStream.prototype);
AbstractOperator.constructor = AbstractOperator;

AbstractOperator.prototype.start = function(){
  if(this.observers.length === 1) this.in.addObserver(this);
}

AbstractOperator.prototype.stop = function(){
  this.in.stop();
}

var Mapper = function(_in,_f){
  AbstractOperator.call(this,_in,_f);
}

//i used the __proto__ property, now we don't have to assign
//the constructor to Mapper.
Mapper.prototype = Object.create(AbstractOperator.prototype);
Mapper.constructor = Mapper;

Mapper.prototype.next = function(_something){
  AbstractStream.prototype.next.call(this,this.f(_something));
}

var Filter = function(_in,_f){
  AbstractOperator.call(this,_in,_f);
}

Filter.prototype = Object.create(AbstractOperator.prototype);
Filter.constructor = Filter;

Filter.prototype.next = function(_something){
  if(this.f(_something)){
    AbstractStream.prototype.next.call(this,_something);
  }
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

var mappedSream0 = stream.map(x => x + " map0");

mappedSream0.addObserver({
  next : data => console.log(data)
});

var mappedStream1 = mappedSream0.map(x => x + " map1");
mappedStream1.addObserver({
  next : data => console.log(data)
});

var stream1 = StreamFactory.from([1,2,3,4,5,6,7,8,9,10]);

stream1
  .filter(x => (x % 2) === 0)
  .map(x => x*2)
  .addObserver({next : y => console.log(y)});
