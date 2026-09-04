require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");

const connectDB = require("./config/db");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await connectDB();

  await apolloServer.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(apolloServer)
  );

  app.listen(process.env.PORT || 5000, () => {
    console.log(
      `Server running on http://localhost:${process.env.PORT || 5000}`
    );

    console.log(
      `GraphQL running on http://localhost:${process.env.PORT || 5000}/graphql`
    );
  });
}

startServer();