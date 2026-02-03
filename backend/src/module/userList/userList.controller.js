
const db = require("../../config/db.config");

class UserListController {
    async getUserList(req, res,next) {
        try {
            const snapshot = await db.collection("users").get();
            const users = snapshot.docs.map(doc=>({
                id:doc.id,
                ...doc.data()
            }))
            res.json({
                result:users,
                message:"User list fetched successfully",
                meta:null
            })        
        } catch (error) {
            next(error)
        }
    }

    async updateStatus(req, res,next) {
        try {
            const {uid, status} = req.body
            await db.collection ("users").doc(uid).update({status})
            res.json({
                result:null,
                message:"Status updated successfully",
                meta:null
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserListController();