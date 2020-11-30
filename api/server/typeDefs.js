import { gql } from "apollo-server-express";

const typeDefs = gql`

  type email{
    name: String
    subject: String
    email: String
    message: String
  }

  type Token {
    _id: ID
    code: String
    value: Int
    active: Boolean
  }

  input inputToken {
    code: String
    value: Int
    active: Boolean
  }

  type License {
    _id: ID
    name: String
    price: Int
    duration: String
    permission: [String]
  }

  input inputLicense {
    name: String
    price: Int
    duration: String
    permission: [String]
  }

  type Plan {
    _id: ID
    name: String
    licenses: [License]
  }

  type User {
    _id: ID
    name: String
    email: String
    password: String
    codReferal: String
    registrationCode: String
    licenses: [String]
    rol: String
    photo: String
    balance: Int
    cycrons: Int
    cycronsGen: Int
    permissions: [String]
    referals: [String]
    isAdmin: Boolean
    isSuperUser: Boolean
    dateCreated: String
  }

  input inputUser {
    name: String
    email: String
    password: String
    codReferal: String
    registrationCode: String
    licenses: [String]
    rol: String
    photo: String
    balance: Int
    cycrons: Int
    cycronsGen: Int
    permissions: [String]
    referals: [String]
    isAdmin: Boolean
    isSuperUser: Boolean
    dateCreated: String
  }

  type Post {
    _id: ID
    tittle: String
    description: String
    category: String
    image: String
    author: String
    shortDesc: String
    date: String
    files: [String]
  }

  input inputPost {
    tittle: String
    description: String
    category: String
    image: String
    author: String
    shortDesc: String
    date: String
    files: [String]
  }

  enum Category {
    New
    Course
    Market
    Webinar
    Event
    Investment
  }

  type Transaction {
    _id: ID
    user: String
    description: String
    credits: String
    date: String
  }

  input inputTransaction {
    user: String
    description: String
    credits: String
    date: String
  }

  type Query {
    users: [User]
    plans: [Plan]
    licenses: [License]
    transactions: [Transaction]
    transaction(user: String): [Transaction]
    tokens: [Token]
    news: [Post]
    posts:[Post]
    user(email: String): User
    userID(_id: ID): User
    userToken(codReferal: String):Boolean
    token(code: String): Token
  }
  type Mutation {

    sendEmail(
      name: String
      subject: String
      email: String
      message: String
    ):String

    addTokens(
      data: [inputToken]
    ):String

    editToken(
      _id: ID
      data: inputToken
    ): Boolean

    addBalance(
      _id: ID
      code: String
    ): User

    buyLicense(
      _idUser: ID
      _idLicense: ID
    ): User


    addTransaction(
      data: inputTransaction
    ):String

    ##POST
    addPost(
      tittle: String
      description: String
      category: String
      image: String
      author: String
      shortDesc: String
      date: String
      files: [String]
    ): Post

    deletePost(
      _id: ID
    ): String

    editPost(
      _id: ID
      data: inputPost
    ): Boolean

    ## LICENCE
    addLicense(
      name: String
      price: Int
      duration: String
      permission: [String]
    ): License

    deleteLicense(
      _id: ID
    ): String

    editLicense(
      _id: ID
      data: inputLicense
    ): String

    ##USER
    addUser(
      data: inputUser
    ): User

    editUser(
      _id: ID
      data: inputUser
    ): Boolean
  }
  type Subscription {
    postModify: [Post]
    userModify: User
  }
`;

module.exports = typeDefs;
