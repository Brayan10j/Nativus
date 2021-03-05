const User = require("../models/User");
const Post = require("../models/Post");
const License = require("../models/License");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
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
    categories: async () => await Category.find(),
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
        throw "Token no found"; // retornar el user
      }
      if (token.active == true) {
        throw "Token active";
      }
      const cryptoGen = token.value * 0.2;
      //agrega al usuario
      const user = await User.findById(data._id);
      let newBalance = user.balance + token.value;
      let newCrypto = user.crypto + cryptoGen * 0.1;
      let newCryptoGen = user.cryptoGen + cryptoGen * 0.1;
      await User.findByIdAndUpdate(user._id, {
        balance: newBalance,
        crypto: newCrypto,
        cryptoGen: newCryptoGen
      });
      //agrega al referido
      let userReferal = await User.findOne({
        codReferal: user.registrationCode
      });
      let newCryptoRef = userReferal.crypto + cryptoGen * 0.1;
      await User.findByIdAndUpdate(userReferal._id, {
        crypto: newCryptoRef
      });

      //agrega a los founders
      const founderUsers = await User.find({ type: "FOUNDER" });

      const cantFounders = (cryptoGen * 0.4) / founderUsers.length;
      founderUsers.forEach(async function(x) {
        let newCrypto = x.crypto + cantFounders;
        await User.findByIdAndUpdate(x._id, { crypto: newCrypto });
      });
      //agrega a los team
      const teamUsers = await User.find({ type: "TEAMPILGRIM" });
      const cantTeam = (cryptoGen * 0.2) / teamUsers.length;
      teamUsers.forEach(async function(x) {
        let newCrypto = x.crypto + cantTeam;
        await User.findByIdAndUpdate(x._id, { crypto: newCrypto });
      });
      //agrega al fondo o reserva
      let userAdmin = await User.findOne({
        rol: "ADMIN"
      });
      let newCryptoAdmin = userAdmin.crypto + cryptoGen * 0.2;
      await User.findByIdAndUpdate(userAdmin._id, { crypto: newCryptoAdmin });

      const transaction = new Transaction({
        user: user._id,
        description: "purcharse balance",
        credits: token.value.toString(),
        date:
          new Date().toISOString().substr(0, 10) +
          "  " +
          new Date().toISOString().substr(11, 8)
      });
      await transaction.save();
      await Token.findByIdAndUpdate(token._id, { active: true });
      const res = await User.findById(user._id);
      return res;
    },
    async buy(_, data) {
      const user = await User.findById(data._idUser);
      const post = await Post.findById(data._idProduct);
      let newBalance = user.balance - post.price;
      await User.findByIdAndUpdate(user._id, {
        balance: newBalance
      });
      const transaction = new Transaction({
        user: user._id,
        description: "Buy " + post.tittle,
        credits: post.price.toString(),
        date:
          new Date().toISOString().substr(0, 10) +
          "  " +
          new Date().toISOString().substr(11, 8)
      });
      let transresult = await transaction.save();
      sm.sendEmail({
        name: user.name,
        subject: "buy",
        email: user.email,
        message: post.tittle,
        idProduct:transresult._id,
      });
      return await User.findById(user._id);;
    },
    async buyLicense(_, data) {
      const user = await User.findById(data._idUser);
      const license = await License.findById(data._idLicense);
      if (license.price > user.balance) {
        throw "Balance insuficient";
      }
      let date = new Date();
      let dateStart = date.toISOString().substr(0, 10);
      date.setMonth(date.getMonth() + parseInt(license.duration));
      let dateFinish = date.toISOString().substr(0, 10);
      let dataLicence = {
        name: license.name,
        dateStart: dateStart,
        dateFinish: dateFinish
      };
      let newLicenses = user.licenses.concat([dataLicence]);
      let newBalance = user.balance - license.price;
      license.permission.filter(data =>
        user.permissions.includes(data) ? data : user.permissions.push(data)
      ); //.concat();
      await User.findByIdAndUpdate(user._id, {
        balance: newBalance,
        licenses: newLicenses,
        permissions: user.permissions
      });
      const transaction = new Transaction({
        user: user._id,
        description: "License purchase",
        credits: license.price.toString(),
        date:
          new Date().toISOString().substr(0, 10) +
          "  " +
          new Date().toISOString().substr(11, 8)
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
      await User.findByIdAndUpdate(_id, data);
      return await User.findById(_id);
    },

    async addTokens(_, data) {
      var tokens = data.data;
      try {
        tokens.forEach(async t => {
          let tokenExist = await Token.findOne({ code: t.code });
          if (tokenExist != null) {
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
    async addPost(_, {data}) {
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
    },
    async addCategory(_, { data }) {
      const category = new Category(data);
      await category.save();
      const categories = await Category.find();
      return categories;
    },
    async deleteCategory(_, data) {
      const category = await Category.findById(data);
      await Category.findByIdAndDelete(data);
      // eliminar en licencias
      const licenses = await License.find();
      licenses.forEach(async function(l) {
        if (l.permission.includes(category.name)) {
          var i = l.permission.indexOf(category.name);
          l.permission.splice(i, 1);
          await License.findByIdAndUpdate(l._id, { permission: l.permission });
        }
      });
      const categories = await Category.find();
      return categories;
    },
    async editCategory(_, { _id, data }) {
      const category = await Category.findByIdAndUpdate(_id, data);
      const categories = await Category.find();
      return categories;
    }
  }
};

module.exports = resolvers;
