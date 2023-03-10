const router = require("express").Router();
const withAuth = require("../../utils/auth");
const { Trainer, Pokemon, TrainerPokemon } = require("../../models");

//-- GET req for all trainer pokedex --//
router.get("/", async (req, res) => {
  console.log("Every Trainers Pokemon here");
  try {
    const PokemonData = await Trainer.findAll({
      attributes: ["username"],
      include: [
        {
          model: Pokemon,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).json(PokemonData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//-- GET req for trainer pokedex by :id --//
router.get("/:id", async (req, res) => {
  console.log("Pokedex for Trainer by id is working");
  try {
    const PokemonData = await Trainer.findByPk(req.params.id, {
      attributes: ["username"],
      include: [
        {
          model: Pokemon,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).json(PokemonData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// --- Post Route for adding a pokemon to the trainerPokedex
// TODO: add withAuth after testing
router.post("/", withAuth, async (req, res) => {
  console.log("Post Route for adding a pokemon!");
  try {
    const newPokemonData = await TrainerPokemon.create({
      // Change to req.body.trainer_id for insomnia testing
      trainer_id: req.session.user_id,
      pokemon_id: req.body.pokemon_id,
    });
    res.status(200).json(newPokemonData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//-- PUT request to remove from trainers party --//
router.put("/remove/:id", withAuth, async (req, res) => {
  console.log(`PUT route for removing a pokemon is working!`);
  try {
    const trainerPokemon = await TrainerPokemon.update(
      {
        is_in_party: false,
      },
      {
        where: {
          trainer_id: req.params.id,
          pokemon_id: req.body.pokemon_id,
        },
      }
    );

    if (!trainerPokemon) {
      return res.status(404).json({ message: "This Pokemon is not in your party!" });
    }

    return res.status(200).json(trainerPokemon);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to update Party!" });
  }
});

//-- PUT request to add to trainers party --//

router.put("/add/:id", withAuth, async (req, res) => {
  console.log(`PUT route for adding a pokemon is working!`);
  try {
    const trainerPokemon = await TrainerPokemon.update(
      {
        is_in_party: true,
      },
      {
        where: {
          trainer_id: req.params.id,
          pokemon_id: req.body.pokemon_id,
        },
      }
    );

    if (!trainerPokemon) {
      return res.status(404).json({ message: "This Pokemon cant be added to your party!" });
    }

    return res.status(200).json(trainerPokemon);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to update Party!" });
  }
});

module.exports = router;
