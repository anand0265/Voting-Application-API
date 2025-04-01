const express = require('express')

const dotenv = require('dotenv')
const connectDB = require('./config/db')


const app = express()

// dot env configuration
dotenv.config()

// DB Coneection
connectDB();

app.use(express.json());


const PORT = process.env.PORT || 8080;

// ROUTE
app.use('/api/user',require('./routes/userRoutes'))
app.use('/api/candidate',require('./routes/candidateRoute'))
app.use('api/vote',require('./routes/givevoteRoute'))

  
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () =>{
    console.log(` app listening on port ${PORT}`)
}) 