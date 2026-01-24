const kafka = require("../config/kafka");

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer Connected (user Service)");
};

module.exports = {
  producer,
  connectProducer,
};
