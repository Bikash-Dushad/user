const redis = require("../config/redis");
const { getUserByAuthIdService } = require("../services/user.service");
const { producer } = require("../kafka/producer");
const Topics = require("../kafka/topics");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    console.log("User connected");

    //sends the captains location to user
    socket.on("USER_LOCATION", async ({ lat, lng }) => {
      try {
        const captains = await redis.georadius(
          "captains:online",
          lng,
          lat,
          5,
          "km",
          "WITHCOORD",
        );

        const result = captains.map(([id, [captLng, captLat]]) => ({
          id,
          lat: parseFloat(captLat),
          lng: parseFloat(captLng),
        }));

        socket.emit("NEARBY_CAPTAINS", result);
        console.log("nearby captains ", result);
      } catch (err) {
        console.error("Error fetching nearby captains:", err);
        socket.emit("NEARBY_CAPTAINS", []);
      }
    });

    socket.on("disconnect", async () => {
      console.log("user offline");
    });

    // Handle socket errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  // Handle namespace errors
  io.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });
};
