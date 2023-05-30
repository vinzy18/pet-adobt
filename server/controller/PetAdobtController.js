const { petAdobt, pet, user } = require("../models");

class PetAdobtController {
  static async getPetAdobts(req, res) {
    try {
      let petAdobts = await petAdobt.findAll({
        attributes: [
          "id",
          "petId",
          "userId",
          "adobt_date",
          "total_price",
          "status",
        ],
        include: [pet, user],
      });

      res.status(200).json(petAdobts);
      //   res.render("petAdobts/index.ejs", { petAdobts });
    } catch (err) {
      res.json(err);
    }
  }

  static async getPetAdobtsByUser(req, res) {
    try {
      const userId = req.params.userId;
      let petAdobts = await petAdobt.findAll({
        attributes: [
          "id",
          "petId",
          "userId",
          "name",
          "adobt_date",
          "total_price",
          "status",
        ],
        include: [pet, user],
        where: {
          userId: userId,
        },
      });

      res.status(200).json({ data: petAdobts });
      //   res.render("petAdobts/index.ejs", { petAdobts });
    } catch (err) {
      res.json(err);
    }
  }

  static async getPetAdobtTotals(req, res) {
    try {
      let petAdobts = await petAdobt.findAll({
        // attributes: [
        //   "id", "petId", "adobtId", "adobt_date", "total_price"
        //   // [sequelize.fn("SUM", sequelize.col('total_price')), 'total'],
        // ],
        // include: [
        //   pet, adobt
        // ],
        group: "adobtId",
      });
      //   res.json(petAdobts);
      res.render("petAdobts/detailPage.ejs", { petAdobts });
    } catch (err) {
      res.json(err);
    }
  }

  static async create(req, res) {
    try {
      const { petId } = req.body;
      const userId = req.userData.id;
      let thisPet = await pet.findByPk(petId);
      //   let tempPrice = await petAdobt.findAll({
      //     attributes: ["total_price"],
      //     where: { userId: userId },
      //   });

      //   res.json(tempPrice[0].total_price);
      let updateStock = await thisPet.decrement("stock");

      let total_price = thisPet.price;
      let status = 1;
      const adobt_date = new Date();

      let result = await petAdobt.create({
        petId: +petId,
        userId: +userId,
        adobt_date,
        total_price,
        status: status,
      });
      console.log(result);

      res.status(201).json({ message, result });
      // res.json(thisPet);
      //   res.redirect("/petAdobts");
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async delete(req, res) {
    try {
      const id = Number(req.params.id);

      let deleteData = await petAdobt.destroy({
        where: { id },
      });

      deleteData === 1
        ? //   res.redirect("/petAdobts")
          res.status(200).json({ message: true })
        : res.status(400).json({
            message: false,
          });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async updatePaymentStatus(req, res) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      let result = await petAdobt.update(
        {
          status: +status,
        },
        {
          where: { id },
        }
      );

      result[0] === 1
        ? res.status(200).json({
            message: `Id ${id} has been updated`,
          })
        : //   res.redirect("/pets")
          res.status(400).json({
            message: `Id ${id} not updated`,
          });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  //   static async increasePetById(req, res) {
  //     try {
  //       const { petId } = req.body;
  //       let thisPet = await pet.findByPk(petId);
  //       let updateStock = await thisPet.increment("stock");
  //     } catch (error) {
  //       res.status(500).json(error);
  //     }
  //   }
}

module.exports = PetAdobtController;
