// const redis = require("../config/redis");

// module.exports = (io) => {
//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     //sends the captains location to user
//     socket.on("USER_LOCATION", async ({ lat, lng }) => {
//       try {
//         const captains = await redis.georadius(
//           "captains:online",
//           lng,
//           lat,
//           5,
//           "km",
//           "WITHCOORD",
//         );

//         const result = captains.map(([id, [captLng, captLat]]) => ({
//           id,
//           lat: parseFloat(captLat),
//           lng: parseFloat(captLng),
//         }));

//         socket.emit("NEARBY_CAPTAINS", result);
//         console.log("nearby captains ", result);
//       } catch (err) {
//         console.error("Error fetching nearby captains:", err);
//         socket.emit("NEARBY_CAPTAINS", []);
//       }
//     });

//     socket.on("disconnect", async () => {
//       console.log("Captain offline");
//     });
//   });
// };


module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Store user location ONCE
    socket.on("USER_LOCATION", async ({ lat, lng }) => {
      try {
        const captains = await redis.georadius(
          "captains:online",
          lng,
          lat,
          5,
          "km",
          "WITHCOORD"
        );

        const result = captains.map(([id, [lng, lat]]) => ({
          id,
          lat: Number(lat),
          lng: Number(lng),
        }));

        socket.emit("NEARBY_CAPTAINS", result);
        } catch (err) {
        console.error("❌ Redis fetch error:", err);
        socket.emit("NEARBY_CAPTAINS", []);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
