import {ApolloServer} from 'apollo-server-express'

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const server = new ApolloServer({ typeDefs, resolvers })

require("../database");

export default server
