import express from "express"
import cors from "cors";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import * as RecipeAPI from "./recipe-api";

config()

const app = express();
const PORT = process.env.PORT || 4000;
const prismaClient = new PrismaClient();

app.use(express.json())
app.use(cors({
    origin: ["https://spoonful-saga-joycvru4h-yadavnishant2020.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true
  }));


app.get("/api/recipes/search", async (req, res) => {
    // https://api.spoonacular.com/recipes/serach?searchTerm=burger&page=2

    const searchTerm = req.query.searchTerm as string;
    const page = parseInt(req.query.page as string);

    const results = await RecipeAPI.searchRecipes(searchTerm, page);

    return res.json(results);
})

app.get("/api/recipes/:recipeId/summary", async (req, res) => {

    const recipeId = req.params.recipeId;
    const results = await RecipeAPI.getRecipeSummary(recipeId)

    return res.json(results);
});

app.post("/api/recipes/favourite", async (req, res) => {
    const recipeId = req.body.recipeId;

    try {
        const favRecipe = await prismaClient.favResipies.create(
            {
                data: {
                    recipeId
                }
            }
        );
        return res.status(201).json(favRecipe)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Oops! Something went wrong" })
    }
})

app.get("/api/recipes/favourite", async (_ , res) => {
    try {
        const favRecipes = await prismaClient.favResipies.findMany();

        const recipeIds = favRecipes.map((recipe: { recipeId: number }) => recipe.recipeId.toString())

        const favorites = await RecipeAPI.getFavRecipedByIDs(recipeIds);

        return res.json(favorites);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });

    }

})

app.delete('/api/recipes/favourite', async (req, res) => {
    const recipeId = req.body.recipeId;
    try {
        await prismaClient.favResipies.delete({
            where: {
                recipeId: recipeId
            }
        })
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Oops! Something went wrong" })
    }
})


app.post("/chat", async (req, res) => {
    const { prompt, servings, dishType, spiceLevel, allergyType } = req.body;
    try {
        const chatGptResponse = await RecipeAPI.chatGpt(prompt, servings, dishType, spiceLevel, allergyType);
        return res.json({ chatGptResponse });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post("/api/recipes/favourite", async (req, res) => {
    const recipeId = req.body.recipeId;

    try {
        const favRecipe = await prismaClient.favResipies.create(
            {
                data: {
                    recipeId
                }
            }
        );
        return res.status(201).json(favRecipe)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Oops! Something went wrong" })
    }
})

app.get("/api/recipes/favourite", async (_ , res) => {
    try {
        const favRecipes = await prismaClient.favResipies.findMany();

        const recipeIds = favRecipes.map((recipe: { recipeId: number }) => recipe.recipeId.toString())

        const favorites = await RecipeAPI.getFavRecipedByIDs(recipeIds);

        return res.json(favorites);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });

    }

})

app.get('/', (_, res) => {
    res.send("<h1>Hello Dev!</h1>")
})

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
})

