const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const Listing = require("./models/listing");

const OWNER_ID = "6a2e9af55266a089d57a7793";

const listings = [];

const LIMIT = 500;

async function seedDB() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);

    console.log("Connected to MongoDB");

    fs.createReadStream("./data/listingsNY.csv")
      .pipe(csv())
      .on("data", (row) => {
        try {
          const price =
            Number(
              String(row.price || "0")
                .replace(/\$/g, "")
                .replace(/,/g, "")
            ) || 100;

          const latitude = Number(row.latitude);
          const longitude = Number(row.longitude);

          if (
            isNaN(latitude) ||
            isNaN(longitude)
          ) {
            return;
          }

          listings.push({
            title:
              row.name?.trim() ||
              "Untitled Listing",

            description:
              row.description?.trim() ||
              "Beautiful stay available for booking.",

            image: {
              url: row.picture_url || "",
              filename: "airbnb"
            },

            price,

            location:
              row.neighbourhood_cleansed ||
              row.neighbourhood ||
              "Unknown",

            state: "California",

            country: "USA",

            rating:
              row.review_scores_rating
                ? Number(row.review_scores_rating) /
                  20
                : 0,

            likes: Math.floor(
              Math.random() * 200
            ),

            likedBy: [],

            reviews: [],

            owner: OWNER_ID,

            geometry: {
              type: "Point",
              coordinates: [
                longitude,
                latitude
              ]
            },

            status: "approved"
          });
        } catch (err) {
          console.error(
            "Skipping row:",
            err.message
          );
        }
      })
      .on("end", async () => {
        try {
          console.log(
            `Parsed ${listings.length} listings`
          );

          await Listing.deleteMany({});

          await Listing.insertMany(
            listings.slice(0, LIMIT),
            { ordered: false }
         );

          console.log(
            `Successfully imported ${LIMIT} listings`
          );

          await mongoose.connection.close();
        } catch (err) {
          console.error(err);
        }
      });
  } catch (err) {
    console.error(err);
  }
}

seedDB();