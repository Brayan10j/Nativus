const User = require("../models/User");
const Post = require("../models/Post");
const License = require("../models/License");
const Transaction = require("../models/Transaction");
const Token = require("../models/Token");
const { PubSub, UserInputError } = require("apollo-server-express");
const sm = require("./nodemailer");


const pubsub = new PubSub();
const POST_MODIFY = "POST_MODIFY";

const resolvers = {
  Subscription: {
    postModify: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([POST_MODIFY])
    }
  },
  Query: {
    users: async () => await User.find(),
    news: async () => await Post.find({ category: "New" }),
    posts: async () => await Post.find(),
    licenses: async () => await License.find(),
    user: async (_, data) => await User.findOne({ email: data.email }),
    userID: async (_, data) => await User.findById(data._id),
    async userToken(_, data) {
      let user = await User.findOne(data);
      return user == null ? false : true;
    },
    token: async (_, data) => await Token.findOne({ code: data.code }),
    tokens: async () => await Token.find(),
    transactions: async () => await Transaction.find(),
    transaction: async (_, data) => await Transaction.find({ user: data.user })
  },
  Mutation: {
    async addBalance(_, data) {
      let token = await Token.findOne({ code: data.code });
      if (token == null) {
        throw "Token no found";
      }
      if (token.active == true) {
        throw "Token active";
      }
      const user = await User.findById(data._id);
      let newBalance = user.balance + token.value;
      let newCycrons = user.cycrons + token.value * 0.02;
      let newcycronsGen = user.cycronsGen + token.value * 0.02;
      await User.findByIdAndUpdate(user._id, {
        balance: newBalance,
        cycrons: newCycrons,
        cycronsGen: newcycronsGen,
      });
      let userReferal = await User.findOne({
        codReferal: user.registrationCode
      });
      let newCycronsRef = userReferal.cycrons + token.value * 0.02;
      await User.findByIdAndUpdate(userReferal._id, { cycrons: newCycronsRef });
      const transaction = new Transaction({
        user: user._id,
        description: "purcharse balance",
        credits: token.value.toString(),
        date: new Date().toISOString().substr(0, 10)+"  "+new Date().toISOString().substr(11, 8)
      });
      await transaction.save();
      await Token.findByIdAndUpdate(token._id, {active: true});
      const res = await User.findById(user._id);
      return res;
    },
    async buyLicense(_, data) {
      const user = await User.findById(data._idUser);
      const license = await License.findById(data._idLicense);
      if (license.price > user.balance) {
        throw "Balance insuficient"
      }
      let newLicenses = user.licenses.concat([license.name]);
      let newBalance = user.balance - license.price;
      license.permission.filter(data => user.permissions.includes(data)?data:user.permissions.push(data));//.concat();
      await User.findByIdAndUpdate(user._id, {
        balance: newBalance,
        licenses: newLicenses,
        permissions: user.permissions,
      });
      const transaction = new Transaction({
        user: user._id,
        description: "License purchase",
        credits: license.price.toString(),
        date: new Date().toISOString().substr(0, 10)+"  "+new Date().toISOString().substr(11, 8)
      });
      await transaction.save();
      const res = await User.findById(user._id);
      return res;
    },
    async addUser(_, { data }) {
      //Busca que el codigo de referido este
      let userReferal = await User.findOne({
        codReferal: data.registrationCode
      });
      if (!userReferal) {
        throw "Referal code not found";
      }
      //inserta el referido enel usuario
      newReferals = userReferal.referals.push(data.email);
      let userTm = await User.findByIdAndUpdate(userReferal._id, {
        referals: userReferal.referals
      });
      //guardar usuario
      const user = new User(data);
      await user.save();
      return user;
    },
    async editUser(_, { _id, data }) {
      const user = await User.findByIdAndUpdate(_id, data);
      return user ? true : false;
    },

    async addTokens(_, data) {
      var tokens = data.data;
      try {
        tokens.forEach(async t => {
          const tokenExist = await Token.findOne({ code: t.code });
          if (!tokenExist) {
            const token = new Token(t);
            await token.save();
          }
        });
      } catch (error) {
        throw error;
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
      } finally {
        return "tokens add success";
      }
    },

    async editToken(_, { _id, data }) {
      const token = await Token.findById(_id);
      if (token.active == false) {
        await Token.findByIdAndUpdate(_id, data);
        return true;
      } else {
        throw "Token active";
        return false;
      }
    },

    async addTransaction(_, { data }) {
      const transaction = new Transaction(data);
      await transaction.save();
      return "Transaction add";
    },

    //POST
    async deletePost(_, data) {
      const post = await Post.findByIdAndDelete(data);
      pubsub.publish(POST_MODIFY, { postModify: data });
      return post ? "Post deleted" : "Post no found";
    },
    async editPost(_, { _id, data }) {
      const post = await Post.findByIdAndUpdate(_id, data);
      return post ? true : false;
    },
    async addPost(_, data) {
      const post = new Post(data);
      await post.save();
      return post;
    },

    // LICENSE
    async deleteLicense(_, data) {
      const license = await License.findByIdAndDelete(data);
      return license ? "License deleted" : "License no found";
    },
    async editLicense(_, { _id, data }) {
      const license = await License.findByIdAndUpdate(_id, data);
      res = license ? "License edit" : "License no found";
      return res;
    },
    async addLicense(_, data) {
      const license = new License(data);
      await license.save();
      return license;
    },
    //OTHERS
    sendEmail(_, data) {
      res = sm.sendEmail(data);
      return res;
    }
  }
};

module.exports = resolvers;
