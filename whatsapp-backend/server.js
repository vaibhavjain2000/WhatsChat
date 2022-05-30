//importing
import express from "express"
import mongoose from "mongoose"
import Messages from './dbMessages.js'
import Pusher from 'pusher'
import cors from 'cors'
//app config
const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1415565",
    key: "88139ab431fd0a295fd3",
    secret: "5cb2dc0437a5095ab4d9",
    cluster: "ap2",
    useTLS: true
  });
//middleware

app.use(express.json())
app.use(cors())


//DB config
const connection_url = 'mongodb+srv://admin:HjbgL8LVaT89LN8t@cluster0.5dqnr5a.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url ,{
    useNewUrlParser : true,
    useUnifiedTopology : true

})
const db = mongoose.connection
db.once('open',()=>{
    console.log('DB connected')
    const messageCollection = db.collection('messagecontents')
    const changeStream = messageCollection.watch()
    changeStream.on('change',(change)=>{
        console.log(change)
        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument
            pusher.trigger('messages','inserted' ,{
                name : messageDetails.name,
                message : messageDetails.message,
                timestamp : messageDetails.timestamp,
                received : messageDetails.received
            })
        }else{
            console.log("Error triggering pusher.")
        }
    })
})
//??

//api routes
app.get('/',(req,res)=>res.status(200).send('Hello World'))

app.get('/messages/sync',(req , res)=>{
    const dbMessage = req.body

    Messages.find(dbMessage , (err , data)=>{
        if(err){
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }

    })
})
app.post('/messages/new',(req , res)=>{
    const dbMessage = req.body

    Messages.create(dbMessage , (err , data)=>{
        if(err){
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})
//listener
app.listen(port ,()=>console.log(`Listening to localhost:${port}`))
