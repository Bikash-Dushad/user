const kafka = require("../config/kafka");
const { CAPTAIN_LOC_UPDATED } = require("./topics");
const consumer = kafka.consumer({ groupId: "captain-loc-update" });

const updateCaptainLocation = async (io) => {
  await consumer.connect();
  await consumer.subscribe({
    topic: CAPTAIN_LOC_UPDATED,
    fromBeginning: false,
  });

  console.log("user Service Kafka Consumer Connected");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      console.log(data);
      if (data.offline) {
        io.emit("CAPTAIN_OFFLINE", { id: data.id });
        return;
      }
      io.emit("CAPTAIN_LOCATION_UPDATE", data);
    },
  });
};

module.exports = updateCaptainLocation;
