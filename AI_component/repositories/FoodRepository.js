import Food from "../models/Food.js"

//part of this design pattern
class FoodRepository {

    async getAllFoods() {

        return await Food.find();
    }

}

export default new FoodRepository();