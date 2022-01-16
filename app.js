const exp = require("express");
const app = exp();
const PORT = process.env.PORT || 3000;
const path = require("path");
const sequelize = require("./db/db");
const User = require("./db/User")
const { santa, receiver } = require("./db/Santa_pairs");

sequelize.sync({force:true}).then(() => console.log("Ready"));

app.use(exp.json());

app.get('/api/restart', (req, res) => {
    sequelize.sync({force:true}).then(() => console.log("Database has been restarted"));
})

app.post('/api/getreceiver', async (req, res) => {
    const santaId = await santa.findOne({where : {
        santa_name: req.body.nameSanta,
        santa_surname: req.body.surnameSanta
    }})
    const receiverId = await santaId.getDataValue("id");
    const getReceiver = await receiver.findOne({where : {
        id : receiverId
    }})
    const receiverWish = getReceiver.getDataValue("receiver_wish");
    const receiverName = getReceiver.getDataValue("receiver_name");
    const receiverSurname = getReceiver.getDataValue("receiver_surname");
    res.status(200).json({
        name : receiverName,
        surname : receiverSurname,
        wish : receiverWish
    })
})

app.post('/api/adduser', (req, res) => {
    User.create(req.body).then(() => {
        res.send("User is inserted");
    })
})

app.post('/api/setpairs', async (req, res) => {
    const santaCreated = await santa.create(req.body.santaData);
    req.body.receiverData.santumId = santaCreated.id;
    await receiver.create(req.body.receiverData);
    res.send("Pairs have been created");
});

app.get('/api/getuser', async (req, res) => {
    const users = await User.findAll();
    res.status(200).json(users);
})

app.use(exp.static(path.resolve(__dirname, "client")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "index.html"))
})

app.listen(PORT, () => {
    console.log("Good");
})