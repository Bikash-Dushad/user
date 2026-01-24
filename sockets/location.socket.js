const redis = require("../config/redis");
const { getUserByAuthIdService } = require("../services/user.service");
const { producer } = require("../kafka/producer");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    console.log("User connected");

    let userDetails = null;
    if (socket.user.id) {
      const authId = socket.user.id;
      console.log("authId from socket.user:", authId);
      const user = await getUserByAuthIdService({ authId });
      if (!user) {
        return;
      }
      userDetails = {
        authId: user.authId,
        userId: user._id,
        userName: user.name,
        userRating: user.rating,
      };
    }
    await producer.send({
      topic: "USER_DETAILS",
      messages: [
        {
          key: userDetails.authId,
          value: JSON.stringify(userDetails),
        },
      ],
    });
    console.log("✅ User connection event sent to Kafka:", userDetails);

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
  });
};
